// Application state
let currentUser = null;
let currentIssues = [];
let map = null;
let charts = {};

// DOM elements
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const userRole = document.getElementById('userRole');
const analyticsTab = document.getElementById('analyticsTab');

// Tab elements
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');

// Modal elements
const issueModal = document.getElementById('issueModal');
const modalClose = document.querySelector('.modal-close');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Check if user is already logged in
  const savedUser = localStorage.getItem('sahaayUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showDashboard();
  } else {
    showLogin();
  }

  // Event listeners
  loginForm.addEventListener('submit', handleLogin);
  logoutBtn.addEventListener('click', handleLogout);
  modalClose.addEventListener('click', closeModal);

  // Tab navigation
  navItems.forEach(item => {
    item.addEventListener('click', () => switchTab(item.dataset.tab));
  });

  // Search and filter functionality
  document.getElementById('searchInput').addEventListener('input', filterIssues);
  document.getElementById('statusFilter').addEventListener('change', filterIssues);
  document.getElementById('typeFilter').addEventListener('change', filterIssues);
  document.getElementById('exportBtn').addEventListener('click', exportData);

  // Modal actions
  document.getElementById('updateIssueBtn').addEventListener('click', updateIssue);
  document.getElementById('contactOfficerBtn').addEventListener('click', contactOfficer);

  // Close modal when clicking outside
  issueModal.addEventListener('click', (e) => {
    if (e.target === issueModal) {
      closeModal();
    }
  });
}

function showLogin() {
  loginScreen.classList.remove('hidden');
  dashboard.classList.add('hidden');
}

function showDashboard() {
  loginScreen.classList.add('hidden');
  dashboard.classList.remove('hidden');
  
  // Set user role display
  userRole.textContent = currentUser.role === 'super-admin' ? 'State Super Admin' : 'Municipality Admin';
  
  // Show/hide analytics tab based on role
  if (currentUser.role === 'super-admin') {
    analyticsTab.classList.remove('hidden');
  } else {
    analyticsTab.classList.add('hidden');
  }

  // Load initial data
  loadDashboardData();
}

function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Validate credentials
  if (mockData.users[email] && mockData.users[email].password === password) {
    currentUser = {
      email: email,
      ...mockData.users[email]
    };
    
    // Save to localStorage
    localStorage.setItem('sahaayUser', JSON.stringify(currentUser));
    
    showDashboard();
  } else {
    alert('Invalid credentials. Please try again.');
  }
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem('sahaayUser');
  showLogin();
  
  // Reset form
  loginForm.reset();
}

function loadDashboardData() {
  // Get issues based on user role
  currentIssues = dataHelpers.getIssuesForUser(currentUser.role, currentUser.jurisdiction);
  
  // Update statistics
  updateStats();
  
  // Load tables
  loadRecentIssues();
  loadAllIssues();
  
  // Initialize map if on map tab
  if (document.getElementById('mapTab').classList.contains('active')) {
    initializeMap();
  }
  
  // Load analytics if super admin
  if (currentUser.role === 'super-admin') {
    loadAnalytics();
  }
}

function updateStats() {
  const stats = dataHelpers.getStats(currentIssues);
  
  document.getElementById('pendingCount').textContent = stats.pending;
  document.getElementById('progressCount').textContent = stats['in-progress'];
  document.getElementById('resolvedCount').textContent = stats.resolved;
  document.getElementById('totalCount').textContent = stats.total;
}

function loadRecentIssues() {
  const recentIssues = currentIssues.slice(0, 5);
  const tbody = document.getElementById('recentIssuesTable');
  
  tbody.innerHTML = recentIssues.map(issue => `
    <tr>
      <td>${issue.id}</td>
      <td>${issue.title}</td>
      <td class="capitalize">${issue.type}</td>
      <td>${issue.location}</td>
      <td><span class="status-badge ${issue.status}">${issue.status.replace('-', ' ')}</span></td>
      <td>${formatDate(issue.reportedDate)}</td>
      <td>
        <button class="action-btn" onclick="viewIssue('${issue.id}')">View</button>
      </td>
    </tr>
  `).join('');
}

function loadAllIssues() {
  const tbody = document.getElementById('allIssuesTable');
  
  tbody.innerHTML = currentIssues.map(issue => `
    <tr>
      <td>${issue.id}</td>
      <td>${issue.title}</td>
      <td class="capitalize">${issue.type}</td>
      <td>${issue.location}</td>
      <td><span class="status-badge ${issue.status}">${issue.status.replace('-', ' ')}</span></td>
      <td>${issue.assignedOfficer || 'Unassigned'}</td>
      <td>${formatDate(issue.reportedDate)}</td>
      <td>
        <button class="action-btn" onclick="viewIssue('${issue.id}')">View</button>
        ${issue.status === 'pending' ? `<button class="action-btn assign" onclick="assignIssue('${issue.id}')">Assign</button>` : ''}
      </td>
    </tr>
  `).join('');
}

