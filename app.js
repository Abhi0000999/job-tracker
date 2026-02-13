// ===================================
// KODNEST PREMIUM BUILD SYSTEM
// Job Notification Tracker - Complete System
// ===================================

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRouteChange());
    window.addEventListener('load', () => this.handleRouteChange());
  }

  register(path, handler) {
    this.routes[path] = handler;
  }

  handleRouteChange() {
    const hash = window.location.hash.slice(1) || '/';
    const route = hash.split('?')[0];
    this.currentRoute = route;
    const handler = this.routes[route] || this.routes['/dashboard'];

    if (handler) {
      handler();
    }

    this.updateNavigation();
  }

  navigate(path) {
    window.location.hash = path;
  }

  updateNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href').slice(1);
      if (href === this.currentRoute) {
        link.classList.add('nav-link--active');
      } else {
        link.classList.remove('nav-link--active');
      }
    });
  }
}

// ===================================
// LOCAL STORAGE UTILITIES
// ===================================

// Saved Jobs
function getSavedJobs() {
  const saved = localStorage.getItem('savedJobs');
  return saved ? JSON.parse(saved) : [];
}

function saveJob(jobId) {
  const savedJobs = getSavedJobs();
  if (!savedJobs.includes(jobId)) {
    savedJobs.push(jobId);
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }
}

function unsaveJob(jobId) {
  const savedJobs = getSavedJobs();
  const filtered = savedJobs.filter(id => id !== jobId);
  localStorage.setItem('savedJobs', JSON.stringify(filtered));
}

function isJobSaved(jobId) {
  return getSavedJobs().includes(jobId);
}

// Preferences
function getPreferences() {
  const prefs = localStorage.getItem('jobTrackerPreferences');
  return prefs ? JSON.parse(prefs) : null;
}

function savePreferences(preferences) {
  localStorage.setItem('jobTrackerPreferences', JSON.stringify(preferences));
}

// Digest
function getTodayDigest() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const key = `jobTrackerDigest_${today}`;
  const digest = localStorage.getItem(key);
  return digest ? JSON.parse(digest) : null;
}

function saveDigest(jobs) {
  const today = new Date().toISOString().split('T')[0];
  const key = `jobTrackerDigest_${today}`;
  localStorage.setItem(key, JSON.stringify(jobs));
}

// Job Status
function getJobStatus(jobId) {
  const statuses = localStorage.getItem('jobTrackerStatus');
  const statusMap = statuses ? JSON.parse(statuses) : {};
  return statusMap[jobId] || 'Not Applied';
}

function setJobStatus(jobId, status) {
  const statuses = localStorage.getItem('jobTrackerStatus');
  const statusMap = statuses ? JSON.parse(statuses) : {};
  statusMap[jobId] = status;
  localStorage.setItem('jobTrackerStatus', JSON.stringify(statusMap));

  // Track status change for recent updates
  if (status !== 'Not Applied') {
    addStatusUpdate(jobId, status);
  }

  // Show toast notification
  showToast(`Status updated: ${status}`);
}

function getStatusUpdates() {
  const updates = localStorage.getItem('jobTrackerStatusUpdates');
  return updates ? JSON.parse(updates) : [];
}

function addStatusUpdate(jobId, status) {
  const updates = getStatusUpdates();
  const job = jobsData.find(j => j.id === jobId);
  if (!job) return;

  const update = {
    jobId,
    title: job.title,
    company: job.company,
    status,
    date: new Date().toISOString()
  };

  // Add to beginning, keep last 20
  updates.unshift(update);
  const trimmed = updates.slice(0, 20);
  localStorage.setItem('jobTrackerStatusUpdates', JSON.stringify(trimmed));
}

// ===================================
// TOAST NOTIFICATIONS
// ===================================

