/**
 * INTERACTIVE VOLUMETRIC AWARDS EXHIBITION
 * Master Featured Showcase, 3D Perspective Curved Deck, Credential Selector,
 * Filter Pills, Touch Swipe, Mouse Parallax & Fullscreen Lightbox.
 */

(function () {
  'use strict';

  // 1. ALL 12 AWARDS DATABASE
  const AWARDS_DATA = [
    {
      id: 'designrush-top',
      title: 'Top Web Development Company 2025',
      org: 'DesignRush Global Network',
      pill: '2025 RECOGNIZED',
      category: 'DesignRush',
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
      category: 'Star of Excellence',
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
      category: 'PDF Certificate',
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
      category: 'TechBehemoths 2025',
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
      category: 'TechBehemoths 2025',
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
      category: 'TechBehemoths 2025',
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
      category: 'TechBehemoths 2025',
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
      category: 'TechBehemoths 2025',
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
      category: 'TechBehemoths 2025',
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
      category: 'TechBehemoths 2025',
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
      category: 'TechBehemoths 2025',
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
      category: 'TechBehemoths 2025',
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
  let stageEl, trackEl, cardsList = [], paginationEl, featuredStageEl, lightboxEl;

  // 2. INITIALIZE
  function initInteractiveAwards() {
    stageEl = document.getElementById('interactiveAwardsStage');
    if (!stageEl) return;

    trackEl = stageEl.querySelector('.aw-deck-track');
    paginationEl = stageEl.querySelector('.aw-pagination-dots');
    featuredStageEl = stageEl.querySelector('.aw-featured-hero-stage');
    lightboxEl = document.getElementById('awLightbox');

    if (!trackEl) return;

    buildCarousel();
    buildPagination();
    setupFilters();
    setupControls();
    setupParallaxTilt();
    setupLightbox();

    // Default to first award
    selectAward(0, false);
  }

  // 3. BUILD CAROUSEL
  function buildCarousel() {
    trackEl.innerHTML = '';
    AWARDS_DATA.forEach((award, index) => {
      const card = document.createElement('div');
      card.className = 'aw-carousel-card';
      card.setAttribute('data-index', index);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${award.title} by ${award.org}`);

      card.innerHTML = `
        <span class="aw-card-pill">${award.pill}</span>
        <div class="aw-card-media ${award.lightBg ? 'light-media' : ''}">
          ${award.type === 'pdf' ? `
            <div class="aw-pdf-icon-badge">
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
            <img src="${award.img}" alt="${award.title}" loading="lazy" />
          `}
        </div>
        <div class="aw-card-info">
          <h4 class="aw-card-title">${award.title}</h4>
          <span class="aw-card-org">${award.org}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        if (currentIndex !== index) {
          selectAward(index, true);
        } else {
          openLightbox(award);
        }
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectAward(index, true);
        }
      });

      trackEl.appendChild(card);
    });

    cardsList = Array.from(trackEl.querySelectorAll('.aw-carousel-card'));
  }

  // 4. BUILD PAGINATION
  function buildPagination() {
    if (!paginationEl) return;
    paginationEl.innerHTML = '';
    AWARDS_DATA.forEach((award, index) => {
      const dot = document.createElement('button');
      dot.className = `aw-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Navigate to ${award.title}`);
      dot.addEventListener('click', () => selectAward(index, true));
      paginationEl.appendChild(dot);
    });
  }

  // 5. UPDATE 3D PERSPECTIVE CAROUSEL
  function updateCarouselPositions() {
    const N = AWARDS_DATA.length;

    cardsList.forEach((card, i) => {
      let diff = i - currentIndex;
      if (diff > N / 2) diff -= N;
      if (diff < -N / 2) diff += N;

      const absDiff = Math.abs(diff);
      card.classList.toggle('active-card', diff === 0);

      if (diff === 0) {
        card.style.transform = `translateX(0px) translateZ(0px) scale(1.15) rotateY(0deg)`;
        card.style.opacity = '1';
        card.style.zIndex = '25';
        card.style.pointerEvents = 'auto';
      } else if (absDiff === 1) {
        const dir = diff > 0 ? 1 : -1;
        const tx = dir * 230;
        const rotY = dir * -16;
        card.style.transform = `translateX(${tx}px) translateZ(-75px) scale(0.92) rotateY(${rotY}deg)`;
        card.style.opacity = '0.85';
        card.style.zIndex = '18';
        card.style.pointerEvents = 'auto';
      } else if (absDiff === 2) {
        const dir = diff > 0 ? 1 : -1;
        const tx = dir * 415;
        const rotY = dir * -28;
        card.style.transform = `translateX(${tx}px) translateZ(-160px) scale(0.80) rotateY(${rotY}deg)`;
        card.style.opacity = '0.6';
        card.style.zIndex = '12';
        card.style.pointerEvents = 'auto';
      } else if (absDiff === 3) {
        const dir = diff > 0 ? 1 : -1;
        const tx = dir * 560;
        const rotY = dir * -38;
        card.style.transform = `translateX(${tx}px) translateZ(-240px) scale(0.70) rotateY(${rotY}deg)`;
        card.style.opacity = '0.28';
        card.style.zIndex = '8';
        card.style.pointerEvents = 'auto';
      } else {
        const dir = diff > 0 ? 1 : -1;
        card.style.transform = `translateX(${dir * 680}px) translateZ(-320px) scale(0.6) rotateY(${dir * -45}deg)`;
        card.style.opacity = '0';
        card.style.zIndex = '1';
        card.style.pointerEvents = 'none';
      }
    });

    if (paginationEl) {
      const dots = paginationEl.querySelectorAll('.aw-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }
  }

  // 6. SELECT AWARD & SYNC MASTER STAGE
  function selectAward(newIndex, animate = true) {
    if (newIndex < 0) newIndex = AWARDS_DATA.length - 1;
    if (newIndex >= AWARDS_DATA.length) newIndex = 0;

    currentIndex = newIndex;
    const award = AWARDS_DATA[currentIndex];

    updateCarouselPositions();

    if (featuredStageEl) {
      const sheen = featuredStageEl.querySelector('.aw-panel-sheen');
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
          <div class="aw-credential-switch" role="tablist" aria-label="Award Credentials">
            ${groupAwards.map(ga => `
              <button type="button" class="aw-cred-btn ${ga.id === award.id ? 'active' : ''}" data-award-id="${ga.id}">
                ${ga.type.charAt(0).toUpperCase() + ga.type.slice(1)}
              </button>
            `).join('')}
          </div>
        `;
      }

      const visualHtml = award.type === 'pdf' ? `
        <div class="aw-featured-visual-box" data-action="open-lightbox" title="Click to preview PDF Certificate">
          <div class="aw-pdf-icon-badge">
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
        <div class="aw-featured-visual-box ${award.lightBg ? 'light-box' : ''}" data-action="open-lightbox" title="Click to view full certificate">
          <img src="${award.img}" alt="${award.title}" class="aw-featured-img" />
        </div>
      `;

      featuredStageEl.innerHTML = `
        <div class="aw-panel-sheen"></div>
        <div class="aw-featured-grid">
          <div class="aw-featured-info">
            <div class="aw-featured-tag-row">
              <span class="aw-featured-pill">
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                ${award.pill}
              </span>
              <span class="aw-featured-pill">${award.category}</span>
            </div>
            <h3 class="aw-featured-title">${award.title}</h3>
            <div class="aw-featured-org">
              <span>${award.org}</span>
              ${award.location ? `<span>&bull; ${award.location}</span>` : ''}
            </div>
            <p class="aw-featured-desc">${award.desc}</p>
            ${credHtml}
            <div class="aw-actions-row">
              <a href="${award.verifyUrl}" target="${award.verifyUrl.startsWith('http') || award.verifyUrl.endsWith('.pdf') ? '_blank' : '_self'}" rel="noopener noreferrer" class="aw-btn-primary">
                <span>${award.ctaText}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"></path></svg>
              </a>
              <button type="button" class="aw-btn-secondary" data-action="open-lightbox">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                <span>Fullscreen View</span>
              </button>
            </div>
          </div>
          <div class="aw-featured-visual-wrapper">
            ${visualHtml}
          </div>
        </div>
      `;

      // Attach credential switcher events
      if (hasMultipleCredentials) {
        const credBtns = featuredStageEl.querySelectorAll('.aw-cred-btn');
        credBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetId = btn.getAttribute('data-award-id');
            const targetIndex = AWARDS_DATA.findIndex(a => a.id === targetId);
            if (targetIndex !== -1) {
              selectAward(targetIndex, true);
            }
          });
        });
      }

      // Attach visual box click to open lightbox
      featuredStageEl.querySelectorAll('[data-action="open-lightbox"]').forEach(el => {
        el.addEventListener('click', () => openLightbox(award));
      });
    }

    // Sync filter pills active state
    if (stageEl) {
      const filterPills = stageEl.querySelectorAll('.aw-filter-pill');
      filterPills.forEach(pill => {
        const targetCategory = pill.getAttribute('data-category');
        if (targetCategory === 'all') {
          pill.classList.toggle('active', false);
        } else {
          pill.classList.toggle('active', award.category === targetCategory);
        }
      });
    }
  }

  // 7. CATEGORY FILTERS
  function setupFilters() {
    if (!stageEl) return;
    const filterPills = stageEl.querySelectorAll('.aw-filter-pill');
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const targetCategory = pill.getAttribute('data-category');
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        if (targetCategory === 'all') {
          selectAward(0, true);
        } else {
          const matchIndex = AWARDS_DATA.findIndex(a => a.category === targetCategory);
          if (matchIndex !== -1) {
            selectAward(matchIndex, true);
          }
        }
      });
    });
  }

  // 8. CONTROLS (ARROWS, KEYBOARD, TOUCH SWIPE)
  function setupControls() {
    const prevBtn = stageEl.querySelector('.aw-nav-btn.prev-btn');
    const nextBtn = stageEl.querySelector('.aw-nav-btn.next-btn');

    if (prevBtn) prevBtn.addEventListener('click', () => selectAward(currentIndex - 1, true));
    if (nextBtn) nextBtn.addEventListener('click', () => selectAward(currentIndex + 1, true));

    window.addEventListener('keydown', (e) => {
      if (stageEl.offsetParent === null) return;
      const rect = stageEl.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowLeft') selectAward(currentIndex - 1, true);
      else if (e.key === 'ArrowRight') selectAward(currentIndex + 1, true);
    });

    // Touch Swipe on track
    let touchStartX = 0;
    let touchEndX = 0;

    trackEl.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    trackEl.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX - touchStartX > 45) {
        selectAward(currentIndex - 1, true);
      } else if (touchStartX - touchEndX > 45) {
        selectAward(currentIndex + 1, true);
      }
    }, { passive: true });
  }

  // 9. 3D MOUSE PARALLAX
  function setupParallaxTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    stageEl.addEventListener('mousemove', (e) => {
      const activeVisual = stageEl.querySelector('.aw-featured-visual-box');
      if (!activeVisual) return;

      const rect = activeVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const rotY = x * 14;
      const rotX = -y * 12;

      activeVisual.style.transform = `perspective(800px) rotateY(${rotY.toFixed(1)}deg) rotateX(${rotX.toFixed(1)}deg) scale(1.02)`;
    });

    stageEl.addEventListener('mouseleave', () => {
      const activeVisual = stageEl.querySelector('.aw-featured-visual-box');
      if (activeVisual) {
        activeVisual.style.transform = `perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)`;
      }
    });
  }

  // 10. LIGHTBOX VIEWER
  function setupLightbox() {
    if (!lightboxEl) return;

    const closeBtn = lightboxEl.querySelector('.aw-lightbox-close');
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    lightboxEl.addEventListener('click', (e) => {
      if (e.target === lightboxEl) closeLightbox();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxEl.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  function openLightbox(award) {
    if (!lightboxEl) return;

    const titleEl = lightboxEl.querySelector('.aw-lightbox-title');
    const subtitleEl = lightboxEl.querySelector('.aw-lightbox-subtitle');
    const bodyEl = lightboxEl.querySelector('.aw-lightbox-body');
    const actionsEl = lightboxEl.querySelector('.aw-lightbox-actions');

    if (titleEl) titleEl.textContent = award.title;
    if (subtitleEl) subtitleEl.textContent = `${award.org} — ${award.pill}`;

    if (bodyEl) {
      if (award.type === 'pdf') {
        bodyEl.innerHTML = `
          <iframe src="${award.pdfUrl}#toolbar=1&navpanes=0" class="aw-lightbox-pdf-frame" title="PDF Document Viewer"></iframe>
        `;
      } else {
        bodyEl.innerHTML = `
          <img src="${award.img}" alt="${award.title}" class="aw-lightbox-preview-img" />
        `;
      }
    }

    if (actionsEl) {
      actionsEl.innerHTML = `
        <a href="${award.verifyUrl}" target="_blank" rel="noopener noreferrer" class="aw-btn-primary">
          <span>${award.ctaText}</span>
        </a>
        ${award.type === 'pdf' ? `
          <a href="${award.pdfUrl}" download class="aw-btn-secondary">
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

  // AUTO-INIT ON DOM READY
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInteractiveAwards);
  } else {
    initInteractiveAwards();
  }

})();
