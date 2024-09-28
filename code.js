// Global variables
let currentUser = null;
let currentRole = null;

// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const profileSection = document.getElementById('profile-section');
const interviewerDashboard = document.getElementById('interviewer-dashboard');
const adminDashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('login-form');
const logoutLink = document.getElementById('logout-link');
const upcomingInterviews = document.getElementById('upcoming-interviews');
const assignedInterviewees = document.getElementById('assigned-interviewees');
const systemStats = document.getElementById('system-stats');
const interviewerManagement = document.getElementById('interviewer-management');
const questionManagement = document.getElementById('question-management');
const intervieweeInfo = document.getElementById('interviewee-info');
const interviewQuestions = document.getElementById('interview-questions');
const notesArea = document.getElementById('notes-area');
const saveNotesButton = document.getElementById('save-notes');
const ratingSelect = document.getElementById('rating-select');
const saveRatingButton = document.getElementById('save-rating');

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
logoutLink.addEventListener('click', handleLogout);
saveNotesButton.addEventListener('click', saveNotes);
saveRatingButton.addEventListener('click', saveRating);

// Functions
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Call Google Apps Script function to authenticate
    google.script.run.withSuccessHandler(onLoginSuccess).withFailureHandler(onLoginFailure).authenticateUser(email, password);
}