function switchTab(tabName) {
  // Update navigation
  navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tabName);
  });
  
  // Update tab content
  tabContents.forEach(content => {
    content.classList.toggle('active', content.id === tabName + 'Tab');
  });
  
  // Initialize specific tab content
  if (tabName === 'map') {
    setTimeout(initializeMap, 100);
  } else if (tabName === 'analytics' && currentUser.role === 'super-admin') {
    loadAnalytics();
  }
}

function initializeMap() {
  if (map) {
    map.remove();
  }
  
  // Initialize Leaflet map
  map = L.map('map').setView([23.3441, 85.3096], 8);
  
  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  
  // Add markers for issues
  currentIssues.forEach(issue => {
    const color = getStatusColor(issue.status);
    const marker = L.circleMarker(issue.coordinates, {
      color: color,
      fillColor: color,
      fillOpacity: 0.7,
      radius: 8
    }).addTo(map);
    
    marker.bindPopup(`
      <div class="map-popup">
        <h4>${issue.title}</h4>
        <p><strong>Type:</strong> ${issue.type}</p>
        <p><strong>Status:</strong> ${issue.status}</p>
        <p><strong>Location:</strong> ${issue.location}</p>
        <button onclick="viewIssue('${issue.id}')" class="action-btn">View Details</button>
      </div>
    `);
  });
}

function getStatusColor(status) {
  switch (status) {
    case 'pending': return '#f59e0b';
    case 'in-progress': return '#3b82f6';
    case 'resolved': return '#10b981';
    default: return '#6b7280';
  }
}

function loadAnalytics() {
  if (currentUser.role !== 'super-admin') return;
  
  // Status distribution chart
  createStatusChart();
  
  // Issue type chart
  createTypeChart();
  
  // City performance chart
  createCityChart();
  
  // Monthly trends chart
  createTrendChart();
}

