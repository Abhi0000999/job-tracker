// ===================================
// KODNEST PREMIUM BUILD SYSTEM
// Job Notification Tracker - Router
// ===================================

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;

    // Initialize router
    this.init();
  }

  init() {
    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRouteChange());
    window.addEventListener('load', () => this.handleRouteChange());
  }

  // Register a route
  register(path, handler) {
    this.routes[path] = handler;
  }

  // Handle route changes
  handleRouteChange() {
    const hash = window.location.hash.slice(1) || '/';
    const route = hash.split('?')[0]; // Remove query params if any

    this.currentRoute = route;

    // Find matching route
    const handler = this.routes[route] || this.routes['/dashboard']; // Default to dashboard

    if (handler) {
      handler();
    }

    // Update navigation active states
    this.updateNavigation();
  }

  // Navigate to a route
  navigate(path) {
    window.location.hash = path;
  }

  // Update active navigation link
  updateNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href').slice(1); // Remove #
      if (href === this.currentRoute) {
        link.classList.add('nav-link--active');
      } else {
        link.classList.remove('nav-link--active');
      }
    });
  }
}

// ===================================
// ROUTE HANDLERS
// ===================================

// Route definitions
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

  '/dashboard': () => {
    const appContainer = document.getElementById('app-container');

    appContainer.innerHTML = `
      <div class="context-header">
        <h1 class="context-header__title">Dashboard</h1>
        <p class="context-header__subtitle">Track and manage your job notifications.</p>
      </div>
      
      <div class="workspace">
        <div class="primary-workspace">
          <div class="empty-state">
            <h3 class="empty-state__title">No jobs yet.</h3>
            <p class="empty-state__message">In the next step, you will load a realistic dataset.</p>
          </div>
        </div>
      </div>
    `;
  },

  '/saved': () => {
    const appContainer = document.getElementById('app-container');

    appContainer.innerHTML = `
      <div class="context-header">
        <h1 class="context-header__title">Saved</h1>
        <p class="context-header__subtitle">View your saved job notifications.</p>
      </div>
      
      <div class="workspace">
        <div class="primary-workspace">
          <div class="empty-state">
            <h3 class="empty-state__title">No saved jobs yet.</h3>
            <p class="empty-state__message">When you find interesting opportunities, save them here for later review.</p>
            <a href="#/dashboard" class="btn btn--secondary">Go to Dashboard</a>
          </div>
        </div>
      </div>
    `;
  },

  '/digest': () => {
    const appContainer = document.getElementById('app-container');

    appContainer.innerHTML = `
      <div class="context-header">
        <h1 class="context-header__title">Digest</h1>
        <p class="context-header__subtitle">Review your daily job notification digest.</p>
      </div>
      
      <div class="workspace">
        <div class="primary-workspace">
          <div class="empty-state">
            <h3 class="empty-state__title">No digest available yet.</h3>
            <p class="empty-state__message">Your daily digest will be delivered at 9AM with precision-matched opportunities.</p>
            <a href="#/settings" class="btn btn--secondary">Configure Preferences</a>
          </div>
        </div>
      </div>
    `;
  },

  '/settings': () => {
    const appContainer = document.getElementById('app-container');

    appContainer.innerHTML = `
      <div class="context-header">
        <h1 class="context-header__title">Settings</h1>
        <p class="context-header__subtitle">Configure your notification preferences.</p>
      </div>
      
      <div class="workspace">
        <div class="primary-workspace">
          <div class="card card--large">
            <h3 class="mb-md">Job Preferences</h3>
            
            <div class="form-group">
              <label class="form-group__label">Role Keywords</label>
              <input type="text" class="input" placeholder="e.g. Senior Software Engineer, Full Stack Developer">
            </div>
            
            <div class="form-group">
              <label class="form-group__label">Preferred Locations</label>
              <input type="text" class="input" placeholder="e.g. San Francisco, New York, Remote">
            </div>
            
            <div class="form-group">
              <label class="form-group__label">Work Mode</label>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="mode" value="remote" checked>
                  <span>Remote</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="mode" value="hybrid">
                  <span>Hybrid</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="mode" value="onsite">
                  <span>Onsite</span>
                </label>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-group__label">Experience Level</label>
              <select class="input">
                <option value="">Select experience level</option>
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (3-5 years)</option>
                <option value="senior">Senior Level (6-10 years)</option>
                <option value="lead">Lead/Principal (10+ years)</option>
              </select>
            </div>
            
            <div class="divider"></div>
            
            <button class="btn btn--primary">Save Preferences</button>
          </div>
        </div>
        
        <div class="secondary-panel">
          <div class="step-explanation mb-md">
            <div class="step-explanation__title">About Preferences</div>
            <div class="step-explanation__content">
              Set your job preferences to receive precision-matched opportunities. Updates will be reflected in your daily digest.
            </div>
          </div>
        </div>
      </div>
    `;
  },

  '/proof': () => {
    const appContainer = document.getElementById('app-container');

    appContainer.innerHTML = `
      <div class="context-header">
        <h1 class="context-header__title">Proof</h1>
        <p class="context-header__subtitle">Verify your job application progress.</p>
      </div>
      
      <div class="workspace">
        <div class="primary-workspace">
          <div class="card card--large">
            <h3 class="mb-md">Artifact Collection</h3>
            <p class="text-muted mb-md">This section will collect proof artifacts of your job search progress.</p>
            
            <div class="empty-state">
              <p class="empty-state__message">Artifact collection interface will be built in the next step.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

// ===================================
// NAVIGATION
// ===================================

function toggleMobileMenu() {
  const nav = document.querySelector('.main-nav');
  const hamburger = document.querySelector('.hamburger');

  nav.classList.toggle('main-nav--open');
  hamburger.classList.toggle('hamburger--open');
}

// Close mobile menu when clicking outside
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

// Close mobile menu when clicking a link
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
  // Create router instance
  router = new Router();

  // Register all routes
  Object.keys(routes).forEach(path => {
    router.register(path, routes[path]);
  });

  // Add click handlers to nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', handleNavClick);
  });

  // Add hamburger menu toggle
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }
});
