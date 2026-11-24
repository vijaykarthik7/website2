/**
 * DESIGN 1 / DESIGN 2 PROTOTYPE SWITCHER ENGINE
 * Provides instant live comparison between Design 1 (Original) and Design 2 (The Digital Perspective)
 * Context-aware routing, in-place awards toggle on home page, persistent selection, and feature flag management.
 */

(function () {
  'use strict';

  // 1. FEATURE FLAG CHECK
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('prototype') === 'false') {
    localStorage.setItem('SERVICES_PROTOTYPE', 'false');
    return;
  }
  if (urlParams.get('prototype') === 'true') {
    localStorage.setItem('SERVICES_PROTOTYPE', 'true');
  }
  const isFeatureEnabled = localStorage.getItem('SERVICES_PROTOTYPE') !== 'false';
  if (!isFeatureEnabled) return;

  // 2. ROUTE DEFINITIONS
  const SERVICES_LIST = [
    'web-development',
    'custom-software-development',
    'mobile-app-development',
    'ecommerce-solutions',
    'game-development',
    'ar-vr-development',
    'ui-ux-design',
    '3d-modeling',
    'digital-marketing'
  ];

  // Detect current active design from pathname
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const isDesign2Page = currentPath.includes('/services/design2');
  const isHomePage = !isDesign2Page && (currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '');

  // Read persisted preference (default to design1 for first-time visitors)
  let storedPref = localStorage.getItem('services_prototype_design');
  if (!storedPref) {
    storedPref = isDesign2Page ? 'design2' : 'design1';
    localStorage.setItem('services_prototype_design', storedPref);
  }

  const activeDesignOnHome = storedPref || 'design1';
  const currentDesign = isHomePage ? activeDesignOnHome : (isDesign2Page ? 'design2' : 'design1');

  // 3. INJECT STYLESHEET IF NOT PRESENT
  if (!document.getElementById('d2-switcher-styles')) {
    const link = document.createElement('link');
    link.id = 'd2-switcher-styles';
    link.rel = 'stylesheet';
    link.href = '/services/design2/design-switcher.css';
    document.head.appendChild(link);
  }

  // 4. HOME PAGE AWARDS SWITCHER HELPER
  function applyHomePageDesign(targetDesign) {
    const awardsD1 = document.getElementById('awards');
    const awardsD2 = document.getElementById('awardsDesign2');

    if (targetDesign === 'design2') {
      if (awardsD1) awardsD1.style.display = 'none';
      if (awardsD2) {
        awardsD2.style.display = 'block';
        if (window.initHallOfExcellence) {
          window.initHallOfExcellence();
        }
      }
    } else {
      if (awardsD2) awardsD2.style.display = 'none';
      if (awardsD1) awardsD1.style.display = 'block';
    }

    // Keep nav anchors synced with active awards design
    document.querySelectorAll('a[href="#awards"], a[href="#awardsDesign2"]').forEach(link => {
      link.setAttribute('href', targetDesign === 'design2' ? '#awardsDesign2' : '#awards');
    });
  }

  // 5. FIND CORRESPONDING TARGET URL FOR SWITCHING (ON SUBPAGES)
  function getTargetUrl(targetDesign) {
    if (targetDesign === currentDesign) return null;

    if (targetDesign === 'design2') {
      // Switching from Design 1 -> Design 2
      for (const slug of SERVICES_LIST) {
        if (currentPath.includes(`/services/${slug}`)) {
          return `/services/design2/${slug}`;
        }
      }
      return '/services/design2/';
    } else {
      // Switching from Design 2 -> Design 1
      for (const slug of SERVICES_LIST) {
        if (currentPath.includes(`/services/design2/${slug}`)) {
          return `/services/${slug}`;
        }
      }
      return '/index.html#services';
    }
  }

  // 6. RENDER THE TOGGLE INTERFACE
  function renderSwitcher() {
    if (document.getElementById('d2SwitcherHost')) return;

    const host = document.createElement('aside');
    host.id = 'd2SwitcherHost';
    host.className = 'd2-switcher-host';
    host.setAttribute('aria-label', 'Design Prototype Switcher');

    const activeDesign = isHomePage ? (localStorage.getItem('services_prototype_design') || 'design1') : currentDesign;

    host.innerHTML = `
      <div class="d2-switcher-tag" title="Prototype Comparison Active">
        <span>PROTOTYPE</span>
      </div>
      <div class="d2-segmented-control" data-active="${activeDesign}" role="radiogroup" aria-label="Select website design version">
        <div class="d2-segmented-slider" aria-hidden="true"></div>
        <button type="button" class="d2-segmented-btn ${activeDesign === 'design1' ? 'active' : ''}" data-target-design="design1" role="radio" aria-checked="${activeDesign === 'design1'}" title="Switch to Design 1 (Original live website)">
          <span>Design 1</span>
          <span class="d2-btn-badge">LIVE</span>
        </button>
        <button type="button" class="d2-segmented-btn ${activeDesign === 'design2' ? 'active' : ''}" data-target-design="design2" role="radio" aria-checked="${activeDesign === 'design2'}" title="Switch to Design 2 (Hall of Excellence)">
          <span>Design 2</span>
          <span class="d2-btn-badge">NEW</span>
        </button>
      </div>
      <div class="d2-switcher-hint">
        ${activeDesign === 'design1' ? 'Switch to Design 2 (Hall of Excellence)' : 'Switch back to Design 1 (Original)'}
      </div>
    `;

    document.body.appendChild(host);

    // Event listeners
    const buttons = host.querySelectorAll('.d2-segmented-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetDesign = btn.getAttribute('data-target-design');
        const currentActive = localStorage.getItem('services_prototype_design') || 'design1';
        if (targetDesign === currentActive && isHomePage) return;

        localStorage.setItem('services_prototype_design', targetDesign);

        const control = host.querySelector('.d2-segmented-control');
        if (control) control.setAttribute('data-active', targetDesign);

        buttons.forEach(b => {
          const isSelected = b.getAttribute('data-target-design') === targetDesign;
          b.classList.toggle('active', isSelected);
          b.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        });

        const hint = host.querySelector('.d2-switcher-hint');
        if (hint) {
          hint.textContent = targetDesign === 'design1'
            ? 'Switch to Design 2 (Hall of Excellence)'
            : 'Switch back to Design 1 (Original)';
        }

        if (isHomePage) {
          // In-place instant toggle on the home page!
          applyHomePageDesign(targetDesign);
        } else {
          const targetUrl = getTargetUrl(targetDesign);
          if (targetUrl) {
            window.location.href = targetUrl;
          }
        }
      });
    });
  }

  // 7. INITIALIZE ON DOM READY
  function init() {
    renderSwitcher();
    if (isHomePage) {
      const stored = localStorage.getItem('services_prototype_design') || 'design1';
      applyHomePageDesign(stored);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 8. ROUTE INTERCEPTION WHEN PREFERENCE IS DESIGN 2
  document.addEventListener('DOMContentLoaded', () => {
    const pref = localStorage.getItem('services_prototype_design');
    if (pref === 'design2') {
      document.querySelectorAll('a[href^="/services/"]').forEach(a => {
        const href = a.getAttribute('href');
        if (!href.startsWith('/services/design2/')) {
          const match = href.match(/^\/services\/([a-z0-9\-]+)/);
          if (match && SERVICES_LIST.includes(match[1])) {
            a.setAttribute('href', `/services/design2/${match[1]}`);
          }
        }
      });

      const navServicesLink = document.getElementById('navServicesLink');
      if (navServicesLink) {
        navServicesLink.setAttribute('href', '/services/design2/');
      }
    }
  });

})();
