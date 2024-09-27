// Google Apps Script deployment ID
const SCRIPT_ID = 'YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID';

// Global variables
let currentUser = null;
let isAdmin = false;

// Initialize the application
function init() {
    gapi.load('client', initClient);
}

// Initialize the Google API client
function initClient() {
    gapi.client.init({
        apiKey: 'YOUR_API_KEY',
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        clientId: 'YOUR_CLIENT_ID',
        scope: 'https://www.googleapis.com/auth/spreadsheets'
    }).then(() => {
        // Listen for sign-in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
        // Handle the initial sign-in state
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

// Update UI based on sign-in status
function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        document.getElementById('login-modal').style.display = 'none';
        getCurrentUser();
    } else {
        document.getElementById('login-modal').style.display = 'block';
        currentUser = null;
        isAdmin = false;
        updateUI();
    }
}

// Get current user information
function getCurrentUser() {
    gapi.client.script.scripts.run({
        scriptId: SCRIPT_ID,
        resource: {
            function: 'getCurrentUser'
        }
    }).then((response) => {
        if (response.result && response.result.response) {
            currentUser = JSON.parse(response.result.response);
            isAdmin = currentUser.role === 'admin';
            updateUI();
        }
    });
}

// Update UI elements based on user role
function updateUI() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const username = document.querySelector('.username');
    const logoutBtn = document.getElementById('logout-btn');

    if (currentUser) {
        username.textContent = currentUser.name;
        logoutBtn.style.display = 'block';
        navLinks.forEach(link => link.style.display = 'block');
        if (isAdmin) {
            // Show admin-specific navigation items
        } else {
            // Hide admin-specific navigation items
        }
        loadPage('dashboard');
    } else {
        username.textContent = '';
        logoutBtn.style.display = 'none';
        navLinks.forEach(link => link.style.display = 'none');
    }
}

// Load page content
function loadPage(pageName) {
    const contentElement = document.getElementById('content');
    fetch(`pages/${pageName}.html`)
        .then(response => response.text())
        .then(html => {
            contentElement.innerHTML = html;
            executeFunctionByName(`load${capitalizeFirstLetter(pageName)}`, window);
        });
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function to execute a function by name
function executeFunctionByName(functionName, context) {
    const namespaces = functionName.split(".");
    const func = namespaces.pop();
    for (let i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    if (typeof context[func] === "function") {
        context[func].call(context);
    }
}

// Load dashboard content
function loadDashboard() {
    gapi.client.script.scripts.run({
        scriptId: SCRIPT_ID,
        resource: {
            function: 'getDashboardData'
        }
    }).then((response) => {
        if (response.result && response.result.response) {
            const dashboardData = JSON.parse(response.result.response);
            updateDashboardUI(dashboardData);
        }
    });
}

// Update dashboard UI
function updateDashboardUI(data) {
    const dashboardGrid = document.querySelector('.dashboard-grid');
    dashboardGrid.innerHTML = `
        <div class="dashboard-card">
            <h2>Active Projects</h2>
            <p>${data.activeProjects}</p>
        </div>
        <div class="dashboard-card">
            <h2>Upcoming Events</h2>
            <p>${data.upcomingEvents}</p>
        </div>
        <div class="dashboard-card">
            <h2>Total Members</h2>
            <p>${data.totalMembers}</p>
        </div>
        <div class="dashboard-card">
            <h2>Recent Announcements</h2>
            <ul>
                ${data.recentAnnouncements.map(announcement => `<li>${announcement}</li>`).join('')}
            </ul>
        </div>
    `;
}

// Load projects content
function loadProjects() {
    gapi.client.script.scripts.run({
        scriptId: SCRIPT_ID,
        resource: {
            function: 'getProjects'
        }
    }).then((response) => {
        if (response.result && response.result.response) {
            const projects = JSON.parse(response.result.response);
            updateProjectsUI(projects);
        }
    });
}

// Update projects UI
function updateProjectsUI(projects) {
    const projectList = document.querySelector('.project-list');
    projectList.innerHTML = projects.map(project => `
        <div class="project-card">
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <p>Status: ${project.status}</p>
            <div class="progress-bar">
                <div class="progress" style="width: ${project.progress}%;"></div>
            </div>
        </div>
    `).join('');
}

// Load events content
function loadEvents() {
    gapi.client.script.scripts.run({
        scriptId: SCRIPT_ID,
        resource: {
            function: 'getEvents'
        }
    }).then((response) => {
        if (response.result && response.result.response) {
            const events = JSON.parse(response.result.response);
            updateEventsUI(events);
        }
    });
}

// Update events UI
function updateEventsUI(events) {
    const eventList = document.querySelector('.event-list');
    eventList.innerHTML = events.map(event => `
        <div class="event-card">
            <h3>${event.name}</h3>
            <p>Date: ${event.date}</p>
            <p>Location: ${event.location}</p>
            <p>${event.description}</p>
        </div>
    `).join('');
}

// Load resources content
function loadResources() {
    gapi.client.script.scripts.run({
        scriptId: SCRIPT_ID,
        resource: {
            function: 'getResources'
        }
    }).then((response) => {
        if (response.result && response.result.response) {
            const resources = JSON.parse(response.result.response);
            updateResourcesUI(resources);
        }
    });
}

// Update resources UI
function updateResourcesUI(resources) {
    const resourceList = document.querySelector('.resource-list');
    resourceList.innerHTML = resources.map(resource => `
        <div class="resource-card">
            <img src="${resource.icon}" alt="${resource.name} icon">
            <h3>${resource.name}</h3>
            <a href="${resource.link}" target="_blank">View Resource</a>
        </div>
    `).join('');
}

// Load profile content
function loadProfile() {
    gapi.client.script.scripts.run({
        scriptId: SCRIPT_ID,
        resource: {
            function: 'getUserProfile',
            parameters: [currentUser.email]
        }
    }).then((response) => {
        if (response.result && response.result.response) {
            const profile = JSON.parse(response.result.response);
            updateProfileUI(profile);
        }
    });
}

// Update profile UI
function updateProfileUI(profile) {
    const profileContainer = document.querySelector('.profile-container');
    profileContainer.innerHTML = `
        <div class="profile-header">
            <img src="${profile.picture}" alt="Profile picture" class="profile-picture">
            <h2 class="profile-name">${profile.name}</h2>
        </div>
        <div class="profile-info">
            <p>Email: ${profile.email}</p>
            <p>Role: ${profile.role}</p>
            <p>Department: ${profile.department}</p>
            <p>Join Date: ${profile.joinDate}</p>
        </div>
        <div class="profile-actions">
            <button onclick="editProfile()">Edit Profile</button>
        </div>
    `;
}

// Edit profile function
function editProfile() {
    // Implement edit profile functionality
    console.log('Edit profile functionality to be implemented');
}

// Logout function
function logout() {
    gapi.auth2.getAuthInstance().signOut().then(() => {
        currentUser = null;
        isAdmin = false;
        updateUI();
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    init();

    // Navigation event listeners
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            loadPage(page);
        });
    });

    // Logout button event listener
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Login form submit event listener
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
});

