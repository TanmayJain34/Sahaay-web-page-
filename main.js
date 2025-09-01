 // Simulate simple user login (demo purpose)
const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const issuesList = document.getElementById('issues-list');
const issueDetails = document.getElementById('issue-details');
const filterLocation = document.getElementById('filter-location');
const filterType = document.getElementById('filter-type');
const filterStatus = document.getElementById('filter-status');
const applyFiltersBtn = document.getElementById('apply-filters-btn');
const issuePhoto = document.getElementById('issue-photo');
const issueLocation = document.getElementById('issue-location');
const issueDesc = document.getElementById('issue-desc');
const assignTeam = document.getElementById('assign-team');
const assignBtn = document.getElementById('assign-btn');
const updateStatusSelect = document.getElementById('update-status');
const updateStatusBtn = document.getElementById('update-status-btn');
const markResolvedCheckbox = document.getElementById('mark-resolved');
const resolutionProof = document.getElementById('resolution-proof');
const saveResolutionBtn = document.getElementById('save-resolution-btn');
const backToListBtn = document.getElementById('back-to-list-btn');

let loggedIn = false;
let selectedIssue = null;

const dummyIssues = [
  {
    id: 1,
    type: 'pothole',
    location: 'Downtown',
    status: 'open',
    photo: 'https://via.placeholder.com/400?text=Pothole',
    description: 'Large pothole causing traffic issues.',
    assignedTo: null,
  },
  {
    id: 2,
    type: 'garbage',
    location: 'Green Park',
    status: 'assigned',
    photo: 'https://via.placeholder.com/400?text=Garbage',
    description: 'Overflowing garbage bin near playground.',
    assignedTo: 'sanitation',
  },
  {
    id: 3,
    type: 'streetlight',
    location: 'City Square',
    status: 'resolved',
    photo: 'https://via.placeholder.com/400?text=Streetlight',
    description: 'Broken streetlight on main square.',
    assignedTo: 'lighting',
  },
];

// Login process
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = loginForm.username.value.trim();
  const password = loginForm.password.value.trim();
  
  // Simple validation (demo only)
  if (username === 'admin' && password === 'sahaay123') {
    loggedIn = true;
    loginError.textContent = '';
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    renderIssues(dummyIssues);
  } else {
    loginError.textContent = 'Invalid username or password.';
  }
});

// Logout function
logoutBtn.addEventListener('click', () => {
  loggedIn = false;
  loginSection.classList.remove('hidden');
  dashboardSection.classList.add('hidden');
  selectedIssue = null;
  issueDetails.classList.add('hidden');
  issuesList.classList.remove('hidden');
  loginForm.reset();
});

// Render filtered issues
applyFiltersBtn.addEventListener('click', () => {
  const locationFilter = filterLocation.value.toLowerCase();
  const typeFilter = filterType.value;
  const statusFilter = filterStatus.value;
  
  const filtered = dummyIssues.filter(issue => {
    return (
      (!locationFilter || issue.location.toLowerCase().includes(locationFilter)) &&
      (!typeFilter || issue.type === typeFilter) &&
      (!statusFilter || issue.status === statusFilter)
    );
  });
  
  renderIssues(filtered);
});

// Render issues in the list
function renderIssues(issues) {
  issuesList.innerHTML = '';
  issueDetails.classList.add('hidden');
  issuesList.classList.remove('hidden');
  
  if (!issues.length) {
    issuesList.innerHTML = '<p>No issues found with the selected filters.</p>';
    return;
  }
  
  issues.forEach(issue => {
    const div = document.createElement('div');
    div.className = 'issue-item';
    // FIXED: Added backticks for template literal
    div.textContent = `[${capitalize(issue.status)}] ${capitalize(issue.type)} at ${issue.location}`;
    div.onclick = () => showIssueDetails(issue);
    issuesList.appendChild(div);
  });
}

// Show selected issue details and actions
function showIssueDetails(issue) {
  selectedIssue = issue;
  issuesList.classList.add('hidden');
  issueDetails.classList.remove('hidden');
  
  issuePhoto.src = issue.photo;
  issueLocation.textContent = issue.location;
  issueDesc.textContent = issue.description;
  assignTeam.value = issue.assignedTo || '';
  updateStatusSelect.value = issue.status;
  markResolvedCheckbox.checked = issue.status === 'resolved';
  resolutionProof.value = '';
}

// Assign to team
assignBtn.addEventListener('click', () => {
  if (!selectedIssue) return;
  
  const team = assignTeam.value;
  if (!team) {
    alert('Please select a team to assign.');
    return;
  }
  
  selectedIssue.assignedTo = team;
  selectedIssue.status = 'assigned';
  // FIXED: Added backticks for template literal
  alert(`Issue assigned to ${capitalize(team)} team.`);
  updateStatusSelect.value = 'assigned';
});

// Update status
updateStatusBtn.addEventListener('click', () => {
  if (!selectedIssue) return;
  
  const status = updateStatusSelect.value;
  selectedIssue.status = status;
  
  if (status === 'resolved') {
    markResolvedCheckbox.checked = true;
  } else {
    markResolvedCheckbox.checked = false;
  }
  
  // FIXED: Added backticks for template literal
  alert(`Status updated to ${capitalize(status)}.`);
  renderIssues(dummyIssues);
});

// Save resolution update
saveResolutionBtn.addEventListener('click', () => {
  if (!selectedIssue) return;
  
  if (markResolvedCheckbox.checked) {
    selectedIssue.status = 'resolved';
    alert('Issue marked as resolved.');
    renderIssues(dummyIssues);
  } else {
    alert('Mark the issue as resolved before saving resolution.');
    return;
  }
  
  // Here add file upload handling logic
  resolutionProof.value = '';
});

// Back to issue list
backToListBtn.addEventListener('click', () => {
  selectedIssue = null;
  issueDetails.classList.add('hidden');
  issuesList.classList.remove('hidden');
});

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
   
