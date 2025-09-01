    const issueOptions = document.getElementById('issue-options');
const reportForm = document.getElementById('report-form');
const formTitle = document.getElementById('form-title');
const severity = document.getElementById('severity');
const comments = document.getElementById('comments');
const location = document.getElementById('location');
const autofillBtn = document.getElementById('autofill-btn');
const photo = document.getElementById('photo');
const backBtn = document.getElementById('back-btn');

const tracker = document.getElementById('tracker');
const ticketId = document.getElementById('ticket-id');
const submittedTime = document.getElementById('submitted-time');
const progressTime = document.getElementById('progress-time');
const resolvedTime = document.getElementById('resolved-time');
const backHomeBtn = document.getElementById('back-home-btn');

// Step 1: Choose issue type
let selectedIssueType = null;

issueOptions.addEventListener('click', (e) => {
  if (e.target.closest('button')) {
    selectedIssueType = e.target.closest('button').dataset.issue;
    formTitle.textContent =
      selectedIssueType === 'pothole' ? 'Pothole Details'
      : selectedIssueType === 'streetlight' ? 'Streetlight Details'
      : 'Garbage Details';
    issueOptions.classList.add('hidden');
    reportForm.classList.remove('hidden');
  }
})

// Step 2: Auto-fill GPS location
autofillBtn.addEventListener('click', () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        location.value = `Lat: ${pos.coords.latitude.toFixed(5)}, Lon: ${pos.coords.longitude.toFixed(5)}`;
      },
      () => {
        alert('Unable to access location');
      }
    );
  } else {
    alert('Geolocation not supported!');
  }
})

// Step 3: Handle form submit
reportForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Show tracker view; simulate submitted/progress/resolved timestamps
  let now = new Date();
  let inProgress = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 hours
  let resolved = new Date(now.getTime() + 6 * 60 * 60 * 1000);   // +6 hours

  let formatTS = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
                        ', ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });

  ticketId.textContent = 'TICKET-' + Math.floor(Math.random() * 900000 + 100000);
  submittedTime.textContent = formatTS(now);
  progressTime.textContent = formatTS(inProgress);
  resolvedTime.textContent = formatTS(resolved);

  reportForm.classList.add('hidden');
  tracker.classList.remove('hidden');
})

// Step 4: Back navigation
backBtn.addEventListener('click', () => {
  reportForm.classList.add('hidden');
  issueOptions.classList.remove('hidden');
});

backHomeBtn.addEventListener('click', () => {
  tracker.classList.add('hidden');
  issueOptions.classList.remove('hidden');
  reportForm.reset();
  comments.value = '';
  location.value = '';
  photo.value = '';
  severity.value = 'Small';
  selectedIssueType = null;
});
