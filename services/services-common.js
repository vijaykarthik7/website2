/**
 * RIYADVI SOFTWARE TECHNOLOGIES — SERVICES COMMON ENGINE
 * Handles sticky subnav scrollspy, smooth scrolling, trending carousel dragging,
 * reading progress bar, and interactive components.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSubnavScrollSpy();
  initTrendingCarousel();
  initReadingProgressBar();
  initSmoothAnchorScrolling();
});

/* ==========================================================================
   1. SUBNAV SCROLLSPY & ACTIVE SECTION INDICATOR
   ========================================================================== */
function initSubnavScrollSpy() {
  const subnav = document.getElementById('svcSubnav');
  const navLinks = document.querySelectorAll('.svc-subnav-item');
  if (!navLinks.length) return;

  const sectionIds = Array.from(navLinks).map(link => {
    const href = link.getAttribute('href');
    return href && href.startsWith('#') ? href.substring(1) : null;
  }).filter(Boolean);

  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  function onScroll() {
    const scrollPos = window.scrollY + 160;

    let currentSectionId = null;
    for (let i = sections.length - 1; i >= 0; i--) {
      const sec = sections[i];
      if (sec.offsetTop <= scrollPos) {
        currentSectionId = sec.getAttribute('id');
        break;
      }
    }

    if (!currentSectionId && sections.length > 0) {
      currentSectionId = sections[0].getAttribute('id');
    }

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
        // Auto scroll subnav on mobile so active link is visible
        if (subnav) {
          const linksContainer = subnav.querySelector('.svc-subnav-links');
          if (linksContainer) {
            const linkLeft = link.offsetLeft;
            const containerScroll = linksContainer.scrollLeft;
            const containerWidth = linksContainer.clientWidth;
            if (linkLeft < containerScroll || linkLeft > containerScroll + containerWidth - 100) {
              linksContainer.scrollTo({ left: linkLeft - 40, behavior: 'smooth' });
            }
          }
        }
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   2. SMOOTH ANCHOR SCROLLING (OFFSET ADJUSTMENT)
   ========================================================================== */
function initSmoothAnchorScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').substring(1);
      if (!targetId) return;

      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        // Calculate offset (Global navbar + Sticky Subnav = ~132px)
        const headerOffset = 130;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update URL hash without jumping
        history.pushState(null, null, `#${targetId}`);
      }
    });
  });
}

/* ==========================================================================
   3. WHAT'S TRENDING CAROUSEL (DRAG, ARROWS & SWIPE)
   ========================================================================== */
function initTrendingCarousel() {
  const viewport = document.getElementById('svcCarouselViewport');
  const prevBtn = document.getElementById('svcCarouselPrev');
  const nextBtn = document.getElementById('svcCarouselNext');

  if (!viewport) return;

  const cardWidth = 408; // 380px + 28px gap

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      viewport.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      viewport.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });
  }

  // Mouse drag functionality
  let isDown = false;
  let startX;
  let scrollLeft;

  viewport.addEventListener('mousedown', (e) => {
    isDown = true;
    viewport.classList.add('is-dragging');
    startX = e.pageX - viewport.offsetLeft;
    scrollLeft = viewport.scrollLeft;
  });

  viewport.addEventListener('mouseleave', () => {
    isDown = false;
    viewport.classList.remove('is-dragging');
  });

  viewport.addEventListener('mouseup', () => {
    isDown = false;
    viewport.classList.remove('is-dragging');
  });

  viewport.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - viewport.offsetLeft;
    const walk = (x - startX) * 1.6;
    viewport.scrollLeft = scrollLeft - walk;
  });
}

/* ==========================================================================
   4. ARTICLE READING PROGRESS BAR
   ========================================================================== */
function initReadingProgressBar() {
  const bar = document.getElementById('svcReadingProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      bar.style.width = Math.min(100, Math.max(0, progress)) + '%';
    }
  }, { passive: true });
}