function showToast(message) {
  // Remove existing toast if any
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  // Show animation
  setTimeout(() => {
    toast.classList.add('toast--show');
  }, 10);

  // Hide and remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('toast--show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// ===================================
// TEST CHECKLIST
// ===================================

function getTestChecklist() {
  const checklist = localStorage.getItem('jobTrackerTestChecklist');
  if (checklist) {
    return JSON.parse(checklist);
  }

  // Initialize with 10 test items
  const defaultChecklist = {
    test1: false, // Preferences persist
    test2: false, // Match score calculates
    test3: false, // Show only matches toggle
    test4: false, // Save job persists
    test5: false, // Apply opens new tab
    test6: false, // Status persist
    test7: false, // Status filter works
    test8: false, // Digest generates top 10
    test9: false, // Digest persists
    test10: false // No console errors
  };

  localStorage.setItem('jobTrackerTestChecklist', JSON.stringify(defaultChecklist));
  return defaultChecklist;
}

function setTestItem(testKey, checked) {
  const checklist = getTestChecklist();
  checklist[testKey] = checked;
  localStorage.setItem('jobTrackerTestChecklist', JSON.stringify(checklist));
}

function resetTestChecklist() {
  localStorage.removeItem('jobTrackerTestChecklist');
  // Re-render test page if currently on it
  if (router && router.currentRoute === '/jt/07-test') {
    routes['/jt/07-test']();
  }
}

function getTestsPassed() {
  const checklist = getTestChecklist();
  const total = Object.keys(checklist).length;
  const passed = Object.values(checklist).filter(v => v === true).length;
  return { passed, total };
}

function allTestsPassed() {
  const { passed, total } = getTestsPassed();
  return passed === total;
}

// ===================================
// PROOF & SUBMISSION
// ===================================

function getProofArtifacts() {
  const artifacts = localStorage.getItem('jobTrackerProofArtifacts');
  if (artifacts) {
    return JSON.parse(artifacts);
  }

  const defaultArtifacts = {
    lovableLink: '',
    githubLink: '',
    deployedLink: ''
  };

  localStorage.setItem('jobTrackerProofArtifacts', JSON.stringify(defaultArtifacts));
  return defaultArtifacts;
}

function setProofArtifact(key, value) {
  const artifacts = getProofArtifacts();
  artifacts[key] = value;
  localStorage.setItem('jobTrackerProofArtifacts', JSON.stringify(artifacts));
}

function isValidUrl(url) {
  if (!url || url.trim() === '') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function allArtifactsProvided() {
  const artifacts = getProofArtifacts();
  return isValidUrl(artifacts.lovableLink) &&
    isValidUrl(artifacts.githubLink) &&
    isValidUrl(artifacts.deployedLink);
}

function getProjectStatus() {
  const artifacts = getProofArtifacts();
  const testsComplete = allTestsPassed();
  const artifactsComplete = allArtifactsProvided();

  if (testsComplete && artifactsComplete) {
    return 'Shipped';
  } else if (artifacts.lovableLink || artifacts.githubLink || artifacts.deployedLink || getTestsPassed().passed > 0) {
    return 'In Progress';
  } else {
    return 'Not Started';
  }
}

function getStepCompletionStatus() {
  const preferences = getPreferences();
  const digest = getTodayDigest();
  const artifacts = getProofArtifacts();
  const { passed } = getTestsPassed();

  return [
    { step: 'Initialize Project', completed: true },
    { step: 'Add Job Data', completed: true },
    { step: 'Implement Preferences & Match Scoring', completed: preferences !== null },
    { step: 'Build Daily Digest Engine', completed: digest !== null },
    { step: 'Add Job Status Tracking', completed: passed >= 6 },
    { step: 'Complete Test Checklist', completed: allTestsPassed() },
    { step: 'Collect Proof Artifacts', completed: allArtifactsProvided() },
    { step: 'Ship Project', completed: allTestsPassed() && allArtifactsProvided() }
  ];
}

function copyFinalSubmission() {
  const artifacts = getProofArtifacts();
  const text = `Job Notification Tracker — Final Submission

Lovable Project:
${artifacts.lovableLink || '[Not provided]'}

GitHub Repository:
${artifacts.githubLink || '[Not provided]'}

Live Deployment:
${artifacts.deployedLink || '[Not provided]'}

Core Features:
- Intelligent match scoring
- Daily digest simulation
- Status tracking
- Test checklist enforced`;

  navigator.clipboard.writeText(text).then(() => {
    showToast('Final submission copied to clipboard!');
  }).catch(() => {
    showToast('Failed to copy. Please try again.');
  });
}

// ===================================
// MATCH SCORE ENGINE
// ===================================

function calculateMatchScore(job, preferences) {
  if (!preferences) return 0;

  let score = 0;

  // +25 if role keyword in title
  if (preferences.roleKeywords && preferences.roleKeywords.trim()) {
    const keywords = preferences.roleKeywords.toLowerCase().split(',').map(k => k.trim()).filter(k => k);
    if (keywords.some(kw => job.title.toLowerCase().includes(kw))) {
      score += 25;
    }
  }

  // +15 if role keyword in description
  if (preferences.roleKeywords && preferences.roleKeywords.trim()) {
    const keywords = preferences.roleKeywords.toLowerCase().split(',').map(k => k.trim()).filter(k => k);
    if (keywords.some(kw => job.description.toLowerCase().includes(kw))) {
      score += 15;
    }
  }

  // +15 if location match
  if (preferences.locations && preferences.locations.length > 0) {
    if (preferences.locations.includes(job.location)) {
      score += 15;
    }
  }

  // +10 if mode match
  if (preferences.modes && preferences.modes.length > 0) {
    if (preferences.modes.includes(job.mode)) {
      score += 10;
    }
  }

  // +10 if experience match
  if (preferences.experience && preferences.experience === job.experience) {
    score += 10;
  }

  // +15 if skills overlap
  if (preferences.skills && preferences.skills.trim()) {
    const userSkills = preferences.skills.toLowerCase().split(',').map(s => s.trim()).filter(s => s);
    const jobSkills = job.skills.map(s => s.toLowerCase());
    const hasOverlap = userSkills.some(us => jobSkills.some(js => js.includes(us) || us.includes(js)));
    if (hasOverlap) {
      score += 15;
    }
  }

  // +5 if posted ≤2 days
  if (job.postedDaysAgo <= 2) {
    score += 5;
  }

  // +5 if LinkedIn
  if (job.source === 'LinkedIn') {
    score += 5;
  }

  return Math.min(score, 100);
}

// ===================================
// JOB RENDERING & FILTERING
// ===================================

let currentFilters = {
  keyword: '',
  location: '',
  mode: '',
  experience: '',
  source: '',
  status: '',
  sort: 'latest',
  showOnlyMatches: false
};

function formatPostedDaysAgo(days) {
  if (days === 0) return 'Posted today';
  if (days === 1) return 'Posted yesterday';
  return `Posted ${days} days ago`;
}

function getMatchBadgeClass(score) {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  if (score >= 40) return 'neutral';
  return 'muted';
}

function renderJobCard(job, showMatchScore = true) {
  const saved = isJobSaved(job.id);
  const saveIcon = saved ? '★' : '☆';
  const saveText = saved ? 'Saved' : 'Save';

  const preferences = getPreferences();
  const matchScore = calculateMatchScore(job, preferences);
  const matchBadgeClass = getMatchBadgeClass(matchScore);

  const matchBadge = showMatchScore && preferences ? `
    <span class="match-badge match-badge--${matchBadgeClass}">${matchScore}% Match</span>
  ` : '';

  const currentStatus = getJobStatus(job.id);
  const statusClass = currentStatus === 'Applied' ? 'info' :
    currentStatus === 'Rejected' ? 'danger' :
      currentStatus === 'Selected' ? 'success' : 'neutral';

  return `
    <div class="job-card">
      <div class="job-card__header">
        <div>
          <h3 class="job-card__title">${job.title}</h3>
          <div class="job-card__company">${job.company}</div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-end;">
          <span class="badge badge--${job.source === 'LinkedIn' ? 'accent' : job.source === 'Naukri' ? 'success' : 'warning'}">${job.source}</span>
          ${matchBadge}
        </div>
      </div>
      
      <div class="job-card__meta">
        <span class="job-card__meta-item">📍 ${job.location} • ${job.mode}</span>
        <span class="job-card__meta-item">💼 ${job.experience}</span>
        <span class="job-card__meta-item">💰 ${job.salaryRange}</span>
      </div>
      
      <div class="job-card__status">
        <label class="status-label">Status:</label>
        <select class="status-select status-select--${statusClass}" onchange="updateJobStatus(${job.id}, this.value)">
          <option value="Not Applied" ${currentStatus === 'Not Applied' ? 'selected' : ''}>Not Applied</option>
          <option value="Applied" ${currentStatus === 'Applied' ? 'selected' : ''}>Applied</option>
          <option value="Rejected" ${currentStatus === 'Rejected' ? 'selected' : ''}>Rejected</option>
          <option value="Selected" ${currentStatus === 'Selected' ? 'selected' : ''}>Selected</option>
        </select>
        <span class="status-badge status-badge--${statusClass}">${currentStatus}</span>
      </div>
      
      <div class="job-card__footer">
        <span class="job-card__posted">${formatPostedDaysAgo(job.postedDaysAgo)}</span>
        <div class="job-card__actions">
          <button class="btn btn--secondary btn--small" onclick="viewJob(${job.id})">View</button>
          <button class="btn btn--secondary btn--small job-save-btn" onclick="toggleSaveJob(${job.id})">
            <span class="save-icon">${saveIcon}</span> ${saveText}
          </button>
          <a href="${job.applyUrl}" target="_blank" class="btn btn--primary btn--small">Apply</a>
        </div>
      </div>
    </div>
  `;
}

function updateJobStatus(jobId, status) {
  setJobStatus(jobId, status);

  // Re-render current page to update UI
  const currentRoute = router.currentRoute;
  if (currentRoute === '/dashboard') {
    renderDashboard();
  } else if (currentRoute === '/saved') {
    renderSavedPage();
  }
}

function extractSalaryNumber(salaryRange) {
  // Extract first number from salary string for sorting
  const match = salaryRange.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

function filterAndSortJobs(jobs) {
  let filtered = [...jobs];
  const preferences = getPreferences();

  // Calculate match scores for all jobs
  const jobsWithScores = filtered.map(job => ({
    ...job,
    matchScore: calculateMatchScore(job, preferences)
  }));

  // Show only matches filter
  if (currentFilters.showOnlyMatches && preferences) {
    const threshold = preferences.minMatchScore || 40;
    filtered = jobsWithScores.filter(job => job.matchScore >= threshold);
  } else {
    filtered = jobsWithScores;
  }

  // Keyword filter
  if (currentFilters.keyword) {
    const keyword = currentFilters.keyword.toLowerCase();
    filtered = filtered.filter(job =>
      job.title.toLowerCase().includes(keyword) ||
      job.company.toLowerCase().includes(keyword) ||
      job.skills.some(skill => skill.toLowerCase().includes(keyword))
    );
  }

  // Location filter
  if (currentFilters.location) {
    filtered = filtered.filter(job => job.location === currentFilters.location);
  }

  // Mode filter
  if (currentFilters.mode) {
    filtered = filtered.filter(job => job.mode === currentFilters.mode);
  }

  // Experience filter
  if (currentFilters.experience) {
    filtered = filtered.filter(job => job.experience === currentFilters.experience);
  }

  // Source filter
  if (currentFilters.source) {
    filtered = filtered.filter(job => job.source === currentFilters.source);
  }

  // Status filter
  if (currentFilters.status) {
    filtered = filtered.filter(job => getJobStatus(job.id) === currentFilters.status);
  }

  // Sort
  if (currentFilters.sort === 'latest') {
    filtered.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
  } else if (currentFilters.sort === 'oldest') {
    filtered.sort((a, b) => b.postedDaysAgo - a.postedDaysAgo);
  } else if (currentFilters.sort === 'matchScore') {
    filtered.sort((a, b) => b.matchScore - a.matchScore);
  } else if (currentFilters.sort === 'salary') {
    filtered.sort((a, b) => extractSalaryNumber(b.salaryRange) - extractSalaryNumber(a.salaryRange));
  }

  return filtered;
}

function renderFilterBar() {
  const locations = [...new Set(jobsData.map(j => j.location))].sort();
  const modes = ['Remote', 'Hybrid', 'Onsite'];
  const experiences = ['Fresher', '0-1', '1-3', '3-5'];
  const sources = ['LinkedIn', 'Naukri', 'Indeed'];
  const preferences = getPreferences();

  const matchToggle = preferences ? `
    <div class="match-toggle">
      <label class="checkbox-option">
        <input 
          type="checkbox" 
          id="showOnlyMatches" 
          ${currentFilters.showOnlyMatches ? 'checked' : ''}
          onchange="toggleMatchFilter(this.checked)"
        >
        <span>Show only jobs above my threshold (${preferences.minMatchScore || 40}%)</span>
      </label>
    </div>
  ` : '';

  return `
    ${matchToggle}
    <div class="filter-bar">
      <div class="filter-bar__row">
        <input 
          type="text" 
          class="input filter-input" 
          placeholder="Search by job title, company, or skills..."
          value="${currentFilters.keyword}"
          oninput="updateFilter('keyword', this.value)"
        >
      </div>
      
      <div class="filter-bar__row">
        <select class="input filter-select" onchange="updateFilter('location', this.value)">
          <option value="">All Locations</option>
          ${locations.map(loc => `
            <option value="${loc}" ${currentFilters.location === loc ? 'selected' : ''}>${loc}</option>
          `).join('')}
        </select>
        
        <select class="input filter-select" onchange="updateFilter('mode', this.value)">
          <option value="">All Modes</option>
          ${modes.map(mode => `
            <option value="${mode}" ${currentFilters.mode === mode ? 'selected' : ''}>${mode}</option>
          `).join('')}
        </select>
        
        <select class="input filter-select" onchange="updateFilter('experience', this.value)">
          <option value="">All Experience</option>
          ${experiences.map(exp => `
            <option value="${exp}" ${currentFilters.experience === exp ? 'selected' : ''}>${exp}</option>
          `).join('')}
        </select>
        
        <select class="input filter-select" onchange="updateFilter('source', this.value)">
          <option value="">All Sources</option>
          ${sources.map(src => `
            <option value="${src}" ${currentFilters.source === src ? 'selected' : ''}>${src}</option>
          `).join('')}
        </select>
        
        <select class="input filter-select" onchange="updateFilter('status', this.value)">
          <option value="">All Statuses</option>
          <option value="Not Applied" ${currentFilters.status === 'Not Applied' ? 'selected' : ''}>Not Applied</option>
          <option value="Applied" ${currentFilters.status === 'Applied' ? 'selected' : ''}>Applied</option>
          <option value="Rejected" ${currentFilters.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
          <option value="Selected" ${currentFilters.status === 'Selected' ? 'selected' : ''}>Selected</option>
        </select>
        
        <select class="input filter-select" onchange="updateFilter('sort', this.value)">
          <option value="latest" ${currentFilters.sort === 'latest' ? 'selected' : ''}>Latest First</option>
          <option value="oldest" ${currentFilters.sort === 'oldest' ? 'selected' : ''}>Oldest First</option>
          ${preferences ? `<option value="matchScore" ${currentFilters.sort === 'matchScore' ? 'selected' : ''}>Match Score</option>` : ''}
          <option value="salary" ${currentFilters.sort === 'salary' ? 'selected' : ''}>Salary</option>
        </select>
      </div>
    </div>
  `;
}

function updateFilter(filterKey, value) {
  currentFilters[filterKey] = value;
  renderDashboard();
}

function toggleMatchFilter(checked) {
  currentFilters.showOnlyMatches = checked;
  renderDashboard();
}

function renderDashboard() {
  const filtered = filterAndSortJobs(jobsData);
  const appContainer = document.getElementById('app-container');
  const preferences = getPreferences();

  const noPrefsBanner = !preferences ? `
    <div class="info-banner">
      <strong>Set your preferences to activate intelligent matching.</strong>
      <a href="#/settings" class="btn btn--secondary btn--small" style="margin-left: 16px;">Configure Now</a>
    </div>
  ` : '';

  appContainer.innerHTML = `
    <div class="context-header">
      <h1 class="context-header__title">Dashboard</h1>
      <p class="context-header__subtitle">${filtered.length} job${filtered.length !== 1 ? 's' : ''} found</p>
    </div>
    
    <div class="workspace">
      <div class="primary-workspace">
        ${noPrefsBanner}
        ${renderFilterBar()}
        
        <div class="job-grid">
          ${filtered.length > 0
      ? filtered.map(job => renderJobCard(job)).join('')
      : `
              <div class="empty-state">
                <h3 class="empty-state__title">No jobs match your criteria</h3>
                <p class="empty-state__message">Try adjusting your search filters${currentFilters.showOnlyMatches ? ' or lowering your match threshold' : ''}.</p>
                <button class="btn btn--secondary" onclick="clearFilters()">Clear Filters</button>
              </div>
            `
    }
        </div>
      </div>
    </div>
  `;
}

function clearFilters() {
  currentFilters = {
    keyword: '',
    location: '',
    mode: '',
    experience: '',
    source: '',
    sort: 'latest',
    showOnlyMatches: false
  };
  renderDashboard();
}

// ===================================
// JOB DETAIL MODAL
// ===================================

function viewJob(jobId) {
  const job = jobsData.find(j => j.id === jobId);
  if (!job) return;

  const modalHTML = `
    <div class="modal-overlay" onclick="closeModal()">
      <div class="modal" onclick="event.stopPropagation()">
        <div class="modal__header">
          <div>
            <h2 class="modal__title">${job.title}</h2>
            <div class="modal__company">${job.company}</div>
          </div>
          <button class="modal__close" onclick="closeModal()">×</button>
        </div>
        
        <div class="modal__body">
          <div class="modal__meta">
            <div class="modal__meta-item">
              <strong>Location:</strong> ${job.location} (${job.mode})
            </div>
            <div class="modal__meta-item">
              <strong>Experience:</strong> ${job.experience}
            </div>
            <div class="modal__meta-item">
              <strong>Salary:</strong> ${job.salaryRange}
            </div>
            <div class="modal__meta-item">
              <strong>Source:</strong> ${job.source}
            </div>
            <div class="modal__meta-item">
              <strong>Posted:</strong> ${formatPostedDaysAgo(job.postedDaysAgo)}
            </div>
          </div>
          
          <div class="divider"></div>
          
          <div class="modal__section">
            <h3 class="modal__section-title">Description</h3>
            <p class="modal__description">${job.description}</p>
          </div>
          
          <div class="modal__section">
            <h3 class="modal__section-title">Required Skills</h3>
            <div class="skill-tags">
              ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
          </div>
        </div>
        
        <div class="modal__footer">
          <button class="btn btn--secondary" onclick="toggleSaveJob(${job.id}); closeModal();">
            ${isJobSaved(job.id) ? '★ Saved' : '☆ Save Job'}
          </button>
          <a href="${job.applyUrl}" target="_blank" class="btn btn--primary">Apply Now</a>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeModal() {
  const modal = document.querySelector('.modal-overlay');
  if (modal) {
    modal.remove();
  }
}

// ===================================
// SAVE/UNSAVE FUNCTIONALITY
// ===================================

function toggleSaveJob(jobId) {
  if (isJobSaved(jobId)) {
    unsaveJob(jobId);
  } else {
    saveJob(jobId);
  }

  const currentRoute = router.currentRoute;
  if (currentRoute === '/dashboard') {
    renderDashboard();
  } else if (currentRoute === '/saved') {
    renderSavedPage();
  }
}

// ===================================
// PREFERENCES FUNCTIONS
// ===================================

function savePreferencesFromForm() {
  const roleKeywords = document.getElementById('roleKeywords').value;

  // Get selected locations
  const locationSelect = document.getElementById('preferredLocations');
  const locations = Array.from(locationSelect.selectedOptions).map(opt => opt.value);

  // Get checked modes
  const modes = [];
  if (document.getElementById('modeRemote').checked) modes.push('Remote');
  if (document.getElementById('modeHybrid').checked) modes.push('Hybrid');
  if (document.getElementById('modeOnsite').checked) modes.push('Onsite');

  const experience = document.getElementById('experienceLevel').value;
  const skills = document.getElementById('skills').value;
  const minMatchScore = parseInt(document.getElementById('minMatchScore').value);

  const preferences = {
    roleKeywords,
    locations,
    modes,
    experience,
    skills,
    minMatchScore
  };

  savePreferences(preferences);

  // Show success feedback
  const saveBtn = document.querySelector('#savePrefsBtn');
  const originalText = saveBtn.textContent;
  saveBtn.textContent = '✓ Saved!';
  saveBtn.classList.add('btn--success');
  setTimeout(() => {
    saveBtn.textContent = originalText;
    saveBtn.classList.remove('btn--success');
  }, 2000);
}

// ===================================
// DIGEST FUNCTIONS
// ===================================

function generateDigest() {
  const preferences = getPreferences();
  if (!preferences) {
    alert('Please set your preferences first.');
    return;
  }

  // Calculate match scores
  const jobsWithScores = jobsData.map(job => ({
    ...job,
    matchScore: calculateMatchScore(job, preferences)
  }));

  // Sort by match score desc, then posted days asc
  jobsWithScores.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return a.postedDaysAgo - b.postedDaysAgo;
  });

  // Take top 10
  const top10 = jobsWithScores.slice(0, 10);

  // Save to localStorage
  saveDigest(top10);

  // Re-render digest page
  routes['/digest']();
}

function copyDigestToClipboard() {
  const digest = getTodayDigest();
  if (!digest) return;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let text = `TOP 10 JOBS FOR YOU — 9AM DIGEST\n${today}\n\n`;

  digest.forEach((job, index) => {
    text += `${index + 1}. ${job.title} at ${job.company}\n`;
    text += `   Location: ${job.location} (${job.mode})\n`;
    text += `   Experience: ${job.experience}\n`;
    text += `   Salary: ${job.salaryRange}\n`;
    text += `   Match Score: ${job.matchScore}%\n`;
    text += `   Apply: ${job.applyUrl}\n\n`;
  });

  text += 'This digest was generated based on your preferences.';

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('#copyDigestBtn');
    const originalText = btn.textContent;
    btn.textContent = '✓ Copied!';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  });
}

function createEmailDraft() {
  const digest = getTodayDigest();
  if (!digest) return;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let body = `TOP 10 JOBS FOR YOU — 9AM DIGEST%0A${today}%0A%0A`;

  digest.forEach((job, index) => {
    body += `${index + 1}. ${job.title} at ${job.company}%0A`;
    body += `   Location: ${job.location} (${job.mode})%0A`;
    body += `   Experience: ${job.experience}%0A`;
    body += `   Salary: ${job.salaryRange}%0A`;
    body += `   Match Score: ${job.matchScore}%%%0A`;
    body += `   Apply: ${job.applyUrl}%0A%0A`;
  });

  body += 'This digest was generated based on your preferences.';

  const subject = 'My 9AM Job Digest';
  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;

  window.location.href = mailtoLink;
}

// ===================================
// ROUTE HANDLERS
// ===================================

const routes = {
  '/': () => {
    const appContainer = document.getElementById('app-container');

    appContainer.innerHTML = `
      <div class="landing-page">
        <div class="landing-hero">
          <h1 class="landing-hero__title">Stop Missing The Right Jobs.</h1>
          <p class="landing-hero__subtitle">Precision-matched job discovery delivered daily at 9AM.</p>
          <a href="#/settings" class="btn btn--primary btn--large">Start Tracking</a>
        </div>
      </div>
    `;
  },

  '/dashboard': renderDashboard,

  '/saved': renderSavedPage,

  '/digest': () => {
    const appContainer = document.getElementById('app-container');
    const preferences = getPreferences();
    const digest = getTodayDigest();
    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (!preferences) {
      appContainer.innerHTML = `
        <div class="context-header">
          <h1 class="context-header__title">Digest</h1>
          <p class="context-header__subtitle">Your daily job digest at 9AM</p>
        </div>
        
        <div class="workspace">
          <div class="primary-workspace">
            <div class="empty-state">
              <h3 class="empty-state__title">Preferences Required</h3>
              <p class="empty-state__message">Set your preferences to generate a personalized digest.</p>
              <a href="#/settings" class="btn btn--primary">Configure Preferences</a>
            </div>
          </div>
        </div>
      `;
      return;
    }

    if (!digest) {
      appContainer.innerHTML = `
        <div class="context-header">
          <h1 class="context-header__title">Digest</h1>
          <p class="context-header__subtitle">Your daily job digest at 9AM</p>
        </div>
        
        <div class="workspace">
          <div class="primary-workspace">
            <div class="card card--large" style="text-align: center;">
              <h3 class="mb-md">Generate Today's Digest</h3>
              <p class="text-muted mb-md">Click below to generate your personalized 9AM digest with the top 10 matched jobs.</p>
              <button class="btn btn--primary" onclick="generateDigest()">Generate Today's 9AM Digest (Simulated)</button>
              <p class="text-tiny text-muted" style="margin-top: 16px;">Demo Mode: Daily 9AM trigger simulated manually.</p>
            </div>
          </div>
        </div>
      `;
      return;
    }

    // Render digest
    appContainer.innerHTML = `
      <div class="context-header">
        <h1 class="context-header__title">Top 10 Jobs For You — 9AM Digest</h1>
        <p class="context-header__subtitle">${today}</p>
      </div>
      
      <div class="workspace">
        <div class="primary-workspace">
          <div class="digest-actions mb-md">
            <button class="btn btn--secondary" id="copyDigestBtn" onclick="copyDigestToClipboard()">📋 Copy Digest to Clipboard</button>
            <button class="btn btn--secondary" onclick="createEmailDraft()">✉️ Create Email Draft</button>
            <button class="btn btn--secondary" onclick="generateDigest()">🔄 Regenerate Digest</button>
          </div>
          
          <div class="digest-card">
            <div class="digest-jobs">
              ${digest.map((job, index) => `
                <div class="digest-job">
                  <div class="digest-job__number">${index + 1}</div>
                  <div class="digest-job__content">
                    <h3 class="digest-job__title">${job.title}</h3>
                    <div class="digest-job__company">${job.company}</div>
                    <div class="digest-job__meta">
                      <span>📍 ${job.location}</span>
                      <span>💼 ${job.experience}</span>
                      <span class="match-badge match-badge--${getMatchBadgeClass(job.matchScore)}">${job.matchScore}% Match</span>
                    </div>
                  </div>
                  <div class="digest-job__action">
                    <a href="${job.applyUrl}" target="_blank" class="btn btn--primary btn--small">Apply</a>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <div class="digest-footer">
              This digest was generated based on your preferences.
            </div>
          </div>
          
          <div class="card card--large" style="margin-top: var(--space-lg);">
            <h3 class="mb-md">Recent Status Updates</h3>
            ${(() => {
        const updates = getStatusUpdates();
        if (updates.length === 0) {
          return `<p class="text-muted">No status updates yet. Change job statuses to track your progress.</p>`;
        }
        return `
                <div class="status-updates">
                  ${updates.slice(0, 10).map(update => {
          const date = new Date(update.date);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
          const statusClass = update.status === 'Applied' ? 'info' :
            update.status === 'Rejected' ? 'danger' :
              update.status === 'Selected' ? 'success' : 'neutral';
          return `
                      <div class="status-update">
                        <div class="status-update__content">
                          <div class="status-update__title">${update.title}</div>
                          <div class="status-update__company">${update.company}</div>
                        </div>
                        <div class="status-update__meta">
                          <span class="status-badge status-badge--${statusClass}">${update.status}</span>
                          <span class="status-update__date">${dateStr} at ${timeStr}</span>
                        </div>
                      </div>
                    `;
        }).join('')}
                </div>
              `;
      })()}
          </div>
          
          <p class="text-tiny text-muted text-center" style="margin-top: 16px;">Demo Mode: Daily 9AM trigger simulated manually.</p>
        </div>
      </div>
    `;
  },

  '/settings': () => {
    const appContainer = document.getElementById('app-container');
    const preferences = getPreferences() || {
      roleKeywords: '',
      locations: [],
      modes: [],
      experience: '',
      skills: '',
      minMatchScore: 40
    };

    const allLocations = [...new Set(jobsData.map(j => j.location))].sort();

    appContainer.innerHTML = `
      <div class="context-header">
        <h1 class="context-header__title">Settings</h1>
        <p class="context-header__subtitle">Configure your job matching preferences</p>
      </div>
      
      <div class="workspace">
        <div class="primary-workspace">
          <div class="card card--large">
            <h3 class="mb-md">Job Preferences</h3>
            
            <div class="form-group">
              <label class="form-group__label">Role Keywords</label>
              <input 
                type="text" 
                id="roleKeywords" 
                class="input" 
                placeholder="e.g. React, Frontend, Developer"
                value="${preferences.roleKeywords}"
              >
              <p class="text-small text-muted" style="margin-top: 4px;">Comma-separated. Used to match job titles and descriptions.</p>
            </div>
            
            <div class="form-group">
              <label class="form-group__label">Preferred Locations</label>
              <select id="preferredLocations" class="input" multiple style="min-height: 120px;">
                ${allLocations.map(loc => `
                  <option value="${loc}" ${preferences.locations.includes(loc) ? 'selected' : ''}>${loc}</option>
                `).join('')}
              </select>
              <p class="text-small text-muted" style="margin-top: 4px;">Hold Ctrl (Cmd on Mac) to select multiple.</p>
            </div>
            
            <div class="form-group">
              <label class="form-group__label">Preferred Work Mode</label>
              <div class="checkbox-group">
                <label class="checkbox-option">
                  <input type="checkbox" id="modeRemote" ${preferences.modes.includes('Remote') ? 'checked' : ''}>
                  <span>Remote</span>
                </label>
                <label class="checkbox-option">
                  <input type="checkbox" id="modeHybrid" ${preferences.modes.includes('Hybrid') ? 'checked' : ''}>
                  <span>Hybrid</span>
                </label>
                <label class="checkbox-option">
                  <input type="checkbox" id="modeOnsite" ${preferences.modes.includes('Onsite') ? 'checked' : ''}>
                  <span>Onsite</span>
                </label>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-group__label">Experience Level</label>
              <select id="experienceLevel" class="input">
                <option value="">Any Experience Level</option>
                <option value="Fresher" ${preferences.experience === 'Fresher' ? 'selected' : ''}>Fresher</option>
                <option value="0-1" ${preferences.experience === '0-1' ? 'selected' : ''}>0-1 years</option>
                <option value="1-3" ${preferences.experience === '1-3' ? 'selected' : ''}>1-3 years</option>
                <option value="3-5" ${preferences.experience === '3-5' ? 'selected' : ''}>3-5 years</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-group__label">Skills</label>
              <input 
                type="text" 
                id="skills" 
                class="input" 
                placeholder="e.g. JavaScript, React, Node.js, Python"
                value="${preferences.skills}"
              >
              <p class="text-small text-muted" style="margin-top: 4px;">Comma-separated. Used to match job skill requirements.</p>
            </div>
            
            <div class="form-group">
              <label class="form-group__label">Minimum Match Score (%)</label>
              <input 
                type="range" 
                id="minMatchScore" 
                class="slider" 
                min="0" 
                max="100" 
                value="${preferences.minMatchScore}"
                oninput="document.getElementById('scoreValue').textContent = this.value"
              >
              <div style="text-align: center; margin-top: 8px; font-size: 18px; font-weight: 600; color: var(--color-accent);">
                <span id="scoreValue">${preferences.minMatchScore}</span>%
              </div>
              <p class="text-small text-muted" style="margin-top: 4px;">Jobs below this threshold can be filtered out.</p>
            </div>
            
            <div class="divider"></div>
            
            <button class="btn btn--primary" id="savePrefsBtn" onclick="savePreferencesFromForm()">Save Preferences</button>
          </div>
        </div>
        
        <div class="secondary-panel">
          <div class="step-explanation mb-md">
            <div class="step-explanation__title">How Matching Works</div>
            <div class="step-explanation__content">
              Your match score is calculated based on:
              <ul style="margin-top: 8px; margin-left: 20px; line-height: 1.8;">
                <li>+25% — Role keyword in title</li>
                <li>+15% — Role keyword in description</li>
                <li>+15% — Location match</li>
                <li>+10% — Work mode match</li>
                <li>+10% — Experience level match</li>
                <li>+15% — Skills overlap</li>
                <li>+5% — Posted ≤2 days ago</li>
                <li>+5% — LinkedIn source</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  '/proof': () => {
    const appContainer = document.getElementById('app-container');
    const artifacts = getProofArtifacts();
    const projectStatus = getProjectStatus();
    const steps = getStepCompletionStatus();
    const completedSteps = steps.filter(s => s.completed).length;

    const statusClass = projectStatus === 'Shipped' ? 'success' :
      projectStatus === 'In Progress' ? 'warning' : 'neutral';

    appContainer.innerHTML = `
      <div class="context-header">
        <h1 class="context-header__title">Final Proof & Submission</h1>
        <p class="context-header__subtitle">Project 1 — Job Notification Tracker</p>
      </div>
      
      <div class="workspace">
        <div class="primary-workspace">
          <div class="card card--large">
            <div class="project-status">
              <span class="project-status__label">Project Status:</span>
              <span class="badge badge--${statusClass}" style="font-size: 14px;">${projectStatus}</span>
            </div>
            
            ${projectStatus === 'Shipped' ? `
              <div class="completion-message">
                ✓ Project 1 Shipped Successfully.
              </div>
            ` : ''}
            
            <div class="divider"></div>
            
            <h3 class="mb-md">A) Step Completion Summary</h3>
            <div class="step-list">
              ${steps.map((s, index) => `
                <div class="step-item${s.completed ? ' step-item--completed' : ''}">
                  <span class="step-item__number">${index + 1}</span>
                  <span class="step-item__title">${s.step}</span>
                  <span class="step-item__status">${s.completed ? '✓' : '○'}</span>
                </div>
              `).join('')}
            </div>
            <p class="text-small text-muted" style="margin-top: var(--space-sm);">
              ${completedSteps} of ${steps.length} steps completed
            </p>
            
            <div class="divider"></div>
            
            <h3 class="mb-md">B) Artifact Collection</h3>
            <p class="text-muted mb-md">Provide the required project links below:</p>
            
            <div class="form-group">
              <label class="form-group__label">Lovable Project Link *</label>
              <input 
                type="url" 
                class="input${artifacts.lovableLink && !isValidUrl(artifacts.lovableLink) ? ' input--error' : ''}" 
                placeholder="https://lovable.dev/projects/..." 
                value="${artifacts.lovableLink}"
                onchange="setProofArtifact('lovableLink', this.value); routes['/proof']();"
              >
              ${artifacts.lovableLink && !isValidUrl(artifacts.lovableLink) ?
        '<p class="text-small text-danger">Please enter a valid URL</p>' : ''}
            </div>
            
            <div class="form-group">
              <label class="form-group__label">GitHub Repository Link *</label>
              <input 
                type="url" 
                class="input${artifacts.githubLink && !isValidUrl(artifacts.githubLink) ? ' input--error' : ''}" 
                placeholder="https://github.com/username/repo" 
                value="${artifacts.githubLink}"
                onchange="setProofArtifact('githubLink', this.value); routes['/proof']();"
              >
              ${artifacts.githubLink && !isValidUrl(artifacts.githubLink) ?
        '<p class="text-small text-danger">Please enter a valid URL</p>' : ''}
            </div>
            
            <div class="form-group">
              <label class="form-group__label">Live Deployment URL (Vercel or equivalent) *</label>
              <input 
                type="url" 
                class="input${artifacts.deployedLink && !isValidUrl(artifacts.deployedLink) ? ' input--error' : ''}" 
                placeholder="https://yourapp.vercel.app" 
                value="${artifacts.deployedLink}"
                onchange="setProofArtifact('deployedLink', this.value); routes['/proof']();"
              >
              ${artifacts.deployedLink && !isValidUrl(artifacts.deployedLink) ?
        '<p class="text-small text-danger">Please enter a valid URL</p>' : ''}
            </div>
            
            <div class="divider"></div>
            
            <button 
              class="btn btn--primary" 
              onclick="copyFinalSubmission()"
              ${!allArtifactsProvided() || !allTestsPassed() ? 'disabled' : ''}
            >
              📋 Copy Final Submission
            </button>
            
            ${!allTestsPassed() || !allArtifactsProvided() ? `
              <p class="text-small text-muted" style="margin-top: var(--space-sm);">
                Complete all tests and provide all links to enable submission export
              </p>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  '/jt/07-test': () => {
    const appContainer = document.getElementById('app-container');
    const checklist = getTestChecklist();
    const { passed, total } = getTestsPassed();

    const testItems = [
      { key: 'test1', title: 'Preferences persist after refresh', howTo: 'Set preferences on /settings, refresh page, verify they are still there' },
      { key: 'test2', title: 'Match score calculates correctly', howTo: 'Set preferences, check job cards show match % badges with correct colors' },
      { key: 'test3', title: '"Show only matches" toggle works', howTo: 'Enable threshold toggle on dashboard, verify only jobs above threshold show' },
      { key: 'test4', title: 'Save job persists after refresh', howTo: 'Save a job, refresh page, verify it still shows as saved' },
      { key: 'test5', title: 'Apply opens in new tab', howTo: 'Click "Apply" button on job card, verify URL opens in new tab' },
      { key: 'test6', title: 'Status update persists after refresh', howTo: 'Change job status to "Applied", refresh page, verify status persists' },
      { key: 'test7', title: 'Status filter works correctly', howTo: 'Set status filter to "Applied", verify only applied jobs show' },
      { key: 'test8', title: 'Digest generates top 10 by score', howTo: 'Generate digest on /digest, verify top 10 jobs sorted by match score' },
      { key: 'test9', title: 'Digest persists for the day', howTo: 'Generate digest, refresh page, verify same digest loads' },
      { key: 'test10', title: 'No console errors on main pages', howTo: 'Open console, navigate to all routes, verify no errors' }
    ];

    appContainer.innerHTML = `
      <div class="context-header">
        <h1 class="context-header__title">Test Checklist</h1>
        <p class="context-header__subtitle">Verify all features before shipping</p>
      </div>
      
      <div class="workspace">
        <div class="primary-workspace">
          <div class="card card--large">
            <div class="test-summary${passed < total ? ' test-summary--incomplete' : ''}">
              <div class="test-summary__score">
                <span class="test-summary__label">Tests Passed:</span>
                <span class="test-summary__count">${passed} / ${total}</span>
              </div>
              ${passed < total ? `
                <div class="test-summary__warning">
                  <strong>⚠ Resolve all issues before shipping.</strong>
                </div>
              ` : `
                <div class="test-summary__success">
                  <strong>✓ All tests passed! Ready to ship.</strong>
                </div>
              `}
            </div>
            
            <div class="divider"></div>
            
            <div class="test-checklist">
              ${testItems.map(item => `
                <div class="test-item">
                  <label class="test-item__checkbox">
                    <input 
                      type="checkbox" 
                      ${checklist[item.key] ? 'checked' : ''}
                      onchange="setTestItem('${item.key}', this.checked); routes['/jt/07-test']();"
                    >
                    <span class="test-item__title">${item.title}</span>
                  </label>
                  <button class="test-item__tooltip" title="${item.howTo}">?</button>
                </div>
              `).join('')}
            </div>
            
            <div class="divider"></div>
            
            <button class="btn btn--secondary" onclick="resetTestChecklist()">Reset Test Status</button>
          </div>
        </div>
      </div>
    `;
  },

  '/jt/08-ship': () => {
    const appContainer = document.getElementById('app-container');
    const testsPassed = allTestsPassed();

    if (!testsPassed) {
      appContainer.innerHTML = `
        <div class="context-header">
          <h1 class="context-header__title">🔒 Ship Locked</h1>
          <p class="context-header__subtitle">Complete all tests to unlock</p>
        </div>
        
        <div class="workspace">
          <div class="primary-workspace">
            <div class="card card--large" style="text-align: center;">
              <div class="lock-icon">🔒</div>
              <h3 class="mb-md">Ship Route Locked</h3>
              <p class="text-muted mb-md">
                You must complete all 10 tests on the test checklist before you can ship.
              </p>
              <a href="#/jt/07-test" class="btn btn--primary">Go to Test Checklist</a>
            </div>
          </div>
        </div>
      `;
      return;
    }

    appContainer.innerHTML = `
      <div class="context-header">
        <h1 class="context-header__title">✓ Ready to Ship</h1>
        <p class="context-header__subtitle">All tests passed</p>
      </div>
      
      <div class="workspace">
        <div class="primary-workspace">
          <div class="card card--large" style="text-align: center;">
            <div class="success-icon">✓</div>
            <h3 class="mb-md">All Tests Passed!</h3>
            <p class="text-muted mb-md">
              Congratulations! All 10 tests have been completed successfully.
              Your Job Notification Tracker is ready to ship.
            </p>
            <p class="text-tiny text-muted">
              This route was locked until all tests passed. Great work!
            </p>
          </div>
        </div>
      </div>
    `;
  }
};

function renderSavedPage() {
  const savedJobIds = getSavedJobs();
  const savedJobs = jobsData.filter(job => savedJobIds.includes(job.id));
  const appContainer = document.getElementById('app-container');

  appContainer.innerHTML = `
    <div class="context-header">
      <h1 class="context-header__title">Saved</h1>
      <p class="context-header__subtitle">${savedJobs.length} saved job${savedJobs.length !== 1 ? 's' : ''}</p>
    </div>
    
    <div class="workspace">
      <div class="primary-workspace">
        ${savedJobs.length > 0
      ? `<div class="job-grid">${savedJobs.map(job => renderJobCard(job)).join('')}</div>`
      : `
            <div class="empty-state">
              <h3 class="empty-state__title">No saved jobs yet</h3>
              <p class="empty-state__message">When you find interesting opportunities, save them here for later review.</p>
              <a href="#/dashboard" class="btn btn--secondary">Go to Dashboard</a>
            </div>
          `
    }
      </div>
    </div>
  `;
}

// ===================================
// NAVIGATION
// ===================================

function toggleMobileMenu() {
  const nav = document.querySelector('.main-nav');
  const hamburger = document.querySelector('.hamburger');
  nav.classList.toggle('main-nav--open');
  hamburger.classList.toggle('hamburger--open');
}

document.addEventListener('click', (e) => {
  const nav = document.querySelector('.main-nav');
  const hamburger = document.querySelector('.hamburger');

  if (nav && hamburger && nav.classList.contains('main-nav--open')) {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove('main-nav--open');
      hamburger.classList.remove('hamburger--open');
    }
  }
});

function handleNavClick() {
  const nav = document.querySelector('.main-nav');
  const hamburger = document.querySelector('.hamburger');

  if (window.innerWidth <= 768) {
    nav.classList.remove('main-nav--open');
    hamburger.classList.remove('hamburger--open');
  }
}

// ===================================
// INITIALIZE APP
// ===================================

let router;

document.addEventListener('DOMContentLoaded', () => {
  router = new Router();

  Object.keys(routes).forEach(path => {
    router.register(path, routes[path]);
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', handleNavClick);
  });

  const hamburger = document.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }
});
