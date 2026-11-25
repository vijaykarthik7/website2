/**
 * DIAGONAL AWARDS EXHIBITION — ANIMATED ZIGZAG SCRIPT
 * Dynamic SVG Curved Connecting Path, Scroll-Driven Stroke Drawing,
 * Credential Switcher, Waypoint Aura & Fullscreen Lightbox Modal.
 */

(function () {
  'use strict';

  function initDiagonalAwards() {
    const timeline = document.querySelector('.aw-zigzag-timeline');
    if (!timeline) return;

    const svgPath = document.getElementById('awZigzagPath');
    const svgCanvas = document.querySelector('.aw-zigzag-svg-canvas');
    const nodes = document.querySelectorAll('.aw-node-anchor');
    const cueBadges = document.querySelectorAll('.aw-path-cue-badge');

    // ----------------------------------------------------
    // 1. CALCULATE AND DRAW CONTINUOUS CURVED PATH
    // ----------------------------------------------------
    function calculateConnectingPath() {
      if (!svgPath || !svgCanvas || nodes.length < 2) return;

      const timelineRect = timeline.getBoundingClientRect();
      const timelineWidth = timelineRect.width;
      const timelineHeight = timelineRect.height;

      svgCanvas.setAttribute('viewBox', `0 0 ${timelineWidth} ${timelineHeight}`);
      svgCanvas.setAttribute('width', timelineWidth);
      svgCanvas.setAttribute('height', timelineHeight);

      const points = [];
      nodes.forEach(node => {
        const nodeRect = node.getBoundingClientRect();
        const x = (nodeRect.left - timelineRect.left) + nodeRect.width / 2;
        const y = (nodeRect.top - timelineRect.top) + nodeRect.height / 2;
        points.push({ x, y });
      });

      if (points.length < 2) return;

      // Start path slightly above first node
      const startY = Math.max(0, points[0].y - 50);
      let d = `M ${points[0].x} ${startY} L ${points[0].x} ${points[0].y}`;

      const midPoints = [];

      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];

        // Cubic bezier control points creating smooth luxury S-curves
        const dy = p2.y - p1.y;
        const cp1x = p1.x;
        const cp1y = p1.y + dy * 0.55;
        const cp2x = p2.x;
        const cp2y = p2.y - dy * 0.55;

        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;

        // Calculate approximate curve midpoint for cue badge (t = 0.5)
        const t = 0.5;
        const midX = (1 - t) ** 3 * p1.x + 3 * (1 - t) ** 2 * t * cp1x + 3 * (1 - t) * t ** 2 * cp2x + t ** 3 * p2.x;
        const midY = (1 - t) ** 3 * p1.y + 3 * (1 - t) ** 2 * t * cp1y + 3 * (1 - t) * t ** 2 * cp2y + t ** 3 * p2.y;
        midPoints.push({ x: midX, y: midY });
      }

      // End path extending down slightly from last node
      const endY = points[points.length - 1].y + 60;
      d += ` L ${points[points.length - 1].x} ${endY}`;

      svgPath.setAttribute('d', d);

      // Position intermediate floating arrow cue badges
      cueBadges.forEach((badge, index) => {
        if (midPoints[index]) {
          badge.style.left = `${midPoints[index].x}px`;
          badge.style.top = `${midPoints[index].y}px`;
          badge.style.display = window.innerWidth > 768 ? 'flex' : 'none';
        }
      });

      // Prepare stroke dash for scroll drawing
      const pathLength = svgPath.getTotalLength();
      svgPath.style.strokeDasharray = pathLength;
      svgPath.style.strokeDashoffset = pathLength;

      updatePathScroll(pathLength);
    }

    // ----------------------------------------------------
    // 2. SCROLL PROGRESS PATH DRAWING
    // ----------------------------------------------------
    function updatePathScroll(totalLen) {
      if (!svgPath || !timeline) return;

      const pathLength = totalLen || svgPath.getTotalLength();
      const rect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Scroll progress through timeline
      const totalDist = rect.height + windowHeight * 0.4;
      const currentDist = windowHeight * 0.7 - rect.top;
      const progress = Math.max(0, Math.min(1, currentDist / totalDist));

      const newOffset = pathLength * (1 - progress);
      svgPath.style.strokeDashoffset = newOffset;

      // Illuminate nodes as scroll reaches them
      nodes.forEach(node => {
        const nodeRect = node.getBoundingClientRect();
        if (nodeRect.top < windowHeight * 0.75) {
          node.classList.add('illuminated');
        } else {
          node.classList.remove('illuminated');
        }
      });
    }

    // GSAP ScrollTrigger integration if available, with robust window scroll fallback
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: timeline,
        start: 'top 80%',
        end: 'bottom 40%',
        scrub: 0.6,
        onUpdate: (self) => {
          if (!svgPath) return;
          const len = svgPath.getTotalLength();
          svgPath.style.strokeDashoffset = len * (1 - self.progress);
        }
      });
    }

    window.addEventListener('scroll', () => updatePathScroll(), { passive: true });
    window.addEventListener('resize', debounce(calculateConnectingPath, 150));

    // Initial path calculation
    setTimeout(calculateConnectingPath, 120);

    // ----------------------------------------------------
    // 3. MULTI-ASSET CREDENTIAL SWITCHER
    // ----------------------------------------------------
    const credTabs = document.querySelectorAll('.aw-cred-tab');
    credTabs.forEach(tab => {
      tab.addEventListener('click', function (e) {
        e.preventDefault();
        const parentTabs = this.closest('.aw-cred-tabs');
        if (parentTabs) {
          parentTabs.querySelectorAll('.aw-cred-tab').forEach(t => t.classList.remove('active'));
        }
        this.classList.add('active');

        const targetItemId = this.getAttribute('data-item');
        const newImgSrc = this.getAttribute('data-img');
        const newPill = this.getAttribute('data-pill');
        const newDesc = this.getAttribute('data-desc');

        const itemEl = document.getElementById(targetItemId);
        if (!itemEl) return;

        // Animate media image change
        const mediaImg = itemEl.querySelector('.aw-media-img');
        if (mediaImg && newImgSrc) {
          mediaImg.style.opacity = '0';
          mediaImg.style.transform = 'scale(0.96)';
          setTimeout(() => {
            mediaImg.src = newImgSrc;
            mediaImg.style.opacity = '1';
            mediaImg.style.transform = 'scale(1)';
          }, 200);
        }

        // Update pill text
        const pillEl = itemEl.querySelector('.aw-media-badge-pill');
        if (pillEl && newPill) {
          pillEl.textContent = newPill;
        }

        // Update description if provided
        const descEl = itemEl.querySelector('.aw-info-desc');
        if (descEl && newDesc) {
          descEl.textContent = newDesc;
        }

        // Update card data attribute for modal
        const mediaCard = itemEl.querySelector('.aw-media-card');
        if (mediaCard && newImgSrc) {
          mediaCard.setAttribute('data-current-img', newImgSrc);
          if (newPill) mediaCard.setAttribute('data-current-pill', newPill);
        }
      });
    });

    // ----------------------------------------------------
    // 4. FULLSCREEN LIGHTBOX & PDF CERTIFICATE MODAL
    // ----------------------------------------------------
    const modal = document.getElementById('awDiagonalModal');
    const modalClose = modal ? modal.querySelector('.aw-modal-close-btn') : null;
    const modalImg = modal ? modal.querySelector('.aw-modal-img') : null;
    const modalPdf = modal ? modal.querySelector('.aw-modal-pdf-frame') : null;
    const modalTitle = modal ? modal.querySelector('.aw-modal-title') : null;
    const modalSub = modal ? modal.querySelector('.aw-modal-subtitle') : null;
    const modalCta = modal ? modal.querySelector('.aw-modal-cta') : null;

    function openModal(data) {
      if (!modal) return;

      if (modalTitle) modalTitle.textContent = data.title || 'Official Recognition';
      if (modalSub) modalSub.textContent = data.org || 'Riyadvi Software Technologies';

      if (data.isPdf) {
        if (modalImg) modalImg.style.display = 'none';
        if (modalPdf) {
          modalPdf.style.display = 'block';
          modalPdf.src = data.pdfUrl || 'assets/awards/Official_Certificate_of_Excellence_TechBehemoths_Global_Awards_2025.pdf';
        }
        if (modalCta) {
          modalCta.href = data.pdfUrl || 'assets/awards/Official_Certificate_of_Excellence_TechBehemoths_Global_Awards_2025.pdf';
          modalCta.textContent = 'Download Official Certificate (PDF) ↗';
        }
      } else {
        if (modalPdf) {
          modalPdf.style.display = 'none';
          modalPdf.src = '';
        }
        if (modalImg) {
          modalImg.style.display = 'block';
          modalImg.src = data.imgSrc || '';
          modalImg.alt = data.title || 'Award Image';
        }
        if (modalCta) {
          modalCta.href = data.verifyUrl || 'https://techbehemoths.com/company/riyadvi-software-technologies-private-limited';
          modalCta.textContent = data.verifyText || 'Verify Official Recognition ↗';
        }
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (modalPdf) modalPdf.src = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeModal();
      }
    });

    // Attach click listeners to all media cards & inspect buttons
    document.querySelectorAll('.aw-media-card').forEach(card => {
      card.addEventListener('click', function () {
        const item = this.closest('.aw-zigzag-item');
        const imgSrc = this.getAttribute('data-current-img') || (this.querySelector('.aw-media-img') ? this.querySelector('.aw-media-img').src : '');
        const title = item ? (item.querySelector('.aw-info-title') ? item.querySelector('.aw-info-title').textContent : '') : '';
        const org = item ? (item.querySelector('.aw-info-org') ? item.querySelector('.aw-info-org').textContent : '') : '';
        const verifyLink = item ? (item.querySelector('.aw-link-primary') ? item.querySelector('.aw-link-primary').href : '') : '';

        const isPdf = this.getAttribute('data-is-pdf') === 'true';
        const pdfUrl = this.getAttribute('data-pdf-url') || '';

        openModal({
          title,
          org,
          imgSrc,
          isPdf,
          pdfUrl,
          verifyUrl: verifyLink,
          verifyText: isPdf ? 'Open PDF in New Tab ↗' : 'Verify Official Recognition ↗'
        });
      });
    });

    document.querySelectorAll('.aw-btn-inspect').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const item = this.closest('.aw-zigzag-item');
        if (!item) return;
        const card = item.querySelector('.aw-media-card');
        if (card) card.click();
      });
    });

    // Smooth scroll for cue button
    const cueBtn = document.querySelector('.aw-diag-cue');
    if (cueBtn) {
      cueBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const firstItem = document.querySelector('.aw-zigzag-item');
        if (firstItem) {
          firstItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }
  }

  // Utility Debounce
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDiagonalAwards);
  } else {
    initDiagonalAwards();
  }
})();
