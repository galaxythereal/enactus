// Global variables
let currentUser = null;
let interviewData = [];
let questionData = [];

// Initialize the application
function init() {
    gapi.load('client', initGoogleApi);
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('logout').addEventListener('click', handleLogout);
    document.getElementById('mobile-menu-button').addEventListener('click', toggleMobileMenu);
    document.getElementById('interview-form').addEventListener('submit', submitInterview);
    document.getElementById('question-form').addEventListener('submit', addQuestion);
}

// Initialize Google API client
function initGoogleApi() {
    gapi.client.init({
        apiKey: 'YOUR_API_KEY',
        clientId: 'YOUR_CLIENT_ID',
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        scope: 'https://www.googleapis.com/auth/spreadsheets'
    }).then(() => {
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
            handleAuthResult(true);
        } else {
            showSection('login');
        }
    });
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // In a real application, you would validate credentials against a secure backend
    // For this example, we'll use a simple check
    if (email === 'admin@enactus.com' && password === 'admin123') {
        currentUser = { name: 'Admin User', role: 'admin' };
        handleAuthResult(true);
    } else if (email === 'interviewer@enactus.com' && password === 'interviewer123') {
        currentUser = { name: 'Interviewer', role: 'interviewer' };
        handleAuthResult(true);
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

// Handle successful authentication
function handleAuthResult(isSignedIn) {
    if (isSignedIn) {
        loadData().then(() => {
            updateUI();
            if (currentUser.role === 'admin') {
                showSection('admin');
            } else {
                showSection('dashboard');
            }
        });
    } else {
        showSection('login');
    }
}

// Handle logout
function handleLogout() {
    currentUser = null;
    gapi.auth2.getAuthInstance().signOut().then(() => {
        showSection('login');
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.md\\:hidden');
    mobileMenu.classList.toggle('hidden');
}

// Load data from Google Sheets
function loadData() {
    return Promise.all([
        loadInterviewData(),
        loadQuestionData()
    ]);
}

// Load interview data from Google Sheets
function loadInterviewData() {
    return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: 'YOUR_SPREADSHEET_ID',
        range: 'Interviews!A2:F'
    }).then(response => {
        interviewData = response.result.values.map(row => ({
            id: row[0],
            interviewee: row[1],
            interviewer: row[2],
            date: row[3],
            time: row[4],
            status: row[5]
        }));
    });
}

// Load question data from Google Sheets
function loadQuestionData() {
    return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: 'YOUR_SPREADSHEET_ID',
        range: 'Questions!A2:B'
    }).then(response => {
        questionData = response.result.values.map(row => ({
            id: row[0],
            question: row[1]
        }));
    });
}

// Update UI based on current user and data
function updateUI() {
    document.getElementById('user-name').textContent = currentUser.name;
    updateDashboardStats();
    updateInterviewTable();
    if (currentUser.role === 'admin') {
        updateAdminDashboard();
    }
}

// Update dashboard statistics
function updateDashboardStats() {
    const upcomingInterviews = interviewData.filter(interview => interview.status === 'Scheduled').length;
    const completedInterviews = interviewData.filter(interview => interview.status === 'Completed').length;
    const averageRating = calculateAverageRating();

    document.getElementById('upcoming-interviews').textContent = upcomingInterviews;
    document.getElementById('completed-interviews').textContent = completedInterviews;
    document.getElementById('average-rating').textContent = averageRating.toFixed(1);
}

// Calculate average rating
function calculateAverageRating() {
    const completedInterviews = interviewData.filter(interview => interview.status === 'Completed');
    if (completedInterviews.length === 0) return 0;
    const totalRating = completedInterviews.reduce((sum, interview) => sum + parseFloat(interview.rating || 0), 0);
    return totalRating / completedInterviews.length;
}

