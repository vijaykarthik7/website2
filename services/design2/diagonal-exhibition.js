/**
 * DIAGONAL AWARD EXHIBITION — ANIMATED ZIGZAG LAYOUT (DESIGN 2 PROTOTYPE)
 * Dynamic SVG Bezier Connecting Path, ScrollTrigger Path Drawing,
 * Alternating Award Reveals, Credential Selectors, Lightbox Modal.
 */

(function () {
  'use strict';

  // 1. EXHIBITION DATA SOURCE
  const EXHIBITION_DATA = [
    {
      id: 'award-01',
      index: '01 — RECOGNITION',
      year: '2021',
      tag: 'Ceremony Photo',
      title: 'Star of Excellence Award',
      org: 'National Integrity Cultural Academy & The Peaks',
      desc: 'Prestigious stage presentation at TR Rajarathinam Kalai Arangam honoring Thiru. R. Bhoopathy for pioneering leadership in enterprise software innovation and business excellence.',
      location: 'Chennai, India',
      type: 'photo',
      img: 'assets/awards/award_star_excellence_ceremony.jpg',
      verifyUrl: '#',
      ctaText: 'View recognition ↗',
      lightPlate: false
    },
    {
      id: 'award-02',
      index: '02 — RECOGNITION',
      year: '2025',
      tag: 'Recognition',
      title: 'Top Web Development Company',
      org: 'DesignRush Global Network',
      desc: '“We are proud to be featured on DesignRush for our outstanding work.” Accredited as a premier agency delivering high-performance enterprise web architectures.',
      location: 'Global Accreditation',
      type: 'badge',
      img: 'assets/awards/award_designrush_2025.png',
      verifyUrl: 'https://www.designrush.com',
      ctaText: 'View recognition ↗',
      lightPlate: true
    },
    {
      id: 'award-03',
      index: '03 — RECOGNITION',
      year: '2025',
      tag: 'Official PDF Certificate',
      title: 'Official Certificate of Excellence',
      org: 'TechBehemoths Berlin, Germany',
      desc: 'Complete official verified PDF certification document honoring Riyadvi across WordPress, ReactJS, and Social Media Marketing (SMM) verticals.',
      location: 'Berlin, Germany',
      type: 'pdf',
      img: 'assets/awards/award_tb_banner_2025.png',
      pdfUrl: 'assets/awards/Official_Certificate_of_Excellence_TechBehemoths_Global_Awards_2025.pdf',
      verifyUrl: 'assets/awards/Official_Certificate_of_Excellence_TechBehemoths_Global_Awards_2025.pdf',
      ctaText: 'Open Official PDF ↗',
      lightPlate: false
    },
    {
      id: 'award-04',
      index: '04 — RECOGNITION',
      year: '2025',
      tag: 'Winner Recognition',
      title: 'ReactJS Engineering Excellence',
      org: 'TechBehemoths Berlin, Germany',
      type: 'multi',
      activeCredIndex: 0,
      credentials: [
        {
          label: 'Badge',
          title: 'Award Winner 2025 — ReactJS Badge',
          desc: 'Official 2025 Winner badge in India for excellence in ReactJS web applications, modern component architecture, and top Lighthouse scores.',
          img: 'assets/awards/award_tb_reactjs_2025_badge.png',
          verifyUrl: 'https://techbehemoths.com/company/riyadvi-software-technologies-private-limited',
          ctaText: 'Verify ReactJS Award ↗'
        },
        {
          label: 'Laurel',
          title: 'ReactJS — 2025 Winner Laurel',
          desc: 'Gold laurel insignia certifying Riyadvi Software Technologies as a premier ReactJS engineering company across India.',
          img: 'assets/awards/award_tb_reactjs_laurel.png',
          verifyUrl: 'https://techbehemoths.com/company/riyadvi-software-technologies-private-limited',
          ctaText: 'Verify ReactJS Laurel ↗'
        },
        {
          label: 'Certificate',
          title: 'Winner ReactJS 2025 — Certificate',
          desc: 'Official celebration certificate proclaiming Riyadvi Software Technologies an Award-Winning Company in India for ReactJS Services.',
          img: 'assets/awards/award_tb_reactjs_winner_poster.png',
          verifyUrl: 'https://techbehemoths.com/company/riyadvi-software-technologies-private-limited',
          ctaText: 'View ReactJS Certificate ↗'
        }
      ]
    },
    {
      id: 'award-05',
      index: '05 — RECOGNITION',
      year: '2025',
      tag: 'Winner Recognition',
      title: 'WordPress Solutions Excellence',
      org: 'TechBehemoths Berlin, Germany',
      type: 'multi',
      activeCredIndex: 0,
      credentials: [
        {
          label: 'Badge',
          title: 'Award Winner 2025 — WordPress Badge',
          desc: 'Official 2025 Winner badge in India for enterprise WordPress solutions, bespoke theme architecture, and headless CMS integrations.',
          img: 'assets/awards/award_tb_wordpress_2025_badge.png',
          verifyUrl: 'https://techbehemoths.com/company/riyadvi-software-technologies-private-limited',
          ctaText: 'Verify WordPress Award ↗'
        },
        {
          label: 'Laurel',
          title: 'WordPress — 2025 Winner Laurel',
          desc: 'Gold laurel insignia certifying Riyadvi Software Technologies as a premier WordPress engineering and theme architecture agency.',
          img: 'assets/awards/award_tb_wordpress_laurel.png',
          verifyUrl: 'https://techbehemoths.com/company/riyadvi-software-technologies-private-limited',
          ctaText: 'Verify WordPress Laurel ↗'
        },
        {
          label: 'Certificate',
          title: 'Winner WordPress 2025 — Certificate',
          desc: 'Official celebration certificate proclaiming Riyadvi Software Technologies an Award-Winning Company in India for WordPress Services.',
          img: 'assets/awards/award_tb_wordpress_winner_poster.png',
          verifyUrl: 'https://techbehemoths.com/company/riyadvi-software-technologies-private-limited',
          ctaText: 'View WordPress Certificate ↗'
        }
      ]
    },
    {
      id: 'award-06',
      index: '06 — RECOGNITION',
      year: '2025',
      tag: 'Winner Recognition',
      title: 'Social Media Marketing Excellence',
      org: 'TechBehemoths Berlin, Germany',
      type: 'multi',
      activeCredIndex: 0,
      credentials: [
        {
          label: 'Badge',
          title: 'Award Badge — SMM — 2025',
          desc: 'Official 2025 Winner badge in India for data-driven Social Media Marketing (SMM), multi-channel brand growth, and audience acquisition.',
          img: 'assets/awards/award_tb_smm_2025_badge.png',
          verifyUrl: 'https://techbehemoths.com/company/riyadvi-software-technologies-private-limited',
          ctaText: 'Verify SMM Award ↗'
        },
        {
          label: 'Laurel',
          title: 'SMM — 2025 Winner Laurel',
          desc: 'Gold laurel insignia certifying Riyadvi Software Technologies as the leading Social Media Marketing company in India.',
          img: 'assets/awards/award_tb_smm_laurel.png',
          verifyUrl: 'https://techbehemoths.com/company/riyadvi-software-technologies-private-limited',
          ctaText: 'Verify SMM Laurel ↗'
        },
        {
          label: 'Certificate',
          title: 'Winner SMM 2025 — Certificate',
          desc: 'Official celebration certificate proclaiming Riyadvi Software Technologies an Award-Winning Company in India for SMM Services.',
          img: 'assets/awards/award_tb_smm_winner_poster.png',
          verifyUrl: 'https://techbehemoths.com/company/riyadvi-software-technologies-private-limited',
          ctaText: 'View SMM Certificate ↗'
        }
      ]
    }
  ];

  // DOM Elements
  let sectionEl, bodyEl, svgEl, pathBgEl, pathAnimEl, progressBarFillEl, lightboxEl;
  let scrollTriggerInstance = null;
  let pathTotalLength = 0;
  let isInitialized = false;

  // 2. INITIALIZATION
  function initDiagonalExhibition() {
    sectionEl = document.getElementById('awardsDesign2');
    if (!sectionEl) return;

    bodyEl = sectionEl.querySelector('.d2-exhibition-body');
    svgEl = sectionEl.querySelector('.d2-connecting-svg');
    pathBgEl = sectionEl.querySelector('.d2-path-bg');
    pathAnimEl = sectionEl.querySelector('.d2-path-animated');
    progressBarFillEl = sectionEl.querySelector('.d2-scroll-progress-fill');
    lightboxEl = document.getElementById('d2AwardLightbox');

    if (!bodyEl) return;

    renderExhibitionItems();
    setupLightbox();
    setupDiscoverLink();

    // Calculate initial path and setup ScrollTrigger
    requestAnimationFrame(() => {
      recalculatePath();
      setupScrollAnimations();
      setupNodeInteractions();
      setupParallaxHover();
    });

    // Resize observer to re-calculate path on layout shifts
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => {
        if (sectionEl.offsetParent !== null) {
          recalculatePath();
          if (window.ScrollTrigger) ScrollTrigger.refresh();
        }
      });
      ro.observe(bodyEl);
    }

    isInitialized = true;
  }

  // 3. RENDER EXHIBITION ITEMS
  function renderExhibitionItems() {
    bodyEl.innerHTML = '';

    EXHIBITION_DATA.forEach((award, idx) => {
      const isOdd = idx % 2 === 0; // 0, 2, 4 -> Odd arrangement (Visual Left, Info Right)
      const itemEl = document.createElement('div');
      itemEl.className = `d2-exhibition-item ${isOdd ? 'odd' : 'even'}`;
      itemEl.id = award.id;
      itemEl.setAttribute('data-index', idx);

      const activeCred = award.type === 'multi' ? award.credentials[award.activeCredIndex] : award;
      const displayTitle = award.type === 'multi' ? activeCred.title : award.title;
      const displayDesc = award.type === 'multi' ? activeCred.desc : award.desc;
      const displayImg = award.type === 'multi' ? activeCred.img : award.img;
      const displayVerify = award.type === 'multi' ? activeCred.verifyUrl : award.verifyUrl;
      const displayCta = award.type === 'multi' ? activeCred.ctaText : award.ctaText;

      // Credential tabs html for multi-credential awards
      let credTabsHtml = '';
      if (award.type === 'multi') {
        credTabsHtml = `
          <div class="d2-credential-tabs" role="tablist" aria-label="${award.title} credentials">
            ${award.credentials.map((c, cIdx) => `
              <button type="button" class="d2-cred-tab ${cIdx === award.activeCredIndex ? 'active' : ''}" data-item-id="${award.id}" data-cred-index="${cIdx}">
                ${c.label}
              </button>
            `).join('')}
          </div>
        `;
      }

      // Visual media inner html
      const visualInnerHtml = award.type === 'pdf' ? `
        <div class="d2-floating-img-frame" data-action="open-lightbox" title="Click to preview official PDF certificate">
          <div class="d2-pdf-visual-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span class="d2-pdf-label">OFFICIAL PDF CERTIFICATE</span>
          </div>
        </div>
      ` : `
        <div class="d2-floating-img-frame ${award.lightPlate ? 'light-plate' : ''}" data-action="open-lightbox" title="Click to view high-resolution certificate">
          <img src="${displayImg}" alt="${displayTitle}" class="d2-award-img" loading="lazy" />
        </div>
      `;

      itemEl.innerHTML = `
        <!-- Visual Column -->
        <div class="d2-item-visual">
          <div class="d2-year-sparkle-group">
            <svg class="d2-sparkle-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"></path>
            </svg>
            <h3 class="d2-big-year">${award.year}</h3>
            <span class="d2-visual-tag">${award.type === 'multi' ? activeCred.label : award.tag}</span>
          </div>
          ${visualInnerHtml}
        </div>

        <!-- Center Node Column -->
        <div class="d2-item-node-col">
          <button type="button" class="d2-connecting-node" data-target-id="${award.id}" aria-label="Navigate to ${award.title}">
            <div class="d2-node-inner"></div>
            <div class="d2-node-tooltip">${award.index} — ${award.title}</div>
          </button>
          ${idx < EXHIBITION_DATA.length - 1 ? `<div class="d2-down-arrow-marker" aria-hidden="true">&darr;</div>` : ''}
        </div>

        <!-- Info Column -->
        <div class="d2-item-info">
          <span class="d2-info-index">${award.index}</span>
          <h4 class="d2-info-title">${displayTitle}</h4>
          <span class="d2-info-org">${award.org}${award.location ? ` &bull; ${award.location}` : ''}</span>
          <p class="d2-info-desc">${displayDesc}</p>
          ${credTabsHtml}
          <a href="${displayVerify}" target="${displayVerify.startsWith('http') || displayVerify.endsWith('.pdf') ? '_blank' : '_self'}" rel="noopener noreferrer" class="d2-info-cta">
            <span>${displayCta}</span>
          </a>
        </div>
      `;

      bodyEl.appendChild(itemEl);
    });

    // Attach credential tab clicks
    bodyEl.querySelectorAll('.d2-cred-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.stopPropagation();
        const itemId = tab.getAttribute('data-item-id');
        const credIdx = parseInt(tab.getAttribute('data-cred-index'), 10);
        switchCredential(itemId, credIdx);
      });
    });

    // Attach lightbox triggers
    bodyEl.querySelectorAll('[data-action="open-lightbox"]').forEach(frame => {
      frame.addEventListener('click', () => {
        const itemEl = frame.closest('.d2-exhibition-item');
        const idx = parseInt(itemEl.getAttribute('data-index'), 10);
        const award = EXHIBITION_DATA[idx];
        const activeCred = award.type === 'multi' ? award.credentials[award.activeCredIndex] : award;
        openLightbox(activeCred, award);
      });
    });
  }

  // 4. SWITCH CREDENTIAL TABS
  function switchCredential(itemId, newCredIndex) {
    const award = EXHIBITION_DATA.find(a => a.id === itemId);
    if (!award || award.type !== 'multi') return;

    award.activeCredIndex = newCredIndex;
    const cred = award.credentials[newCredIndex];
    const itemEl = document.getElementById(itemId);
    if (!itemEl) return;

    // Update tabs
    const tabs = itemEl.querySelectorAll('.d2-cred-tab');
    tabs.forEach((tab, i) => {
      tab.classList.toggle('active', i === newCredIndex);
    });

    // Animate image transition
    const imgEl = itemEl.querySelector('.d2-award-img');
    if (imgEl) {
      imgEl.style.opacity = '0';
      imgEl.style.transform = 'scale(0.96)';
      setTimeout(() => {
        imgEl.src = cred.img;
        imgEl.alt = cred.title;
        imgEl.style.opacity = '1';
        imgEl.style.transform = 'scale(1)';
      }, 150);
    }

    // Update tag
    const tagEl = itemEl.querySelector('.d2-visual-tag');
    if (tagEl) tagEl.textContent = cred.label;

    // Update Title, Desc, CTA
    const titleEl = itemEl.querySelector('.d2-info-title');
    if (titleEl) titleEl.textContent = cred.title;

    const descEl = itemEl.querySelector('.d2-info-desc');
    if (descEl) descEl.textContent = cred.desc;

    const ctaEl = itemEl.querySelector('.d2-info-cta');
    if (ctaEl) {
      ctaEl.href = cred.verifyUrl;
      ctaEl.querySelector('span').textContent = cred.ctaText;
    }

    // Pulse the corresponding node
    const nodeEl = itemEl.querySelector('.d2-connecting-node');
    if (nodeEl) {
      nodeEl.classList.add('active-node');
      setTimeout(() => {
        if (!nodeEl.dataset.inView) nodeEl.classList.remove('active-node');
      }, 600);
    }
  }

  // 5. CALCULATE DYNAMIC SVG BEZIER PATH
  function recalculatePath() {
    if (!svgEl || !bodyEl || !sectionEl) return;

    const svgRect = svgEl.getBoundingClientRect();
    if (svgRect.width === 0 || svgRect.height === 0) return;

    // Header bottom center starting point
    const headerEl = sectionEl.querySelector('.d2-exhibition-header');
    let startPoint = { x: svgRect.width / 2, y: 0 };
    if (headerEl) {
      const hRect = headerEl.getBoundingClientRect();
      startPoint = {
        x: hRect.left + hRect.width / 2 - svgRect.left,
        y: Math.max(0, hRect.bottom - svgRect.top)
      };
    }

    // Get center of each node
    const nodes = Array.from(bodyEl.querySelectorAll('.d2-connecting-node'));
    if (nodes.length === 0) return;

    const points = [startPoint];

    nodes.forEach(node => {
      const nRect = node.getBoundingClientRect();
      points.push({
        x: nRect.left + nRect.width / 2 - svgRect.left,
        y: nRect.top + nRect.height / 2 - svgRect.top
      });
    });

    // Add termination point into Accreditations section
    const accredSection = sectionEl.querySelector('.d2-accreditations-section');
    if (accredSection) {
      const aRect = accredSection.getBoundingClientRect();
      points.push({
        x: aRect.left + aRect.width / 2 - svgRect.left,
        y: aRect.top - svgRect.top + 20
      });
    }

    // Build smooth cubic bezier curve through points
    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const dy = curr.y - prev.y;

      // Smooth diagonal S-curve control points
      const cp1X = prev.x;
      const cp1Y = prev.y + dy * 0.5;
      const cp2X = curr.x;
      const cp2Y = curr.y - dy * 0.5;

      d += ` C ${cp1X.toFixed(1)} ${cp1Y.toFixed(1)}, ${cp2X.toFixed(1)} ${cp2Y.toFixed(1)}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
    }

    if (pathBgEl) pathBgEl.setAttribute('d', d);
    if (pathAnimEl) {
      pathAnimEl.setAttribute('d', d);
      pathTotalLength = pathAnimEl.getTotalLength();
      pathAnimEl.style.strokeDasharray = `${pathTotalLength} ${pathTotalLength}`;
      pathAnimEl.style.strokeDashoffset = `${pathTotalLength}`;
    }
  }

  // 6. GSAP SCROLLTRIGGER ANIMATION
  function setupScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Clean up previous trigger
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
    }

    // Scroll-driven path drawing
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: sectionEl,
      start: 'top 75%',
      end: 'bottom 85%',
      scrub: 0.3,
      onUpdate: (self) => {
        const progress = self.progress;
        if (pathAnimEl && pathTotalLength > 0) {
          const drawLength = pathTotalLength * (1 - progress);
          pathAnimEl.style.strokeDashoffset = drawLength;
        }
        if (progressBarFillEl) {
          progressBarFillEl.style.width = `${(progress * 100).toFixed(1)}%`;
        }
      }
    });

    // Reveal animations for each item
    const items = sectionEl.querySelectorAll('.d2-exhibition-item');
    items.forEach((item, i) => {
      const isOdd = item.classList.contains('odd');
      const visual = item.querySelector('.d2-item-visual');
      const info = item.querySelector('.d2-item-info');
      const node = item.querySelector('.d2-connecting-node');

      // ScrollTrigger for each item
      ScrollTrigger.create({
        trigger: item,
        start: 'top 72%',
        onEnter: () => {
          if (node) {
            node.classList.add('active-node');
            node.dataset.inView = 'true';
          }
        },
        onLeaveBack: () => {
          if (node) {
            node.classList.remove('active-node');
            delete node.dataset.inView;
          }
        }
      });

      // Smooth horizontal reveal
      if (visual && info) {
        gsap.fromTo(visual, 
          { opacity: 0, x: isOdd ? -40 : 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 75%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );

        gsap.fromTo(info,
          { opacity: 0, x: isOdd ? 40 : -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 75%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }
    });
  }

  // 7. NODE CLICK NAVIGATION & DISCOVER LINK
  function setupNodeInteractions() {
    const nodes = sectionEl.querySelectorAll('.d2-connecting-node');
    nodes.forEach(node => {
      node.addEventListener('click', () => {
        const targetId = node.getAttribute('data-target-id');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          if (window.lenis) {
            window.lenis.scrollTo(targetEl, { offset: -80, duration: 1.2 });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });
    });
  }

  function setupDiscoverLink() {
    const discoverLink = sectionEl.querySelector('.d2-header-cta');
    if (discoverLink) {
      discoverLink.addEventListener('click', (e) => {
        e.preventDefault();
        const firstItem = sectionEl.querySelector('.d2-exhibition-item');
        if (firstItem) {
          if (window.lenis) {
            window.lenis.scrollTo(firstItem, { offset: -60, duration: 1.2 });
          } else {
            firstItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    }
  }

  // 8. MOUSE PARALLAX TILT ON HOVER
  function setupParallaxHover() {
    if (window.matchMedia('(pointer: coarse)').matches) return; // Disable on touch

    const frames = sectionEl.querySelectorAll('.d2-floating-img-frame');
    frames.forEach(frame => {
      frame.addEventListener('mousemove', (e) => {
        const rect = frame.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const tiltX = -y * 14;
        const tiltY = x * 14;

        frame.style.transform = `perspective(800px) rotateX(${tiltX.toFixed(1)}deg) rotateY(${tiltY.toFixed(1)}deg) scale(1.03)`;
      });

      frame.addEventListener('mouseleave', () => {
        frame.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }

  // 9. LIGHTBOX MODAL
  function setupLightbox() {
    if (!lightboxEl) return;

    const closeBtn = lightboxEl.querySelector('.d2-lightbox-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }

    lightboxEl.addEventListener('click', (e) => {
      if (e.target === lightboxEl) closeLightbox();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxEl.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  function openLightbox(cred, parentAward) {
    if (!lightboxEl) return;

    const titleEl = lightboxEl.querySelector('.d2-lightbox-title');
    const subtitleEl = lightboxEl.querySelector('.d2-lightbox-subtitle');
    const bodyEl = lightboxEl.querySelector('.d2-lightbox-body');
    const actionsEl = lightboxEl.querySelector('.d2-lightbox-actions');

    if (titleEl) titleEl.textContent = cred.title;
    if (subtitleEl) subtitleEl.textContent = `${parentAward.org} — ${parentAward.year}`;

    if (bodyEl) {
      if (parentAward.type === 'pdf') {
        bodyEl.innerHTML = `
          <iframe src="${parentAward.pdfUrl}#toolbar=1&navpanes=0" class="d2-lightbox-pdf-frame" title="PDF Document Viewer"></iframe>
        `;
      } else {
        bodyEl.innerHTML = `
          <img src="${cred.img}" alt="${cred.title}" class="d2-lightbox-preview-img" />
        `;
      }
    }

    if (actionsEl) {
      actionsEl.innerHTML = `
        <a href="${cred.verifyUrl}" target="_blank" rel="noopener noreferrer" class="d2-lightbox-btn btn-gold">
          <span>${cred.ctaText || 'Verify Recognition ↗'}</span>
        </a>
        ${parentAward.type === 'pdf' ? `
          <a href="${parentAward.pdfUrl}" download class="d2-lightbox-btn btn-ghost">
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

  // 10. EXPOSE GLOBAL HOOK FOR SWITCHER
  window.initDiagonalExhibition = initDiagonalExhibition;

  // AUTO-INIT ON DOM READY
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDiagonalExhibition);
  } else {
    initDiagonalExhibition();
  }

})();