function createStatusChart() {
  const ctx = document.getElementById('statusChart').getContext('2d');
  const stats = dataHelpers.getStats(currentIssues);
  
  if (charts.statusChart) {
    charts.statusChart.destroy();
  }
  
  charts.statusChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Pending', 'In Progress', 'Resolved'],
      datasets: [{
        data: [stats.pending, stats['in-progress'], stats.resolved],
        backgroundColor: ['#f59e0b', '#3b82f6', '#10b981']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function createTypeChart() {
  const ctx = document.getElementById('typeChart').getContext('2d');
  
  const typeStats = {};
  currentIssues.forEach(issue => {
    typeStats[issue.type] = (typeStats[issue.type] || 0) + 1;
  });
  
  if (charts.typeChart) {
    charts.typeChart.destroy();
  }
  
  charts.typeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(typeStats).map(type => type.charAt(0).toUpperCase() + type.slice(1)),
      datasets: [{
        label: 'Number of Issues',
        data: Object.values(typeStats),
        backgroundColor: '#3b82f6'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function createCityChart() {
  const ctx = document.getElementById('cityChart').getContext('2d');
  const performance = dataHelpers.getCityPerformance();
  
  if (charts.cityChart) {
    charts.cityChart.destroy();
  }
  
  charts.cityChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(performance),
      datasets: [{
        label: 'Resolution Rate (%)',
        data: Object.values(performance).map(p => p.resolutionRate),
        backgroundColor: '#10b981'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

function createTrendChart() {
  const ctx = document.getElementById('trendChart').getContext('2d');
  const { months, trends } = dataHelpers.getMonthlyTrends();
  
  if (charts.trendChart) {
    charts.trendChart.destroy();
  }
  
  charts.trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Reported',
        data: trends.reported,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)'
      }, {
        label: 'Resolved',
        data: trends.resolved,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function filterIssues() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const statusFilter = document.getElementById('statusFilter').value;
  const typeFilter = document.getElementById('typeFilter').value;
  
  let filteredIssues = currentIssues;
  
  // Apply search filter
  if (searchTerm) {
    filteredIssues = filteredIssues.filter(issue => 
      issue.title.toLowerCase().includes(searchTerm) ||
      issue.description.toLowerCase().includes(searchTerm) ||
      issue.location.toLowerCase().includes(searchTerm)
    );
  }
  
  // Apply status filter
  if (statusFilter) {
    filteredIssues = filteredIssues.filter(issue => issue.status === statusFilter);
  }
  
  // Apply type filter
  if (typeFilter) {
    filteredIssues = filteredIssues.filter(issue => issue.type === typeFilter);
  }
  
  // Update table with filtered results
  const tbody = document.getElementById('allIssuesTable');
  tbody.innerHTML = filteredIssues.map(issue => `
    <tr>
      <td>${issue.id}</td>
      <td>${issue.title}</td>
      <td class="capitalize">${issue.type}</td>
      <td>${issue.location}</td>
      <td><span class="status-badge ${issue.status}">${issue.status.replace('-', ' ')}</span></td>
      <td>${issue.assignedOfficer || 'Unassigned'}</td>
      <td>${formatDate(issue.reportedDate)}</td>
      <td>
        <button class="action-btn" onclick="viewIssue('${issue.id}')">View</button>
        ${issue.status === 'pending' ? `<button class="action-btn assign" onclick="assignIssue('${issue.id}')">Assign</button>` : ''}
      </td>
    </tr>
  `).join('');
}

function viewIssue(issueId) {
  const issue = currentIssues.find(i => i.id === issueId);
  if (!issue) return;
  
  // Populate modal with issue details
  document.getElementById('issueImage').src = issue.image;
  document.getElementById('issueTitle').textContent = issue.title;
  document.getElementById('issueDescription').textContent = issue.description;
  document.getElementById('issueType').textContent = issue.type;
  document.getElementById('issueLocation').textContent = issue.location;
  document.getElementById('issueStatus').textContent = issue.status.replace('-', ' ');
  document.getElementById('issueStatus').className = `status-badge ${issue.status}`;
  document.getElementById('issueDate').textContent = formatDate(issue.reportedDate);
  document.getElementById('issueAssigned').textContent = issue.assignedOfficer || 'Unassigned';
  
  // Set current values in form
  document.getElementById('statusSelect').value = issue.status;
  
  // Populate officer dropdown
  populateOfficerDropdown(issue.city, issue.type);
  
  // Store current issue ID for updates
  issueModal.dataset.issueId = issueId;
  
  // Show modal
  issueModal.classList.remove('hidden');
}

function populateOfficerDropdown(city, issueType) {
  const select = document.getElementById('assignSelect');
  select.innerHTML = '<option value="">Select Officer</option>';
  
  // Determine department based on issue type
  let department = '';
  switch (issueType) {
    case 'pothole':
      department = 'Roads Dept';
      break;
    case 'garbage':
      department = 'Garbage Dept';
      break;
    case 'streetlight':
      department = 'Streetlight Dept';
      break;
  }
  
  const officers = dataHelpers.getOfficers(city, department);
  officers.forEach(officer => {
    const option = document.createElement('option');
    option.value = officer.name;
    option.textContent = `${officer.name} (${officer.email})`;
    option.dataset.email = officer.email;
    option.dataset.phone = officer.phone;
    select.appendChild(option);
  });
}

function assignIssue(issueId) {
  viewIssue(issueId);
}

function updateIssue() {
  const issueId = issueModal.dataset.issueId;
  const newStatus = document.getElementById('statusSelect').value;
  const assignedOfficer = document.getElementById('assignSelect').value;
  
  const updates = {
    status: newStatus
  };
  
  if (assignedOfficer) {
    updates.assignedOfficer = assignedOfficer;
    updates.assignedTo = getDepartmentForOfficer(assignedOfficer);
  }
  
  // Update the issue
  if (dataHelpers.updateIssue(issueId, updates)) {
    // Refresh data
    loadDashboardData();
    closeModal();
    alert('Issue updated successfully!');
  } else {
    alert('Failed to update issue.');
  }
}

function getDepartmentForOfficer(officerName) {
  // This is a simplified lookup - in a real app, you'd have a proper mapping
  const issue = currentIssues.find(i => i.id === issueModal.dataset.issueId);
  if (!issue) return '';
  
  switch (issue.type) {
    case 'pothole': return 'Roads Dept';
    case 'garbage': return 'Garbage Dept';
    case 'streetlight': return 'Streetlight Dept';
    default: return '';
  }
}

function contactOfficer() {
  const assignSelect = document.getElementById('assignSelect');
  const selectedOption = assignSelect.options[assignSelect.selectedIndex];
  
  if (selectedOption && selectedOption.dataset.email) {
    const email = selectedOption.dataset.email;
    const phone = selectedOption.dataset.phone;
    const issueId = issueModal.dataset.issueId;
    const issue = currentIssues.find(i => i.id === issueId);
    
    const subject = `Issue Assignment: ${issue.title}`;
    const body = `Dear Officer,\n\nYou have been assigned to handle the following issue:\n\nIssue ID: ${issue.id}\nTitle: ${issue.title}\nLocation: ${issue.location}\nDescription: ${issue.description}\n\nPlease take necessary action.\n\nRegards,\nSahaay Admin Portal`;
    
    // Create mailto link
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
    
    // Also show contact info
    alert(`Officer Contact Information:\nEmail: ${email}\nPhone: ${phone}`);
  } else {
    alert('Please select an officer first.');
  }
}

function closeModal() {
  issueModal.classList.add('hidden');
}

function exportData() {
  // Create CSV content
  const headers = ['ID', 'Title', 'Type', 'Location', 'Status', 'Assigned To', 'Date'];
  const csvContent = [
    headers.join(','),
    ...currentIssues.map(issue => [
      issue.id,
      `"${issue.title}"`,
      issue.type,
      `"${issue.location}"`,
      issue.status,
      issue.assignedOfficer || 'Unassigned',
      issue.reportedDate
    ].join(','))
  ].join('\n');
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sahaay-issues-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Utility function to capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
