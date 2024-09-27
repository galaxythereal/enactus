
// API base URL - replace with your Google Apps Script web app URL
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbxEppWL3eWJexe2wgEZFIySmuOgvy9xksTKQciFeLszuhuyyUthV8BRoi0Pb9p8vFjXAg/exec';

// Axios instance for API calls
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Utility function to handle API errors
const handleApiError = (error) => {
  console.error('API Error:', error);
  alert('An error occurred. Please try again later.');
};

// Leaderboard Chart Component
Vue.component('leaderboard-chart', {
  extends: VueChartJs.Bar,
  props: ['chartData'],
  mounted() {
    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    });
  }
});

// Task List Component
Vue.component('task-list', {
  props: ['tasks'],
  template: `
    <div class="space-y-4">
      <div v-for="task in tasks" :key="task.id" class="bg-white p-4 rounded-lg shadow">
        <h4 class="font-bold">{{ task.title }}</h4>
        <p class="text-gray-600">{{ task.description }}</p>
        <div class="mt-2 flex justify-between items-center">
          <span :class="{'text-green-500': task.status === 'Completed', 'text-yellow-500': task.status === 'In Progress', 'text-red-500': task.status === 'Not Started'}">
            {{ task.status }}
          </span>
          <button @click="updateTaskStatus(task)" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-sm">
            Update Status
          </button>
        </div>
      </div>
    </div>
  `,
  methods: {
    updateTaskStatus(task) {
      // Implement task status update logic here
      console.log('Updating task status:', task.id);
    }
  }
});

// Meeting List Component
Vue.component('meeting-list', {
  props: ['meetings'],
  template: `
    <div class="space-y-4">
      <div v-for="meeting in meetings" :key="meeting.id" class="bg-white p-4 rounded-lg shadow">
        <h4 class="font-bold">{{ meeting.title }}</h4>
        <p class="text-gray-600">{{ meeting.date }} - {{ meeting.time }}</p>
        <p>{{ meeting.description }}</p>
      </div>
    </div>
  `
});

// Event Calendar Component
Vue.component('event-calendar', {
  props: ['events'],
  template: `
    <div class="bg-white p-4 rounded-lg shadow">
      <!-- Implement a calendar view here -->
      <p>Calendar component (to be implemented)</p>
    </div>
  `
});

// Document Library Component
Vue.component('document-library', {
  props: ['documents'],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="doc in documents" :key="doc.id" class="bg-white p-4 rounded-lg shadow">
        <h4 class="font-bold">{{ doc.title }}</h4>
        <p class="text-gray-600">{{ doc.description }}</p>
        <a :href="doc.url" target="_blank" class="text-blue-500 hover:underline">Download</a>
      </div>
    </div>
  `
});

// Content Editor Modal Component
Vue.component('content-editor-modal', {
  template: `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="content-editor-modal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-bold mb-4">Edit Content</h3>
        <!-- Add content editing form here -->
        <button @click="$emit('close')" class="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Close
        </button>
      </div>
    </div>
  `
});

// User Manager Modal Component
Vue.component('user-manager-modal', {
  template: `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="user-manager-modal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-bold mb-4">Manage Users</h3>
        <!-- Add user management form here -->
        <button @click="$emit('close')" class="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Close
        </button>
      </div>
    </div>
  `
});

// Task Manager Modal Component
Vue.component('task-manager-modal', {
  template: `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="task-manager-modal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-bold mb-4">Manage Tasks</h3>
        <!-- Add task management form here -->
        <button @click="$emit('close')" class="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Close
        </button>
      </div>
    </div>
  `
});

// Main Vue Instance
new Vue({
  el: '#app',
  data: {
    user: null,
    loginEmail: '',
    loginPassword: '',
    showContentEditor: false,
    showUserManager: false,
    showTaskManager: false,
    leaderboardData: null,
    userTasks: [],
    upcomingMeetings: [],
    events: [],
    documents: []
  },
  methods: {
    async login() {
      try {
        const response = await api.post('', {
          action: 'login',
          email: this.loginEmail,
          password: this.loginPassword
        });
        if (response.data.success) {
          this.user = response.data.user;
          this.fetchDashboardData();
        } else {
          alert('Invalid credentials. Please try again.');
        }
      } catch (error) {
        handleApiError(error);
      }
    },
    logout() {
      this.user = null;
      this.loginEmail = '';
      this.loginPassword = '';
    },
    async fetchDashboardData() {
      await Promise.all([
        this.fetchLeaderboardData(),
        this.fetchUserTasks(),
        this.fetchUpcomingMeetings(),
        this.fetchEvents(),
        this.fetchDocuments()
      ]);
    },
    async fetchLeaderboardData() {
      try {
        const response = await api.post('', { action: 'getLeaderboard' });
        this.leaderboardData = {
          labels: response.data.leaderboard.map(item => item.name),
          datasets: [{
            label: 'Points',
            backgroundColor: '#4299e1',
            data: response.data.leaderboard.map(item => item.points)
          }]
        };
      } catch (error) {
        handleApiError(error);
      }
    },
    async fetchUserTasks() {
      try {
        const response = await api.post('', { action: 'getUserTasks', userId: this.user.id });
        this.userTasks = response.data.tasks;
      } catch (error) {
        handleApiError(error);
      }
    },
    async fetchUpcomingMeetings() {
      try {
        const response = await api.post('', { action: 'getUpcomingMeetings' });
        this.upcomingMeetings = response.data.meetings;
      } catch (error) {
        handleApiError(error);
      }
    },
    async fetchEvents() {
      try {
        const response = await api.post('', { action: 'getEvents' });
        this.events = response.data.events;
      } catch (error) {
        handleApiError(error);
      }
    },
    async fetchDocuments() {
      try {
        const response = await api.post('', { action: 'getDocuments' });
        this.documents = response.data.documents;
      } catch (error) {
        handleApiError(error);
      }
    }
  },
  mounted() {
    // Check for existing session or perform any initial setup
  }
});
