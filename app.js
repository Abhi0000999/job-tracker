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

function renderPage(title, subtitle = "This section will be built in the next step.") {
  const appContainer = document.getElementById('app-container');
  
  appContainer.innerHTML = `
    <div class="context-header">
      <h1 class="context-header__title">${title}</h1>
      <p class="context-header__subtitle text-muted">${subtitle}</p>
    </div>
    
    <div class="workspace">
      <div class="primary-workspace">
        <div class="empty-state">
          <p class="empty-state__message">Content for this page will be added in the next step.</p>
        </div>
      </div>
    </div>
  `;
}

// Route definitions
const routes = {
  '/': () => {
    // Redirect to dashboard
    router.navigate('/dashboard');
  },
  
  '/dashboard': () => {
    renderPage('Dashboard', 'Track and manage your job notifications.');
  },
  
  '/saved': () => {
    renderPage('Saved', 'View your saved job notifications.');
  },
  
  '/digest': () => {
    renderPage('Digest', 'Review your daily job notification digest.');
  },
  
  '/settings': () => {
    renderPage('Settings', 'Configure your notification preferences.');
  },
  
  '/proof': () => {
    renderPage('Proof', 'Verify your job application progress.');
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
