// Global variables
let currentUser = null;
let interviewees = [];
let interviewers = [];
let questions = [];

// Initialize the application
function initApp() {
    // Set up event listeners
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('submit-evaluation').addEventListener('click', submitEvaluation);
    document.getElementById('add-interviewer').addEventListener('click', showAddInterviewerModal);
    document.getElementById('add-question').addEventListener('click', showAddQuestionModal);

    // Check if user is already logged in
    checkAuthStatus();
}

// Check authentication status
function checkAuthStatus() {
    // In a real application, you would check with your backend here
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showDashboard();
    } else {
        showLoginForm();
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // In a real application, you would verify credentials with your backend here
    // For this example, we'll use a mock login
    if (email === 'admin@enactus.com' && password === 'admin123') {
        currentUser = { name: 'Admin User', role: 'admin', email: email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showDashboard();
    } else if (email === 'interviewer@enactus.com' && password === 'interviewer123') {
        currentUser = { name: 'Interviewer User', role: 'interviewer', email: email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showDashboard();
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

// Handle logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLoginForm();
}

// Show the appropriate dashboard based on user role
function showDashboard() {
    document.getElementById('login-portal').classList.add('hidden');
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('user-name').textContent = currentUser.name;

    if (currentUser.role === 'admin') {
        document.getElementById('admin-dashboard').classList.remove('hidden');
        loadAdminDashboard();
    } else if (currentUser.role === 'interviewer') {
        document.getElementById('interviewer-dashboard').classList.remove('hidden');
        loadInterviewerDashboard();
    }

    updateNavigation();
}

// Show login form
function showLoginForm() {
    document.getElementById('login-portal').classList.remove('hidden');
    document.getElementById('user-info').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('interviewer-dashboard').classList.add('hidden');
    document.getElementById('interviewee-profile').classList.add('hidden');
    updateNavigation();
}

// Update navigation based on user role
function updateNavigation() {
    const nav = document.getElementById('main-nav');
    nav.innerHTML = '';

    if (currentUser) {
        if (currentUser.role === 'admin') {
            nav.innerHTML = `
                <ul>
                    <li><a href="#" onclick="loadAdminDashboard()">Dashboard</a></li>
                    <li><a href="#" onclick="loadApplicantOverview()">Applicants</a></li>
                    <li><a href="#" onclick="loadInterviewerManagement()">Interviewers</a></li>
                    <li><a href="#" onclick="loadQuestionManagement()">Questions</a></li>
                    <li><a href="#" onclick="loadStatistics()">Statistics</a></li>
                </ul>
            `;
        } else if (currentUser.role === 'interviewer') {
            nav.innerHTML = `
                <ul>
                    <li><a href="#" onclick="loadInterviewerDashboard()">Dashboard</a></li>
                    <li><a href="#" onclick="loadInterviewSchedule()">Schedule</a></li>
                </ul>
            `;
        }
    }
}

// Load admin dashboard
function loadAdminDashboard() {
    document.getElementById('admin-dashboard').classList.remove('hidden');
    document.getElementById('interviewer-dashboard').classList.add('hidden');
    document.getElementById('interviewee-profile').classList.add('hidden');

    loadApplicantOverview();
    loadInterviewerManagement();
    loadQuestionManagement();
    loadStatistics();
}

// Load applicant overview
function loadApplicantOverview() {
    const applicantTable = document.getElementById('applicant-table').getElementsByTagName('tbody')[0];
    applicantTable.innerHTML = '';

    // In a real application, you would fetch this data from your backend
    const mockApplicants = [
        { id: 1, name: 'John Doe', status: 'Scheduled', averageRating: 4.2 },
        { id: 2, name: 'Jane Smith', status: 'Interviewed', averageRating: 3.8 },
        { id: 3, name: 'Bob Johnson', status: 'Pending', averageRating: null },
    ];

    mockApplicants.forEach(applicant => {
        const row = applicantTable.insertRow();
        row.innerHTML = `
            <td>${applicant.name}</td>
            <td>${applicant.status}</td>
            <td>${applicant.averageRating ? applicant.averageRating.toFixed(1) : 'N/A'}</td>
            <td>
                <button onclick="viewApplicant(${applicant.id})" class="btn btn-secondary">View</button>
                <button onclick="editApplicant(${applicant.id})" class="btn btn-secondary">Edit</button>
            </td>
        `;
    });
}

// Load interviewer management
function loadInterviewerManagement() {
    const interviewerTable = document.getElementById('interviewer-table').getElementsByTagName('tbody')[0];
    interviewerTable.innerHTML = '';

    // In a real application, you would fetch this data from your backend
    const mockInterviewers = [
        { id: 1, name: 'Alice Brown', email: 'alice@enactus.com', assignedInterviews: 5 },
        { id: 2, name: 'Charlie Davis', email: 'charlie@enactus.com', assignedInterviews: 3 },
    ];

    mockInterviewers.forEach(interviewer => {
        const row = interviewerTable.insertRow();
        row.innerHTML = `
            <td>${interviewer.name}</td>
            <td>${interviewer.email}</td>
            <td>${interviewer.assignedInterviews}</td>
            <td>
                <button onclick="editInterviewer(${interviewer.id})" class="btn btn-secondary">Edit</button>
                <button onclick="removeInterviewer(${interviewer.id})" class="btn btn-secondary">Remove</button>
            </td>
        `;
    });
}

// Load question management
function loadQuestionManagement() {
    const questionCategories = document.getElementById('question-categories');
    questionCategories.innerHTML = '';

    // In a real application, you would fetch this data from your backend
    const mockCategories = [
        { id: 1, name: 'Technical Skills', questions: ['Describe your experience with JavaScript', 'What is your approach to problem-solving?'] },
        { id: 2, name: 'Soft Skills', questions: ['How do you handle conflicts in a team?', 'Describe a time when you demonstrated leadership'] },
    ];

    mockCategories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.innerHTML = `
            <h4>${category.name}</h4>
            <ul>
                ${category.questions.map(q => `<li>${q} <button onclick="editQuestion(${category.id})" class="btn btn-secondary">Edit</button></li>`).join('')}
            </ul>
        `;
        questionCategories.appendChild(categoryDiv);
    });
}

// Load statistics
function loadStatistics() {
    const statsCharts = document.getElementById('stats-charts');
    statsCharts.innerHTML = '<p>Statistics charts will be displayed here.</p>';
    // In a real application, you would implement charts using a library like Chart.js
}

// Load interviewer dashboard
function loadInterviewerDashboard() {
    document.getElementById('interviewer-dashboard').classList.remove('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('interviewee-profile').classList.add('hidden');

    loadAssignedInterviewees();
    loadInterviewSchedule();
}

// Load assigned interviewees
function loadAssignedInterviewees() {
    const intervieweeList = document.getElementById('interviewee-list');
    intervieweeList.innerHTML = '';

    // In a real application, you would fetch this data from your backend
    const mockInterviewees = [
        { id: 1, name: 'Eva Green', status: 'Scheduled' },
        { id: 2, name: 'Frank White', status: 'Pending' },
    ];

    mockInterviewees.forEach(interviewee => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${interviewee.name} - ${interviewee.status}
            <button onclick="viewInterviewee(${interviewee.id})" class="btn btn-secondary">View</button>
        `;
        intervieweeList.appendChild(li);
    });
}

// Load interview schedule
function loadInterviewSchedule() {
    const scheduleTable = document.getElementById('schedule-table').getElementsByTagName('tbody')[0];
    scheduleTable.innerHTML = '';

    // In a real application, you would fetch this data from your backend
    const mockSchedule = [
        { id: 1, time: '2024-10-01 10:00 AM', interviewee: 'Eva Green' },
        { id: 2, time: '2024-10-01 02:00 PM', interviewee: 'Frank White' },
    ];

    mockSchedule.forEach(interview => {
        const row = scheduleTable.insertRow();
        row.innerHTML = `
            <td>${interview.time}</td>
            <td>${interview.interviewee}</td>
            <td>
                <button onclick="startInterview(${interview.id})" class="btn btn-secondary">Start</button>
            </td>
        `;
    });
}

// View interviewee profile
function viewInterviewee(id) {
    document.getElementById('interviewer-dashboard').classList.add('hidden');
    document.getElementById('interviewee-profile').classList.remove('hidden');

    // In a real application, you would fetch this data from your backend
    const mockInterviewee = {
        id: id,
        name: 'Eva Green',
        email: 'eva@example.com',
        education: 'Bachelor in Computer Science',
        experience: '2 years as Junior Developer',
    };

    const applicantDetails = document.getElementById('applicant-details');
    applicantDetails.innerHTML = `
        <p><strong>Name:</strong> ${mockInterviewee.name}</p>
        <p><strong>Email:</strong> ${mockInterviewee.email}</p>
        <p><strong>Education:</strong> ${mockInterviewee.education}</p>
        <p><strong>Experience:</strong> ${mockInterviewee.experience}</p>
    `;

    loadInterviewQuestions();
}

// Load interview questions
function loadInterviewQuestions() {
    const questionList = document.getElementById('question-list');
    questionList.innerHTML = '';

    // In a real application, you would fetch this data from your backend
    const mockQuestions = [
        'Describe your experience with JavaScript',
        'What is your approach to problem-solving?',
        'How do you handle conflicts in a team?',
        'Describe a time when you demonstrated leadership',
    ];

    mockQuestions.forEach((question, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
            <p><strong>Q${index + 1}:</strong> ${question}</p>
            <textarea placeholder="Enter your notes for this question"></textarea>
        `;
        questionList.appendChild(div);
    });
}

// Submit evaluation
function submitEvaluation() {
    const notes = document.getElementById('interviewer-notes').value;
    const ratings = document.querySelectorAll('#rating-form input:checked');

    // In a real application, you would send this data to your backend
    console.log('Submitting evaluation:', { notes, ratings });

    alert('Evaluation submitted successfully!');
    loadInterviewerDashboard();
}

// Show add interviewer modal
function showAddInterviewerModal() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <h3>Add New Interviewer</h3>
        <form id="add-interviewer-form">
            <div class="form-group">
                <label for="interviewer-name">Name</label>
                <input type="text" id="interviewer-name" required>
            </div>
            <div class="form-group">
                <label for="interviewer-email">Email</label>
                <input type="email" id="interviewer-email" required>
            </div>
            <button type="submit" class="btn btn-primary">Add Interviewer</button>
        </form>
    `;

    document.getElementById('add-interviewer-form').addEventListener('submit', addInterviewer);

    modal.style.display = 'block';
}

// Add interviewer
function addInterviewer(event) {
    event.preventDefault();

    const name = document.getElementById('interviewer-name').value;
    const email = document.getElementById('interviewer-email').value;

    // In a real application, you would send this data to your backend
    console.log('Adding interviewer:', { name, email });

    alert('Interviewer added successfully!');
    document.getElementById('modal').style.display = 'none';
    loadInterviewerManagement();
}

// Show add question modal
function showAddQuestionModal() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <h3>Add New Question</h3>
        <form id="add-question-form">
            <div class="form-group">
                <label for="question-category">Category</label>
                <select id="question-category" required>
                    <option value="technical">Technical Skills</option>
                    <option value="soft">Soft Skills</option>
                </select>
            </div>
            <div class="form-group">
                <label for="question-text">Question</label>
                <textarea id="question-text" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Add Question</button>
        </form>
    `;

    document.getElementById('add-question-form').addEventListener('submit', addQuestion);

    modal.style.display = 'block';
}

