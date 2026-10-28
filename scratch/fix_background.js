const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, '..', 'styles.css');
const scriptPath = path.join(__dirname, '..', 'script.js');

// 1. UPDATE STYLES.CSS
let styles = fs.readFileSync(stylesPath, 'utf8');
const isStylesCRLF = styles.includes('\r\n');
styles = styles.replace(/\r\n/g, '\n');

const oldTimelineStyle = `.section-timeline-01 {
  position: relative;
  background: radial-gradient(ellipse at 50% 30%, rgba(5, 5, 8, 0.36) 0%, rgba(5, 5, 8, 0.75) 65%, #000000 100%);
  padding: 24px 0 130px 0;
  margin-top: 0;
  overflow: hidden;
  z-index: 2;
}

.timeline-01-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 48px);
}`;

const newTimelineStyle = `.section-timeline-01 {
  position: relative;
  background-color: #040407;
  background: 
    radial-gradient(circle at 50% 8%, rgba(212, 175, 55, 0.08) 0%, transparent 45%),
    radial-gradient(circle at 85% 55%, rgba(212, 175, 55, 0.035) 0%, transparent 40%),
    radial-gradient(circle at 15% 40%, rgba(147, 51, 234, 0.025) 0%, transparent 40%),
    #040407;
  padding: 40px 0 130px 0;
  margin-top: 0;
  overflow: hidden;
  z-index: 10;
}

.section-timeline-01::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 56px 56px;
  pointer-events: none;
  z-index: 0;
  mask-image: radial-gradient(ellipse at 50% 50%, black 50%, transparent 85%);
  -webkit-mask-image: radial-gradient(ellipse at 50% 50%, black 50%, transparent 85%);
}

.timeline-01-container {
  position: relative;
  z-index: 2;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 48px);
}`;

if (styles.includes(oldTimelineStyle)) {
  styles = styles.replace(oldTimelineStyle, newTimelineStyle);
  console.log('✓ Replaced section-timeline-01 in styles.css');
} else {
  console.warn('✗ oldTimelineStyle not matched');
}

// Normalize image filters
styles = styles.replace('filter: brightness(1.22) contrast(1.1) saturate(1.15);', 'filter: brightness(1.02) contrast(1.05);');
styles = styles.replace('filter: brightness(1.28) contrast(1.12) saturate(1.2);', 'filter: brightness(1.08) contrast(1.08);');

if (isStylesCRLF) {
  styles = styles.replace(/\n/g, '\r\n');
}
fs.writeFileSync(stylesPath, styles, 'utf8');

// 2. UPDATE SCRIPT.JS
let script = fs.readFileSync(scriptPath, 'utf8');
const isScriptCRLF = script.includes('\r\n');
script = script.replace(/\r\n/g, '\n');

// Find the block from updateScrollProgress down to ScrollTrigger setup
const oldScrollBlockStart = '    // Scroll progress strictly bound from hero top until About Us section';
const oldScrollBlockEnd = '    window.addEventListener(\'resize\', resizeCanvas);';

