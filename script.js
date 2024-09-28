// Global variables
let currentUser = null;
let currentSection = 'dashboard';
let applicantsData = [];
let interviewsData = [];

// DOM Elements
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const content = document.querySelector('.content');
const sections = document.querySelectorAll('.section');
const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modal-overlay');
const closeModal = document.querySelector('.close-modal');

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);
sidebarToggle.addEventListener('click', toggleSidebar);
sidebar.addEventListener('click', handleNavigation);
closeModal.addEventListener('click', closeModalWindow);

function initializeApp() {
    // Simulating user authentication
    currentUser = { id: 1, name: 'John Doe', role: 'interviewer' };
    updateUserInfo();
    loadDashboardData();
    setupEventListeners();
}

function updateUserInfo() {
    const userInfo = document.querySelector('.user-info');
    userInfo.innerHTML = `
        <img src="user-avatar.jpg" alt="${currentUser.name}" class="avatar">
        <span>${currentUser.name}</span>
    `;
}

function toggleSidebar() {
    sidebar.classList.toggle('active');
    content.classList.toggle('sidebar-hidden');
}

function handleNavigation(e) {
    if (e.target.tagName === 'A') {
        e.preventDefault();
        const targetSection = e.target.getAttribute('href').slice(1);
        changeSection(targetSection);
    }
}

function changeSection(sectionId) {
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    currentSection = sectionId;
    loadSectionData(sectionId);
}

function loadSectionData(sectionId) {
    switch (sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'interviews':
            loadInterviewsData();
            break;
        case 'applicants':
            loadApplicantsData();
            break;
        case 'reports':
            loadReportsData();
            break;
        case 'settings':
            loadSettingsData();
            break;
    }
}

function loadDashboardData() {
    // Simulating API call to fetch dashboard data
    setTimeout(() => {
        const dashboardData = {
            totalApplicants: 150,
            pendingInterviews: 25,
            completedInterviews: 100,
            averageRating: 4.2
        };
        updateDashboardStats(dashboardData);
        createDashboardCharts();
    }, 500);
}

function updateDashboardStats(data) {
    document.getElementById('total-applicants').textContent = data.totalApplicants;
    document.getElementById('pending-interviews').textContent = data.pendingInterviews;
    document.getElementById('completed-interviews').textContent = data.completedInterviews;
    document.getElementById('average-rating').textContent = data.averageRating.toFixed(1);
}

