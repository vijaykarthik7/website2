const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, '..', 'styles.css');
const scriptPath = path.join(__dirname, '..', 'script.js');

let styles = fs.readFileSync(stylesPath, 'utf8');
let script = fs.readFileSync(scriptPath, 'utf8');

// 1. Add process footer styles & standardized section flow classes to styles.css
const extraStyles = `
/* ==========================================================================
   MASTER SECTION FLOW & TRANSITION HARMONY ENGINE
   ========================================================================== */

/* 6-Step Process Completion Gateway */
.timeline-01-process-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 36px;
  gap: 12px;
}

.process-complete-badge {
  font-family: var(--font-heading);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: var(--gold-champagne);
  text-transform: uppercase;
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.28);
  padding: 5px 16px;
  border-radius: 999px;
  box-shadow: 0 0 16px rgba(212, 175, 55, 0.15);
}

/* Seamless Section Transitions */
.section-awards::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 110px;
  background: linear-gradient(to bottom, transparent 0%, #060608 100%);
  pointer-events: none;
  z-index: 25;
}

/* Section Anchor Offsets for Smooth Navigation */
#about, #awards, #trust, #services, #industries, #guardian, #portfolio, #estimator, #assistant, #contact {
  scroll-margin-top: 80px;
}
`;

if (!styles.includes('MASTER SECTION FLOW & TRANSITION HARMONY ENGINE')) {
  styles += extraStyles;
  fs.writeFileSync(stylesPath, styles, 'utf8');
  console.log('Appended flow styles to styles.css');
}

// 2. Add initMasterSectionFlow to script.js
const masterFlowFunction = `
  // =========================================================================
  // 18. Master Unified Section Flow Engine (GSAP & ScrollTrigger)
  //     Ensures buttery-smooth, cohesive entrance transitions for ALL sections
  // =========================================================================
  function initMasterSectionFlow() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // A. Section Headers Reveal across ALL sections
    const sectionHeaders = document.querySelectorAll(
      '#awards .center-header, #trust .center-header, ' +
      '#services .center-header, #services .services-header-left, ' +
      '#industries .center-header, #industries .industries-header-left, ' +
      '#guardian .guardian-header-block, ' +
      '#portfolio .center-header, ' +
      '.section-tech-ecosystem .center-header, ' +
      '.section-clients .center-header, ' +
      '#estimator .center-header, ' +
      '#assistant .demo-split .demo-left, ' +
      '#contact .center-header'
    );

    sectionHeaders.forEach((hdr) => {
      gsap.fromTo(hdr, 
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: hdr,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // B. Awards Cards Staggered Fluid Reveal
    const awardCards = document.querySelectorAll('#awards .award-card');
    if (awardCards.length > 0) {
      gsap.fromTo(awardCards,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#awards .awards-grid',
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // C. Trust Interactive Viewer (TIV Stage) Reveal
    const tivViewer = document.getElementById('trustImageViewer');
    if (tivViewer) {
      gsap.fromTo(tivViewer,
        { opacity: 0, y: 45 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: tivViewer,
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // D. Digital Capability Bento Grid Staggered Reveal
    const bentoCards = document.querySelectorAll('.bento-card');
    if (bentoCards.length > 0) {
      gsap.fromTo(bentoCards,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.08,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.bento-services-grid',
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // E. Industries Display Box & Tabs Reveal
    const indDisplay = document.querySelector('.industry-display-box');
    const indTabs = document.querySelector('.industry-tabs-bar');
    if (indDisplay) {
      gsap.fromTo(indDisplay,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: indDisplay,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
    if (indTabs) {
      gsap.fromTo(indTabs,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: indTabs,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // F. Riyadvi Guardian Framework Nodes Stagger
    const guardianCenter = document.querySelector('.guardian-shield-center');
    const guardianPillars = document.querySelectorAll('.v-pillar-card');
    if (guardianCenter) {
      gsap.fromTo(guardianCenter,
        { opacity: 0, scale: 0.88 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: guardianCenter,
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
    if (guardianPillars.length > 0) {
      gsap.fromTo(guardianPillars,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.guardian-v-stage',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // G. Portfolio Case Studies Staggered Reveal
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    if (portfolioCards.length > 0) {
      gsap.fromTo(portfolioCards,
        { opacity: 0, y: 45 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.portfolio-grid',
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // H. Tech Ecosystem Badges Gentle Elastic Stagger
    const techBadges = document.querySelectorAll('.tech-node-badge');
    if (techBadges.length > 0) {
      gsap.fromTo(techBadges,
        { opacity: 0, scale: 0.9, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.03,
          duration: 0.55,
          ease: 'back.out(1.3)',
          scrollTrigger: {
            trigger: '.tech-nodes-container',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // I. Client Logos Staggered Fade
    const clientLogos = document.querySelectorAll('.client-logo-item');
    if (clientLogos.length > 0) {
      gsap.fromTo(clientLogos,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.07,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.clients-grid',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // J. Estimator Box & Interactive Assistant Window Reveal
    const estimatorBox = document.querySelector('.estimator-box');
    if (estimatorBox) {
      gsap.fromTo(estimatorBox,
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: estimatorBox,
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    const demoSplit = document.querySelector('.demo-split');
    if (demoSplit) {
      gsap.fromTo(demoSplit,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: demoSplit,
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // K. Contact Split Grid Reveal
    const contactGrid = document.querySelector('.contact-split-grid');
    if (contactGrid) {
      gsap.fromTo(contactGrid,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contactGrid,
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }

  // Initialize Master Section Flow
  initMasterSectionFlow();
`;

if (!script.includes('initMasterSectionFlow')) {
  // Insert before the last closing of DOMContentLoaded listener
  const target = 'initStraightTimeline();';
  if (script.includes(target)) {
    script = script.replace(target, target + '\n' + masterFlowFunction);
    fs.writeFileSync(scriptPath, script, 'utf8');
    console.log('Injected initMasterSectionFlow into script.js');
  } else {
    console.warn('Target string not found in script.js');
  }
}