// Login function
function login(email, password) {
    gapi.client.script.scripts.run({
        scriptId: SCRIPT_ID,
        resource: {
            function: 'login',
            parameters: [email, password]
        }
    }).then((response) => {
        if (response.result && response.result.response) {
            const result = JSON.parse(response.result.response);
            if (result.success) {
                gapi.auth2.getAuthInstance().signIn().then(() => {
                    getCurrentUser();
                });
            } else {
                alert('Invalid email or password');
            }
        }
    });
}

// Add new project function (for admins)
function addNewProject() {
    if (!isAdmin) return;

    const projectName = prompt('Enter project name:');
    const projectDescription = prompt('Enter project description:');

    if (projectName && projectDescription) {
        gapi.client.script.scripts.run({
            scriptId: SCRIPT_ID,
            resource: {
                function: 'addNewProject',
                parameters: [projectName, projectDescription]
            }
        }).then((response) => {
            if (response.result && response.result.response) {
                const result = JSON.parse(response.result.response);
                if (result.success) {
                    alert('Project added successfully');
                    loadProjects();
                } else {
                    alert('Failed to add project');
                }
            }
        });
    }
}

// Add new event function (for admins)
function addNewEvent() {
    if (!isAdmin) return;

    const eventName = prompt('Enter event name:');
    const eventDate = prompt('Enter event date (YYYY-MM-DD):');
    const eventLocation = prompt('Enter event location:');
    const eventDescription = prompt('Enter event description:');

    if (eventName && eventDate && eventLocation && eventDescription) {
        gapi.client.script.scripts.run({
            scriptId: SCRIPT_ID,
            resource: {
                function: 'addNewEvent',
                parameters: [eventName, eventDate, eventLocation, eventDescription]
            }
        }).then((response) => {
            if (response.result && response.result.response) {
                const result = JSON.parse(response.result.response);
                if (result.success) {
                    alert('Event added successfully');
                    loadEvents();
                } else {
                    alert('Failed to add event');
                }
            }
        });
    }
}

// Add new resource function (for admins)
function addNewResource() {
    if (!isAdmin) return;

    const resourceName = prompt('Enter resource name:');
    const resourceLink = prompt('Enter resource link:');
    const resourceIcon = prompt('Enter resource icon URL:');

    if (resourceName && resourceLink && resourceIcon) {
        gapi.client.script.scripts.run({
            scriptId: SCRIPT_ID,
            resource: {
                function: 'addNewResource',
                parameters: [resourceName, resourceLink, resourceIcon]
            }
        }).then((response) => {
            if (response.result && response.result.response) {
                const result = JSON.parse(response.result.response);
                if (result.success) {
                    alert('Resource added successfully');
                    loadResources();
                } else {
                    alert('Failed to add resource');
                }
            }
        });
    }
}

// Add new announcement function (for admins)
function addNewAnnouncement() {
    if (!isAdmin) return;

    const announcementText = prompt('Enter announcement text:');

    if (announcementText) {
        gapi.client.script.scripts.run({
            scriptId: SCRIPT_ID,
            resource: {
                function: 'addNewAnnouncement',
                parameters: [announcementText]
            }
        }).then((response) => {
            if (response.result && response.result.response) {
                const result = JSON.parse(response.result.response);
                if (result.success) {
                    alert('Announcement added successfully');
                    loadDashboard();
                } else {
                    alert('Failed to add announcement');
                }
            }
        });
    }
}

// Search function
function search() {
    const searchTerm = document.getElementById('search-input').value;
    
    gapi.client.script.scripts.run({
        scriptId: SCRIPT_ID,
        resource: {
            function: 'search',
            parameters: [searchTerm]
        }
    }).then((response) => {
        if (response.result && response.result.response) {
            const searchResults = JSON.parse(response.result.response);
            displaySearchResults(searchResults);
        }
    });
}

// Display search results
function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = '';

    if (results.length === 0) {
        searchResultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    const resultList = document.createElement('ul');
    results.forEach(result => {
        const listItem = document.createElement('li');
        listItem.textContent = `${result.type}: ${result.name}`;
        resultList.appendChild(listItem);
    });

    searchResultsContainer.appendChild(resultList);
}

// Initialize the application
init();
