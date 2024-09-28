// Global variables
let currentUser = null;
let currentIntervieweeId = null;

// Show the login form on page load
window.onload = function() {
    showLoginForm();
};

function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('interviewerDashboard').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('intervieweeProfile').style.display = 'none';
}

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    google.script.run
        .withSuccessHandler(onLoginSuccess)
        .withFailureHandler(onError)
        .authenticateUser(email, password);
}

function onLoginSuccess(result) {
    if (result.authenticated) {
        currentUser = result;
        if (result.role === 'admin') {
            loadAdminDashboard();
        } else {
            loadInterviewerDashboard();
        }
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

function logout() {
    currentUser = null;
    showLoginForm();
}

function loadInterviewerDashboard() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('interviewerDashboard').style.display = 'block';
    
    google.script.run
        .withSuccessHandler(displayUpcomingInterviews)
        .withFailureHandler(onError)
        .getUpcomingInterviews(currentUser.email);
    
    google.script.run
        .withSuccessHandler(displayAssignedInterviewees)
        .withFailureHandler(onError)
        .getAssignedInterviewees(currentUser.email);
}

function displayUpcomingInterviews(interviews) {
    const container = document.getElementById('upcomingInterviews');
    container.innerHTML = '';

    if (interviews.length === 0) {
        container.innerHTML = '<p>No upcoming interviews scheduled.</p>';
        return;
    }

    const table = createTable(['Interviewee', 'Date', 'Time', 'Action']);
    interviews.forEach(interview => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${interview.intervieweeName}</td>
            <td>${interview.date}</td>
            <td>${interview.time}</td>
            <td><button onclick="viewIntervieweeProfile('${interview.intervieweeId}')">View Profile</button></td>
        `;
    });

    container.appendChild(table);
}

function displayAssignedInterviewees(interviewees) {
    const container = document.getElementById('assignedInterviewees');
    container.innerHTML = '';

    if (interviewees.length === 0) {
        container.innerHTML = '<p>No interviewees assigned.</p>';
        return;
    }

    const table = createTable(['Name', 'Email', 'Status', 'Action']);
    interviewees.forEach(interviewee => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${interviewee.name}</td>
            <td>${interviewee.email}</td>
            <td>${interviewee.status}</td>
            <td><button onclick="viewIntervieweeProfile('${interviewee.id}')">View Profile</button></td>
        `;
    });

    container.appendChild(table);
}

function loadAdminDashboard() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    
    google.script.run
        .withSuccessHandler(displayStatistics)
        .withFailureHandler(onError)
        .getAdminStatistics();
    
    google.script.run
        .withSuccessHandler(displayApplicants)
        .withFailureHandler(onError)
        .getAllApplicants();
    
    google.script.run
        .withSuccessHandler(displayInterviewers)
        .withFailureHandler(onError)
        .getAllInterviewers();
}

function displayStatistics(stats) {
    const container = document.getElementById('statistics');
    container.innerHTML = `
        <p>Total Applicants: ${stats.totalApplicants}</p>
        <p>Interviews Scheduled: ${stats.interviewsScheduled}</p>
        <p>Interviews Completed: ${stats.interviewsCompleted}</p>
        <p>Accepted Candidates: ${stats.acceptedCandidates}</p>
    `;
}

function displayApplicants(applicants) {
    const container = document.getElementById('applicantList');
    container.innerHTML = '';

    if (applicants.length === 0) {
        container.innerHTML = '<p>No applicants found.</p>';
        return;
    }

    const table = createTable(['Name', 'Email', 'Status', 'Action']);
    applicants.forEach(applicant => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${applicant.name}</td>
            <td>${applicant.email}</td>
            <td>${applicant.status}</td>
            <td>
                <button onclick="assignInterviewer('${applicant.id}')">Assign Interviewer</button>
                <button onclick="viewIntervieweeProfile('${applicant.id}')">View Profile</button>
            </td>
        `;
    });

    container.appendChild(table);
}

function displayInterviewers(interviewers) {
    const container = document.getElementById('interviewerList');
    container.innerHTML = '';

    if (interviewers.length === 0) {
        container.innerHTML = '<p>No interviewers found.</p>';
        return;
    }

    const table = createTable(['Name', 'Email', 'Assigned Interviews', 'Action']);
    interviewers.forEach(interviewer => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${interviewer.name}</td>
            <td>${interviewer.email}</td>
            <td>${interviewer.assignedInterviews}</td>
            <td><button onclick="viewInterviewerPerformance('${interviewer.id}')">View Performance</button></td>
        `;
    });

    container.appendChild(table);
}

function viewIntervieweeProfile(intervieweeId) {
    currentIntervieweeId = intervieweeId;
    document.getElementById('interviewerDashboard').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('intervieweeProfile').style.display = 'block';
    
    google.script.run
        .withSuccessHandler(displayIntervieweeProfile)
        .withFailureHandler(onError)
        .getIntervieweeProfile(intervieweeId);
    
    google.script.run
        .withSuccessHandler(displayInterviewQuestions)
        .withFailureHandler(onError)
        .getInterviewQuestions(intervieweeId);
}

function displayIntervieweeProfile(profile) {
    const container = document.getElementById('applicantInfo');
    container.innerHTML = `
        <p><strong>Name:</strong> ${profile.name}</p>
        <p><strong>Email:</strong> ${profile.email}</p>
        <p><strong>Phone:</strong> ${profile.phone}</p>
        <p><strong>University:</strong> ${profile.university}</p>
        <p><strong>Major:</strong> ${profile.major}</p>
        <p><strong>Graduation Year:</strong> ${profile.graduationYear}</p>
    `;
}

function displayInterviewQuestions(questions) {
    const container = document.getElementById('questionSet');
    container.innerHTML = '';

    questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.innerHTML = `
            <p><strong>Q${index + 1}:</strong> ${question}</p>
            <textarea rows="3" placeholder="Enter answer here"></textarea>
        `;
        container.appendChild(questionElement);
    });
}

function saveNotes() {
    const notes = document.getElementById('interviewNotes').value;
    
    google.script.run
        .withSuccessHandler(() => alert('Notes saved successfully'))
        .withFailureHandler(onError)
        .saveInterviewNotes(currentIntervieweeId, notes);
}

function submitRating() {
    const rating = document.getElementById('candidateRating').value;
    
    google.script.run
        .withSuccessHandler(() => alert('Rating submitted successfully'))
        .withFailureHandler(onError)
        .submitCandidateRating(currentIntervieweeId, rating);
}

function assignInterviewer(applicantId) {
    const interviewer = prompt('Enter interviewer email:');
    if (interviewer) {
        google.script.run
            .withSuccessHandler(() => {
                alert('Interviewer assigned successfully');
                loadAdminDashboard();
            })
            .withFailureHandler(onError)
            .assignInterviewer(applicantId, interviewer);
    }
}

function generateReport(reportType) {
    google.script.run
        .withSuccessHandler(displayReport)
        .withFailureHandler(onError)
        .generateReport(reportType);
}

function displayReport(report) {
    alert('Report generated: ' + report);
    // Implement a more sophisticated report display here
}

function goBack() {
    if (currentUser.role === 'admin') {
        loadAdminDashboard();
    } else {
        loadInterviewerDashboard();
    }
}

function createTable(headers) {
    const table = document.createElement('table');
    const headerRow = table.insertRow();
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    return table;
}

function onError(error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
}
