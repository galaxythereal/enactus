// Global variables
let currentUser = null;
let googleAuth = null;

// Initialize the application
function init() {
    gapi.load('client:auth2', initGoogleAuth);
    addEventListeners();
}

// Initialize Google Auth
function initGoogleAuth() {
    gapi.client.init({
        apiKey: 'YOUR_API_KEY',
        clientId: 'YOUR_CLIENT_ID',
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        scope: 'https://www.googleapis.com/auth/spreadsheets'
    }).then(() => {
        googleAuth = gapi.auth2.getAuthInstance();
        googleAuth.isSignedIn.listen(updateSignInStatus);
        updateSignInStatus(googleAuth.isSignedIn.get());
    });
}

// Update UI based on sign-in status
function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        document.getElementById('login-section').classList.add('hidden');
        loadUserDashboard();
    } else {
        document.getElementById('login-section').classList.remove('hidden');
        hideAllDashboards();
    }
}

// Load appropriate dashboard based on user role
function loadUserDashboard() {
    getCurrentUser().then(user => {
        currentUser = user;
        if (user.role === 'interviewer') {
            loadInterviewerDashboard();
        } else if (user.role === 'admin') {
            loadAdminDashboard();
        }
    });
}

// Load interviewer dashboard
function loadInterviewerDashboard() {
    document.getElementById('interviewer-dashboard').classList.remove('hidden');
    loadAssignedInterviewees();
    loadUpcomingInterviews();
}

// Load admin dashboard
function loadAdminDashboard() {
    document.getElementById('admin-dashboard').classList.remove('hidden');
    loadApplicantOverview();
    loadInterviewStats();
    loadInterviewerManagement();
    loadQuestionManagement();
}

// Hide all dashboards
function hideAllDashboards() {
    document.getElementById('interviewer-dashboard').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('interviewee-profile').classList.add('hidden');
}

// Add event listeners
function addEventListeners() {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('nav-logout').addEventListener('click', handleLogout);
    document.getElementById('nav-home').addEventListener('click', loadUserDashboard);
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    // In a real application, you would validate credentials against your backend
    // For this example, we'll just simulate a successful login
    googleAuth.signIn();
}

// Handle logout
function handleLogout() {
    googleAuth.signOut();
}

// Get current user information
function getCurrentUser() {
    return new Promise((resolve, reject) => {
        // In a real application, you would fetch this from your backend
        // For this example, we'll return a mock user
        resolve({
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'interviewer'
        });
    });
}

// Load assigned interviewees
function loadAssignedInterviewees() {
    const container = document.getElementById('assigned-interviewees');
    // In a real application, you would fetch this data from your Google Sheet
    // For this example, we'll use mock data
    const interviewees = [
        { id: '1', name: 'Alice Smith', status: 'Pending' },
        { id: '2', name: 'Bob Johnson', status: 'Interviewed' }
    ];
    container.innerHTML = interviewees.map(i => `
        <div class="interviewee">
            <span>${i.name}</span>
            <span>${i.status}</span>
            <button onclick="viewIntervieweeProfile('${i.id}')">View Profile</button>
        </div>
    `).join('');
}

// Load upcoming interviews
function loadUpcomingInterviews() {
    const container = document.getElementById('upcoming-interviews');
    // In a real application, you would fetch this data from your Google Sheet
    // For this example, we'll use mock data
    const interviews = [
        { id: '1', name: 'Alice Smith', date: '2024-10-01', time: '10:00 AM' },
        { id: '2', name: 'Bob Johnson', date: '2024-10-02', time: '2:00 PM' }
    ];
    container.innerHTML = interviews.map(i => `
        <div class="interview">
            <span>${i.name}</span>
            <span>${i.date} ${i.time}</span>
            <button onclick="startInterview('${i.id}')">Start Interview</button>
        </div>
    `).join('');
}

// View interviewee profile
function viewIntervieweeProfile(intervieweeId) {
    hideAllDashboards();
    document.getElementById('interviewee-profile').classList.remove('hidden');
    // In a real application, you would fetch this data from your Google Sheet
    // For this example, we'll use mock data
    const interviewee = {
        id: intervieweeId,
        name: 'Alice Smith',
        email: 'alice@example.com',
        phone: '123-456-7890',
        education: 'Bachelor of Science in Computer Science'
    };
    document.getElementById('interviewee-info').innerHTML = `
        <h3>${interviewee.name}</h3>
        <p>Email: ${interviewee.email}</p>
        <p>Phone: ${interviewee.phone}</p>
        <p>Education: ${interviewee.education}</p>
    `;
    loadQuestionSet();
}

// Load question set
function loadQuestionSet() {
    const container = document.getElementById('question-set');
    // In a real application, you would fetch this data from your Google Sheet
    // For this example, we'll use mock data
    const questions = [
        { id: '1', text: 'Tell me about yourself.' },
        { id: '2', text: 'Why do you want to join Enactus?' },
        { id: '3', text: 'What skills can you bring to our team?' }
    ];
    container.innerHTML = questions.map(q => `
        <div class="question">
            <p>${q.text}</p>
            <textarea id="answer-${q.id}" placeholder="Enter answer..."></textarea>
        </div>
    `).join('');
}