// Update interview table
function updateInterviewTable() {
    const table = document.getElementById('interview-table');
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    const userInterviews = interviewData.filter(interview => interview.interviewer === currentUser.name);

    userInterviews.forEach(interview => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td class="py-2 px-4 border-b border-gray-200">${interview.interviewee}</td>
            <td class="py-2 px-4 border-b border-gray-200">${interview.date}</td>
            <td class="py-2 px-4 border-b border-gray-200">${interview.time}</td>
            <td class="py-2 px-4 border-b border-gray-200">${interview.status}</td>
            <td class="py-2 px-4 border-b border-gray-200">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" onclick="startInterview('${interview.id}')">
                    ${interview.status === 'Scheduled' ? 'Start' : 'View'}
                </button>
            </td>
        `;
    });
}

// Start or view an interview
function startInterview(interviewId) {
    const interview = interviewData.find(i => i.id === interviewId);
    if (!interview) return;

    document.getElementById('interviewee-name').textContent = interview.interviewee;
    document.getElementById('interview-date').textContent = interview.date;
    document.getElementById('interview-time').textContent = interview.time;
    document.getElementById('interview-status').textContent = interview.status;

    const form = document.getElementById('interview-form');
    form.innerHTML = '';
    questionData.forEach(question => {
        const div = document.createElement('div');
        div.className = 'mb-4';
        div.innerHTML = `
            <label class="block text-gray-700 font-bold mb-2" for="q${question.id}">${question.question}</label>
            <textarea id="q${question.id}" name="q${question.id}" class="w-full p-2 border rounded" rows="3"></textarea>
        `;
        form.appendChild(div);
    });

    showSection('interview');
}

// Submit interview
function submitInterview(event) {
    event.preventDefault();
    const interviewId = document.getElementById('interviewee-name').textContent;
    const rating = document.getElementById('interview-rating').value;
    const notes = document.getElementById('interview-notes').value;

    const answers = questionData.map(question => ({
        questionId: question.id,
        answer: document.getElementById(`q${question.id}`).value
    }));

    // In a real application, you would send this data to your backend or directly to Google Sheets
    console.log('Interview submitted:', { interviewId, rating, notes, answers });

    // Update interview status
    const interviewIndex = interviewData.findIndex(i => i.id === interviewId);
    if (interviewIndex !== -1) {
        interviewData[interviewIndex].status = 'Completed';
        interviewData[interviewIndex].rating = rating;
    }

    updateUI();
    showSection('dashboard');
}

// Update admin dashboard
function updateAdminDashboard() {
    updateAdminStats();
    updateAdminCharts();
    updateAdminInterviewTable();
}

// Update admin statistics
function updateAdminStats() {
    const totalApplicants = interviewData.length;
    const scheduledInterviews = interviewData.filter(interview => interview.status === 'Scheduled').length;
    const completedInterviews = interviewData.filter(interview => interview.status === 'Completed').length;
    const averageRating = calculateAverageRating();

    document.getElementById('total-applicants').textContent = totalApplicants;
    document.getElementById('interviews-scheduled').textContent = scheduledInterviews;
    document.getElementById('interviews-completed').textContent = completedInterviews;
    document.getElementById('admin-average-rating').textContent = averageRating.toFixed(1);
}

// Update admin charts
function updateAdminCharts() {
    updateInterviewProgressChart();
    updateRatingDistributionChart();
}

// Update interview progress chart
function updateInterviewProgressChart() {
    const ctx = document.getElementById('interview-progress-chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Scheduled', 'Completed', 'Cancelled'],
            datasets: [{
                data: [
                    interviewData.filter(i => i.status === 'Scheduled').length,
                    interviewData.filter(i => i.status === 'Completed').length,
                    interviewData.filter(i => i.status === 'Cancelled').length
                ],
                backgroundColor: ['#3b82f6', '#10b981', '#ef4444']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Interview Progress'
                }
            }
        }
    });
}

// Update rating distribution chart
function updateRatingDistributionChart() {
    const ctx = document.getElementById('rating-distribution-chart').getContext('2d');
    const ratings = interviewData.filter(i => i.status === 'Completed').map(i => parseInt(i.rating));
    const ratingCounts = [1, 2, 3, 4, 5].map(rating => ratings.filter(r => r === rating).length);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
            datasets: [{
                label: 'Number of Interviews',
                data: ratingCounts,
                backgroundColor: '#3b82f6'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Interviews'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Rating Distribution'
                }
            }
        }
    });
}

// Update admin interview table
function updateAdminInterviewTable() {
    const table = document.getElementById('admin-interview-table');
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    interviewData.forEach(interview => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td class="py-2 px-4 border-b border-gray-200">${interview.interviewee}</td>
            <td class="py-2 px-4 border-b border-gray-200">${interview.interviewer}</td>
            <td class="py-2 px-4 border-b border-gray-200">${interview.date}</td>
            <td class="py-2 px-4 border-b border-gray-200">${interview.time}</td>
            <td class="py-2 px-4 border-b border-gray-200">${interview.status}</td>
            <td class="py-2 px-4 border-b border-gray-200">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2" onclick="editInterview('${interview.id}')">Edit</button>
                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" onclick="deleteInterview('${interview.id}')">Delete</button>
            </td>
        `;
    });
}