function createDashboardCharts() {
    // Applicant Pipeline Chart
    const pipelineCtx = document.getElementById('applicant-pipeline-chart').getContext('2d');
    new Chart(pipelineCtx, {
        type: 'bar',
        data: {
            labels: ['Applied', 'Screened', 'Interviewed', 'Offered', 'Hired'],
            datasets: [{
                label: 'Applicants',
                data: [100, 75, 50, 25, 10],
                backgroundColor: 'rgba(54, 162, 235, 0.8)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Interview Outcomes Chart
    const outcomesCtx = document.getElementById('interview-outcomes-chart').getContext('2d');
    new Chart(outcomesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Passed', 'Failed', 'No Show'],
            datasets: [{
                data: [70, 20, 10],
                backgroundColor: ['#4CAF50', '#FF5722', '#9E9E9E']
            }]
        },
        options: {
            responsive: true
        }
    });
}

function loadInterviewsData() {
    // Simulating API call to fetch interviews data
    setTimeout(() => {
        interviewsData = [
            { id: 1, applicantName: 'Alice Johnson', date: '2024-10-01', time: '10:00 AM', interviewer: 'John Doe', status: 'Scheduled' },
            { id: 2, applicantName: 'Bob Smith', date: '2024-10-02', time: '2:00 PM', interviewer: 'Jane Smith', status: 'Completed' },
            { id: 3, applicantName: 'Charlie Brown', date: '2024-10-03', time: '11:30 AM', interviewer: 'John Doe', status: 'Scheduled' }
        ];
        renderInterviewsTable();
    }, 500);
}

function renderInterviewsTable() {
    const tableBody = document.getElementById('interviews-table-body');
    tableBody.innerHTML = '';
    interviewsData.forEach(interview => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${interview.applicantName}</td>
            <td>${interview.date}</td>
            <td>${interview.time}</td>
            <td>${interview.interviewer}</td>
            <td>${interview.status}</td>
            <td>
                <button class="btn-secondary view-interview" data-id="${interview.id}">View</button>
                <button class="btn-primary edit-interview" data-id="${interview.id}">Edit</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function loadApplicantsData() {
    // Simulating API call to fetch applicants data
    setTimeout(() => {
        applicantsData = [
            { id: 1, name: 'Alice Johnson', email: 'alice@example.com', status: 'New' },
            { id: 2, name: 'Bob Smith', email: 'bob@example.com', status: 'Interviewed' },
            { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', status: 'Accepted' }
        ];
        renderApplicantsList();
    }, 500);
}

function renderApplicantsList() {
    const applicantsList = document.querySelector('.applicants-list');
    applicantsList.innerHTML = '';
    applicantsData.forEach(applicant => {
        const card = document.createElement('div');
        card.className = 'applicant-card';
        card.innerHTML = `
            <div class="applicant-card-header">
                <h3>${applicant.name}</h3>
            </div>
            <div class="applicant-card-body">
                <p>Email: ${applicant.email}</p>
                <p>Status: ${applicant.status}</p>
            </div>
            <div class="applicant-card-footer">
                <button class="btn-secondary view-applicant" data-id="${applicant.id}">View</button>
                <button class="btn-primary schedule-interview" data-id="${applicant.id}">Schedule Interview</button>
            </div>
        `;
        applicantsList.appendChild(card);
    });
}
function loadReportsData() {
    // Implement reports data loading and visualization
    const reportContainer = document.getElementById('report-container');
    reportContainer.innerHTML = '<canvas id="report-chart"></canvas>';
    
    const ctx = document.getElementById('report-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Applicants',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function loadSettingsData() {
    // Implement settings data loading
    const settingsContent = document.querySelector('.settings-content');
    settingsContent.innerHTML = `
        <div id="general-settings" class="tab-content active">
            <h3>General Settings</h3>
            <form id="general-settings-form">
                <label for="company-name">Company Name</label>
                <input type="text" id="company-name" value="Enactus Menoufia">
                <label for="email-notifications">Email Notifications</label>
                <input type="checkbox" id="email-notifications" checked>
                <button type="submit" class="btn-primary">Save Changes</button>
            </form>
        </div>
        <div id="interview-stages" class="tab-content">
            <h3>Interview Stages</h3>
            <ul id="stage-list">
                <li>Initial Screening</li>
                <li>Technical Interview</li>
                <li>HR Interview</li>
            </ul>
            <button id="add-stage-btn" class="btn-secondary">Add New Stage</button>
        </div>
        <div id="evaluation-criteria" class="tab-content">
            <h3>Evaluation Criteria</h3>
            <ul id="criteria-list">
                <li>Technical Skills</li>
                <li>Communication</li>
                <li>Problem Solving</li>
            </ul>
            <button id="add-criteria-btn" class="btn-secondary">Add New Criteria</button>
        </div>
        <div id="email-templates" class="tab-content">
            <h3>Email Templates</h3>
            <select id="template-select">
                <option value="interview-invitation">Interview Invitation</option>
                <option value="rejection">Rejection</option>
                <option value="offer-letter">Offer Letter</option>
            </select>
            <textarea id="template-content" rows="10"></textarea>
            <button id="save-template-btn" class="btn-primary">Save Template</button>
        </div>
    `;
}

function setupEventListeners() {
    // Dashboard
    document.getElementById('schedule-interview-btn').addEventListener('click', showScheduleInterviewModal);
    document.getElementById('add-applicant-btn').addEventListener('click', showAddApplicantModal);

    // Interviews
    document.getElementById('interviews').addEventListener('click', handleInterviewActions);

    // Applicants
    document.getElementById('applicants').addEventListener('click', handleApplicantActions);
    document.getElementById('applicant-search').addEventListener('input', handleApplicantSearch);
    document.getElementById('applicant-status-filter').addEventListener('change', handleApplicantFilter);

    // Reports
    document.getElementById('generate-report-btn').addEventListener('click', generateReport);

    // Settings
    document.querySelector('.settings-tabs').addEventListener('click', handleSettingsTabs);
    document.getElementById('general-settings-form').addEventListener('submit', saveGeneralSettings);
    document.getElementById('add-stage-btn').addEventListener('click', addInterviewStage);
    document.getElementById('add-criteria-btn').addEventListener('click', addEvaluationCriteria);
    document.getElementById('save-template-btn').addEventListener('click', saveEmailTemplate);
}

function showScheduleInterviewModal() {
    const modalContent = `
        <h2>Schedule Interview</h2>
        <form id="schedule-interview-form">
            <label for="applicant">Applicant</label>
            <select id="applicant" required>
                ${applicantsData.map(applicant => `<option value="${applicant.id}">${applicant.name}</option>`).join('')}
            </select>
            <label for="interviewer">Interviewer</label>
            <input type="text" id="interviewer" required>
            <label for="date">Date</label>
            <input type="date" id="date" required>
            <label for="time">Time</label>
            <input type="time" id="time" required>
            <button type="submit" class="btn-primary">Schedule</button>
        </form>
    `;
    showModal(modalContent);
    document.getElementById('schedule-interview-form').addEventListener('submit', handleScheduleInterview);
}

function showAddApplicantModal() {
    const modalContent = `
        <h2>Add New Applicant</h2>
        <form id="add-applicant-form">
            <label for="name">Name</label>
            <input type="text" id="name" required>
            <label for="email">Email</label>
            <input type="email" id="email" required>
            <label for="phone">Phone</label>
            <input type="tel" id="phone">
            <label for="resume">Resume</label>
            <input type="file" id="resume" accept=".pdf,.doc,.docx">
            <button type="submit" class="btn-primary">Add Applicant</button>
        </form>
    `;
    showModal(modalContent);
    document.getElementById('add-applicant-form').addEventListener('submit', handleAddApplicant);
}

function handleInterviewActions(e) {
    if (e.target.classList.contains('view-interview')) {
        const interviewId = e.target.getAttribute('data-id');
        viewInterview(interviewId);
    } else if (e.target.classList.contains('edit-interview')) {
        const interviewId = e.target.getAttribute('data-id');
        editInterview(interviewId);
    }
}

function handleApplicantActions(e) {
    if (e.target.classList.contains('view-applicant')) {
        const applicantId = e.target.getAttribute('data-id');
        viewApplicant(applicantId);
    } else if (e.target.classList.contains('schedule-interview')) {
        const applicantId = e.target.getAttribute('data-id');
        showScheduleInterviewModal(applicantId);
    }
}

function handleApplicantSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredApplicants = applicantsData.filter(applicant => 
        applicant.name.toLowerCase().includes(searchTerm) || 
        applicant.email.toLowerCase().includes(searchTerm)
    );
    renderApplicantsList(filteredApplicants);
}

function handleApplicantFilter(e) {
    const statusFilter = e.target.value;
    const filteredApplicants = statusFilter === 'all' 
        ? applicantsData 
        : applicantsData.filter(applicant => applicant.status.toLowerCase() === statusFilter);
    renderApplicantsList(filteredApplicants);
}

function generateReport() {
    const reportType = document.getElementById('report-type').value;
    const startDate = document.getElementById('report-start-date').value;
    const endDate = document.getElementById('report-end-date').value;
    
    // Implement report generation logic here
    console.log(`Generating ${reportType} report from ${startDate} to ${endDate}`);
    loadReportsData(); // Refresh the report visualization
}

function handleSettingsTabs(e) {
    if (e.target.classList.contains('tab-btn')) {
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => content.classList.remove('active'));
        
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        const targetTab = e.target.getAttribute('data-tab');
        document.getElementById(targetTab).classList.add('active');
        e.target.classList.add('active');
    }
}

function saveGeneralSettings(e) {
    e.preventDefault();
    const companyName = document.getElementById('company-name').value;
    const emailNotifications = document.getElementById('email-notifications').checked;
    
    // Implement settings save logic here
    console.log(`Saving general settings: Company Name - ${companyName}, Email Notifications - ${emailNotifications}`);
    showNotification('Settings saved successfully');
}

function addInterviewStage() {
    const stageName = prompt('Enter new interview stage name:');
    if (stageName) {
        const stageList = document.getElementById('stage-list');
        const newStage = document.createElement('li');
        newStage.textContent = stageName;
        stageList.appendChild(newStage);
        showNotification('New interview stage added');
    }
}

function addEvaluationCriteria() {
    const criteriaName = prompt('Enter new evaluation criteria:');
    if (criteriaName) {
        const criteriaList = document.getElementById('criteria-list');
        const newCriteria = document.createElement('li');
        newCriteria.textContent = criteriaName;
        criteriaList.appendChild(newCriteria);
        showNotification('New evaluation criteria added');
    }
}

function saveEmailTemplate() {
    const templateType = document.getElementById('template-select').value;
    const templateContent = document.getElementById('template-content').value;
    
    // Implement template save logic here
    console.log(`Saving ${templateType} template`);
    showNotification('Email template saved successfully');
}

function showModal(content) {
    modal.querySelector('#modal-body').innerHTML = content;
    modal.style.display = 'block';
    modalOverlay.style.display = 'block';
}

function closeModalWindow() {
    modal.style.display = 'none';
    modalOverlay.style.display = 'none';
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize the application
initializeApp();