function onLoginSuccess(userData) {
    if (userData) {
        currentUser = userData.email;
        currentRole = userData.role;
        loginSection.classList.remove('active');
        dashboardSection.classList.add('active');
        loadDashboard();
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

function onLoginFailure(error) {
    console.error('Login error:', error);
    alert('An error occurred during login. Please try again.');
}

function handleLogout() {
    currentUser = null;
    currentRole = null;
    dashboardSection.classList.remove('active');
    profileSection.classList.remove('active');
    loginSection.classList.add('active');
    clearDashboard();
}

function loadDashboard() {
    if (currentRole === 'interviewer') {
        interviewerDashboard.classList.remove('hidden');
        adminDashboard.classList.add('hidden');
        loadInterviewerDashboard();
    } else if (currentRole === 'admin') {
        interviewerDashboard.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        loadAdminDashboard();
    }
}

function loadInterviewerDashboard() {
    google.script.run.withSuccessHandler(displayUpcomingInterviews).getUpcomingInterviews(currentUser);
    google.script.run.withSuccessHandler(displayAssignedInterviewees).getAssignedInterviewees(currentUser);
}

function loadAdminDashboard() {
    google.script.run.withSuccessHandler(displaySystemStats).getSystemStats();
    google.script.run.withSuccessHandler(displayInterviewerManagement).getInterviewers();
    google.script.run.withSuccessHandler(displayQuestionManagement).getInterviewQuestions();
}

function displayUpcomingInterviews(interviews) {
    upcomingInterviews.innerHTML = '';
    interviews.forEach(interview => {
        const li = document.createElement('li');
        li.textContent = `${interview.interviewee} - ${interview.date} ${interview.time}`;
        upcomingInterviews.appendChild(li);
    });
}

function displayAssignedInterviewees(interviewees) {
    assignedInterviewees.innerHTML = '';
    interviewees.forEach(interviewee => {
        const li = document.createElement('li');
        li.textContent = interviewee.name;
        li.addEventListener('click', () => loadIntervieweeProfile(interviewee.id));
        assignedInterviewees.appendChild(li);
    });
}

function displaySystemStats(stats) {
    systemStats.innerHTML = `
        <p>Total Applicants: ${stats.totalApplicants}</p>
        <p>Interviews Completed: ${stats.interviewsCompleted}</p>
        <p>Interviews Scheduled: ${stats.interviewsScheduled}</p>
    `;
}

function displayInterviewerManagement(interviewers) {
    interviewerManagement.innerHTML = '';
    interviewers.forEach(interviewer => {
        const div = document.createElement('div');
        div.innerHTML = `
            <p>${interviewer.name} - ${interviewer.email}</p>
            <button onclick="assignInterviewer('${interviewer.id}')">Assign Interviewees</button>
        `;
        interviewerManagement.appendChild(div);
    });
}

function displayQuestionManagement(questions) {
    questionManagement.innerHTML = '';
    questions.forEach(question => {
        const div = document.createElement('div');
        div.innerHTML = `
            <p>${question.text}</p>
            <button onclick="editQuestion('${question.id}')">Edit</button>
            <button onclick="deleteQuestion('${question.id}')">Delete</button>
        `;
        questionManagement.appendChild(div);
    });
    const addButton = document.createElement('button');
    addButton.textContent = 'Add New Question';
    addButton.onclick = addNewQuestion;
    questionManagement.appendChild(addButton);
}

function loadIntervieweeProfile(intervieweeId) {
    dashboardSection.classList.remove('active');
    profileSection.classList.add('active');
    google.script.run.withSuccessHandler(displayIntervieweeInfo).getIntervieweeInfo(intervieweeId);
    google.script.run.withSuccessHandler(displayInterviewQuestions).getInterviewQuestions(intervieweeId);
}

function displayIntervieweeInfo(info) {
    intervieweeInfo.innerHTML = `
        <h3>${info.name}</h3>
        <p>College: ${info.college}</p>
        <p>Study Year: ${info.studyYear}</p>
        <p>Email: ${info.email}</p>
    `;
}

function displayInterviewQuestions(questions) {
    interviewQuestions.innerHTML = '';
    questions.forEach(question => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h4>${question.text}</h4>
            <textarea rows="3" id="answer-${question.id}"></textarea>
        `;
        interviewQuestions.appendChild(div);
    });
}

function saveNotes() {
    const notes = notesArea.value;
    google.script.run.withSuccessHandler(onNotesSaved).saveInterviewNotes(currentUser, notes);
}

function onNotesSaved() {
    alert('Notes saved successfully');
}

function saveRating() {
    const rating = ratingSelect.value;
    google.script.run.withSuccessHandler(onRatingSaved).saveIntervieweeRating(currentUser, rating);
}

function onRatingSaved() {
    alert('Rating saved successfully');
}

function assignInterviewer(interviewerId) {
    const intervieweeId = prompt('Enter the ID of the interviewee to assign:');
    if (intervieweeId) {
        google.script.run.withSuccessHandler(onInterviewerAssigned).assignInterviewerToInterviewee(interviewerId, intervieweeId);
    }
}

function onInterviewerAssigned() {
    alert('Interviewer assigned successfully');
    loadAdminDashboard();
}

function editQuestion(questionId) {
    const newText = prompt('Enter the new question text:');
    if (newText) {
        google.script.run.withSuccessHandler(onQuestionEdited).editInterviewQuestion(questionId, newText);
    }
}

function onQuestionEdited() {
    alert('Question edited successfully');
    loadAdminDashboard();
}

function deleteQuestion(questionId) {
    if (confirm('Are you sure you want to delete this question?')) {
        google.script.run.withSuccessHandler(onQuestionDeleted).deleteInterviewQuestion(questionId);
    }
}

function onQuestionDeleted() {
    alert('Question deleted successfully');
    loadAdminDashboard();
}

function addNewQuestion() {
    const newQuestionText = prompt('Enter the new question:');
    if (newQuestionText) {
        google.script.run.withSuccessHandler(onQuestionAdded).addInterviewQuestion(newQuestionText);
    }
}

function onQuestionAdded() {
    alert('New question added successfully');
    loadAdminDashboard();
}

function clearDashboard() {
    upcomingInterviews.innerHTML = '';
    assignedInterviewees.innerHTML = '';
    systemStats.innerHTML = '';
    interviewerManagement.innerHTML = '';
    questionManagement.innerHTML = '';
    intervieweeInfo.innerHTML = '';
    interviewQuestions.innerHTML = '';
    notesArea.value = '';
    ratingSelect.value = '';
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    google.script.run.withSuccessHandler(initializeApp).checkUserSession();
});

function initializeApp(session) {
    if (session) {
        currentUser = session.email;
        currentRole = session.role;
        loginSection.classList.remove('active');
        dashboardSection.classList.add('active');
        loadDashboard();
    } else {
        loginSection.classList.add('active');
    }
}

// Error handling
window.onerror = function(message, source, lineno, colno, error) {
    console.error('An error occurred:', error);
    alert('An unexpected error occurred. Please try refreshing the page.');
};
