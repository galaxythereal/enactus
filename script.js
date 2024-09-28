// Global variables
let currentUser = null;
let currentRole = null;

// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const intervieweeSection = document.getElementById('interviewee-section');
const adminSection = document.getElementById('admin-section');
const reportsSection = document.getElementById('reports-section');

// Event Listeners
document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('nav-home').addEventListener('click', showDashboard);
document.getElementById('nav-logout').addEventListener('click', handleLogout);
document.getElementById('generate-report').addEventListener('click', generateReport);
document.getElementById('submit-rating').addEventListener('click', submitRating);

// Login Handler
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Call Google Apps Script function
    google.script.run.withSuccessHandler(loginSuccess).withFailureHandler(loginFailure).validateUser(email, password);
}

function loginSuccess(user) {
    if (user) {
        currentUser = user;
        currentRole = user.role;
        showDashboard();
    } else {
        loginFailure('Invalid credentials');
    }
}

function loginFailure(error) {
    alert('Login failed: ' + error);
}

// Navigation Functions
function showDashboard() {
    hideAllSections();
    dashboardSection.classList.remove('hidden');
    loadDashboardData();
}

function showIntervieweeProfile(intervieweeId) {
    hideAllSections();
    intervieweeSection.classList.remove('hidden');
    loadIntervieweeData(intervieweeId);
}

function showAdminDashboard() {
    hideAllSections();
    adminSection.classList.remove('hidden');
    loadAdminData();
}

function hideAllSections() {
    loginSection.classList.add('hidden');
    dashboardSection.classList.add('hidden');
    intervieweeSection.classList.add('hidden');
    adminSection.classList.add('hidden');
    reportsSection.classList.add('hidden');
}

// Data Loading Functions
function loadDashboardData() {
    google.script.run.withSuccessHandler(displayDashboardData).getDashboardData(currentUser.id);
}

function displayDashboardData(data) {
    document.getElementById('user-details').innerHTML = `
        <p>Welcome, ${data.name}</p>
        <p>Role: ${data.role}</p>
    `;

    const scheduleList = document.getElementById('schedule-list');
    scheduleList.innerHTML = '';
    data.upcomingInterviews.forEach(interview => {
        const li = document.createElement('li');
        li.textContent = `${interview.date} - ${interview.intervieweeName}`;
        scheduleList.appendChild(li);
    });

    const statsDisplay = document.getElementById('stats-display');
    statsDisplay.innerHTML = `
        <p>Total Interviews: ${data.totalInterviews}</p>
        <p>Interviews This Week: ${data.interviewsThisWeek}</p>
    `;
}

function loadIntervieweeData(intervieweeId) {
    google.script.run.withSuccessHandler(displayIntervieweeData).getIntervieweeData(intervieweeId);
}

function displayIntervieweeData(data) {
    document.getElementById('applicant-details').innerHTML = `
        <p>Name: ${data.name}</p>
        <p>Email: ${data.email}</p>
        <p>Applied Position: ${data.appliedPosition}</p>
    `;

    const questionList = document.getElementById('question-list');
    questionList.innerHTML = '';
    data.questions.forEach(question => {
        const li = document.createElement('li');
        li.textContent = question;
        questionList.appendChild(li);
    });

    document.getElementById('interview-notes').value = data.notes || '';
    
    const ratingStars = document.getElementById('rating-stars');
    ratingStars.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.textContent = i <= data.rating ? '★' : '☆';
        star.addEventListener('click', () => setRating(i));
        ratingStars.appendChild(star);
    }
}

function loadAdminData() {
    google.script.run.withSuccessHandler(displayAdminData).getAdminData();
}

function displayAdminData(data) {
    const applicantList = document.getElementById('applicant-list');
    applicantList.innerHTML = '';
    data.applicants.forEach(applicant => {
        const li = document.createElement('li');
        li.textContent = `${applicant.name} - ${applicant.status}`;
        applicantList.appendChild(li);
    });

    const interviewerList = document.getElementById('interviewer-list');
    interviewerList.innerHTML = '';
    data.interviewers.forEach(interviewer => {
        const li = document.createElement('li');
        li.textContent = `${interviewer.name} - ${interviewer.role}`;
        interviewerList.appendChild(li);
    });

    const questionBank = document.getElementById('question-bank');
    questionBank.innerHTML = '';
    data.questions.forEach(question => {
        const li = document.createElement('li');
        li.textContent = question;
        questionBank.appendChild(li);
    });
}

// Interview Rating
function setRating(rating) {
    const stars = document.getElementById('rating-stars').children;
    for (let i = 0; i < stars.length; i++) {
        stars[i].textContent = i < rating ? '★' : '☆';
    }
}

function submitRating() {
    const rating = document.getElementById('rating-stars').getElementsByClassName('★').length;
    const notes = document.getElementById('interview-notes').value;
    const intervieweeId = currentIntervieweeId; // Assume this is set when loading interviewee data

    google.script.run.withSuccessHandler(ratingSubmitSuccess).submitInterviewRating(intervieweeId, rating, notes);
}

function ratingSubmitSuccess() {
    alert('Rating submitted successfully');
    showDashboard();
}

// Report Generation
function generateReport() {
    const reportType = document.getElementById('report-type').value;
    google.script.run.withSuccessHandler(displayReport).generateReport(reportType);
}

function displayReport(reportData) {
    const reportContent = document.getElementById('report-content');
    reportContent.innerHTML = '';

    const table = document.createElement('table');
    const headerRow = table.insertRow();
    Object.keys(reportData[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    });

    reportData.forEach(row => {
        const tr = table.insertRow();
        Object.values(row).forEach(value => {
            const td = tr.insertCell();
            td.textContent = value;
        });
    });

    reportContent.appendChild(table);
}

// Logout Handler
function handleLogout() {
    currentUser = null;
    currentRole = null;
    hideAllSections();
    loginSection.classList.remove('hidden');
}

// Initial setup
hideAllSections();
loginSection.classList.remove('hidden');
