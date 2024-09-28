// Global variables
let currentUser = null;
let currentPage = 'login';

// DOM Elements
const app = document.getElementById('app');
const mainNav = document.getElementById('main-nav');
const logoutBtn = document.getElementById('logout-btn');
const loginForm = document.getElementById('login-form');
const pages = document.querySelectorAll('.page');

// Event Listeners
document.addEventListener('DOMContentLoaded', initApp);
mainNav.addEventListener('click', handleNavigation);
logoutBtn.addEventListener('click', handleLogout);
loginForm.addEventListener('submit', handleLogin);

// Initialize the application
function initApp() {
    checkAuthStatus();
    renderPage(currentPage);
}

// Check authentication status
function checkAuthStatus() {
    // In a real application, you would check with the server
    // For this example, we'll use localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateNavigation();
    }
}

// Update navigation based on user role
function updateNavigation() {
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (currentUser) {
            if (link.dataset.page === 'login') {
                link.classList.add('hidden');
            } else {
                link.classList.remove('hidden');
            }
        } else {
            if (link.dataset.page === 'login') {
                link.classList.remove('hidden');
            } else {
                link.classList.add('hidden');
            }
        }
    });

    logoutBtn.classList.toggle('hidden', !currentUser);
}

// Handle navigation
function handleNavigation(e) {
    e.preventDefault();
    if (e.target.classList.contains('nav-link')) {
        const page = e.target.dataset.page;
        renderPage(page);
    }
}