// Start interview
function startInterview(interviewId) {
    viewIntervieweeProfile(interviewId);
    // Additional logic for starting the interview
}

// Load applicant overview (for admin dashboard)
function loadApplicantOverview() {
    const container = document.getElementById('applicant-overview');
    // In a real application, you would fetch this data from your Google Sheet
    // For this example, we'll use mock data
    const applicants = [
        { id: '1', name: 'Alice Smith', status: 'Pending' },
        { id: '2', name: 'Bob Johnson', status: 'Interviewed' },
        { id: '3', name: 'Charlie Brown', status: 'Accepted' }
    ];
    container.innerHTML = `
        <h3>Applicant Overview</h3>
        <table>
            <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
            ${applicants.map(a => `
                <tr>
                    <td>${a.name}</td>
                    <td>${a.status}</td>
                    <td><button onclick="viewIntervieweeProfile('${a.id}')">View Profile</button></td>
                </tr>
            `).join('')}
        </table>
    `;
}

// Load interview stats (for admin dashboard)
function loadInterviewStats() {
    const container = document.getElementById('interview-stats');
    // In a real application, you would fetch this data from your Google Sheet
    // For this example, we'll use mock data
    const stats = {
        totalApplicants: 50,
        interviewsCompleted: 30,
        acceptedApplicants: 15
    };
    container.innerHTML = `
        <h3>Interview Statistics</h3>
        <p>Total Applicants: ${stats.totalApplicants}</p>
        <p>Interviews Completed: ${stats.interviewsCompleted}</p>
        <p>Accepted Applicants: ${stats.acceptedApplicants}</p>
    `;
}

// Load interviewer management (for admin dashboard)
function loadInterviewerManagement() {
    const container = document.getElementById('interviewer-management');
    // In a real application, you would fetch this data from your Google Sheet
    // For this example, we'll use mock data
    const interviewers = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
    ];
    container.innerHTML = `
        <h3>Interviewer Management</h3>
        <table>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
            </tr>
            ${interviewers.map(i => `
                <tr>
                    <td>${i.name}</td>
                    <td>${i.email}</td>
                    <td>
                        <button onclick="editInterviewer('${i.id}')">Edit</button>
                        <button onclick="deleteInterviewer('${i.id}')">Delete</button>
                    </td>
                </tr>
            `).join('')}
        </table>
        <button onclick="addInterviewer()">Add Interviewer</button>
    `;
}

// Load question management (for admin dashboard)
function loadQuestionManagement() {
    const container = document.getElementById('question-management');
    // In a real application, you would fetch this data from your Google Sheet
    // For this example, we'll use mock data
    const questions = [
        { id: '1', text: 'Tell me about yourself.' },
        { id: '2', text: 'Why do you want to join Enactus?' },
        { id: '3', text: 'What skills can you bring to our team?' }
    ];
    container.innerHTML = `
        <h3>Question Management</h3>
        <table>
            <tr>
                <th>Question</th>
                <th>Action</th>
            </tr>
            ${questions.map(q => `
                <tr>
                    <td>${q.text}</td>
                    <td>
                        <button onclick="editQuestion('${q.id}')">Edit</button>
                        <button onclick="deleteQuestion('${q.id}')">Delete</button>
                    </td>
                </tr>
            `).join('')}
        </table>
        <button onclick="addQuestion()">Add Question</button>
    `;
}

// Edit interviewer
function editInterviewer(interviewerId) {
    // Implementation for editing an interviewer
    console.log(`Editing interviewer with ID: ${interviewerId}`);
}

// Delete interviewer
function deleteInterviewer(interviewerId) {
    // Implementation for deleting an interviewer
    console.log(`Deleting interviewer with ID: ${interviewerId}`);
}

// Add interviewer
function addInterviewer() {
    // Implementation for adding a new interviewer
    console.log('Adding a new interviewer');
}

// Edit question
function editQuestion(questionId) {
    // Implementation for editing a question
    console.log(`Editing question with ID: ${questionId}`);
}

// Delete question
function deleteQuestion(questionId) {
    // Implementation for deleting a question
    console.log(`Deleting question with ID: ${questionId}`);
}

// Add question
function addQuestion() {
    // Implementation for adding a new question
    console.log('Adding a new question');
}

// Save interview notes
function saveInterviewNotes() {
    const notes = document.getElementById('interview-notes').value;
    // In a real application, you would save this to your Google Sheet
    console.log('Saving interview notes:', notes);
}

// Submit interview rating
function submitRating(rating) {
    // In a real application, you would save this to your Google Sheet
    console.log('Submitting rating:', rating);
}

// Google Sheets integration functions
function appendToSheet(sheetName, rowData) {
    return gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: 'YOUR_SPREADSHEET_ID',
        range: sheetName,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [rowData]
        }
    });
}

function readFromSheet(sheetName, range) {
    return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: 'YOUR_SPREADSHEET_ID',
        range: `${sheetName}!${range}`
    });
}

function updateSheet(sheetName, range, values) {
    return gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: 'YOUR_SPREADSHEET_ID',
        range: `${sheetName}!${range}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: values
        }
    });
}

// Initialize the application when the page loads
window.onload = init;