// Edit interview (admin function)
function editInterview(interviewId) {
    const interview = interviewData.find(i => i.id === interviewId);
    if (!interview) return;

    // In a real application, you would open a modal or navigate to an edit page
    console.log('Editing interview:', interview);
}

// Delete interview (admin function)
function deleteInterview(interviewId) {
    if (confirm('Are you sure you want to delete this interview?')) {
        interviewData = interviewData.filter(i => i.id !== interviewId);
        updateAdminDashboard();
    }
}

// Add new question (admin function)
function addQuestion(event) {
    event.preventDefault();
    const newQuestion = document.getElementById('new-question').value;
    if (newQuestion.trim() === '') return;

    const newId = Math.max(...questionData.map(q => parseInt(q.id))) + 1;
    questionData.push({ id: newId.toString(), question: newQuestion });

    updateQuestionList();
    document.getElementById('new-question').value = '';

    // In a real application, you would also update the Google Sheet
}

// Update question list
function updateQuestionList() {
    const list = document.getElementById('question-list');
    list.innerHTML = '';
    questionData.forEach(question => {
        const li = document.createElement('li');
        li.className = 'mb-2';
        li.innerHTML = `
            ${question.question}
            <button class="ml-2 text-red-500 hover:text-red-700" onclick="deleteQuestion('${question.id}')">Delete</button>
        `;
        list.appendChild(li);
    });
}

// Delete question (admin function)
function deleteQuestion(questionId) {
    if (confirm('Are you sure you want to delete this question?')) {
        questionData = questionData.filter(q => q.id !== questionId);
        updateQuestionList();
        // In a real application, you would also update the Google Sheet
    }
}

// Show a specific section and hide others
function showSection(sectionId) {
    const sections = ['login', 'dashboard', 'interview', 'admin'];
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (id === sectionId) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });

    // Update navigation visibility based on user role
    const adminNavItem = document.querySelector('a[href="#admin"]');
    if (currentUser && currentUser.role === 'admin') {
        adminNavItem.classList.remove('hidden');
    } else {
        adminNavItem.classList.add('hidden');
    }
}

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Helper function to format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
}

// Helper function to format time
function formatTime(time) {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(`2000-01-01T${time}`).toLocaleTimeString(undefined, options);
}

// Helper function to generate a unique ID
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Error handling function
function handleError(error) {
    console.error('An error occurred:', error);
    alert('An error occurred. Please try again later.');
}

// Function to update Google Sheets
function updateGoogleSheet(range, values) {
    return gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: 'YOUR_SPREADSHEET_ID',
        range: range,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: values
        }
    }).then(response => {
        console.log('Google Sheet updated successfully');
    }, error => {
        handleError(error);
    });
}

// Function to append data to Google Sheets
function appendToGoogleSheet(range, values) {
    return gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: 'YOUR_SPREADSHEET_ID',
        range: range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: values
        }
    }).then(response => {
        console.log('Data appended to Google Sheet successfully');
    }, error => {
        handleError(error);
    });
}

// Function to validate email
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Function to validate password strength
function validatePassword(password) {
    // Require at least 8 characters, one uppercase letter, one lowercase letter, and one number
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
}

// Function to sanitize input
function sanitizeInput(input) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return input.replace(reg, (match)=>(map[match]));
}

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', init);