// Render the selected page
function renderPage(page) {
    pages.forEach(p => p.classList.add('hidden'));
    const selectedPage = document.getElementById(`${page}-page`);
    if (selectedPage) {
        selectedPage.classList.remove('hidden');
        currentPage = page;

        switch (page) {
            case 'dashboard':
                renderDashboard();
                break;
            case 'profile':
                renderProfile();
                break;
            case 'admin':
                renderAdminDashboard();
                break;
        }
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // In a real application, you would send this to the server for authentication
    // For this example, we'll use a mock login
    if (email === 'admin@enactus.com' && password === 'admin123') {
        currentUser = { email, role: 'admin' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateNavigation();
        renderPage('dashboard');
    } else if (email === 'interviewer@enactus.com' && password === 'interviewer123') {
        currentUser = { email, role: 'interviewer' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateNavigation();
        renderPage('dashboard');
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

// Handle logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateNavigation();
    renderPage('login');
}

// Render dashboard
function renderDashboard() {
    const dashboardContent = document.getElementById('dashboard-content');
    if (currentUser.role === 'admin') {
        dashboardContent.innerHTML = `
            <h3>Welcome, Admin!</h3>
            <div class="dashboard-stats">
                <div class="stat-card">
                    <h4>Total Applicants</h4>
                    <p>150</p>
                </div>
                <div class="stat-card">
                    <h4>Interviews Scheduled</h4>
                    <p>75</p>
                </div>
                <div class="stat-card">
                    <h4>Interviews Completed</h4>
                    <p>50</p>
                </div>
            </div>
            <div class="dashboard-actions">
                <button onclick="renderPage('admin')">Go to Admin Dashboard</button>
            </div>
        `;
    } else {
        dashboardContent.innerHTML = `
            <h3>Welcome, Interviewer!</h3>
            <div class="upcoming-interviews">
                <h4>Upcoming Interviews</h4>
                <ul>
                    <li>John Doe - 2:00 PM</li>
                    <li>Jane Smith - 3:30 PM</li>
                    <li>Mike Johnson - 5:00 PM</li>
                </ul>
            </div>
            <div class="dashboard-actions">
                // ... (continued from previous code.js)

                <button onclick="renderPage('profile')">View Next Interviewee</button>
            </div>
        `;
    }
}

// Render profile
function renderProfile() {
    const profileContent = document.getElementById('profile-content');
    // In a real application, you would fetch this data from the server
    const mockInterviewee = {
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "+20 123 456 7890",
        university: "Menoufia University",
        major: "Computer Science",
        graduationYear: "2025",
        skills: ["JavaScript", "React", "Node.js", "Python"],
        experience: "1 year internship at Tech Corp"
    };

    profileContent.innerHTML = `
        <div class="interviewee-info">
            <h3>${mockInterviewee.name}</h3>
            <p><strong>Email:</strong> ${mockInterviewee.email}</p>
            <p><strong>Phone:</strong> ${mockInterviewee.phone}</p>
            <p><strong>University:</strong> ${mockInterviewee.university}</p>
            <p><strong>Major:</strong> ${mockInterviewee.major}</p>
            <p><strong>Graduation Year:</strong> ${mockInterviewee.graduationYear}</p>
            <p><strong>Skills:</strong> ${mockInterviewee.skills.join(', ')}</p>
            <p><strong>Experience:</strong> ${mockInterviewee.experience}</p>
        </div>
        <div class="interview-questions">
            <h4>Interview Questions</h4>
            <ul id="question-list"></ul>
        </div>
    `;

    renderInterviewQuestions();
    setupRating();
}

// Render interview questions
function renderInterviewQuestions() {
    const questionList = document.getElementById('question-list');
    // In a real application, you would fetch these questions from the server
    const mockQuestions = [
        "Tell me about yourself and your background in Enactus.",
        "What motivated you to join Enactus Menoufia?",
        "Describe a project you've worked on that demonstrates your leadership skills.",
        "How do you handle conflicts within a team?",
        "What do you think are the biggest challenges facing social entrepreneurs today?"
    ];

    questionList.innerHTML = mockQuestions.map(q => `
        <li>
            <p>${q}</p>
            <textarea class="question-notes" rows="2" placeholder="Enter notes here..."></textarea>
        </li>
    `).join('');
}

// Setup rating system
function setupRating() {
    const ratingStars = document.getElementById('rating-stars');
    const submitRating = document.getElementById('submit-rating');

    ratingStars.innerHTML = `
        <i class="fas fa-star" data-rating="1"></i>
        <i class="fas fa-star" data-rating="2"></i>
        <i class="fas fa-star" data-rating="3"></i>
        <i class="fas fa-star" data-rating="4"></i>
        <i class="fas fa-star" data-rating="5"></i>
    `;

    let currentRating = 0;

    ratingStars.addEventListener('click', (e) => {
        if (e.target.matches('.fa-star')) {
            currentRating = parseInt(e.target.dataset.rating);
            updateStars();
        }
    });

    submitRating.addEventListener('click', () => {
        if (currentRating > 0) {
            // In a real application, you would send this rating to the server
            alert(`Rating of ${currentRating} stars submitted.`);
        } else {
            alert('Please select a rating before submitting.');
        }
    });

    function updateStars() {
        const stars = ratingStars.querySelectorAll('.fa-star');
        stars.forEach((star, index) => {
            if (index < currentRating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
}

// Render admin dashboard
function renderAdminDashboard() {
    const adminContent = document.getElementById('admin-content');
    adminContent.innerHTML = `
        <div class="admin-stats">
            <div class="stat-card">
                <h4>Total Applicants</h4>
                <p id="total-applicants">Loading...</p>
            </div>
            <div class="stat-card">
                <h4>Interviews Scheduled</h4>
                <p id="interviews-scheduled">Loading...</p>
            </div>
            <div class="stat-card">
                <h4>Interviews Completed</h4>
                <p id="interviews-completed">Loading...</p>
            </div>
        </div>
        <div class="admin-actions">
            <button onclick="showApplicantOverview()">Applicant Overview</button>
            <button onclick="showInterviewSchedule()">Interview Schedule</button>
            <button onclick="showInterviewerManagement()">Interviewer Management</button>
            <button onclick="showQuestionBank()">Question Bank</button>
        </div>
        <div id="admin-view-content"></div>
    `;

    fetchAdminStats();
}

// Fetch admin statistics
function fetchAdminStats() {
    // In a real application, you would fetch this data from the server
    // For this example, we'll use setTimeout to simulate an API call
    setTimeout(() => {
        document.getElementById('total-applicants').textContent = '150';
        document.getElementById('interviews-scheduled').textContent = '75';
        document.getElementById('interviews-completed').textContent = '50';
    }, 1000);
}

// Show applicant overview
function showApplicantOverview() {
    const adminViewContent = document.getElementById('admin-view-content');
    adminViewContent.innerHTML = `
        <h3>Applicant Overview</h3>
        <canvas id="applicant-chart"></canvas>
    `;

    // Create a chart using Chart.js
    const ctx = document.getElementById('applicant-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Applied', 'Shortlisted', 'Interviewed', 'Accepted', 'Rejected'],
            datasets: [{
                label: 'Number of Applicants',
                data: [150, 100, 75, 30, 45],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Show interview schedule
function showInterviewSchedule() {
    const adminViewContent = document.getElementById('admin-view-content');
    adminViewContent.innerHTML = `
        <h3>Interview Schedule</h3>
        <div id="interview-calendar"></div>
    `;

    // Initialize FullCalendar
    const calendarEl = document.getElementById('interview-calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [
            {
                title: 'Interview: John Doe',
                start: '2024-09-30T10:00:00',
                end: '2024-09-30T11:00:00'
            },
            {
                title: 'Interview: Jane Smith',
                start: '2024-09-30T14:00:00',
                end: '2024-09-30T15:00:00'
            },
            // Add more events as needed
        ]
    });
    calendar.render();
}

// Show interviewer management
function showInterviewerManagement() {
    const adminViewContent = document.getElementById('admin-view-content');
    adminViewContent.innerHTML = `
        <h3>Interviewer Management</h3>
        <table class="interviewer-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="interviewer-list"></tbody>
        </table>
        <button onclick="showAddInterviewerForm()">Add Interviewer</button>
    `;

    // Fetch and display interviewers
    fetchInterviewers();
}

// Fetch interviewers
function fetchInterviewers() {
    // In a real application, you would fetch this data from the server
    const mockInterviewers = [
        { id: 1, name: "Alice Johnson", email: "alice@enactus.com", role: "Lead Interviewer" },
        { id: 2, name: "Bob Smith", email: "bob@enactus.com", role: "Interviewer" },
        { id: 3, name: "Carol Williams", email: "carol@enactus.com", role: "Interviewer" }
    ];

    const interviewerList = document.getElementById('interviewer-list');
    interviewerList.innerHTML = mockInterviewers.map(interviewer => `
        <tr>
            <td>${interviewer.name}</td>
            <td>${interviewer.email}</td>
            <td>${interviewer.role}</td>
            <td>
                <button onclick="editInterviewer(${interviewer.id})">Edit</button>
                <button onclick="deleteInterviewer(${interviewer.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Show add interviewer form
function showAddInterviewerForm() {
    const adminViewContent = document.getElementById('admin-view-content');
    adminViewContent.innerHTML = `
        <h3>Add Interviewer</h3>
        <form id="add-interviewer-form">
            <div class="form-group">
                <label for="interviewer-name">Name</label>
                <input type="text" id="interviewer-name" required>
            </div>
            <div class="form-group">
                <label for="interviewer-email">Email</label>
                <input type="email" id="interviewer-email" required>
            </div>
            <div class="form-group">
                <label for="interviewer-role">Role</label>
                <select id="interviewer-role" required>
                    <option value="Lead Interviewer">Lead Interviewer</option>
                    <option value="Interviewer">Interviewer</option>
                </select>
            </div>
            <button type="submit">Add Interviewer</button>
        </form>
    `;

    document.getElementById('add-interviewer-form').addEventListener('submit', handleAddInterviewer);
}

// Handle add interviewer
function handleAddInterviewer(e) {
    e.preventDefault();
    const name = document.getElementById('interviewer-name').value;
    const email = document.getElementById('interviewer-email').value;
    const role = document.getElementById('interviewer-role').value;

    // In a real application, you would send this data to the server
    alert(`Interviewer added: ${name} (${email}) - ${role}`);
    showInterviewerManagement();
}

// Edit interviewer
function editInterviewer(id) {
    // In a real application, you would fetch the interviewer's data and populate a form
    alert(`Editing interviewer with ID: ${id}`);
}

// Delete interviewer
function deleteInterviewer(id) {
    // In a real application, you would send a request to the server to delete the interviewer
    if (confirm(`Are you sure you want to delete the interviewer with ID: ${id}?`)) {
        alert(`Interviewer with ID: ${id} deleted`);
        showInterviewerManagement();
    }
}

// Show question bank
function showQuestionBank() {
    const adminViewContent = document.getElementById('admin-view-content');
    adminViewContent.innerHTML = `
        <h3>Question Bank</h3>
        <div id="question-list"></div>
        <button onclick="showAddQuestionForm()">Add Question</button>
    `;

    // Fetch and display questions
    fetchQuestions();
}

// Fetch questions
function fetchQuestions() {
    // In a real application, you would fetch this data from the server
    const mockQuestions = [
        { id: 1, text: "Tell me about yourself and your background in Enactus.", category: "General" },
        { id: 2, text: "What motivated you to join Enactus Menoufia?", category: "Motivation" },
        { id: 3, text: "Describe a project you've worked on that demonstrates your leadership skills.", category: "Experience" },
        { id: 4, text: "How do you handle conflicts within a team?", category: "Teamwork" },
        { id: 5, text: "What do you think are the biggest challenges facing social entrepreneurs today?", category: "Industry Knowledge" }
    ];

    const questionList = document.getElementById('question-list');
    questionList.innerHTML = mockQuestions.map(question => `
        <div class="question-item">
            <p><strong>${question.category}:</strong> ${question.text}</p>
            <button onclick="editQuestion(${question.id})">Edit</button>
            <button onclick="deleteQuestion(${question.id})">Delete</button>
        </div>
    `).join('');
}

// Show add question form
function showAddQuestionForm() {
    const adminViewContent = document.getElementById('admin-view-content');
    adminViewContent.innerHTML = `
        <h3>Add Question</h3>
        <form id="add-question-form">
            <div class="form-group">
                <label for="question-text">Question</label>
                <textarea id="question-text" rows="3" required></textarea>
            </div>
            <div class="form-group">
                <label for="question-category">Category</label>
                <select id="question-category" required>
                    <option value="General">General</option>
                    <option value="Motivation">Motivation</option>
                    <option value="Experience">Experience</option>
                    <option value="Teamwork">Teamwork</option>
                    <option value="Industry Knowledge">Industry Knowledge</option>
                </select>
            </div>
            <button type="submit">Add Question</button>
        </form>
    `;

    document.getElementById('add-question-form').addEventListener('submit', handleAddQuestion);
}

// Handle add question
function handleAddQuestion(e) {
    e.preventDefault();
    const text = document.getElementById('question-text').value;
    const category = document.getElementById('question-category').value;

    // In a real application, you would send this data to the server
    alert(`Question added: ${category} - ${text}`);
    showQuestionBank();
}

// Edit question
function editQuestion(id) {
    // In a real application, you would fetch the question's data and populate a form
    alert(`Editing question with ID: ${id}`);
}

// ... (continued from previous code.js)

// Delete question
function deleteQuestion(id) {
    // In a real application, you would send a request to the server to delete the question
    if (confirm(`Are you sure you want to delete the question with ID: ${id}?`)) {
        alert(`Question with ID: ${id} deleted`);
        showQuestionBank();
    }
}

// Helper function to make API calls to Google Apps Script
function callScriptFunction(functionName, params) {
    return new Promise((resolve, reject) => {
        google.script.run
            .withSuccessHandler(resolve)
            .withFailureHandler(reject)
            [functionName](params);
    });
}

// Function to load data from Google Sheets
async function loadDataFromSheets() {
    try {
        const data = await callScriptFunction('getDataFromSheets');
        // Process the data as needed
        console.log('Data loaded from Google Sheets:', data);
        // Update UI with the loaded data
        updateUIWithData(data);
    } catch (error) {
        console.error('Error loading data from Google Sheets:', error);
        alert('An error occurred while loading data. Please try again.');
    }
}

// Function to update UI with loaded data
function updateUIWithData(data) {
    // Update various sections of the UI based on the loaded data
    // This is a placeholder function - you'll need to implement the actual UI updates
    console.log('Updating UI with data:', data);
    // Example: Update dashboard stats
    if (data.dashboardStats) {
        document.getElementById('total-applicants').textContent = data.dashboardStats.totalApplicants;
        document.getElementById('interviews-scheduled').textContent = data.dashboardStats.interviewsScheduled;
        document.getElementById('interviews-completed').textContent = data.dashboardStats.interviewsCompleted;
    }
    // Add more UI updates as needed
}

// Function to save data to Google Sheets
async function saveDataToSheets(data) {
    try {
        await callScriptFunction('saveDataToSheets', data);
        console.log('Data saved to Google Sheets:', data);
        alert('Data saved successfully!');
    } catch (error) {
        console.error('Error saving data to Google Sheets:', error);
        alert('An error occurred while saving data. Please try again.');
    }
}

// Example function to save an interview note
async function saveInterviewNote(intervieweeId, note) {
    const data = {
        intervieweeId: intervieweeId,
        note: note,
        timestamp: new Date().toISOString()
    };
    await saveDataToSheets(data);
}

// Function to handle interview note submission
function handleInterviewNoteSubmit(e) {
    e.preventDefault();
    const noteText = document.getElementById('interview-notes').value;
    const intervieweeId = getCurrentIntervieweeId(); // You'll need to implement this function
    saveInterviewNote(intervieweeId, noteText);
}

// Add event listener for interview note form
document.getElementById('notes-form').addEventListener('submit', handleInterviewNoteSubmit);

// Function to get current interviewee ID (placeholder)
function getCurrentIntervieweeId() {
    // In a real application, you would get this from the current state or URL
    return '12345'; // Placeholder ID
}

// Function to load interview questions
async function loadInterviewQuestions() {
    try {
        const questions = await callScriptFunction('getInterviewQuestions');
        renderInterviewQuestions(questions);
    } catch (error) {
        console.error('Error loading interview questions:', error);
        alert('An error occurred while loading interview questions. Please try again.');
    }
}

// Function to render interview questions
function renderInterviewQuestions(questions) {
    const questionList = document.getElementById('question-list');
    questionList.innerHTML = questions.map(q => `
        <li>
            <p>${q.text}</p>
            <textarea class="question-notes" rows="2" placeholder="Enter notes here..."></textarea>
        </li>
    `).join('');
}

// Function to handle applicant search
async function handleApplicantSearch(searchTerm) {
    try {
        const results = await callScriptFunction('searchApplicants', searchTerm);
        displaySearchResults(results);
    } catch (error) {
        console.error('Error searching applicants:', error);
        alert('An error occurred while searching applicants. Please try again.');
    }
}

// Function to display search results
function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = results.map(applicant => `
        <div class="applicant-card">
            <h4>${applicant.name}</h4>
            <p>Email: ${applicant.email}</p>
            <p>University: ${applicant.university}</p>
            <button onclick="viewApplicantProfile('${applicant.id}')">View Profile</button>
        </div>
    `).join('');
}

// Function to view applicant profile
async function viewApplicantProfile(applicantId) {
    try {
        const profile = await callScriptFunction('getApplicantProfile', applicantId);
        renderApplicantProfile(profile);
    } catch (error) {
        console.error('Error loading applicant profile:', error);
        alert('An error occurred while loading the applicant profile. Please try again.');
    }
}

// Function to render applicant profile
function renderApplicantProfile(profile) {
    const profileContent = document.getElementById('profile-content');
    profileContent.innerHTML = `
        <h3>${profile.name}</h3>
        <p><strong>Email:</strong> ${profile.email}</p>
        <p><strong>Phone:</strong> ${profile.phone}</p>
        <p><strong>University:</strong> ${profile.university}</p>
        <p><strong>Major:</strong> ${profile.major}</p>
        <p><strong>Graduation Year:</strong> ${profile.graduationYear}</p>
        <p><strong>Skills:</strong> ${profile.skills.join(', ')}</p>
        <p><strong>Experience:</strong> ${profile.experience}</p>
    `;
}

// Function to schedule an interview
async function scheduleInterview(applicantId, interviewerId, dateTime) {
    try {
        await callScriptFunction('scheduleInterview', { applicantId, interviewerId, dateTime });
        alert('Interview scheduled successfully!');
        // Refresh the interview schedule display
        showInterviewSchedule();
    } catch (error) {
        console.error('Error scheduling interview:', error);
        alert('An error occurred while scheduling the interview. Please try again.');
    }
}

// Function to generate reports
async function generateReport(reportType) {
    try {
        const reportData = await callScriptFunction('generateReport', reportType);
        displayReport(reportType, reportData);
    } catch (error) {
        console.error('Error generating report:', error);
        alert('An error occurred while generating the report. Please try again.');
    }
}

// Function to display generated report
function displayReport(reportType, reportData) {
    const reportContainer = document.getElementById('report-container');
    // Clear previous report
    reportContainer.innerHTML = '';

    // Create report based on type
    switch (reportType) {
        case 'applicantSummary':
            createApplicantSummaryReport(reportData);
            break;
        case 'interviewStatistics':
            createInterviewStatisticsReport(reportData);
            break;
        // Add more report types as needed
    }
}

// Function to create applicant summary report
function createApplicantSummaryReport(data) {
    const reportContainer = document.getElementById('report-container');
    reportContainer.innerHTML = `
        <h3>Applicant Summary Report</h3>
        <p>Total Applicants: ${data.totalApplicants}</p>
        <p>Shortlisted: ${data.shortlisted}</p>
        <p>Interviewed: ${data.interviewed}</p>
        <p>Accepted: ${data.accepted}</p>
        <p>Rejected: ${data.rejected}</p>
        <canvas id="applicant-summary-chart"></canvas>
    `;

    // Create chart using Chart.js
    const ctx = document.getElementById('applicant-summary-chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Shortlisted', 'Interviewed', 'Accepted', 'Rejected'],
            datasets: [{
                data: [data.shortlisted, data.interviewed, data.accepted, data.rejected],
                backgroundColor: [
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                ]
            }]
        }
    });
}

// Function to create interview statistics report
function createInterviewStatisticsReport(data) {
    const reportContainer = document.getElementById('report-container');
    reportContainer.innerHTML = `
        <h3>Interview Statistics Report</h3>
        <p>Total Interviews: ${data.totalInterviews}</p>
        <p>Average Interview Duration: ${data.averageDuration} minutes</p>
        <p>Highest Rated Skill: ${data.highestRatedSkill}</p>
        <p>Lowest Rated Skill: ${data.lowestRatedSkill}</p>
        <canvas id="interview-statistics-chart"></canvas>
    `;

    // Create chart using Chart.js
    const ctx = document.getElementById('interview-statistics-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(data.skillRatings),
            datasets: [{
                label: 'Average Skill Ratings',
                data: Object.values(data.skillRatings),
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5
                }
            }
        }
    });
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);