// Add question
function addQuestion(event) {
    event.preventDefault();

    const category = document.getElementById('question-category').value;
    const questionText = document.getElementById('question-text').value;

    // In a real application, you would send this data to your backend
    console.log('Adding question:', { category, questionText });

    alert('Question added successfully!');
    document.getElementById('modal').style.display = 'none';
    loadQuestionManagement();
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Helper function to create rating inputs
function createRatingInputs(containerId, name, levels = 5) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    for (let i = 1; i <= levels; i++) {
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = name;
        input.value = i;
        input.id = `${name}-${i}`;

        const label = document.createElement('label');
        label.htmlFor = `${name}-${i}`;
        label.textContent = i;

        container.appendChild(input);
        container.appendChild(label);
    }
}

// Initialize Google Sheets API
function initGoogleSheetsAPI() {
    gapi.client.init({
        apiKey: 'YOUR_API_KEY',
        clientId: 'YOUR_CLIENT_ID',
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        scope: 'https://www.googleapis.com/auth/spreadsheets'
    }).then(function() {
        // API is initialized and ready to use
        console.log('Google Sheets API initialized');
    }, function(error) {
        console.error('Error initializing Google Sheets API:', error);
    });
}

// Load data from Google Sheets
function loadDataFromGoogleSheets() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: 'YOUR_SPREADSHEET_ID',
        range: 'Sheet1!A1:Z1000', // Adjust the range as needed
    }).then(function(response) {
        const range = response.result;
        if (range.values.length > 0) {
            // Process the data
            console.log('Data loaded from Google Sheets:', range.values);
            // Update your application state and UI with this data
      } else {
            console.log('No data found in the Google Sheet.');
        }
    }, function(response) {
        console.error('Error loading data from Google Sheets:', response.result.error.message);
    });
}