const newScrollBlock = `    // Scroll progress strictly bound to Hero section:
    // Completes cinematic hand connection sequence during Hero scroll,
    // and smoothly fades out before entering About Us / Timeline section
    const aboutSection = document.getElementById('about');
    const videoHeroStage = document.getElementById('videoHeroStage');

    function updateScrollProgress(forcedProgress) {
      let progress;
      if (typeof forcedProgress === 'number') {
        progress = Math.max(0, Math.min(1, forcedProgress));
      } else if (heroSection) {
        const heroH = heroSection.offsetHeight || window.innerHeight;
        const currentY = window.scrollY || window.pageYOffset || 0;
        progress = Math.max(0, Math.min(1, currentY / (heroH * 0.95)));
      } else {
        const currentY = window.scrollY || window.pageYOffset || 0;
        progress = Math.max(0, Math.min(1, currentY / (window.innerHeight * 1.5)));
      }

      // Map progress [0, 1] to frames [1, 175]
      targetFrame = 1 + progress * (TOTAL_FRAMES - 1);

      // Cue hint fade immediately when scroll starts
      if (scrollDownHint) {
        scrollDownHint.style.opacity = progress > 0.04 ? '0' : '0.85';
        scrollDownHint.style.transform = \`translateX(-50%) translateY(\${progress * 20}px)\`;
      }

      // Cinematic text fade:
      // Keep hero headline, buttons, and stats clear on load, then gracefully fade out (0.02 to 0.22)
      // as the user scrolls away from Hero into About Us
      const overlayFade = progress < 0.02 ? 1 : Math.max(0, 1 - (progress - 0.02) / 0.20);
      const translateY = -progress * 35;

      if (heroEditorialCenter) {
        heroEditorialCenter.style.opacity = overlayFade.toFixed(2);
        heroEditorialCenter.style.transform = \`translateX(-50%) translateY(\${translateY}px)\`;
        heroEditorialCenter.style.pointerEvents = overlayFade < 0.1 ? 'none' : 'auto';
      }
      if (heroTypographyLayer) {
        heroTypographyLayer.style.opacity = overlayFade.toFixed(2);
        heroTypographyLayer.style.transform = \`translateY(\${translateY}px)\`;
        heroTypographyLayer.style.pointerEvents = overlayFade < 0.1 ? 'none' : 'auto';
      }
      if (heroLeftColumn) {
        heroLeftColumn.style.opacity = overlayFade.toFixed(2);
        heroLeftColumn.style.transform = \`translateY(\${translateY}px)\`;
        heroLeftColumn.style.pointerEvents = overlayFade < 0.1 ? 'none' : 'auto';
      }
      if (heroRightColumn) {
        heroRightColumn.style.opacity = overlayFade.toFixed(2);
        heroRightColumn.style.transform = \`translateY(\${translateY}px)\`;
        heroRightColumn.style.pointerEvents = overlayFade < 0.1 ? 'none' : 'auto';
      }

      // Hero canvas & ambient opacity:
      // Active and visible during Hero scroll (progress 0 to 0.65).
      // As progress approaches 1.0 (leaving Hero, entering About Us),
      // smoothly fade out completely to 0 opacity and hide stage,
      // ensuring NO robot hand or tech icon imagery lingers in the Timeline background.
      const stageFade = progress < 0.65 ? 1 : Math.max(0, 1 - (progress - 0.65) / 0.30);

      if (videoHeroStage) {
        videoHeroStage.style.opacity = stageFade.toFixed(2);
        videoHeroStage.style.visibility = stageFade < 0.01 ? 'hidden' : 'visible';
      }

      const vCanvas = document.getElementById('videoHeroCanvas');
      if (vCanvas) {
        vCanvas.style.opacity = (0.85 * stageFade).toFixed(2);
        vCanvas.style.filter = 'brightness(0.92) contrast(0.98)';
      }

      if (videoHeroAmbient) {
        videoHeroAmbient.style.opacity = (0.6 * stageFade).toFixed(2);
      }

      // Audio micro-haptic when fingers make initial connection (around progress 0.45 to 0.70)
      if (progress >= 0.45 && progress <= 0.70) {
        if (!hasPlayedTouchChime) {
          AudioEngine.playBeep(1120, 'sine', 0.15, 0.025);
          hasPlayedTouchChime = true;
        }
      } else if (progress < 0.30 || progress > 0.80) {
        hasPlayedTouchChime = false;
      }
    }

    // ScrollTrigger: Scoped strictly to Hero section so the cinematic hand connection completes within Hero,
    // smoothly fading out before About Us / Timeline begins.
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && heroSection) {
      gsap.registerPlugin(ScrollTrigger);

      // Hand animation progress scrub: completes Frame 1 to 175 within Hero
      ScrollTrigger.create({
        trigger: heroSection,
        start: "top top",
        end: "bottom top",
        scrub: 0.2,
        onUpdate: (self) => {
          updateScrollProgress(self.progress);
        }
      });

      // Explicit fade-out trigger ensuring videoHeroStage is 100% hidden whenever user enters About Us or below
      if (aboutSection) {
        ScrollTrigger.create({
          trigger: aboutSection,
          start: "top 95%",
          end: "top 60%",
          scrub: true,
          onUpdate: (self) => {
            if (videoHeroStage) {
              const op = Math.max(0, 1 - self.progress * 2.0);
              videoHeroStage.style.opacity = op.toFixed(2);
              videoHeroStage.style.visibility = op < 0.01 ? 'hidden' : 'visible';
            }
          }
        });
      }
    }

    window.addEventListener('scroll', () => {
      if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.getAll().length > 0) return;
      updateScrollProgress();
    }, { passive: true });
`;

const startIdx = script.indexOf(oldScrollBlockStart);
const endIdx = script.indexOf(oldScrollBlockEnd);

if (startIdx !== -1 && endIdx !== -1) {
  script = script.substring(0, startIdx) + newScrollBlock + '\n    ' + script.substring(endIdx);
  console.log('✓ Replaced scroll progress and ScrollTrigger block in script.js');
} else {
  console.warn('✗ Scroll block indices not found in script.js', { startIdx, endIdx });
}

if (isScriptCRLF) {
  script = script.replace(/\n/g, '\r\n');
}
fs.writeFileSync(scriptPath, script, 'utf8');

console.log('ALL UPDATES COMPLETE!');
