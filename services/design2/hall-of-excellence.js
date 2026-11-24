/**
 * HALL OF EXCELLENCE — AWARDS & RECOGNITIONS REDESIGN (DESIGN 2 PROTOTYPE)
 * Interactive 3D Curved Carousel, Dynamic Featured Showcase, Credential Selector,
 * Mouse Parallax, Lightbox Viewer, and Switcher Integration.
 */

(function () {
  'use strict';

  // 1. COMPREHENSIVE AWARDS DATABASE
  const AWARDS_DATA = [
    {
      id: 'designrush-top',
      title: 'Top Web Development Company 2025',
      org: 'DesignRush Global Network',
      pill: '2025 RECOGNIZED',
      category: 'Web Development',
      group: 'designrush',
      type: 'badge',
      img: 'assets/awards/award_designrush_2025.png',
      lightBg: true,
      desc: '“We are proud to be featured on DesignRush for our outstanding work.” Accredited as a premier agency delivering high-performance enterprise web architectures.',
      location: 'Global Accreditation',
      verifyUrl: 'https://www.designrush.com',
      ctaText: 'Verify Recognition ↗'
    },
    {
      id: 'star-ceremony',
      title: 'Star of Excellence Award',
      org: 'National Integrity Cultural Academy & The Peaks',
      pill: '2021 CEREMONY',
      category: 'Leadership & Innovation',
      group: 'star-excellence',
      type: 'photo',
      img: 'assets/awards/award_star_excellence_ceremony.jpg',
      lightBg: false,
      desc: 'Prestigious stage presentation at TR Rajarathinam Kalai Arangam honoring Thiru. R. Bhoopathy for pioneering leadership in enterprise software innovation and business excellence.',
      location: 'Chennai, India',
      verifyUrl: '#',
      ctaText: 'View Presentation Photo ↗'
    },
    {
      id: 'tb-pdf-certificate',
      title: 'Official Certificate of Excellence',
      org: 'TechBehemoths Berlin, Germany',
      pill: '2025 OFFICIAL PDF',
      category: 'Global Excellence',
      group: 'tb-pdf',
      type: 'pdf',
      img: 'assets/awards/award_tb_banner_2025.png',
      pdfUrl: 'assets/awards/Official_Certificate_of_Excellence_TechBehemoths_Global_Awards_2025.pdf',
      lightBg: false,
      desc: 'Complete official verified PDF certification document honoring Riyadvi across WordPress, ReactJS, and Social Media Marketing (SMM) verticals.',
      location: 'Berlin, Germany',
      verifyUrl: 'assets/awards/Official_Certificate_of_Excellence_TechBehemoths_Global_Awards_2025.pdf',
      ctaText: 'Open Official PDF Certificate ↗'
    },
    {
      id: 'tb-react-badge',
      title: 'Award Winner 2025 — ReactJS Badge',
      org: 'TechBehemoths Berlin, Germany',
      pill: '2025 WINNER',
      category: 'ReactJS Engineering',
      group: 'reactjs',
      type: 'badge',
      img: 'assets/awards/award_tb_reactjs_2025_badge.png',
      lightBg: false,
      desc: 'Official 2025 Winner badge in India for excellence in ReactJS web applications, modern component architecture, and top Lighthouse scores.',
      location: 'India • Berlin, Germany',
      verifyUrl: 'https://techbehemoths.com/company/riyadvi-software-technologies-private-limited',
      ctaText: 'Verify ReactJS Award ↗'
    },
    {
      id: 'tb-react-laurel',
      title: 'ReactJS — 2025 Winner Laurel',
      org: 'TechBehemoths Berlin, Germany',
      pill: '2025 LAUREL',
      category: 'ReactJS Engineering',
      group: 'reactjs',
      type: 'laurel',
      img: 'assets/awards/award_tb_reactjs_laurel.png',
      lightBg: false,
      desc: 'Gold laurel insignia certifying Riyadvi Software Technologies as a premier ReactJS engineering company across India.',
      location: 'India • Berlin, Germany',
      verifyUrl: 'https://techbehemoths.com/company/riyadvi-software-technologies-private-limited',
      ctaText: 'Verify ReactJS Laurel ↗'
    },
    {
      id: 'tb-react-certificate',
      title: 'Winner ReactJS 2025 — Certificate',
      org: 'TechBehemoths Berlin, Germany',
      pill: '2025 CERTIFICATE',
      category: 'ReactJS Engineering',
      group: 'reactjs',
      type: 'certificate',
      img: 'assets/awards/award_tb_reactjs_winner_poster.png',
      lightBg: false,
      desc: 'Official celebration certificate proclaiming Riyadvi Software Technologies an Award-Winning Company in India for ReactJS Services.',
      location: 'India • Berlin, Germany',
      verifyUrl: 'https://techbehemoths.com/company/riyadvi-software-technologies-private-limited',
      ctaText: 'View ReactJS Certificate ↗'
    },
    {
      id: 'tb-wordpress-badge',
      title: 'Award Winner 2025 — WordPress Badge',
      org: 'TechBehemoths Berlin, Germany',
      pill: '2025 WINNER',
      category: 'WordPress Development',
      group: 'wordpress',
      type: 'badge',
      img: 'assets/awards/award_tb_wordpress_2025_badge.png',
      lightBg: false,
      desc: 'Official 2025 Winner badge in India for enterprise WordPress solutions, bespoke theme architecture, and headless CMS integrations.',
      location: 'India • Berlin, Germany',
      verifyUrl: 'https://techbehemoths.com/company/riyadvi-software-technologies-private-limited',
      ctaText: 'Verify WordPress Award ↗'
    },
    {
      id: 'tb-wordpress-laurel',
      title: 'WordPress — 2025 Winner Laurel',
      org: 'TechBehemoths Berlin, Germany',
      pill: '2025 LAUREL',
      category: 'WordPress Development',
      group: 'wordpress',
      type: 'laurel',
      img: 'assets/awards/award_tb_wordpress_laurel.png',
      lightBg: false,
      desc: 'Gold laurel insignia certifying Riyadvi Software Technologies as a premier WordPress engineering and theme architecture agency.',
      location: 'India • Berlin, Germany',
      verifyUrl: 'https://techbehemoths.com/company/riyadvi-software-technologies-private-limited',
      ctaText: 'Verify WordPress Laurel ↗'
    },
    {
      id: 'tb-wordpress-certificate',
      title: 'Winner WordPress 2025 — Certificate',
      org: 'TechBehemoths Berlin, Germany',
      pill: '2025 CERTIFICATE',
      category: 'WordPress Development',
      group: 'wordpress',
      type: 'certificate',
      img: 'assets/awards/award_tb_wordpress_winner_poster.png',
      lightBg: false,
      desc: 'Official celebration certificate proclaiming Riyadvi Software Technologies an Award-Winning Company in India for WordPress Services.',
      location: 'India • Berlin, Germany',
      verifyUrl: 'https://techbehemoths.com/company/riyadvi-software-technologies-private-limited',
      ctaText: 'View WordPress Certificate ↗'
    },
    {
      id: 'tb-smm-badge',
      title: 'Award Badge — SMM — 2025',
      org: 'TechBehemoths Berlin, Germany',
      pill: '2025 WINNER',
      category: 'Social Media Marketing',
      group: 'smm',
      type: 'badge',
      img: 'assets/awards/award_tb_smm_2025_badge.png',
      lightBg: false,
      desc: 'Official 2025 Winner badge in India for data-driven Social Media Marketing (SMM), multi-channel brand growth, and audience acquisition.',
      location: 'India • Berlin, Germany',
      verifyUrl: 'https://techbehemoths.com/company/riyadvi-software-technologies-private-limited',
      ctaText: 'Verify SMM Award ↗'
    },
    {
      id: 'tb-smm-laurel',
      title: 'SMM — 2025 Winner Laurel',
      org: 'TechBehemoths Berlin, Germany',
      pill: '2025 LAUREL',
      category: 'Social Media Marketing',
      group: 'smm',
      type: 'laurel',
      img: 'assets/awards/award_tb_smm_laurel.png',
      lightBg: false,
      desc: 'Gold laurel insignia certifying Riyadvi Software Technologies as the leading Social Media Marketing company in India.',
      location: 'India • Berlin, Germany',
      verifyUrl: 'https://techbehemoths.com/company/riyadvi-software-technologies-private-limited',
      ctaText: 'Verify SMM Laurel ↗'
    },
    {
      id: 'tb-smm-certificate',
      title: 'Winner SMM 2025 — Certificate',
      org: 'TechBehemoths Berlin, Germany',
      pill: '2025 CERTIFICATE',
      category: 'Social Media Marketing',
      group: 'smm',
      type: 'certificate',
      img: 'assets/awards/award_tb_smm_winner_poster.png',
      lightBg: false,
      desc: 'Official celebration certificate proclaiming Riyadvi Software Technologies an Award-Winning Company in India for SMM Services.',
      location: 'India • Berlin, Germany',
      verifyUrl: 'https://techbehemoths.com/company/riyadvi-software-technologies-private-limited',
      ctaText: 'View SMM Certificate ↗'
    }
  ];

  // STATE
  let currentIndex = 0;
  let isInitialized = false;
  let isTransitioning = false;

  // DOM Elements cache
  let sectionEl, trackEl, cardsNodeList = [], paginationEl, featuredPanelEl;
  let trophyWrapperEl, podiumPulseEl;
  let lightboxEl;

  // INITIALIZE
  function initHallOfExcellence() {
    sectionEl = document.getElementById('awardsDesign2');
    if (!sectionEl) return;

    trackEl = sectionEl.querySelector('.d2-carousel-track');
    paginationEl = sectionEl.querySelector('.d2-carousel-pagination');
    featuredPanelEl = sectionEl.querySelector('.d2-hall-featured-panel');
    trophyWrapperEl = sectionEl.querySelector('.d2-trophy-wrapper');
    podiumPulseEl = sectionEl.querySelector('.d2-podium-light-pulse');
    lightboxEl = document.getElementById('d2AwardLightbox');

    if (!trackEl) return;

    buildCarouselCards();
    buildPaginationDots();
    setupControls();
    setupMouseParallax();
    setupStatsCounter();
    setupLightbox();

    // Default active item
    updateActiveAward(0, false);
    isInitialized = true;
  }

  // 2. BUILD CAROUSEL CARDS
  function buildCarouselCards() {
    trackEl.innerHTML = '';
    AWARDS_DATA.forEach((award, index) => {
      const card = document.createElement('div');
      card.className = 'd2-carousel-card';
      card.setAttribute('data-index', index);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${award.title} by ${award.org}`);

      card.innerHTML = `
        <span class="d2-card-pill">${award.pill}</span>
        <div class="d2-card-media-box ${award.lightBg ? 'light-media' : ''}">
          ${award.type === 'pdf' ? `
            <div class="d2-featured-pdf-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>OFFICIAL PDF</span>
            </div>
          ` : `
            <img src="${award.img}" alt="${award.title}" class="d2-card-img" loading="lazy" />
          `}
        </div>
        <div class="d2-card-info">
          <h4 class="d2-card-title">${award.title}</h4>
          <span class="d2-card-org">${award.org}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        if (currentIndex !== index) {
          updateActiveAward(index, true);
        } else {
          openLightbox(award);
        }
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          updateActiveAward(index, true);
        }
      });

      trackEl.appendChild(card);
    });

    cardsNodeList = Array.from(trackEl.querySelectorAll('.d2-carousel-card'));
  }

  // 3. BUILD PAGINATION DOTS
  function buildPaginationDots() {
    if (!paginationEl) return;
    paginationEl.innerHTML = '';
    AWARDS_DATA.forEach((award, index) => {
      const dot = document.createElement('button');
      dot.className = `d2-page-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Navigate to ${award.title}`);
      dot.addEventListener('click', () => updateActiveAward(index, true));
      paginationEl.appendChild(dot);
    });
  }

  // 4. CURVED 3D CAROUSEL POSITIONING
  function updateCarouselPositions() {
    const N = AWARDS_DATA.length;

    cardsNodeList.forEach((card, i) => {
      // Calculate shortest distance in circular loop
      let diff = i - currentIndex;
      if (diff > N / 2) diff -= N;
      if (diff < -N / 2) diff += N;

      const absDiff = Math.abs(diff);

      card.classList.toggle('active-card', diff === 0);

      if (diff === 0) {
        // Active center card
        card.style.transform = `translateX(0px) translateZ(0px) scale(1.14) rotateY(0deg)`;
        card.style.opacity = '1';
        card.style.zIndex = '25';
        card.style.pointerEvents = 'auto';
      } else if (absDiff === 1) {
        // Immediate neighbors
        const dir = diff > 0 ? 1 : -1;
        const tx = dir * 235;
        const rotY = dir * -16;
        card.style.transform = `translateX(${tx}px) translateZ(-75px) scale(0.92) rotateY(${rotY}deg)`;
        card.style.opacity = '0.85';
        card.style.zIndex = '18';
        card.style.pointerEvents = 'auto';
      } else if (absDiff === 2) {
        // Second tier
        const dir = diff > 0 ? 1 : -1;
        const tx = dir * 420;
        const rotY = dir * -28;
        card.style.transform = `translateX(${tx}px) translateZ(-160px) scale(0.80) rotateY(${rotY}deg)`;
        card.style.opacity = '0.6';
        card.style.zIndex = '12';
        card.style.pointerEvents = 'auto';
      } else if (absDiff === 3) {
        // Third tier
        const dir = diff > 0 ? 1 : -1;
        const tx = dir * 560;
        const rotY = dir * -38;
        card.style.transform = `translateX(${tx}px) translateZ(-240px) scale(0.70) rotateY(${rotY}deg)`;
        card.style.opacity = '0.28';
        card.style.zIndex = '8';
        card.style.pointerEvents = 'auto';
      } else {
        // Offscreen / hidden
        const dir = diff > 0 ? 1 : -1;
        card.style.transform = `translateX(${dir * 680}px) translateZ(-320px) scale(0.6) rotateY(${dir * -45}deg)`;
        card.style.opacity = '0';
        card.style.zIndex = '1';
        card.style.pointerEvents = 'none';
      }
    });

    // Update pagination dots
    if (paginationEl) {
      const dots = paginationEl.querySelectorAll('.d2-page-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }
  }

  // 5. UPDATE ACTIVE AWARD (SYNC FEATURED PANEL & PODIUM PULSE)
  function updateActiveAward(newIndex, animate = true) {
    if (newIndex < 0) newIndex = AWARDS_DATA.length - 1;
    if (newIndex >= AWARDS_DATA.length) newIndex = 0;

    currentIndex = newIndex;
    const award = AWARDS_DATA[currentIndex];

    updateCarouselPositions();

    // Trigger Podium light pulse
    if (podiumPulseEl && animate) {
      podiumPulseEl.classList.remove('active-pulse');
      // Reflow to restart animation
      void podiumPulseEl.offsetWidth;
      podiumPulseEl.classList.add('active-pulse');
      setTimeout(() => {
        if (podiumPulseEl) podiumPulseEl.classList.remove('active-pulse');
      }, 700);
    }

    // Update Featured Panel with smooth sheen and fade
    if (featuredPanelEl) {
      const sheen = featuredPanelEl.querySelector('.d2-panel-sheen');
      if (sheen && animate) {
        sheen.classList.remove('sweep');
        void sheen.offsetWidth;
        sheen.classList.add('sweep');
      }

      // Check group credentials (ReactJS, WordPress, SMM)
      const groupAwards = award.group ? AWARDS_DATA.filter(a => a.group === award.group && a.type !== 'pdf') : [];
      const hasMultipleCredentials = groupAwards.length > 1;

      let credHtml = '';
      if (hasMultipleCredentials) {
        credHtml = `
          <div class="d2-credential-switch" role="tablist" aria-label="Award Credentials">
            ${groupAwards.map(ga => `
              <button type="button" class="d2-cred-btn ${ga.id === award.id ? 'active' : ''}" data-award-id="${ga.id}">
                ${ga.type.charAt(0).toUpperCase() + ga.type.slice(1)}
              </button>
            `).join('')}
          </div>
        `;
      }

      const visualHtml = award.type === 'pdf' ? `
        <div class="d2-featured-visual-box dark-box" data-action="open-lightbox" title="Click to preview PDF Certificate">
          <div class="d2-featured-pdf-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span>OFFICIAL PDF</span>
          </div>
        </div>
      ` : `
        <div class="d2-featured-visual-box ${award.lightBg ? '' : 'dark-box'}" data-action="open-lightbox" title="Click to view full certificate">
          <img src="${award.img}" alt="${award.title}" class="d2-featured-img" />
        </div>
      `;

      featuredPanelEl.innerHTML = `
        <div class="d2-panel-sheen"></div>
        <div class="d2-featured-layout">
          <div class="d2-featured-info">
            <div class="d2-featured-tag-row">
              <span class="d2-featured-tag">
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                ${award.pill}
              </span>
              <span class="d2-featured-tag">${award.category}</span>
            </div>
            <h3 class="d2-featured-title">${award.title}</h3>
            <div class="d2-featured-org">
              <span>${award.org}</span>
              ${award.location ? `<span>&bull; ${award.location}</span>` : ''}
            </div>
            <p class="d2-featured-desc">${award.desc}</p>
            ${credHtml}
            <a href="${award.verifyUrl}" target="${award.verifyUrl.startsWith('http') || award.verifyUrl.endsWith('.pdf') ? '_blank' : '_self'}" rel="noopener noreferrer" class="d2-featured-cta">
              <span>${award.ctaText}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"></path></svg>
            </a>
          </div>
          ${visualHtml}
        </div>
      `;

      // Attach credential switcher events
      if (hasMultipleCredentials) {
        const credBtns = featuredPanelEl.querySelectorAll('.d2-cred-btn');
        credBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetId = btn.getAttribute('data-award-id');
            const targetIndex = AWARDS_DATA.findIndex(a => a.id === targetId);
            if (targetIndex !== -1) {
              updateActiveAward(targetIndex, true);
            }
          });
        });
      }

      // Attach visual box click to open lightbox
      const visualBox = featuredPanelEl.querySelector('[data-action="open-lightbox"]');
      if (visualBox) {
        visualBox.addEventListener('click', () => openLightbox(award));
      }
    }
  }

  // 6. SETUP CONTROLS (ARROWS, KEYBOARD, TOUCH SWIPE)
  function setupControls() {
    const prevBtn = sectionEl.querySelector('.d2-carousel-nav-btn.prev-btn');
    const nextBtn = sectionEl.querySelector('.d2-carousel-nav-btn.next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        updateActiveAward(currentIndex - 1, true);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        updateActiveAward(currentIndex + 1, true);
      });
    }

    // Keyboard navigation when section is in view
    window.addEventListener('keydown', (e) => {
      if (sectionEl.offsetParent === null) return; // not visible
      const rect = sectionEl.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowLeft') {
        updateActiveAward(currentIndex - 1, true);
      } else if (e.key === 'ArrowRight') {
        updateActiveAward(currentIndex + 1, true);
      }
    });

    // Touch swipe support on track
    let touchStartX = 0;
    let touchEndX = 0;

    trackEl.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    trackEl.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 45) {
        if (swipeDistance < 0) {
          updateActiveAward(currentIndex + 1, true);
        } else {
          updateActiveAward(currentIndex - 1, true);
        }
      }
    }
  }

  // 7. MOUSE PARALLAX INTERACTION
  function setupMouseParallax() {
    if (!sectionEl || !trophyWrapperEl) return;

    sectionEl.addEventListener('mousemove', (e) => {
      const rect = sectionEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const rotY = x * 14;
      const rotX = -y * 10;
      const transX = x * 12;

      trophyWrapperEl.style.transform = `translate3d(${transX}px, 0, 0) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
    });

    sectionEl.addEventListener('mouseleave', () => {
      trophyWrapperEl.style.transform = `translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)`;
    });
  }

  // 8. ANIMATED STATS COUNTER
  function setupStatsCounter() {
    const statsContainer = sectionEl.querySelector('.d2-stats-row');
    if (!statsContainer) return;

    let hasCounted = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasCounted) {
          hasCounted = true;
          animateStatNumbers();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsContainer);

    function animateStatNumbers() {
      const numbers = statsContainer.querySelectorAll('.d2-stat-number');
      numbers.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        let count = 0;
        const duration = 1200;
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          count = Math.floor(easeProgress * target);
          el.textContent = `${count}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = `${target}${suffix}`;
          }
        }
        requestAnimationFrame(updateCount);
      });
    }
  }

  // 9. LIGHTBOX VIEWER
  function setupLightbox() {
    if (!lightboxEl) return;

    const closeBtn = lightboxEl.querySelector('.d2-lightbox-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }

    lightboxEl.addEventListener('click', (e) => {
      if (e.target === lightboxEl) {
        closeLightbox();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxEl.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  function openLightbox(award) {
    if (!lightboxEl) return;

    const titleEl = lightboxEl.querySelector('.d2-lightbox-title');
    const subtitleEl = lightboxEl.querySelector('.d2-lightbox-subtitle');
    const bodyEl = lightboxEl.querySelector('.d2-lightbox-body');
    const actionsEl = lightboxEl.querySelector('.d2-lightbox-actions');

    if (titleEl) titleEl.textContent = award.title;
    if (subtitleEl) subtitleEl.textContent = `${award.org} — ${award.pill}`;

    if (bodyEl) {
      if (award.type === 'pdf') {
        bodyEl.innerHTML = `
          <iframe src="${award.pdfUrl}#toolbar=1&navpanes=0" class="d2-lightbox-pdf-frame" title="PDF Document Viewer"></iframe>
        `;
      } else {
        bodyEl.innerHTML = `
          <img src="${award.img}" alt="${award.title}" class="d2-lightbox-preview-img" />
        `;
      }
    }

    if (actionsEl) {
      actionsEl.innerHTML = `
        <a href="${award.verifyUrl}" target="_blank" rel="noopener noreferrer" class="d2-lightbox-btn btn-gold">
          <span>${award.ctaText}</span>
        </a>
        ${award.type === 'pdf' ? `
          <a href="${award.pdfUrl}" download class="d2-lightbox-btn btn-ghost">
            <span>Download PDF</span>
          </a>
        ` : ''}
      `;
    }

    lightboxEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxEl) return;
    lightboxEl.classList.remove('active');
    document.body.style.overflow = '';
  }

  // 10. EXPOSE GLOBAL HOOK FOR DESIGN SWITCHER
  window.initHallOfExcellence = initHallOfExcellence;

  // AUTO-INIT ON DOM READY
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initHallOfExcellence();
    });
  } else {
    initHallOfExcellence();
  }

})();
