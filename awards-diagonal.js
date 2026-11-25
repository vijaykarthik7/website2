/**
 * DIAGONAL AWARDS EXHIBITION — ANIMATED ZIGZAG SCRIPT
 * Calculates true full-width diagonal S-curves between Left and Right anchors.
 * Drives real-time path drawing and glowing tracer head on scroll down.
 */

(function () {
  'use strict';

  function initDiagonalExhibition() {
    const timeline = document.querySelector('.aw-zigzag-timeline');
    if (!timeline) return;

    const svgCanvas = document.querySelector('.aw-zigzag-svg-canvas');
    const pathBg = document.getElementById('awZigzagPathBg');
    const pathActive = document.getElementById('awZigzagPathActive');
    const tracerGroup = document.getElementById('awTracerGroup');

    let totalLength = 0;
    let isTicking = false;

    // -----------------------------------------------------------------
    // 1. CALCULATE TRUE WIDE S-CURVE DIAGONAL PATH
    // -----------------------------------------------------------------
    function calculateZigzagPath() {
      if (!svgCanvas || !pathActive || !timeline) return;

      const timelineRect = timeline.getBoundingClientRect();
      const width = timelineRect.width;
      const height = timelineRect.height;

      if (width <= 0 || height <= 0) return;

      svgCanvas.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svgCanvas.setAttribute('width', width);
      svgCanvas.setAttribute('height', height);

      // Collect anchor markers in exact DOM order
      const anchorPoints = [];

      // Start: Top Center
      anchorPoints.push({ x: width / 2, y: 10 });

      // Gather all milestone anchors and intermediate waypoint anchors
      const allAnchors = timeline.querySelectorAll('.aw-anchor-point, .aw-waypoint-anchor');
      allAnchors.forEach(el => {
        const rect = el.getBoundingClientRect();
        const x = (rect.left - timelineRect.left) + rect.width / 2;
        const y = (rect.top - timelineRect.top) + rect.height / 2;
        anchorPoints.push({ x, y });
      });

      // End: Bottom Center
      anchorPoints.push({ x: width / 2, y: height - 10 });

      if (anchorPoints.length < 3) return;

      // Construct smooth continuous cubic bezier curve
      let d = `M ${anchorPoints[0].x} ${anchorPoints[0].y}`;

      for (let i = 0; i < anchorPoints.length - 1; i++) {
        const p1 = anchorPoints[i];
        const p2 = anchorPoints[i + 1];

        const dy = p2.y - p1.y;

        // Smooth vertical tension for natural organic sweeps across the screen
        const cp1x = p1.x;
        const cp1y = p1.y + dy * 0.52;
        const cp2x = p2.x;
        const cp2y = p2.y - dy * 0.52;

        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }

      // Apply to background guide and active drawing paths
      if (pathBg) pathBg.setAttribute('d', d);
      pathActive.setAttribute('d', d);

      // Cache total path length
      totalLength = pathActive.getTotalLength();
      pathActive.style.strokeDasharray = `${totalLength} ${totalLength}`;
      pathActive.style.strokeDashoffset = `${totalLength}`;

      updatePathOnScroll();
    }

    // -----------------------------------------------------------------
    // 2. SCROLL PROGRESS & PATH DRAWING ENGINE
    // -----------------------------------------------------------------
    function updatePathOnScroll() {
      if (!pathActive || totalLength <= 0) return;

      const timelineRect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start drawing when the top of the awards section enters 75% of viewport
      const startTrigger = windowHeight * 0.75;
      // Complete drawing when bottom reaches 35% of viewport
      const endTrigger = windowHeight * 0.35;

      const totalDist = timelineRect.height + (startTrigger - endTrigger);
      const currentScroll = startTrigger - timelineRect.top;

      const progress = Math.max(0, Math.min(1, currentScroll / totalDist));
      const drawnLength = totalLength * progress;

      // Draw active golden stroke
      pathActive.style.strokeDashoffset = `${totalLength - drawnLength}`;

      // Move glowing tracer head along tip of drawn stroke
      if (tracerGroup) {
        if (drawnLength > 8 && drawnLength < totalLength - 4) {
          const point = pathActive.getPointAtLength(drawnLength);
          tracerGroup.setAttribute('transform', `translate(${point.x}, ${point.y})`);
          tracerGroup.style.opacity = '1';
        } else {
          tracerGroup.style.opacity = '0';
        }
      }

      // Activate milestone items as the line passes through them
      const items = timeline.querySelectorAll('.aw-zigzag-item');
      items.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.top < windowHeight * 0.7) {
          item.classList.add('aw-passed');
        } else {
          item.classList.remove('aw-passed');
        }
      });
    }

    function onScrollThrottled() {
      if (!isTicking) {
        requestAnimationFrame(() => {
          updatePathOnScroll();
          isTicking = false;
        });
        isTicking = true;
      }
    }

    // -----------------------------------------------------------------
    // 3. LISTENERS (Lenis, Window Scroll, GSAP, Resize)
    // -----------------------------------------------------------------
    window.addEventListener('scroll', onScrollThrottled, { passive: true });

    // Hook into Lenis if active
    if (window.lenis) {
      window.lenis.on('scroll', onScrollThrottled);
    } else {
      // Check after a brief delay in case Lenis initializes later
      setTimeout(() => {
        if (window.lenis) window.lenis.on('scroll', onScrollThrottled);
      }, 500);
    }

    // GSAP ScrollTrigger hookup if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: timeline,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 0.2,
        onUpdate: () => onScrollThrottled()
      });
    }

    window.addEventListener('resize', debounce(calculateZigzagPath, 150));
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(calculateZigzagPath);
    }

    // Initial calculation with fallbacks for layout settles
    setTimeout(calculateZigzagPath, 150);
    setTimeout(calculateZigzagPath, 600);

    // -----------------------------------------------------------------
    // 4. MULTI-CREDENTIAL TABS SWITCHER
    // -----------------------------------------------------------------
    const credTabs = document.querySelectorAll('.aw-cred-tab');
    credTabs.forEach(tab => {
      tab.addEventListener('click', function (e) {
        e.preventDefault();
        const parent = this.closest('.aw-cred-tabs');
        if (parent) {
          parent.querySelectorAll('.aw-cred-tab').forEach(t => t.classList.remove('active'));
        }
        this.classList.add('active');

        const itemId = this.getAttribute('data-item');
        const newImg = this.getAttribute('data-img');
        const newLabel = this.getAttribute('data-label');
        const newDesc = this.getAttribute('data-desc');

        const itemEl = document.getElementById(itemId);
        if (!itemEl) return;

        // Update year subcaption / label
        const subcaption = itemEl.querySelector('.aw-year-subcaption');
        if (subcaption && newLabel) {
          subcaption.textContent = newLabel;
        }

        // Update peek thumbnail
        const thumbImg = itemEl.querySelector('.aw-media-peek-thumb img');
        if (thumbImg && newImg) {
          thumbImg.src = newImg;
        }

        // Update description if present
        const descEl = itemEl.querySelector('.aw-info-desc');
        if (descEl && newDesc) {
          descEl.textContent = newDesc;
        }

        // Update target visual data for modal
        const visualCluster = itemEl.querySelector('.aw-visual-cluster');
        if (visualCluster && newImg) {
          visualCluster.setAttribute('data-modal-img', newImg);
        }
      });
    });

    // -----------------------------------------------------------------
    // 5. LIGHTBOX MODAL VIEWER
    // -----------------------------------------------------------------
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
          modalCta.textContent = 'Verify Official Recognition ↗';
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

    // Click on visual clusters to open preview modal
    document.querySelectorAll('.aw-visual-cluster').forEach(cluster => {
      cluster.addEventListener('click', function () {
        const item = this.closest('.aw-zigzag-item');
        const imgSrc = this.getAttribute('data-modal-img') || (this.querySelector('.aw-media-peek-thumb img') ? this.querySelector('.aw-media-peek-thumb img').src : '');
        const title = item ? (item.querySelector('.aw-info-title') ? item.querySelector('.aw-info-title').textContent : '') : '';
        const org = item ? (item.querySelector('.aw-info-org') ? item.querySelector('.aw-info-org').textContent : '') : '';
        const isPdf = this.getAttribute('data-is-pdf') === 'true';
        const pdfUrl = this.getAttribute('data-pdf-url') || '';
        const linkEl = item ? item.querySelector('.aw-link-primary') : null;

        openModal({
          title,
          org,
          imgSrc,
          isPdf,
          pdfUrl,
          verifyUrl: linkEl ? linkEl.href : ''
        });
      });
    });

    // Click on primary link or view recognition
    document.querySelectorAll('.aw-link-primary[data-modal="true"]').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const item = this.closest('.aw-zigzag-item');
        if (!item) return;
        const visual = item.querySelector('.aw-visual-cluster');
        if (visual) visual.click();
      });
    });

    // Scroll cue
    const cueBtn = document.querySelector('.aw-diag-cue');
    if (cueBtn) {
      cueBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const first = document.querySelector('.aw-zigzag-item');
        if (first) {
          if (window.lenis) {
            window.lenis.scrollTo(first, { offset: -60, duration: 1.2 });
          } else {
            first.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });
    }
  }

  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDiagonalExhibition);
  } else {
    initDiagonalExhibition();
  }
})();
