const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, '..', 'styles.css');
const scriptPath = path.join(__dirname, '..', 'script.js');

// 1. RESTORE STYLES.CSS
let styles = fs.readFileSync(stylesPath, 'utf8');
const isStylesCRLF = styles.includes('\r\n');
styles = styles.replace(/\r\n/g, '\n');

// Restore .section-timeline-01 to semi-transparent so the robotic hand background shines through
const currentTimelineBlock = `.section-timeline-01 {
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

const restoredTimelineBlock = `.section-timeline-01 {
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

if (styles.includes(currentTimelineBlock)) {
  styles = styles.replace(currentTimelineBlock, restoredTimelineBlock);
  console.log('✓ Restored section-timeline-01 background in styles.css');
} else {
  console.warn('✗ currentTimelineBlock not matched');
}

// Enhance timeline-01-img-card and timeline-01-img to blend seamlessly with the futuristic cyber background
const oldImgCardStyle = `.timeline-01-img-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  border: 1.5px solid rgba(244, 211, 107, 0.45);
  background: #0a0a0e;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.85), 0 0 30px rgba(212, 175, 55, 0.28);
  transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
}`;

const newImgCardStyle = `.timeline-01-img-card {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  border: 1.5px solid rgba(244, 211, 107, 0.55);
  background: rgba(8, 8, 12, 0.72);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.88), 0 0 32px rgba(212, 175, 55, 0.32);
  transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
}`;

if (styles.includes(oldImgCardStyle)) {
  styles = styles.replace(oldImgCardStyle, newImgCardStyle);
  console.log('✓ Updated timeline-01-img-card with glassmorphism in styles.css');
}

if (isStylesCRLF) {
  styles = styles.replace(/\n/g, '\r\n');
}
fs.writeFileSync(stylesPath, styles, 'utf8');

// 2. RESTORE SCRIPT.JS
let script = fs.readFileSync(scriptPath, 'utf8');
const isScriptCRLF = script.includes('\r\n');
script = script.replace(/\r\n/g, '\n');

const currentScrollBlockStart = '    // Scroll progress strictly bound to Hero section:';
const currentScrollBlockEnd = '    window.addEventListener(\'resize\', resizeCanvas);';

const restoredScrollBlock = `    // Scroll progress smoothly spans from Hero top across About Us timeline
    const aboutSection = document.getElementById('about');
    const videoHeroStage = document.getElementById('videoHeroStage');

    function updateScrollProgress(forcedProgress) {
      let progress;
      if (typeof forcedProgress === 'number') {
        progress = Math.max(0, Math.min(1, forcedProgress));
      } else if (aboutSection && heroSection) {
        const startY = 0;
        // Reach touching contact at the 2026 milestone before methodology
        const endY = aboutSection.offsetTop + aboutSection.offsetHeight * 0.72;
        const currentY = window.scrollY || window.pageYOffset || 0;
        progress = Math.max(0, Math.min(1, (currentY - startY) / Math.max(1, endY - startY)));
      } else {
        const currentY = window.scrollY || window.pageYOffset || 0;
        progress = Math.max(0, Math.min(1, currentY / (window.innerHeight * 2.8)));
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

      // When animation starts (scrolling from Hero into About Us timeline):
      // Keep robotic hands & golden cybernetic background visible and clear
      const vCanvas = document.getElementById('videoHeroCanvas');
      if (vCanvas) {
        if (progress <= 0.08) {
          vCanvas.style.opacity = '0.82';
          vCanvas.style.filter = 'brightness(0.88) contrast(0.96)';
        } else {
          const dullFactor = Math.max(0.75, 0.82 - (progress - 0.08) * 0.15);
          vCanvas.style.opacity = dullFactor.toFixed(2);
          vCanvas.style.filter = \`brightness(\${(0.85 + (dullFactor - 0.75) * 0.6).toFixed(2)}) contrast(0.96)\`;
        }
      }

      // Ambient warm golden glow throughout timeline
      if (videoHeroAmbient) {
        if (progress <= 0.08) {
          videoHeroAmbient.style.opacity = '0.6';
          videoHeroAmbient.style.transform = 'translate(-50%, -50%) scale(1)';
          videoHeroAmbient.style.background = 'radial-gradient(circle, rgba(244, 211, 107, 0.16) 0%, rgba(212, 175, 55, 0.05) 45%, transparent 70%)';
        } else {
          const ambVal = Math.max(0.48, 0.6 - (progress - 0.08) * 0.22);
          videoHeroAmbient.style.opacity = ambVal.toFixed(2);
          videoHeroAmbient.style.transform = 'translate(-50%, -50%) scale(1)';
          videoHeroAmbient.style.background = 'radial-gradient(circle, rgba(244, 211, 107, 0.22) 0%, rgba(212, 175, 55, 0.07) 48%, transparent 70%)';
        }
      }

      // Audio micro-haptic when fingers make initial connection (around progress 0.28 to 0.45)
      if (progress >= 0.28 && progress <= 0.45) {
        if (!hasPlayedTouchChime) {
          AudioEngine.playBeep(1120, 'sine', 0.15, 0.025);
          hasPlayedTouchChime = true;
        }
      } else if (progress < 0.20 || progress > 0.60) {
        hasPlayedTouchChime = false;
      }
    }

    // ScrollTrigger: Smoothly connects Frame 1 to 175 across Hero and About Us timeline
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && heroSection && aboutSection) {
      gsap.registerPlugin(ScrollTrigger);

      ScrollTrigger.create({
        trigger: heroSection,
        start: "top top",
        endTrigger: aboutSection,
        end: "bottom 85%",
        scrub: 0.2,
        onUpdate: (self) => {
          updateScrollProgress(self.progress);
        }
      });

      // Smoothly fade out the canvas stage as user finishes About Us, completely clear before Awards enters view
      ScrollTrigger.create({
        trigger: aboutSection,
        start: "bottom 95%",
        end: "bottom 25%",
        scrub: true,
        onUpdate: (self) => {
          if (videoHeroStage) {
            const op = Math.max(0, 1 - self.progress * 1.25);
            videoHeroStage.style.opacity = op.toFixed(2);
            videoHeroStage.style.visibility = op < 0.01 ? 'hidden' : 'visible';
          }
        }
      });
    }

    window.addEventListener('scroll', () => {
      if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.getAll().length > 0) return;
      updateScrollProgress();
    }, { passive: true });
`;

const sIdx = script.indexOf(currentScrollBlockStart);
const eIdx = script.indexOf(currentScrollBlockEnd);

if (sIdx !== -1 && eIdx !== -1) {
  script = script.substring(0, sIdx) + restoredScrollBlock + '\n    ' + script.substring(eIdx);
  console.log('✓ Restored scroll progress and ScrollTrigger in script.js');
} else {
  console.warn('✗ Scroll block indices not found in script.js', { sIdx, eIdx });
}

if (isScriptCRLF) {
  script = script.replace(/\n/g, '\r\n');
}
fs.writeFileSync(scriptPath, script, 'utf8');

console.log('BACKGROUND RESTORATION COMPLETE!');