// Save data to Google Sheets
function saveDataToGoogleSheets(data, range) {
    gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: 'YOUR_SPREADSHEET_ID',
        range: range,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: data
        }
    }).then(function(response) {
        console.log('Data saved to Google Sheets:', response.result);
    }, function(response) {
        console.error('Error saving data to Google Sheets:', response.result.error.message);
    });
}

// Fetch interviewees from Google Sheets
function fetchInterviewees() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: 'YOUR_SPREADSHEET_ID',
        range: 'Interviewees!A2:E', // Assumes headers in row 1
    }).then(function(response) {
        const range = response.result;
        if (range.values.length > 0) {
            interviewees = range.values.map(row => ({
                id: row[0],
                name: row[1],
                email: row[2],
                status: row[3],
                averageRating: row[4] ? parseFloat(row[4]) : null
            }));
            console.log('Interviewees loaded:', interviewees);
            updateIntervieweesList();
        } else {
            console.log('No interviewees found in the Google Sheet.');
        }
    }, function(response) {
        console.error('Error fetching interviewees:', response.result.error.message);
    });
}

// Update interviewees list in UI
function updateIntervieweesList() {
    const intervieweeList = document.getElementById('interviewee-list');
    intervieweeList.innerHTML = '';

    interviewees.forEach(interviewee => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${interviewee.name} - ${interviewee.status}
            <button onclick="viewInterviewee(${interviewee.id})" class="btn btn-secondary">View</button>
        `;
        intervieweeList.appendChild(li);
    });

    // Update applicant overview if on admin dashboard
    if (currentUser.role === 'admin') {
        loadApplicantOverview();
    }
}

// Fetch interviewers from Google Sheets
function fetchInterviewers() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: 'YOUR_SPREADSHEET_ID',
        range: 'Interviewers!A2:D', // Assumes headers in row 1
    }).then(function(response) {
        const range = response.result;
        if (range.values.length > 0) {
            interviewers = range.values.map(row => ({
                id: row[0],
                name: row[1],
                email: row[2],
                assignedInterviews: parseInt(row[3]) || 0
            }));
            console.log('Interviewers loaded:', interviewers);
            updateInterviewersList();
        } else {
            console.log('No interviewers found in the Google Sheet.');
        }
    }, function(response) {
        console.error('Error fetching interviewers:', response.result.error.message);
    });
}

// Update interviewers list in UI
function updateInterviewersList() {
    const interviewerTable = document.getElementById('interviewer-table').getElementsByTagName('tbody')[0];
    interviewerTable.innerHTML = '';

    interviewers.forEach(interviewer => {
        const row = interviewerTable.insertRow();
        row.innerHTML = `
            <td>${interviewer.name}</td>
            <td>${interviewer.email}</td>
            <td>${interviewer.assignedInterviews}</td>
            <td>
                <button onclick="editInterviewer(${interviewer.id})" class="btn btn-secondary">Edit</button>
                <button onclick="removeInterviewer(${interviewer.id})" class="btn btn-secondary">Remove</button>
            </td>
        `;
    });
}

// Fetch questions from Google Sheets
function fetchQuestions() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: 'YOUR_SPREADSHEET_ID',
        range: 'Questions!A2:C', // Assumes headers in row 1
    }).then(function(response) {
        const range = response.result;
        if (range.values.length > 0) {
            questions = range.values.map(row => ({
                id: row[0],
                category: row[1],
                text: row[2]
            }));
            console.log('Questions loaded:', questions);
            updateQuestionsList();
        } else {
            console.log('No questions found in the Google Sheet.');
        }
    }, function(response) {
        console.error('Error fetching questions:', response.result.error.message);
    });
}

// Update questions list in UI
function updateQuestionsList() {
    const questionCategories = document.getElementById('question-categories');
    questionCategories.innerHTML = '';

    const categories = [...new Set(questions.map(q => q.category))];

    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.innerHTML = `
            <h4>${category}</h4>
            <ul>
                ${questions.filter(q => q.category === category).map(q => `
                    <li>${q.text} 
                        <button onclick="editQuestion(${q.id})" class="btn btn-secondary">Edit</button>
                        <button onclick="deleteQuestion(${q.id})" class="btn btn-secondary">Delete</button>
                    </li>
                `).join('')}
            </ul>
        `;
        questionCategories.appendChild(categoryDiv);
    });
}

// Edit interviewer
function editInterviewer(id) {
    const interviewer = interviewers.find(i => i.id === id);
    if (!interviewer) {
        console.error('Interviewer not found');
        return;
    }

    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <h3>Edit Interviewer</h3>
        <form id="edit-interviewer-form">
            <div class="form-group">
                <label for="interviewer-name">Name</label>
                <input type="text" id="interviewer-name" value="${interviewer.name}" required>
            </div>
            <div class="form-group">
                <label for="interviewer-email">Email</label>
                <input type="email" id="interviewer-email" value="${interviewer.email}" required>
            </div>
            <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
    `;

    document.getElementById('edit-interviewer-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const updatedName = document.getElementById('interviewer-name').value;
        const updatedEmail = document.getElementById('interviewer-email').value;

        // Update local data
        interviewer.name = updatedName;
        interviewer.email = updatedEmail;

        // Update Google Sheets
        const updatedData = [[interviewer.id, updatedName, updatedEmail, interviewer.assignedInterviews]];
        saveDataToGoogleSheets(updatedData, `Interviewers!A${interviewers.indexOf(interviewer) + 2}`);

        updateInterviewersList();
        modal.style.display = 'none';
    });

    modal.style.display = 'block';
}

// Remove interviewer
function removeInterviewer(id) {
    if (confirm('Are you sure you want to remove this interviewer?')) {
        const index = interviewers.findIndex(i => i.id === id);
        if (index !== -1) {
            interviewers.splice(index, 1);
            updateInterviewersList();

            // Update Google Sheets
            gapi.client.sheets.spreadsheets.values.clear({
                spreadsheetId: 'YOUR_SPREADSHEET_ID',
                range: `Interviewers!A${index + 2}:D${index + 2}`
            }).then(function(response) {
                console.log('Interviewer removed from Google Sheets');
            }, function(response) {
                console.error('Error removing interviewer from Google Sheets:', response.result.error.message);
            });
        }
    }
}

// Edit question
function editQuestion(id) {
    const question = questions.find(q => q.id === id);
    if (!question) {
        console.error('Question not found');
        return;
    }

    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <h3>Edit Question</h3>
        <form id="edit-question-form">
            <div class="form-group">
                <label for="question-category">Category</label>
                <select id="question-category" required>
                    <option value="Technical Skills" ${question.category === 'Technical Skills' ? 'selected' : ''}>Technical Skills</option>
                    <option value="Soft Skills" ${question.category === 'Soft Skills' ? 'selected' : ''}>Soft Skills</option>
                </select>
            </div>
            <div class="form-group">
                <label for="question-text">Question</label>
                <textarea id="question-text" required>${question.text}</textarea>
            </div>
            <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
    `;

    document.getElementById('edit-question-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const updatedCategory = document.getElementById('question-category').value;
        const updatedText = document.getElementById('question-text').value;

        // Update local data
        question.category = updatedCategory;
        question.text = updatedText;

        // Update Google Sheets
        const updatedData = [[question.id, updatedCategory, updatedText]];
        saveDataToGoogleSheets(updatedData, `Questions!A${questions.indexOf(question) + 2}`);

        updateQuestionsList();
        modal.style.display = 'none';
    });

    modal.style.display = 'block';
}

// Delete question
function deleteQuestion(id) {
    if (confirm('Are you sure you want to delete this question?')) {
        const index = questions.findIndex(q => q.id === id);
        if (index !== -1) {
            questions.splice(index, 1);
            updateQuestionsList();

            // Update Google Sheets
            gapi.client.sheets.spreadsheets.values.clear({
                spreadsheetId: 'YOUR_SPREADSHEET_ID',
                range: `Questions!A${index + 2}:C${index + 2}`
            }).then(function(response) {
                console.log('Question removed from Google Sheets');
            }, function(response) {
                console.error('Error removing question from Google Sheets:', response.result.error.message);
            });
        }
    }
}

// Start interview
function startInterview(id) {
    const interview = mockSchedule.find(i => i.id === id);
    if (!interview) {
        console.error('Interview not found');
        return;
    }

    viewInterviewee(id);
    // Additional logic to start the interview can be added here
}

// Load interview statistics
function loadStatistics() {
    // In a real application, you would fetch this data from your Google Sheets
    const mockData = {
        totalInterviews: 50,
        averageRating: 3.8,
        statusDistribution: {
            'Pending': 10,
            'Scheduled': 15,
            'Interviewed': 20,
            'Hired': 5
        }
    };

    const statsCharts = document.getElementById('stats-charts');
    statsCharts.innerHTML = `
        <div>
            <h4>Total Interviews: ${mockData.totalInterviews}</h4>
            <h4>Average Rating: ${mockData.averageRating.toFixed(1)}</h4>
        </div>
        <div id="status-distribution-chart"></div>
    `;

    // Create a simple bar chart for status distribution
    const chart = document.createElement('div');
    chart.style.display = 'flex';
    chart.style.alignItems = 'flex-end';
    chart.style.height = '200px';
    chart.style.width = '100%';

    Object.entries(mockData.statusDistribution).forEach(([status, count]) => {
        const bar = document.createElement('div');
        bar.style.flexGrow = 1;
        bar.style.backgroundColor = getRandomColor();
        bar.style.marginRight = '5px';
        bar.style.height = `${(count / mockData.totalInterviews) * 100}%`;
        bar.title = `${status}: ${count}`;
        
        const label = document.createElement('div');
        label.textContent = status;
        label.style.textAlign = 'center';
        label.style.fontSize = '12px';
        label.style.marginTop = '5px';

        const barContainer = document.createElement('div');
        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        chart.appendChild(barContainer);
    });

    document.getElementById('status-distribution-chart').appendChild(chart);
}

// Helper function to generate random colors for the chart
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    gapi.load('client', initGoogleSheetsAPI);
});         
