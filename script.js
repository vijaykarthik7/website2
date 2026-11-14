/**
 * RIYADVI SOFTWARE TECHNOLOGIES — Core Application Engine
 * Combines 150-Frame 3D Proximity Tracking, Particle Preloader,
 * Interactive Guardian System, Project Estimator & AI Assistant.
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Web Audio Synthesizer (Cybernetic Micro-Haptics & SFX)
  // =========================================================================
  const AudioEngine = {
    ctx: null,
    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
    },
    playBeep(freq = 880, type = 'sine', duration = 0.08, gainVal = 0.04) {
      try {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    },
    playScanHum() {
      try {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(380, this.ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.38);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.38);
      } catch (e) {}
    }
  };

  // =========================================================================
  // 1B. Lenis Smooth Inertial Scroll Physics & Card Stacking Integration
  // =========================================================================
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Smooth navigation anchor scrolling
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href && href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: 0, duration: 1.4 });
          }
        }
      });
    });

    window.lenis = lenis;
  }

  // =========================================================================
  // 1C. Flow Art Story Scroll Animation (Disabled for clean natural scrolling)
  // =========================================================================


  // =========================================================================
  // 2. Preloader Animation (1.5s Gold Particle & Emblem Sequence)
  // =========================================================================
  const preloader = document.getElementById('riyadviPreloader');
  const preloaderCanvas = document.getElementById('preloaderCanvas');
  const preloaderBar = document.getElementById('preloaderBar');

  if (preloader && preloaderCanvas) {
    const pCtx = preloaderCanvas.getContext('2d');
    let pWidth = (preloaderCanvas.width = window.innerWidth);
    let pHeight = (preloaderCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      pWidth = preloaderCanvas.width = window.innerWidth;
      pHeight = preloaderCanvas.height = window.innerHeight;
    });

    const particles = [];
    const NUM_PARTICLES = 50;
    const centerX = pWidth / 2;
    const centerY = pHeight / 2;

    for (let i = 0; i < NUM_PARTICLES; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 120 + Math.random() * (Math.min(pWidth, pHeight) * 0.4);
      particles.push({
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        targetX: centerX,
        targetY: centerY,
        size: Math.random() * 2 + 1,
        speed: 0.02 + Math.random() * 0.03,
        alpha: Math.random() * 0.7 + 0.3
      });
    }

    let pAnimId;
    function animatePreloaderParticles() {
      if (!pCtx) return;
      pCtx.clearRect(0, 0, pWidth, pHeight);

      particles.forEach((p) => {
        p.x += (p.targetX - p.x) * p.speed;
        p.y += (p.targetY - p.y) * p.speed;

        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(244, 211, 107, ${p.alpha})`;
        pCtx.shadowBlur = 8;
        pCtx.shadowColor = '#D4AF37';
        pCtx.fill();
      });

      pAnimId = requestAnimationFrame(animatePreloaderParticles);
    }
    animatePreloaderParticles();

    // Trigger progress bar
    setTimeout(() => {
      if (preloaderBar) preloaderBar.style.width = '100%';
    }, 50);

    let preloaderDismissed = false;
    function dismissPreloader() {
      if (preloaderDismissed) return;
      preloaderDismissed = true;
      cancelAnimationFrame(pAnimId);
      preloader.classList.add('preloader-hidden');
      try { AudioEngine.playBeep(980, 'sine', 0.12, 0.02); } catch (e) {}
    }

    // Dismiss early on window load (400ms) or at 800ms max for instant perceived speed
    window.addEventListener('load', () => {
      setTimeout(dismissPreloader, 400);
    });
    setTimeout(dismissPreloader, 800);
  }

  // =========================================================================
  // 3. VideoHero Scroll-Bound Canvas Animation Engine
  //    Scrub-controls 130 cinema frames of human & robot hand reaching and touching.
  //    Locked strictly within heroScrollContainer, completing at About Us section.
  // =========================================================================
  const canvas = document.getElementById('videoHeroCanvas');
  const heroSection = document.getElementById('home');
  const videoHeroAmbient = document.getElementById('videoHeroAmbient');
  const scrollDownHint = document.getElementById('scrollDownHint');
  const heroEditorialCenter = document.getElementById('heroEditorialCenter');
  const heroTypographyLayer = document.getElementById('heroTypographyLayer');
  const heroLeftColumn = document.getElementById('heroLeftColumn');
  const heroRightColumn = document.getElementById('heroRightColumn');

  if (canvas && heroSection) {
    const ctx = canvas.getContext('2d');
    const TOTAL_FRAMES = 175;
    const frames = new Array(TOTAL_FRAMES + 1);
    const isLoaded = new Array(TOTAL_FRAMES + 1).fill(false);

    let targetFrame = 1;
    let currentFrame = 1;
    let renderedFrame = -1;
    let hasPlayedTouchChime = false;

    function getFrameSrc(index) {
      const num = String(index).padStart(3, '0');
      return `assets/HeroAbout/VideoHero_frames/frame_${num}.webp`;
    }

    function getFallbackFrameSrc(index) {
      const num = String(index).padStart(3, '0');
      return `assets/HeroAbout/VideoHero_frames/frame_${num}.png`;
    }

    function resizeCanvas() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.8);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      renderedFrame = -1;
      render();
    }

    function getNearestLoadedImage(targetIdx) {
      const rounded = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(targetIdx)));
      if (isLoaded[rounded] && frames[rounded]) return frames[rounded];
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const left = rounded - offset;
        if (left >= 1 && isLoaded[left] && frames[left]) return frames[left];
        const right = rounded + offset;
        if (right <= TOTAL_FRAMES && isLoaded[right] && frames[right]) return frames[right];
      }
      return frames[1] || null;
    }

    function render() {
      const frameIdx = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(currentFrame)));
      const img = getNearestLoadedImage(frameIdx);
      if (!ctx || !img || !img.complete || img.naturalWidth === 0) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Identify portrait or narrow viewports (e.g. mobile, portrait tablets)
      const isNarrowOrPortrait = (cw / ch) < (iw / ih) * 0.92 || window.innerWidth <= 900;

      let nw, nh, cx, cy;
      if (isNarrowOrPortrait) {
        // Fit 100% of the image width inside the viewport so BOTH human hand (left) and robot hand (right) fit completely inside the frame
        const r = cw / iw;
        nw = Math.round(cw);
        nh = Math.round(ih * r);
        cx = 0;
        // Position hands in the focal area with tight, balanced spacing between CTA and timeline
        cy = Math.round(ch * 0.47 - nh * 0.5);
      } else {
        // Aspect ratio cover scale to immerse the widescreen desktop viewport
        const r = Math.max(cw / iw, ch / ih);
        nw = Math.round(iw * r);
        nh = Math.round(ih * r);
        cx = Math.round((cw - nw) * 0.5);
        cy = Math.round((ch - nh) * 0.5 + Math.min(45, Math.max(0, (nh - ch) * 0.28)));
      }

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, 0, 0, iw, ih, cx, cy, nw, nh);
      renderedFrame = frameIdx;
    }

    function loadFrame(idx, onComplete) {
      if (frames[idx] && isLoaded[idx]) {
        if (onComplete) onComplete(frames[idx]);
        return;
      }
      const img = new Image();
      img.onload = () => {
        frames[idx] = img;
        isLoaded[idx] = true;
        if (onComplete) onComplete(img);
        if (Math.round(currentFrame) === idx || renderedFrame === -1) {
          render();
        }
      };
      img.onerror = () => {
        const fallback = new Image();
        fallback.onload = () => {
          frames[idx] = fallback;
          isLoaded[idx] = true;
          if (onComplete) onComplete(fallback);
          if (Math.round(currentFrame) === idx || renderedFrame === -1) {
            render();
          }
        };
        fallback.src = getFallbackFrameSrc(idx);
      };
      img.src = getFrameSrc(idx);
    }

    // Step 1: Immediately load and render Frame 1 (Zero lag on page load)
    loadFrame(1, () => {
      render();
    });

    // Step 2: Progressive Keyframe Stride (Loads anchor frames across full scroll arc in <200ms)
    const isMobileHero = window.innerWidth <= 768;
    const strideStep = isMobileHero ? 15 : 10;
    const keyframes = [];
    for (let k = strideStep; k <= TOTAL_FRAMES; k += strideStep) {
      keyframes.push(k);
    }
    keyframes.forEach(k => loadFrame(k));

    // Step 3: Stream all remaining frames progressively in background
    let nextIdxToLoad = 2;
    const heroStep = isMobileHero ? 2 : 1;
    function loadNextBatch() {
      let count = 0;
      while (nextIdxToLoad <= TOTAL_FRAMES && count < (isMobileHero ? 3 : 5)) {
        if (!frames[nextIdxToLoad]) {
          loadFrame(nextIdxToLoad);
          count++;
        }
        nextIdxToLoad += heroStep;
      }
      if (nextIdxToLoad <= TOTAL_FRAMES) {
        setTimeout(loadNextBatch, isMobileHero ? 50 : 35);
      }
    }
    setTimeout(loadNextBatch, 150);

    // Scroll progress smoothly spans from Hero top across About Us timeline
    const aboutSection = document.getElementById('about');
    const videoHeroStage = document.getElementById('videoHeroStage');

    function updateScrollProgress(forcedProgress) {
      let progress;
      if (typeof forcedProgress === 'number') {
        progress = Math.max(0, Math.min(1, forcedProgress));
      } else if (aboutSection && heroSection) {
        const startY = 0;
        // Reach touching contact as user progresses through timeline and methodology
        const endY = aboutSection.offsetTop + aboutSection.offsetHeight * 0.88;
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
        scrollDownHint.style.transform = `translateX(-50%) translateY(${progress * 20}px)`;
      }

      // Cinematic text fade:
      // Keep hero headline, buttons, and stats clear on load, then gracefully fade out (0.02 to 0.22)
      // as the user scrolls away from Hero into About Us
      const overlayFade = progress < 0.02 ? 1 : Math.max(0, 1 - (progress - 0.02) / 0.20);
      const translateY = -progress * 35;

      if (heroEditorialCenter) {
        heroEditorialCenter.style.opacity = overlayFade.toFixed(2);
        heroEditorialCenter.style.transform = `translateX(-50%) translateY(${translateY}px)`;
        heroEditorialCenter.style.pointerEvents = overlayFade < 0.1 ? 'none' : 'auto';
      }
      if (heroTypographyLayer) {
        heroTypographyLayer.style.opacity = overlayFade.toFixed(2);
        heroTypographyLayer.style.transform = `translateY(${translateY}px)`;
        heroTypographyLayer.style.pointerEvents = overlayFade < 0.1 ? 'none' : 'auto';
      }
      if (heroLeftColumn) {
        heroLeftColumn.style.opacity = overlayFade.toFixed(2);
        heroLeftColumn.style.transform = `translateY(${translateY}px)`;
        heroLeftColumn.style.pointerEvents = overlayFade < 0.1 ? 'none' : 'auto';
      }
      if (heroRightColumn) {
        heroRightColumn.style.opacity = overlayFade.toFixed(2);
        heroRightColumn.style.transform = `translateY(${translateY}px)`;
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
          vCanvas.style.filter = `brightness(${(0.85 + (dullFactor - 0.75) * 0.6).toFixed(2)}) contrast(0.96)`;
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

      // Keep VideoHero canvas active through all About Us milestones and 6-step engineering methodology
      ScrollTrigger.create({
        trigger: aboutSection,
        start: "bottom 60%",
        end: "bottom 5%",
        scrub: true,
        onUpdate: (self) => {
          if (videoHeroStage) {
            const op = Math.max(0, 1 - self.progress * 1.3);
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

        window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    updateScrollProgress(0);

    // 60fps/120fps smooth critical damping render loop
    function renderLoop() {
      const diff = targetFrame - currentFrame;
      if (Math.abs(diff) > 0.02) {
        currentFrame += diff * 0.18; // Buttery-smooth fluid response
        render();
      }
      requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
  }

  // =========================================================================
  // 3B. Rocket Launch Scroll-Bound Canvas Animation Engine
  //     Scrub-controls 240 cinema frames of high-velocity rocket ascent & booster separation.
  //     Active across Section 3 (Awards), Section 4 (Trust), and Section 5 (Services).
  // =========================================================================
  const rocketStage = document.getElementById('rocketScrollStage');
  const rocketCanvas = document.getElementById('rocketCanvas');
  const rocketAmbientGlow = document.getElementById('rocketAmbientGlow');
  const rocketTelemetryProgress = document.getElementById('rocketTelemetryProgress');
  const rocketTelemetryPhase = document.getElementById('rocketTelemetryPhase');
  const rocketTelemetryVal = document.getElementById('rocketAltitudeVal');
  const rocketTrajectoryLabel = document.getElementById('rocketTrajectoryLabel');

  const awardsSectionEl = document.getElementById('awards');
  const trustSectionEl = document.getElementById('trust');
  const servicesSectionEl = document.getElementById('services');
  const industriesSectionEl = document.getElementById('industries');

  if (rocketCanvas && awardsSectionEl && servicesSectionEl) {
    const rCtx = rocketCanvas.getContext('2d');
    const TOTAL_ROCKET_FRAMES = 240;
    const rocketFrames = new Array(TOTAL_ROCKET_FRAMES + 1);
    const rocketLoaded = new Array(TOTAL_ROCKET_FRAMES + 1).fill(false);

    let rocketTargetFrame = 1;
    let rocketCurrentFrame = 1;
    let rocketRenderedFrame = -1;
    let hasPlayedBoosterAudio = false;

    function getRocketFrameSrc(index) {
      const num = String(index).padStart(3, '0');
      return `assets/rocket/ezgif-frame-${num}.jpg`;
    }

    function resizeRocketCanvas() {
      if (!rocketCanvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      rocketCanvas.width = Math.round(w * dpr);
      rocketCanvas.height = Math.round(h * dpr);
      rocketCanvas.style.width = `${w}px`;
      rocketCanvas.style.height = `${h}px`;
      rocketRenderedFrame = -1;
      renderRocket();
    }

    function getNearestRocketImage(targetIdx) {
      const rounded = Math.max(1, Math.min(TOTAL_ROCKET_FRAMES, Math.round(targetIdx)));
      if (rocketLoaded[rounded] && rocketFrames[rounded]) return rocketFrames[rounded];
      for (let offset = 1; offset < TOTAL_ROCKET_FRAMES; offset++) {
        const left = rounded - offset;
        if (left >= 1 && rocketLoaded[left] && rocketFrames[left]) return rocketFrames[left];
        const right = rounded + offset;
        if (right <= TOTAL_ROCKET_FRAMES && rocketLoaded[right] && rocketFrames[right]) return rocketFrames[right];
      }
      return rocketFrames[1] || null;
    }

    function renderRocket() {
      const frameIdx = Math.max(1, Math.min(TOTAL_ROCKET_FRAMES, Math.round(rocketCurrentFrame)));
      const img = getNearestRocketImage(frameIdx);
      if (!rCtx || !img || !img.complete || img.naturalWidth === 0) return;

      const cw = rocketCanvas.width;
      const ch = rocketCanvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Aspect ratio cover scale to immerse the entire viewport
      const r = Math.max(cw / iw, ch / ih);
      const nw = iw * r;
      const nh = ih * r;
      const cx = (cw - nw) * 0.5;
      const cy = (ch - nh) * 0.5;

      rCtx.clearRect(0, 0, cw, ch);
      rCtx.drawImage(img, 0, 0, iw, ih, cx, cy, nw, nh);
      rocketRenderedFrame = frameIdx;
    }

    function loadRocketFrame(idx, onComplete) {
      if (rocketFrames[idx] && rocketLoaded[idx]) {
        if (onComplete) onComplete(rocketFrames[idx]);
        return;
      }
      const img = new Image();
      img.onload = () => {
        rocketFrames[idx] = img;
        rocketLoaded[idx] = true;
        if (onComplete) onComplete(img);
        if (Math.round(rocketCurrentFrame) === idx || rocketRenderedFrame === -1) {
          renderRocket();
        }
      };
      img.src = getRocketFrameSrc(idx);
    }

    // Progressive Staged Loader — Lazy loaded when visitor nears Awards/About section
    let rocketLoadingStarted = false;
    function startRocketLoading() {
      if (rocketLoadingStarted) return;
      rocketLoadingStarted = true;

      // Step 1: Immediately load and render Frame 1
      loadRocketFrame(1, () => {
        renderRocket();
      });

      // Step 2: Progressive Keyframe Stride (Loads anchor frames across full scroll arc)
      const isMobileRocket = window.innerWidth <= 768;
      const strideStep = isMobileRocket ? 20 : 15;
      for (let k = strideStep; k <= TOTAL_ROCKET_FRAMES; k += strideStep) {
        loadRocketFrame(k);
      }

      // Step 3: Stream all remaining frames progressively in background
      let nextRocketIdx = 2;
      const rocketStep = isMobileRocket ? 2 : 1;
      function loadNextRocketBatch() {
        let count = 0;
        while (nextRocketIdx <= TOTAL_ROCKET_FRAMES && count < (isMobileRocket ? 4 : 6)) {
          if (!rocketFrames[nextRocketIdx]) {
            loadRocketFrame(nextRocketIdx);
            count++;
          }
          nextRocketIdx += rocketStep;
        }
        if (nextRocketIdx <= TOTAL_ROCKET_FRAMES) {
          setTimeout(loadNextRocketBatch, 30);
        }
      }
      setTimeout(loadNextRocketBatch, 100);
    }

    // Connect IntersectionObserver to trigger loading when scrolling towards section
    const aboutSectionElForRocket = document.getElementById('about');
    if ('IntersectionObserver' in window && aboutSectionElForRocket) {
      const rocketObserver = new IntersectionObserver((entries) => {
        if (entries.some(e => e.isIntersecting)) {
          startRocketLoading();
          rocketObserver.disconnect();
        }
      }, { rootMargin: '600px 0px' });
      rocketObserver.observe(aboutSectionElForRocket);
    } else {
      setTimeout(startRocketLoading, 2000);
    }

    function updateRocketProgress(progressVal) {
      if (!rocketLoadingStarted) startRocketLoading();
      const p = Math.max(0, Math.min(1, progressVal));
      rocketTargetFrame = 1 + p * (TOTAL_ROCKET_FRAMES - 1);

      // Telemetry HUD updates
      if (rocketTelemetryProgress) {
        rocketTelemetryProgress.style.width = `${(p * 100).toFixed(1)}%`;
      }

      if (rocketTelemetryPhase && rocketTelemetryVal) {
        if (p < 0.20) {
          rocketTelemetryPhase.textContent = 'STANDBY // IGNITION T-00';
          rocketTelemetryVal.textContent = 'ALT: 1,400 M';
          if (rocketTrajectoryLabel) rocketTrajectoryLabel.textContent = 'LAUNCH PAD';
        } else if (p < 0.45) {
          rocketTelemetryPhase.textContent = 'PROPULSION // STAGE 1';
          rocketTelemetryVal.textContent = `ALT: ${Math.round(1400 + (p - 0.20) * 80000).toLocaleString()} M`;
          if (rocketTrajectoryLabel) rocketTrajectoryLabel.textContent = 'ATMOSPHERIC ASCENT';
        } else if (p < 0.75) {
          rocketTelemetryPhase.textContent = 'BOOSTER SEPARATION // STAGE 2';
          rocketTelemetryVal.textContent = `ALT: ${Math.round(22000 + (p - 0.45) * 160000).toLocaleString()} M`;
          if (rocketTrajectoryLabel) rocketTrajectoryLabel.textContent = 'SUPERSONIC TRAJECTORY';
        } else {
          rocketTelemetryPhase.textContent = 'EXOSPHERE // ORBITAL INSERTION';
          rocketTelemetryVal.textContent = `ALT: ${Math.round(75000 + (p - 0.75) * 250000).toLocaleString()} M`;
          if (rocketTrajectoryLabel) rocketTrajectoryLabel.textContent = 'ORBITAL APOGEE';
        }
      }

      // Audio haptic chime when booster separation occurs (~50%)
      if (p >= 0.48 && p <= 0.55) {
        if (!hasPlayedBoosterAudio && typeof AudioEngine !== 'undefined') {
          AudioEngine.playBeep(640, 'triangle', 0.2, 0.035);
          hasPlayedBoosterAudio = true;
        }
      } else if (p < 0.35 || p > 0.65) {
        hasPlayedBoosterAudio = false;
      }
    }

    function updateRocketVisibility() {
      if (!rocketStage || !awardsSectionEl || !servicesSectionEl) return;
      const rectA = awardsSectionEl.getBoundingClientRect();
      const rectS = servicesSectionEl.getBoundingClientRect();
      const vh = window.innerHeight || 800;

      // Check if user is anywhere in or entering Sections 3 to 5
      if (rectA.top > vh || rectS.bottom < 0) {
        rocketStage.style.opacity = '0';
        rocketStage.style.visibility = 'hidden';
      } else {
        let opacity = 1;
        // Fade in as Awards top enters from vh down to 0
        if (rectA.top > 0) {
          opacity = Math.max(0, Math.min(1, (vh - rectA.top) / (vh * 0.75)));
        }
        // Fade out as Services bottom exits from vh down to 0
        if (rectS.bottom < vh) {
          const outFade = Math.max(0, Math.min(1, rectS.bottom / (vh * 0.75)));
          opacity = Math.min(opacity, outFade);
        }
        rocketStage.style.opacity = opacity.toFixed(2);
        rocketStage.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
      }
    }

    // GSAP ScrollTrigger Integration
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Scrub progress smoothly across Sections 3 to 5
      ScrollTrigger.create({
        trigger: awardsSectionEl,
        start: 'top top',
        endTrigger: servicesSectionEl,
        end: 'bottom bottom',
        scrub: 0.25,
        onUpdate: (self) => {
          updateRocketProgress(self.progress);
        }
      });

      // Visibility & Entrance/Exit trigger
      ScrollTrigger.create({
        trigger: awardsSectionEl,
        start: 'top bottom',
        endTrigger: servicesSectionEl,
        end: 'bottom top',
        scrub: true,
        onUpdate: () => {
          updateRocketVisibility();
        }
      });
    }

    // Direct scroll listener for smooth fallback & Lenis updates
    window.addEventListener('scroll', () => {
      updateRocketVisibility();
      if (typeof ScrollTrigger === 'undefined' || ScrollTrigger.getAll().length === 0) {
        const awardsTop = awardsSectionEl.offsetTop;
        const servicesBottom = servicesSectionEl.offsetTop + servicesSectionEl.offsetHeight;
        const totalDist = servicesBottom - awardsTop - window.innerHeight;
        const currentPos = window.scrollY - awardsTop;
        const p = Math.max(0, Math.min(1, currentPos / Math.max(1, totalDist)));
        updateRocketProgress(p);
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      resizeRocketCanvas();
      updateRocketVisibility();
    });

    resizeRocketCanvas();
    updateRocketVisibility();
    updateRocketProgress(0);

    // 60fps/120fps smooth critical damping render loop
    function rocketRenderLoop() {
      const diff = rocketTargetFrame - rocketCurrentFrame;
      if (Math.abs(diff) > 0.02) {
        rocketCurrentFrame += diff * 0.18;
        renderRocket();
      }
      requestAnimationFrame(rocketRenderLoop);
    }
    requestAnimationFrame(rocketRenderLoop);
  }

  // =========================================================================
  // 3C. Earth Orbital Scroll-Bound Canvas Animation Engine
  //     Scrub-controls 240 cinema frames of planetary 3D Earth rotation & orbital telemetry.
  //     Active across Section 6 (Industries), Section 7 (Guardian), and Section 8 (Portfolio).
  // =========================================================================
  const earthStage = document.getElementById('earthScrollStage');
  const earthCanvas = document.getElementById('earthCanvas');
  const earthAmbientGlow = document.getElementById('earthAmbientGlow');
  const earthTelemetryProgress = document.getElementById('earthTelemetryProgress');
  const earthTelemetryPhase = document.getElementById('earthTelemetryPhase');
  const earthCoordinatesVal = document.getElementById('earthCoordinatesVal');
  const earthTrajectoryLabel = document.getElementById('earthTrajectoryLabel');

  const guardianSectionEl = document.getElementById('guardian');
  const portfolioSectionEl = document.getElementById('portfolio');

  if (earthCanvas && industriesSectionEl && portfolioSectionEl) {
    const eCtx = earthCanvas.getContext('2d');
    const TOTAL_EARTH_FRAMES = 240;
    const earthFrames = new Array(TOTAL_EARTH_FRAMES + 1);
    const earthLoaded = new Array(TOTAL_EARTH_FRAMES + 1).fill(false);

    let earthTargetFrame = 1;
    let earthCurrentFrame = 1;
    let earthRenderedFrame = -1;
    let hasPlayedEarthAudio = false;

    function getEarthFrameSrc(index) {
      const num = String(index).padStart(3, '0');
      return `assets/earth/ezgif-frame-${num}.webp`;
    }

    function getEarthFallbackFrameSrc(index) {
      const num = String(index).padStart(3, '0');
      return `assets/earth/ezgif-frame-${num}.png`;
    }

    function resizeEarthCanvas() {
      if (!earthCanvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.8);
      const w = window.innerWidth;
      const h = window.innerHeight;
      earthCanvas.width = Math.round(w * dpr);
      earthCanvas.height = Math.round(h * dpr);
      earthCanvas.style.width = `${w}px`;
      earthCanvas.style.height = `${h}px`;
      earthRenderedFrame = -1;
      renderEarth();
    }

    function getNearestEarthImage(targetIdx) {
      const rounded = Math.max(1, Math.min(TOTAL_EARTH_FRAMES, Math.round(targetIdx)));
      if (earthLoaded[rounded] && earthFrames[rounded]) return earthFrames[rounded];
      for (let offset = 1; offset < TOTAL_EARTH_FRAMES; offset++) {
        const left = rounded - offset;
        if (left >= 1 && earthLoaded[left] && earthFrames[left]) return earthFrames[left];
        const right = rounded + offset;
        if (right <= TOTAL_EARTH_FRAMES && earthLoaded[right] && earthFrames[right]) return earthFrames[right];
      }
      return earthFrames[1] || null;
    }

    function renderEarth() {
      const frameIdx = Math.max(1, Math.min(TOTAL_EARTH_FRAMES, Math.round(earthCurrentFrame)));
      const img = getNearestEarthImage(frameIdx);
      if (!eCtx || !img || !img.complete || img.naturalWidth === 0) return;

      const cw = earthCanvas.width;
      const ch = earthCanvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Aspect ratio cover scale to immerse the entire viewport
      const r = Math.max(cw / iw, ch / ih);
      const nw = iw * r;
      const nh = ih * r;
      const cx = (cw - nw) * 0.5;
      const cy = (ch - nh) * 0.5;

      eCtx.clearRect(0, 0, cw, ch);
      eCtx.drawImage(img, 0, 0, iw, ih, cx, cy, nw, nh);
      earthRenderedFrame = frameIdx;
    }

    function loadEarthFrame(idx, onComplete) {
      if (earthFrames[idx] && earthLoaded[idx]) {
        if (onComplete) onComplete(earthFrames[idx]);
        return;
      }
      const img = new Image();
      img.onload = () => {
        earthFrames[idx] = img;
        earthLoaded[idx] = true;
        if (onComplete) onComplete(img);
        if (Math.round(earthCurrentFrame) === idx || earthRenderedFrame === -1) {
          renderEarth();
        }
      };
      img.onerror = () => {
        const fallback = new Image();
        fallback.onload = () => {
          earthFrames[idx] = fallback;
          earthLoaded[idx] = true;
          if (onComplete) onComplete(fallback);
          if (Math.round(earthCurrentFrame) === idx || earthRenderedFrame === -1) {
            renderEarth();
          }
        };
        fallback.src = getEarthFallbackFrameSrc(idx);
      };
      img.src = getEarthFrameSrc(idx);
    }

    // Lazy load Earth frames when scrolling toward industries/guardian section
    let earthLoadingStarted = false;
    function startEarthLoading() {
      if (earthLoadingStarted) return;
      earthLoadingStarted = true;

      // Step 1: Immediately load and render Frame 1
      loadEarthFrame(1, () => {
        renderEarth();
      });

      // Step 2: Progressive Keyframe Stride across full arc
      const isMobileEarth = window.innerWidth <= 768;
      const strideStep = isMobileEarth ? 20 : 15;
      for (let k = strideStep; k <= TOTAL_EARTH_FRAMES; k += strideStep) {
        loadEarthFrame(k);
      }

      // Step 3: Stream all remaining frames progressively in background
      let nextEarthIdx = 2;
      const earthStep = isMobileEarth ? 2 : 1;
      function loadNextEarthBatch() {
        let count = 0;
        while (nextEarthIdx <= TOTAL_EARTH_FRAMES && count < (isMobileEarth ? 3 : 5)) {
          if (!earthFrames[nextEarthIdx]) {
            loadEarthFrame(nextEarthIdx);
            count++;
          }
          nextEarthIdx += earthStep;
        }
        if (nextEarthIdx <= TOTAL_EARTH_FRAMES) {
          setTimeout(loadNextEarthBatch, 35);
        }
      }
      setTimeout(loadNextEarthBatch, 100);
    }

    const servicesSectionForEarth = document.getElementById('services');
    if ('IntersectionObserver' in window && servicesSectionForEarth) {
      const earthObserver = new IntersectionObserver((entries) => {
        if (entries.some(e => e.isIntersecting)) {
          startEarthLoading();
          earthObserver.disconnect();
        }
      }, { rootMargin: '600px 0px' });
      earthObserver.observe(servicesSectionForEarth);
    } else {
      setTimeout(startEarthLoading, 3000);
    }

    function updateEarthProgress(progressVal) {
      if (!earthLoadingStarted) startEarthLoading();
      const p = Math.max(0, Math.min(1, progressVal));
      earthTargetFrame = 1 + p * (TOTAL_EARTH_FRAMES - 1);

      // Telemetry HUD updates
      if (earthTelemetryProgress) {
        earthTelemetryProgress.style.width = `${(p * 100).toFixed(1)}%`;
      }

      if (earthTelemetryPhase && earthCoordinatesVal) {
        if (p < 0.33) {
          earthTelemetryPhase.textContent = 'GEOCENTRIC ORBIT // CONTINENTAL SECTOR';
          earthCoordinatesVal.textContent = 'LAT 13.0827° N // LON 80.2707° E';
          if (earthTrajectoryLabel) earthTrajectoryLabel.textContent = 'REGIONAL HUBS';
        } else if (p < 0.68) {
          earthTelemetryPhase.textContent = 'GUARDIAN SHIELD GRID // PLANETARY DEFENSE';
          earthCoordinatesVal.textContent = 'GEO-SYNCHRONOUS ROTATION // ACTIVE';
          if (earthTrajectoryLabel) earthTrajectoryLabel.textContent = 'SENTINEL SPHERE';
        } else {
          earthTelemetryPhase.textContent = 'GLOBAL DEPLOYMENTS // ENTERPRISE APOGEE';
          earthCoordinatesVal.textContent = 'GLOBAL COVERAGE // 100% DEPLOYED';
          if (earthTrajectoryLabel) earthTrajectoryLabel.textContent = 'CIRCULAR APOGEE';
        }
      }

      // Audio micro-haptic when aligning with Guardian grid (~50%)
      if (p >= 0.48 && p <= 0.55) {
        if (!hasPlayedEarthAudio && typeof AudioEngine !== 'undefined') {
          AudioEngine.playBeep(440, 'sine', 0.2, 0.03);
          hasPlayedEarthAudio = true;
        }
      } else if (p < 0.35 || p > 0.65) {
        hasPlayedEarthAudio = false;
      }
    }

    function updateEarthVisibility() {
      if (!earthStage || !industriesSectionEl || !portfolioSectionEl) return;
      const rectInd = industriesSectionEl.getBoundingClientRect();
      const rectPort = portfolioSectionEl.getBoundingClientRect();
      const vh = window.innerHeight || 800;

      // Check if user is anywhere in or entering Sections 6 to 8
      if (rectInd.top > vh || rectPort.bottom < 0) {
        earthStage.style.opacity = '0';
        earthStage.style.visibility = 'hidden';
      } else {
        let opacity = 1;
        // Fade in as Industries top enters from vh down to 0
        if (rectInd.top > 0) {
          opacity = Math.max(0, Math.min(1, (vh - rectInd.top) / (vh * 0.75)));
        }
        // Fade out as Portfolio bottom exits from vh down to 0
        if (rectPort.bottom < vh) {
          const outFade = Math.max(0, Math.min(1, rectPort.bottom / (vh * 0.75)));
          opacity = Math.min(opacity, outFade);
        }
        earthStage.style.opacity = opacity.toFixed(2);
        earthStage.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
      }
    }

    // GSAP ScrollTrigger Integration
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Scrub progress smoothly across Sections 6 to 8
      ScrollTrigger.create({
        trigger: industriesSectionEl,
        start: 'top top',
        endTrigger: portfolioSectionEl,
        end: 'bottom bottom',
        scrub: 0.25,
        onUpdate: (self) => {
          updateEarthProgress(self.progress);
        }
      });

      // Visibility & Entrance/Exit trigger
      ScrollTrigger.create({
        trigger: industriesSectionEl,
        start: 'top bottom',
        endTrigger: portfolioSectionEl,
        end: 'bottom top',
        scrub: true,
        onUpdate: () => {
          updateEarthVisibility();
        }
      });
    }

    // Direct scroll listener for smooth fallback & Lenis updates
    window.addEventListener('scroll', () => {
      updateEarthVisibility();
      if (typeof ScrollTrigger === 'undefined' || ScrollTrigger.getAll().length === 0) {
        const indTop = industriesSectionEl.offsetTop;
        const portBottom = portfolioSectionEl.offsetTop + portfolioSectionEl.offsetHeight;
        const totalDist = portBottom - indTop - window.innerHeight;
        const currentPos = window.scrollY - indTop;
        const p = Math.max(0, Math.min(1, currentPos / Math.max(1, totalDist)));
        updateEarthProgress(p);
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      resizeEarthCanvas();
      updateEarthVisibility();
    });

    resizeEarthCanvas();
    updateEarthVisibility();
    updateEarthProgress(0);

    // 60fps/120fps smooth critical damping render loop
    function earthRenderLoop() {
      const diff = earthTargetFrame - earthCurrentFrame;
      if (Math.abs(diff) > 0.02) {
        earthCurrentFrame += diff * 0.18;
        renderEarth();
      }
      requestAnimationFrame(earthRenderLoop);
    }
    requestAnimationFrame(earthRenderLoop);
  }

  // =========================================================================
  // 3D. Handani AI Neural Scroll-Bound Canvas Animation Engine
  //     Scrub-controls 225 cinema frames of human hand manifesting AI neural core & digital ecosystem.
  //     Active across Section 9 (Estimator) & Section 10 (Contact).
  // =========================================================================
  const handaniStage = document.getElementById('handaniScrollStage');
  const handaniCanvas = document.getElementById('handaniCanvas');
  const handaniAmbientGlow = document.getElementById('handaniAmbientGlow');
  const handaniTelemetryProgress = document.getElementById('handaniTelemetryProgress');
  const handaniTelemetryPhase = document.getElementById('handaniTelemetryPhase');
  const handaniNodesVal = document.getElementById('handaniNodesVal');
  const handaniTelemetryLabel = document.getElementById('handaniTelemetryLabel');

  const estimatorSectionEl = document.getElementById('estimator') || document.querySelector('.section-estimator');
  const contactSectionEl = document.getElementById('contact') || document.querySelector('.section-contact-full');
  const footerSectionEl = document.getElementById('footer') || document.querySelector('.footer');

  if (handaniCanvas && estimatorSectionEl && contactSectionEl) {
    const hCtx = handaniCanvas.getContext('2d');
    const TOTAL_HANDANI_FRAMES = 225;
    const handaniFrames = new Array(TOTAL_HANDANI_FRAMES + 1);
    const handaniLoaded = new Array(TOTAL_HANDANI_FRAMES + 1).fill(false);

    let handaniTargetFrame = 1;
    let handaniCurrentFrame = 1;
    let handaniRenderedFrame = -1;
    let hasPlayedHandaniAudio = false;

    function getHandaniFrameSrc(index) {
      const num = String(index).padStart(3, '0');
      return `assets/handani/ezgif-frame-${num}.jpg`;
    }

    function resizeHandaniCanvas() {
      if (!handaniCanvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      handaniCanvas.width = Math.round(w * dpr);
      handaniCanvas.height = Math.round(h * dpr);
      handaniCanvas.style.width = `${w}px`;
      handaniCanvas.style.height = `${h}px`;
      handaniRenderedFrame = -1;
      renderHandani();
    }

    function getNearestHandaniImage(targetIdx) {
      const rounded = Math.max(1, Math.min(TOTAL_HANDANI_FRAMES, Math.round(targetIdx)));
      if (handaniLoaded[rounded] && handaniFrames[rounded]) return handaniFrames[rounded];
      for (let offset = 1; offset < TOTAL_HANDANI_FRAMES; offset++) {
        const left = rounded - offset;
        if (left >= 1 && handaniLoaded[left] && handaniFrames[left]) return handaniFrames[left];
        const right = rounded + offset;
        if (right <= TOTAL_HANDANI_FRAMES && handaniLoaded[right] && handaniFrames[right]) return handaniFrames[right];
      }
      return handaniFrames[1] || null;
    }

    function renderHandani() {
      const frameIdx = Math.max(1, Math.min(TOTAL_HANDANI_FRAMES, Math.round(handaniCurrentFrame)));
      const img = getNearestHandaniImage(frameIdx);
      if (!hCtx || !img || !img.complete || img.naturalWidth === 0) return;

      const cw = handaniCanvas.width;
      const ch = handaniCanvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Aspect ratio cover scale to immerse the entire viewport
      const r = Math.max(cw / iw, ch / ih);
      const nw = iw * r;
      const nh = ih * r;
      const cx = (cw - nw) * 0.5;
      const cy = (ch - nh) * 0.5;

      hCtx.clearRect(0, 0, cw, ch);
      hCtx.drawImage(img, 0, 0, iw, ih, cx, cy, nw, nh);
      handaniRenderedFrame = frameIdx;
    }

    function loadHandaniFrame(idx, onComplete) {
      if (handaniFrames[idx] && handaniLoaded[idx]) {
        if (onComplete) onComplete(handaniFrames[idx]);
        return;
      }
      const img = new Image();
      img.onload = () => {
        handaniFrames[idx] = img;
        handaniLoaded[idx] = true;
        if (onComplete) onComplete(img);
        if (Math.round(handaniCurrentFrame) === idx || handaniRenderedFrame === -1) {
          renderHandani();
        }
      };
      img.src = getHandaniFrameSrc(idx);
    }

    // Lazy load Handani frames when scrolling towards portfolio/estimator section
    let handaniLoadingStarted = false;
    function startHandaniLoading() {
      if (handaniLoadingStarted) return;
      handaniLoadingStarted = true;

      // Step 1: Immediately load and render Frame 1
      loadHandaniFrame(1, () => {
        renderHandani();
      });

      // Step 2: Progressive Keyframe Stride across full arc
      const isMobileHandani = window.innerWidth <= 768;
      const strideStep = isMobileHandani ? 20 : 15;
      for (let k = strideStep; k <= TOTAL_HANDANI_FRAMES; k += strideStep) {
        loadHandaniFrame(k);
      }

      // Step 3: Stream all remaining frames progressively in background
      let nextHandaniIdx = 2;
      const handaniStep = isMobileHandani ? 2 : 1;
      function loadNextHandaniBatch() {
        let count = 0;
        while (nextHandaniIdx <= TOTAL_HANDANI_FRAMES && count < (isMobileHandani ? 3 : 5)) {
          if (!handaniFrames[nextHandaniIdx]) {
            loadHandaniFrame(nextHandaniIdx);
            count++;
          }
          nextHandaniIdx += handaniStep;
        }
        if (nextHandaniIdx <= TOTAL_HANDANI_FRAMES) {
          setTimeout(loadNextHandaniBatch, 35);
        }
      }
      setTimeout(loadNextHandaniBatch, 100);
    }

    const portfolioSectionForHandani = document.getElementById('portfolio');
    if ('IntersectionObserver' in window && portfolioSectionForHandani) {
      const handaniObserver = new IntersectionObserver((entries) => {
        if (entries.some(e => e.isIntersecting)) {
          startHandaniLoading();
          handaniObserver.disconnect();
        }
      }, { rootMargin: '600px 0px' });
      handaniObserver.observe(portfolioSectionForHandani);
    } else {
      setTimeout(startHandaniLoading, 4000);
    }

    function updateHandaniProgress(progressVal) {
      if (!handaniLoadingStarted) startHandaniLoading();
      const p = Math.max(0, Math.min(1, progressVal));
      handaniTargetFrame = 1 + p * (TOTAL_HANDANI_FRAMES - 1);

      // Telemetry HUD updates
      if (handaniTelemetryProgress) {
        handaniTelemetryProgress.style.width = `${(p * 100).toFixed(1)}%`;
      }

      if (handaniTelemetryPhase && handaniNodesVal) {
        if (p < 0.28) {
          handaniTelemetryPhase.textContent = 'TRANS-CONTINENTAL LINK // CANADA - AUSTRALIA';
          handaniNodesVal.textContent = 'GLOBAL NODE ARCHITECTURE // SYNCHRONIZED';
          if (handaniTelemetryLabel) handaniTelemetryLabel.textContent = 'GLOBAL NETWORK';
        } else if (p < 0.65) {
          handaniTelemetryPhase.textContent = 'NEURAL COGNITION // AI ECOSYSTEM';
          handaniNodesVal.textContent = 'INTERACTIVE SCOPE MATRIX // ACTIVE';
          if (handaniTelemetryLabel) handaniTelemetryLabel.textContent = 'PROJECT ESTIMATOR';
        } else {
          handaniTelemetryPhase.textContent = 'SYNAPTIC NETWORK // DISTRIBUTED ARCHITECTURE';
          handaniNodesVal.textContent = 'ENTERPRISE BLUEPRINT // SYNCHRONIZING';
          if (handaniTelemetryLabel) handaniTelemetryLabel.textContent = 'ENTERPRISE CONSULTATION';
        }
      }

      // Audio micro-haptic when full AI neural sphere ignites (~50%)
      if (p >= 0.48 && p <= 0.54) {
        if (!hasPlayedHandaniAudio && typeof AudioEngine !== 'undefined') {
          AudioEngine.playBeep(520, 'sine', 0.2, 0.03);
          hasPlayedHandaniAudio = true;
        }
      } else if (p < 0.35 || p > 0.65) {
        hasPlayedHandaniAudio = false;
      }
    }

    function updateHandaniVisibility() {
      if (!handaniStage || !estimatorSectionEl || !contactSectionEl) return;
      const rectEst = estimatorSectionEl.getBoundingClientRect();
      const rectContact = contactSectionEl.getBoundingClientRect();
      const vh = window.innerHeight || 800;

      // Check if user is anywhere in or entering Estimator or Contact
      if (rectEst.top > vh || rectContact.bottom <= 0) {
        handaniStage.style.opacity = '0';
        handaniStage.style.visibility = 'hidden';
      } else {
        let opacity = 1;
        // Fade in as Estimator enters from bottom of viewport
        if (rectEst.top > 0) {
          opacity = Math.max(0, Math.min(1, (vh - rectEst.top) / (vh * 0.75)));
        }
        // Fade out as Contact exits top of viewport
        if (rectContact.bottom < vh) {
          const outFade = Math.max(0, Math.min(1, rectContact.bottom / (vh * 0.6)));
          opacity = Math.min(opacity, outFade);
        }
        // Keep footer 100% solid pure black: fade out Handani as footer enters
        if (footerSectionEl) {
          const rectFooter = footerSectionEl.getBoundingClientRect();
          if (rectFooter.top < vh) {
            const footerFade = Math.max(0, Math.min(1, (rectFooter.top - (vh * 0.7)) / (vh * 0.25)));
            opacity = Math.min(opacity, footerFade);
          }
        }
        handaniStage.style.opacity = opacity.toFixed(2);
        handaniStage.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
      }
    }

    // GSAP ScrollTrigger Integration
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Scrub progress smoothly across Estimator and Contact
      ScrollTrigger.create({
        trigger: estimatorSectionEl,
        start: 'top top',
        endTrigger: contactSectionEl,
        end: 'bottom bottom',
        scrub: 0.25,
        onUpdate: (self) => {
          updateHandaniProgress(self.progress);
        }
      });

      // Visibility & Entrance/Exit trigger
      ScrollTrigger.create({
        trigger: estimatorSectionEl,
        start: 'top bottom',
        endTrigger: contactSectionEl,
        end: 'bottom top',
        scrub: true,
        onUpdate: () => {
          updateHandaniVisibility();
        }
      });

      // Global Presence Trans-Continental Arc Scroll-Down Draw Animation
      const globalArcLine = document.getElementById('canadaAustraliaArc');
      const globalAmbientTrail = document.querySelector('.arc-ambient-trail');
      const globalMapConsole = document.querySelector('.global-map-console');
      if (globalArcLine && globalMapConsole) {
        gsap.fromTo([globalArcLine, globalAmbientTrail].filter(Boolean),
          { strokeDashoffset: 1400 },
          {
            strokeDashoffset: 0,
            duration: 2.0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: globalMapConsole,
              start: 'top 80%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }
    }

    // Direct scroll listener for smooth fallback & Lenis updates
    window.addEventListener('scroll', () => {
      updateHandaniVisibility();
      if (typeof ScrollTrigger === 'undefined' || ScrollTrigger.getAll().length === 0) {
        const startTop = estimatorSectionEl.offsetTop;
        const totalDist = (contactSectionEl.offsetTop + contactSectionEl.offsetHeight) - startTop - window.innerHeight;
        const currentPos = window.scrollY - startTop;
        const p = Math.max(0, Math.min(1, currentPos / Math.max(1, totalDist)));
        updateHandaniProgress(p);
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      resizeHandaniCanvas();
      updateHandaniVisibility();
    });

    resizeHandaniCanvas();
    updateHandaniVisibility();
    updateHandaniProgress(0);

    // 60fps/120fps smooth critical damping render loop
    function handaniRenderLoop() {
      const diff = handaniTargetFrame - handaniCurrentFrame;
      if (Math.abs(diff) > 0.02) {
        handaniCurrentFrame += diff * 0.18;
        renderHandani();
      }
      requestAnimationFrame(handaniRenderLoop);
    }
    requestAnimationFrame(handaniRenderLoop);
  }


  // =========================================================================
  // 4. Custom Gold Cursor Logic (Desktop Only)
  // =========================================================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const cursorLabel = document.getElementById('cursorLabel');

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function renderCursorRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursorRing);
    }
    requestAnimationFrame(renderCursorRing);

    // Contextual cursor labels for interactive elements
    const hoverElements = document.querySelectorAll('[data-cursor], a, button, .award-card, .capability-card, .portfolio-card');
    hoverElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        const labelText = el.getAttribute('data-cursor') || 'VIEW';
        cursorRing.classList.add('cursor-hover');
        if (labelText) {
          cursorLabel.textContent = labelText;
          cursorRing.classList.add('has-label');
        }
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.classList.remove('cursor-hover', 'has-label');
        cursorLabel.textContent = '';
      });
    });
  }

  // =========================================================================
  // 5. Floating Navigation Scroll Shrink & Hide/Reveal Logic
  // =========================================================================
  const navbar = document.getElementById('topNavbar');
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    
    // Background blur & shrink
    if (st > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll Down -> Hide, Scroll Up -> Reappear
    if (st > 250) {
      if (st > lastScrollTop + 10) {
        navbar.classList.add('nav-hidden');
      } else if (st < lastScrollTop - 10) {
        navbar.classList.remove('nav-hidden');
      }
    } else {
      navbar.classList.remove('nav-hidden');
    }
    lastScrollTop = Math.max(0, st);

    // Active indicator tracking
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (st >= top && st < top + height) {
        document.querySelectorAll('.nav-link').forEach((link) => {
          link.classList.toggle('active', link.getAttribute('data-nav') === id);
        });
      }
    });
  }, { passive: true });

  // Mobile Menu Toggle with Body Lock & Smooth Navigation
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileMenu = document.getElementById('mobileMenuOverlay');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-nav-link').forEach((l) => {
      l.addEventListener('click', (e) => {
        mobileMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
        const targetId = l.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            if (window.lenis) {
              window.lenis.scrollTo(targetEl, { offset: -70, duration: 1.2 });
            } else {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      });
    });
  }

  // =========================================================================
  // 6. Statistics Counter Animation
  // =========================================================================
  const statNumbers = document.querySelectorAll('.metric-number[data-count], .hero-metric-val[data-count]');
  let counted = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        statNumbers.forEach((num) => {
          const target = parseInt(num.getAttribute('data-count'), 10);
          const suffix = num.getAttribute('data-suffix') || '+';
          const duration = 1600;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(1, elapsed / duration);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const val = Math.floor(easeOut * target);
            num.textContent = `${val}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              num.textContent = `${target}${suffix}`;
            }
          }
          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.15 });

  const metricsGroup = document.querySelector('.hero-metrics-bar, .metrics-card-group');
  if (metricsGroup) countObserver.observe(metricsGroup);

  // =========================================================================
  // 7. Awards Verification Modal
  // =========================================================================
  const awardModal = document.getElementById('awardModal');
  const awardModalCloseBtn = document.getElementById('awardModalCloseBtn');
  const awardModalTitle = document.getElementById('awardModalTitle');
  const awardModalBody = document.getElementById('awardModalBody');
  const awardVerifyBtn = document.getElementById('awardVerifyBtn');
  const awardModalBadgeImg = document.getElementById('awardModalBadgeImg');
  const awardModalDefaultSvg = document.getElementById('awardModalDefaultSvg');

  const awardDetails = {
    star: {
      title: "Star Excellence Awards 2021",
      body: "Recognized by the National Integrity Cultural Academy for outstanding contribution to digital innovation, technical excellence, and sustainable enterprise solutions.",
      link: "https://riyadvisoftwaretechnologies.com/"
    },
    designrush: {
      title: "DesignRush — Top Web Development Company 2025",
      body: "“We are proud to be featured on DesignRush for our outstanding work.” Accredited on DesignRush's international B2B index as a premier technology agency engineering scalable architectures and conversion-driven digital products.",
      link: "https://www.designrush.com/"
    },
    techbehemoths: {
      title: "TechBehemoths Global Awards 2025",
      body: "Location: Berlin, Germany. Riyadvi Software Technologies Pvt. Ltd. was officially recognized as global winners across ReactJS, WordPress, and Social Media Marketing (SMM).",
      link: "https://techbehemoths.com/company/riyadvi-software-technologies-private-limited"
    }
  };

  document.querySelectorAll('.award-card').forEach((card) => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-award');
      const data = awardDetails[key] || awardDetails.techbehemoths;
      if (awardModalTitle) awardModalTitle.textContent = data.title;
      if (awardModalBody) awardModalBody.textContent = data.body;
      if (awardVerifyBtn) awardVerifyBtn.href = data.link;

      if (awardModalBadgeImg && awardModalDefaultSvg) {
        if (key === 'designrush') {
          awardModalBadgeImg.src = 'assets/designrush_badge.png';
          awardModalBadgeImg.alt = 'DesignRush';
          awardModalBadgeImg.style.display = 'block';
          awardModalDefaultSvg.style.display = 'none';
        } else {
          awardModalBadgeImg.style.display = 'none';
          awardModalDefaultSvg.style.display = 'block';
        }
      }

      if (awardModal) awardModal.classList.add('open');
      AudioEngine.playBeep(750, 'sine', 0.1, 0.03);
    });
  });

  if (awardModalCloseBtn && awardModal) {
    awardModalCloseBtn.addEventListener('click', () => awardModal.classList.remove('open'));
    awardModal.addEventListener('click', (e) => {
      if (e.target === awardModal) awardModal.classList.remove('open');
    });
  }

  // =========================================================================
  // 8. Service Detail Lifecycle Modal
  // =========================================================================
  const serviceModal = document.getElementById('serviceLifecycleModal');
  const serviceModalCloseBtn = document.getElementById('serviceModalCloseBtn');
  const serviceModalBadge = document.getElementById('serviceModalBadge');
  const serviceModalTitle = document.getElementById('serviceModalTitle');
  const serviceModalDesc = document.getElementById('serviceModalDesc');
  const serviceModalTags = document.getElementById('serviceModalTags');
  const serviceModalDeliverables = document.getElementById('serviceModalDeliverables');
  const serviceModalActionBtn = document.getElementById('serviceModalActionBtn');

  const serviceData = {
    web: {
      badge: "01 // CORE ARCHITECTURE",
      title: "Web Development Architecture",
      desc: "Next-generation responsive web applications engineered with headless CMS, sub-second load times, and custom APIs.",
      tags: ["React", "Next.js", "Node.js", "TypeScript", "TailwindCSS", "GraphQL", "Headless CMS", "Edge CDN"],
      deliverables: [
        "Sub-second Largest Contentful Paint (LCP < 1.2s)",
        "Fully responsive & WCAG accessible UI components",
        "Scalable micro-frontend & modular architecture",
        "Automated CI/CD pipelines & zero-downtime deployment"
      ]
    },
    custom: {
      badge: "02 // ENTERPRISE SYSTEMS",
      title: "Custom Software Development",
      desc: "Mission-critical enterprise software, bespoke CRM/ERP platforms, microservice architectures, and multi-tenant cloud backends.",
      tags: ["Node.js", "Microservices", "PostgreSQL", "AWS Cloud", "Docker", "Kubernetes", "Redis", "Kafka"],
      deliverables: [
        "High-throughput distributed cloud architectures",
        "ACID-compliant relational & NoSQL data pipelines",
        "Role-based enterprise security & OAuth2 / SAML SSO",
        "99.99% uptime guarantee with automated failover"
      ]
    },
    mobile: {
      badge: "03 // MOBILE ENGINEERING",
      title: "Mobile App Development",
      desc: "High-performance cross-platform iOS and Android mobile applications built for fluid user engagement and offline resilience.",
      tags: ["Flutter", "React Native", "Swift / iOS", "Kotlin / Android", "REST APIs", "SQLite", "Firebase", "App Store CI/CD"],
      deliverables: [
        "Consistent 60fps/120fps fluid micro-interactions",
        "Offline-first data sync & local encryption",
        "Native device integration (Biometrics, GPS, Push)",
        "App Store & Google Play compliance & publishing"
      ]
    },
    ecommerce: {
      badge: "04 // COMMERCE ENGINEERING",
      title: "E-Commerce Solutions",
      desc: "High-converting online store architectures with seamless payment gateways, automated inventory sync, and instant checkout.",
      tags: ["WooCommerce", "Shopify Plus", "Stripe", "Headless Commerce", "Razorpay", "Inventory Sync", "Cart Optimization", "ERP Integration"],
      deliverables: [
        "Sub-second frictionless one-click checkout flows",
        "Multi-currency & multi-regional localized tax rules",
        "Omnichannel inventory & warehouse management sync",
        "Abandoned cart recovery & automated upsell funnels"
      ]
    },
    gamedev: {
      badge: "05 // REALTIME GAME ENGINES",
      title: "Game Development",
      desc: "High-performance 2D and 3D games engineered with cutting-edge physics, immersive audio, cross-platform multiplayer, and custom shaders.",
      tags: ["Unreal Engine 5", "Unity", "C++", "C#", "HLSL / GLSL", "Multiplayer Networking", "Physics Simulation", "Game AI"],
      deliverables: [
        "Cross-platform game deployment (PC, Console, Mobile, Web)",
        "Real-time multiplayer client-server architecture",
        "Custom shader authoring & dynamic visual effects (VFX)",
        "End-to-end game lifecycle: mechanics, audio, and QA testing"
      ]
    },
    arvr: {
      badge: "06 // SPATIAL COMPUTING & XR",
      title: "AR/VR Development",
      desc: "Transformative spatial computing, WebXR environments, 6-DoF interactive simulations, and enterprise XR apps for Apple Vision Pro and Meta Quest.",
      tags: ["Apple VisionOS", "Meta Quest", "WebXR", "Unity XR", "ARKit / ARCore", "Spatial Audio", "6-DoF Tracking", "Hand Tracking"],
      deliverables: [
        "Spatial computing apps for VisionOS and Meta Quest ecosystem",
        "Browser-accessible WebXR immersive interactive experiences",
        "Enterprise AR training simulations & digital twins",
        "Real-time spatial audio and precision hand-tracking integration"
      ]
    },
    design: {
      badge: "07 // CREATIVE & DESIGN SYSTEMS",
      title: "UI/UX Design & Architecture",
      desc: "Bespoke design systems, rapid interactive Figma prototypes, and micro-interaction flows centered around conversion rate optimization.",
      tags: ["Figma", "Design Systems", "Interactive Prototypes", "Wireframing", "User Research", "Motion Design", "Design Tokens", "Usability Testing"],
      deliverables: [
        "Scalable atomic design system with Figma token sync",
        "High-fidelity interactive prototype click-throughs",
        "Data-backed UX user journeys & heatmaps analysis",
        "Pixel-perfect developer handoff specifications"
      ]
    },
    '3d': {
      badge: "08 // 3D ASSETS & CGI",
      title: "3D Modeling Design & Digital Assets",
      desc: "Photorealistic 3D modeling, cinematic rendering, interactive product configurators, and optimized real-time 3D web assets.",
      tags: ["Blender", "Three.js", "Cinema 4D", "ZBrush", "GLTF / GLB", "PBR Texturing", "GLSL Shaders", "3D Optimization"],
      deliverables: [
        "Photorealistic 3D product visualizations & renders",
        "Ultra-lightweight real-time mesh compression (< 3MB)",
        "Interactive 360° product configurators for web & e-commerce",
        "Rigged, textured, and game-ready 3D asset libraries"
      ]
    },
    marketing: {
      badge: "09 // GROWTH ACCELERATION",
      title: "Digital Marketing & Performance",
      desc: "High-ROI multi-channel customer acquisition funnels, paid performance campaigns, and programmatic lead generation.",
      tags: ["Google Ads", "Meta Ads", "Lead Funnels", "ROI Analytics", "HubSpot", "Conversion Rate Opt", "Retargeting", "A/B Testing"],
      deliverables: [
        "Multi-touch attribution & conversion tracking",
        "Predictive audience cohort targeting & retargeting",
        "Continuous landing page split-testing (A/B & MVT)",
        "Lower customer acquisition cost (CAC) & higher ROAS"
      ]
    },
    seo: {
      badge: "10 // AUTHORITY & DOMINANCE",
      title: "SEO & Social Media (SMM)",
      desc: "Award-winning organic search engine dominance and viral social media campaigns that capture targeted market share.",
      tags: ["Technical SEO", "SMM Mastery", "Backlinks", "Schema Markup", "Core Web Vitals", "Content Strategy", "Trend Hijacking", "Viral Campaigns"],
      deliverables: [
        "Dominant Google Page-1 search ranking strategies",
        "Rich snippet schema markup & semantic entity graph",
        "Viral social media calendar & content distribution",
        "High-authority PR backlink acquisition campaigns"
      ]
    }
  };

  function openServiceModal(key) {
    const info = serviceData[key] || serviceData.web;
    if (serviceModalBadge) serviceModalBadge.textContent = info.badge || "RIYADVI // CAPABILITY";
    if (serviceModalTitle) serviceModalTitle.textContent = info.title;
    if (serviceModalDesc) serviceModalDesc.textContent = info.desc;

    if (serviceModalTags) {
      serviceModalTags.innerHTML = '';
      (info.tags || []).forEach(tag => {
        const span = document.createElement('span');
        span.className = 'service-modal-tag';
        span.textContent = tag;
        serviceModalTags.appendChild(span);
      });
    }

    if (serviceModalDeliverables) {
      serviceModalDeliverables.innerHTML = '';
      (info.deliverables || []).forEach(item => {
        const div = document.createElement('div');
        div.className = 'service-deliverable-item';
        div.textContent = item;
        serviceModalDeliverables.appendChild(div);
      });
    }

    if (serviceModal) {
      serviceModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    if (typeof AudioEngine !== 'undefined' && AudioEngine.playBeep) {
      AudioEngine.playBeep(820, 'sine', 0.1, 0.03);
    }
  }

  function closeServiceModal() {
    if (serviceModal) {
      serviceModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('[data-service-trigger]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = el.getAttribute('data-service-trigger');
      if (key) openServiceModal(key);
    });
  });

  if (serviceModalCloseBtn) {
    serviceModalCloseBtn.addEventListener('click', closeServiceModal);
  }
  if (serviceModal) {
    serviceModal.addEventListener('click', (e) => {
      if (e.target === serviceModal) closeServiceModal();
    });
  }
  if (serviceModalActionBtn) {
    serviceModalActionBtn.addEventListener('click', () => {
      closeServiceModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && serviceModal && serviceModal.classList.contains('open')) {
      closeServiceModal();
    }
  });

  // Bento Category Tabs Switching (Development, Designing, Marketing)
  document.querySelectorAll('.bento-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.bento-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-bento-tab');
      const gDev = document.getElementById('bentoGroupDevelopment');
      const gDesign = document.getElementById('bentoGroupDesign');
      const gMkt = document.getElementById('bentoGroupMarketing');

      if (target === 'development') {
        if (gDev) gDev.style.display = 'grid';
        if (gDesign) gDesign.style.display = 'none';
        if (gMkt) gMkt.style.display = 'none';
      } else if (target === 'designing') {
        if (gDev) gDev.style.display = 'none';
        if (gDesign) gDesign.style.display = 'grid';
        if (gMkt) gMkt.style.display = 'none';
      } else if (target === 'marketing') {
        if (gDev) gDev.style.display = 'none';
        if (gDesign) gDesign.style.display = 'none';
        if (gMkt) gMkt.style.display = 'grid';
      }
      AudioEngine.playBeep(640, 'triangle', 0.08, 0.02);
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      if (typeof ScrollRevealEngine !== 'undefined') {
        const activeGroup = target === 'development' ? gDev : (target === 'designing' ? gDesign : gMkt);
        ScrollRevealEngine.refreshGroup(activeGroup);
      }
    });
  });

  // =========================================================================
  // 8C. Thumbnail Image Viewer Engine for Trust Section (6 Core Pillars)
  // =========================================================================
  const trustViewer = document.getElementById('trustImageViewer');
  if (trustViewer) {
    const PILLARS_DATA = [
      {
        num: "01",
        category: "01 / STRATEGY",
        title: "Result-Driven Strategy",
        desc: "We align every pixel and database schema with commercial objectives, conversion funnels, and revenue metrics.",
        tag: "COMMERCIAL ROI & CONVERSION ARCHITECTURE",
        credit: "The Riyadvi Engineering Standard • Pillar 01",
        img: "assets/bento_service_landscape.jpg"
      },
      {
        num: "02",
        category: "02 / EXPERTISE",
        title: "Expert Technology Team",
        desc: "Senior architects and full-stack engineers experienced in modern TypeScript, Next.js, Cloud APIs, and 3D WebGL.",
        tag: "SENIOR ARCHITECTS & FULL-STACK ENGINE",
        credit: "The Riyadvi Engineering Standard • Pillar 02",
        img: "assets/timeline_studio_chennai.jpg"
      },
      {
        num: "03",
        category: "03 / DESIGN",
        title: "Design-Led Development",
        desc: "Aesthetic sophistication paired with friction-free UX to wow prospective clients while maximizing conversions.",
        tag: "AESTHETIC SOPHISTICATION & FRICTION-FREE UX",
        credit: "The Riyadvi Engineering Standard • Pillar 03",
        img: "assets/bento_service_bridge.jpg"
      },
      {
        num: "04",
        category: "04 / TRANSPARENCY",
        title: "Transparent Process",
        desc: "Clear sprints, real-time staging previews, weekly syncs, and comprehensive documentation from kickoff to deployment.",
        tag: "AGILE VELOCITY & SPRINT TRANSPARENCY",
        credit: "The Riyadvi Engineering Standard • Pillar 04",
        img: "assets/timeline_designrush_award.jpg"
      },
      {
        num: "05",
        category: "05 / PARTNERSHIP",
        title: "Long-Term Partnership",
        desc: "50+ recurring clients rely on Riyadvi as their ongoing technological co-pilot and growth infrastructure.",
        tag: "RECURRING GROWTH CO-PILOT INFRASTRUCTURE",
        credit: "The Riyadvi Engineering Standard • Pillar 05",
        img: "assets/bento_service_hand.jpg"
      },
      {
        num: "06",
        category: "06 / SUPPORT",
        title: "Continuous Support",
        desc: "Proactive maintenance, 24/7 uptime monitoring, security patching, and ongoing performance tuning.",
        tag: "PROACTIVE 24/7 UPTIME & SECURITY PATCHING",
        credit: "The Riyadvi Engineering Standard • Pillar 06",
        img: "assets/timeline_guardian3d_system.jpg"
      }
    ];

    let activePillar = 0;
    const stageImg = document.getElementById('tivStageImg');
    const pillarNumEl = document.getElementById('tivPillarNum');
    const stageTagEl = document.getElementById('tivStageTag');
    const stageTitleEl = document.getElementById('tivStageTitle');
    const stageDescEl = document.getElementById('tivStageDesc');
    const captionTitleEl = document.getElementById('tivCaptionTitle');
    const captionCreditEl = document.getElementById('tivCaptionCredit');
    const counterCurrentEl = document.getElementById('tivCounterCurrent');
    const prevBtn = document.getElementById('tivPrevBtn');
    const nextBtn = document.getElementById('tivNextBtn');
    const thumbBtns = trustViewer.querySelectorAll('.tiv-thumb-btn');

    const AUTO_DELAY = 4200; // 4.2s per slide
    let autoTimer = null;
    let isPaused = false;
    let isVisible = false;
    const progressBar = document.getElementById('tivProgressBar');

    function resetProgressBar() {
      if (!progressBar) return;
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
    }

    function triggerProgressBar() {
      if (!progressBar) return;
      resetProgressBar();
      // Force DOM reflow to restart css animation
      void progressBar.offsetWidth;
      if (!isPaused && isVisible) {
        progressBar.style.transition = `width ${AUTO_DELAY}ms linear`;
        progressBar.style.width = '100%';
      }
    }

    function startAutoPlay() {
      if (autoTimer) clearTimeout(autoTimer);
      if (!isVisible || isPaused) return;

      triggerProgressBar();

      autoTimer = setTimeout(() => {
        if (!isPaused && isVisible) {
          setPillar(activePillar + 1, false);
          startAutoPlay();
        }
      }, AUTO_DELAY);
    }

    function stopAutoPlay() {
      if (autoTimer) {
        clearTimeout(autoTimer);
        autoTimer = null;
      }
      resetProgressBar();
    }

    function pauseAutoPlay() {
      isPaused = true;
      if (autoTimer) {
        clearTimeout(autoTimer);
        autoTimer = null;
      }
      if (progressBar) {
        const computedWidth = window.getComputedStyle(progressBar).width;
        progressBar.style.transition = 'none';
        progressBar.style.width = computedWidth;
      }
    }

    function resumeAutoPlay() {
      if (!isPaused) return;
      isPaused = false;
      if (isVisible) {
        startAutoPlay();
      }
    }

    function setPillar(idx, playSound = true) {
      activePillar = (idx + PILLARS_DATA.length) % PILLARS_DATA.length;
      const data = PILLARS_DATA[activePillar];

      // Subtle image crossfade
      if (stageImg) {
        stageImg.style.opacity = '0.3';
        stageImg.style.transform = 'scale(0.98)';
        setTimeout(() => {
          stageImg.src = data.img;
          stageImg.alt = data.title;
          stageImg.style.opacity = '1';
          stageImg.style.transform = 'scale(1)';
        }, 120);
      }

      if (pillarNumEl) pillarNumEl.textContent = data.category;
      if (stageTagEl) stageTagEl.textContent = data.tag;
      if (stageTitleEl) stageTitleEl.textContent = data.title;
      if (stageDescEl) stageDescEl.textContent = data.desc;
      if (captionTitleEl) captionTitleEl.textContent = `${data.num} // ${data.title}`;
      if (captionCreditEl) captionCreditEl.textContent = data.credit;
      if (counterCurrentEl) counterCurrentEl.textContent = data.num;

      thumbBtns.forEach((btn, i) => {
        const isActive = i === activePillar;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.tabIndex = isActive ? 0 : -1;
      });

      if (thumbBtns[activePillar]) {
        thumbBtns[activePillar].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }

      if (playSound && typeof AudioEngine !== 'undefined') {
        AudioEngine.playBeep(560 + activePillar * 40, 'triangle', 0.05, 0.015);
      }
    }

    function handleManualInteraction(idx) {
      setPillar(idx, true);
      if (isVisible && !isPaused) {
        startAutoPlay();
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => handleManualInteraction(activePillar - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => handleManualInteraction(activePillar + 1));
    }

    thumbBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-pillar-idx'), 10);
        if (!isNaN(idx)) handleManualInteraction(idx);
      });
    });

    // Pause on hover so the user can comfortably examine details
    trustViewer.addEventListener('mouseenter', pauseAutoPlay);
    trustViewer.addEventListener('mouseleave', resumeAutoPlay);

    // Keyboard navigation (Left / Right arrow keys)
    trustViewer.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleManualInteraction(activePillar + 1);
        thumbBtns[activePillar]?.focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleManualInteraction(activePillar - 1);
        thumbBtns[activePillar]?.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        handleManualInteraction(0);
        thumbBtns[0]?.focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        handleManualInteraction(PILLARS_DATA.length - 1);
        thumbBtns[PILLARS_DATA.length - 1]?.focus();
      }
    });

    // IntersectionObserver to auto-play only when in viewport
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            isVisible = true;
            isPaused = false;
            startAutoPlay();
          } else {
            isVisible = false;
            stopAutoPlay();
          }
        });
      }, { threshold: 0.15 });
      observer.observe(trustViewer);
    } else {
      isVisible = true;
      startAutoPlay();
    }

    // Visibility change (pause if user switches browser tab)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoPlay();
      } else if (isVisible && !isPaused) {
        startAutoPlay();
      }
    });

    // GSAP ScrollTrigger Entrance
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(trustViewer, 
        { opacity: 0, y: 35 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: trustViewer,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }
  }

  // =========================================================================
  // 9. Riyadvi Guardian™ Platform Centered Three-Band Interactions & Form
  // =========================================================================
  const guardianPillChips = document.querySelectorAll('.guardian-pill-chip');
  const guardianFeatureCards = document.querySelectorAll('.guardian-feature-card');
  const tierCards = document.querySelectorAll('.tier-card');
  const guardianForm = document.getElementById('guardianForm');
  const guardianThankYou = document.getElementById('guardianThankYou');

  guardianPillChips.forEach((chip) => {
    chip.addEventListener('mouseenter', () => {
      if (typeof AudioEngine !== 'undefined' && AudioEngine.playBeep) {
        AudioEngine.playBeep(720, 'sine', 0.04, 0.015);
      }
    });
  });

  guardianFeatureCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      if (typeof AudioEngine !== 'undefined' && AudioEngine.playBeep) {
        AudioEngine.playBeep(580, 'sine', 0.04, 0.012);
      }
    });
  });

  tierCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      if (typeof AudioEngine !== 'undefined' && AudioEngine.playBeep) {
        AudioEngine.playBeep(640, 'sine', 0.05, 0.015);
      }
    });
  });

  if (guardianForm) {
    guardianForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Acoustic confirmation feedback
      if (typeof AudioEngine !== 'undefined' && AudioEngine.playBeep) {
        AudioEngine.playBeep(880, 'sine', 0.12, 0.03);
        setTimeout(() => AudioEngine.playBeep(1100, 'sine', 0.18, 0.04), 100);
      }

      // Hide the form fields and show the green dashed thank-you box
      guardianForm.style.display = 'none';
      if (guardianThankYou) {
        guardianThankYou.style.display = 'flex';
      }

      // =====================================================================
      // NOTE: CONNECT REAL FORM SUBMISSION ENDPOINT HERE
      // Example:
      // const formData = new FormData(guardianForm);
      // fetch('/api/guardian-consultation', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(Object.fromEntries(formData))
      // });
      // =====================================================================
    });
  }

  // =========================================================================
  // 10. Industry Ecosystem Interactive Selector & HUD Controller
  // =========================================================================
  const industriesData = [
    {
      num: "01",
      name: "Real Estate",
      cta: "REAL ESTATE",
      x: 38,
      y: 14,
      title: "Real Estate Digital Infrastructure",
      desc: "Virtual 3D property tours, dynamic CRM lead capture, MLS integration, and automated WhatsApp inspection booking engines built to convert high-net-worth real estate buyers.",
      stack: ["3D WebGL Virtual Walkthrough", "Next.js Headless", "Automated CRM Routing", "WhatsApp Funnel API"],
      geo: "LAT 13.0827° N // LON 80.2707° E"
    },
    {
      num: "02",
      name: "Healthcare",
      cta: "HEALTHCARE",
      x: 25,
      y: 18,
      title: "Healthcare & Telemedicine Systems",
      desc: "HIPAA-compliant patient portals, doctor tele-consultation booking engines, and electronic health record (EHR) sync engineered with zero downtime and ironclad security.",
      stack: ["HIPAA Compliant Cloud", "Real-Time WebRTC", "React Native Mobile App", "Secure EHR Interop"],
      geo: "LAT 37.7749° N // LON 122.4194° W"
    },
    {
      num: "03",
      name: "Education",
      cta: "EDTECH",
      x: 16,
      y: 28,
      title: "EdTech & Learning Infrastructure",
      desc: "Scalable interactive virtual classrooms, student assignment assessment workflows, and recurring course subscription gateways built for millions of concurrent learners.",
      stack: ["Video Streaming CDN", "Interactive Canvas LMS", "Adaptive Quiz Engines", "Stripe Multi-Currency"],
      geo: "LAT 51.5074° N // LON 0.1278° W"
    },
    {
      num: "04",
      name: "Retail",
      cta: "RETAIL",
      x: 55,
      y: 12,
      title: "Omnichannel Retail & POS Networks",
      desc: "POS terminal syncing, multi-store inventory automation, click-and-collect portals, and customer loyalty retention engines that maximize lifetime customer value.",
      stack: ["Distributed POS Sync", "Headless Shopify Store", "Real-Time Stock Matrix", "Loyalty Rewards Engine"],
      geo: "LAT 40.7128° N // LON 74.0060° W"
    },
    {
      num: "05",
      name: "E-Commerce",
      cta: "E-COMMERCE",
      x: 72,
      y: 15,
      title: "High-Volume Direct-to-Consumer (D2C)",
      desc: "High-converting storefronts, sub-second checkout pages, dynamic AI product recommendations, and automated drop-shipping pipelines engineered for peak scale.",
      stack: ["Next.js Headless Commerce", "Algolia Instant Search", "1-Click Accelerated Checkout", "Automated Retention Funnel"],
      geo: "LAT 35.6762° N // LON 139.6503° E"
    },
    {
      num: "06",
      name: "Sports & Fitness",
      cta: "FITNESS",
      x: 32,
      y: 26,
      title: "Member Portals & Fitness Telemetry",
      desc: "Gym membership subscription billing, workout telemetry tracking, personal trainer live scheduling, and branded companion mobile apps with push automation.",
      stack: ["BLE Wearable Sync", "Recurring Stripe Billing", "Trainer Live Scheduler", "React Native Companion"],
      geo: "LAT 34.0522° N // LON 118.2437° W"
    },
    {
      num: "07",
      name: "Professional Services",
      cta: "ADVISORY",
      x: 22,
      y: 12,
      title: "Professional Services & Legal Tech",
      desc: "Client intake automation, secure zero-knowledge document vaulting, contract digital signing workflows, and billable hour tracking portals.",
      stack: ["Zero-Knowledge Vault", "e-Signature Webhooks", "Client Intake Funnel", "Encrypted Billing API"],
      geo: "LAT 25.2048° N // LON 55.2708° E"
    },
    {
      num: "08",
      name: "Startups",
      cta: "STARTUP",
      x: 12,
      y: 20,
      title: "Rapid MVP Launchpad Architecture",
      desc: "Rapid concept-to-deployment execution in 4-week sprints, investor-ready UI/UX design, serverless backend infrastructure, and scalable cloud elasticity.",
      stack: ["4-Week MVP Sprints", "Supabase / Postgres", "Modern Tailwind/React", "Mixpanel Growth Funnel"],
      geo: "LAT 1.3521° N // LON 103.8198° E"
    },
    {
      num: "09",
      name: "SMEs",
      cta: "SME",
      x: 48,
      y: 18,
      title: "SME Digital Transformation Suite",
      desc: "Modernizing legacy manual processes, automating customer service inquiries with AI WhatsApp bots, and establishing dominant multi-channel online pipelines.",
      stack: ["Automated Invoicing", "WhatsApp Business Funnel", "Lead Capture Automation", "Cloud Operations Hub"],
      geo: "LAT 19.0760° N // LON 72.8777° E"
    },
    {
      num: "10",
      name: "Enterprise",
      cta: "ENTERPRISE",
      x: 64,
      y: 20,
      title: "Enterprise Multi-Tenant Infrastructure",
      desc: "High-availability microservice clusters, enterprise single sign-on (SSO), role-based permissions (RBAC), and SOC-2 standard cloud architectures.",
      stack: ["Kubernetes Microservices", "OAuth 2.0 / Okta SSO", "Multi-Region Cloud Failover", "24/7 SLA Telemetry"],
      geo: "LAT 48.8566° N // LON 2.3522° E"
    }
  ];

  let currentIndustryIndex = 0;

  // DOM Elements
  const indIndexCol = document.getElementById('industryIndexCol');
  const indNodesLayer = document.getElementById('industryNodesLayer');
  const indStageCol = document.getElementById('industryStageCol');
  const indLeaderSvg = document.getElementById('industryLeaderSvg');
  const indLeaderPath = document.getElementById('industryLeaderPath');
  const indLeaderEndDot = document.getElementById('industryLeaderEndDot');
  const indHudCard = document.getElementById('industryHudCard');
  const hudCardInner = document.getElementById('hudCardInner');

  const hudSectorTag = document.getElementById('hudSectorTag');
  const hudCounterTag = document.getElementById('hudCounterTag');
  const hudCardTitle = document.getElementById('hudCardTitle');
  const hudCardDesc = document.getElementById('hudCardDesc');
  const hudStackGrid = document.getElementById('hudStackGrid');
  const hudCtaBtn = document.getElementById('hudCtaBtn');
  const hudCtaText = document.getElementById('hudCtaText');
  const hudGeoCoords = document.getElementById('hudGeoCoords');

  // Render Signal Nodes dynamically over stage
  if (indNodesLayer) {
    indNodesLayer.innerHTML = industriesData.map((ind, i) => {
      const isFlipped = ind.x > 68 ? ' flipped' : '';
      const isActive = i === 0 ? ' active' : '';
      return `
        <button type="button" 
          class="industry-node-btn${isActive}${isFlipped}" 
          id="indNode-${i}" 
          data-index="${i}" 
          style="left: ${ind.x}%; top: ${ind.y}%;" 
          aria-label="Select ${ind.name} signal node"
          tabindex="0">
          <span class="industry-node-pulse" aria-hidden="true"></span>
          <span class="industry-node-dot" aria-hidden="true"></span>
          <span class="industry-node-label" aria-hidden="true">${ind.name}</span>
        </button>
      `;
    }).join('');
  }

  // Calculate and redraw Dashed Gold Leader Line
  function updateLeaderLine() {
    if (!indStageCol || !indLeaderSvg || !indLeaderPath || !indLeaderEndDot || !indHudCard) return;

    // Responsive: below 900px, nodes and line are hidden
    if (window.innerWidth <= 900) {
      indLeaderPath.setAttribute('d', '');
      indLeaderEndDot.setAttribute('cx', '-999');
      indLeaderEndDot.setAttribute('cy', '-999');
      return;
    }

    const activeNode = indNodesLayer ? indNodesLayer.querySelector('.industry-node-btn.active') : null;
    if (!activeNode) return;

    const stageRect = indStageCol.getBoundingClientRect();
    const cardRect = indHudCard.getBoundingClientRect();
    const nodeRect = activeNode.getBoundingClientRect();

    if (stageRect.width === 0 || cardRect.width === 0) return;

    // Node center coordinates relative to stage
    const nx = Math.round((nodeRect.left + nodeRect.width / 2) - stageRect.left);
    const ny = Math.round((nodeRect.top + nodeRect.height / 2) - stageRect.top);

    // Card entry point: near left of card top edge (e.g. 36px in from card left)
    const cardRelLeft = Math.round(cardRect.left - stageRect.left);
    const cardRelTop = Math.round(cardRect.top - stageRect.top);
    const entryX = cardRelLeft + 36;
    const entryY = cardRelTop;

    // Path: from node (nx, ny) -> horizontally to (entryX, ny) -> straight down into (entryX, entryY)
    const d = `M ${nx} ${ny} L ${entryX} ${ny} L ${entryX} ${entryY}`;
    indLeaderPath.setAttribute('d', d);
    indLeaderEndDot.setAttribute('cx', entryX);
    indLeaderEndDot.setAttribute('cy', entryY);
  }

  // Select Industry Function
  function selectIndustry(index, shouldFocus = false) {
    if (index < 0 || index >= industriesData.length) return;
    currentIndustryIndex = index;
    const data = industriesData[index];

    // 1. Update List Rows
    const rows = indIndexCol ? indIndexCol.querySelectorAll('.industry-index-row') : [];
    rows.forEach((row, i) => {
      const isActive = i === index;
      row.classList.toggle('active', isActive);
      row.setAttribute('aria-selected', isActive ? 'true' : 'false');
      row.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    if (shouldFocus && rows[index]) {
      rows[index].focus();
    }

    // 2. Update Nodes
    const nodes = indNodesLayer ? indNodesLayer.querySelectorAll('.industry-node-btn') : [];
    nodes.forEach((node, i) => {
      node.classList.toggle('active', i === index);
    });

    // 3. Card Content Transition: Fade & Slide up 12px
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hudCardInner) {
      if (!prefersReducedMotion) {
        hudCardInner.classList.add('animating');
      }

      setTimeout(() => {
        if (hudSectorTag) hudSectorTag.textContent = `SECTOR ${data.num} // ${data.name.toUpperCase()}`;
        if (hudCounterTag) hudCounterTag.textContent = `${data.num} / 10`;
        if (hudCardTitle) hudCardTitle.textContent = data.title;
        if (hudCardDesc) hudCardDesc.textContent = data.desc;

        if (hudStackGrid) {
          hudStackGrid.innerHTML = data.stack.map((item) => `
            <div class="hud-stack-item">
              <span class="hud-stack-bullet" aria-hidden="true">&#10022;</span>
              <span>${item}</span>
            </div>
          `).join('');
        }

        if (hudCtaText) hudCtaText.textContent = `CONSULT ${data.cta} EXPERTS`;
        if (hudGeoCoords) hudGeoCoords.textContent = data.geo;

        if (!prefersReducedMotion) {
          requestAnimationFrame(() => {
            hudCardInner.classList.remove('animating');
            updateLeaderLine();
          });
        } else {
          updateLeaderLine();
        }
      }, prefersReducedMotion ? 0 : 160);
    } else {
      updateLeaderLine();
    }

    // Play subtle high-tech sound beep
    if (typeof AudioEngine !== 'undefined' && AudioEngine.playBeep) {
      AudioEngine.playBeep(850, 'sine', 0.08, 0.02);
    }
  }

  // List Rows Click Event Listeners
  if (indIndexCol) {
    const rows = indIndexCol.querySelectorAll('.industry-index-row');
    rows.forEach((row, i) => {
      row.addEventListener('click', () => {
        selectIndustry(i, false);
      });
    });

    // Arrow Up / Arrow Down / Home / End Keyboard Navigation
    indIndexCol.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIdx = (currentIndustryIndex + 1) % industriesData.length;
        selectIndustry(nextIdx, true);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIdx = (currentIndustryIndex - 1 + industriesData.length) % industriesData.length;
        selectIndustry(prevIdx, true);
      } else if (e.key === 'Home') {
        e.preventDefault();
        selectIndustry(0, true);
      } else if (e.key === 'End') {
        e.preventDefault();
        selectIndustry(industriesData.length - 1, true);
      }
    });
  }

  // Nodes Click Event Listeners
  if (indNodesLayer) {
    indNodesLayer.addEventListener('click', (e) => {
      const btn = e.target.closest('.industry-node-btn');
      if (btn) {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        if (!isNaN(idx)) {
          selectIndustry(idx, false);
        }
      }
    });
  }

  // Window Resize & ResizeObserver for Dynamic Leader Line Redraw
  window.addEventListener('resize', updateLeaderLine);

  if (typeof ResizeObserver !== 'undefined') {
    const hudObserver = new ResizeObserver(() => {
      updateLeaderLine();
    });
    if (indStageCol) hudObserver.observe(indStageCol);
    if (indHudCard) hudObserver.observe(indHudCard);
  }

  // Initialize Leader Line on Page Ready & on Scroll
  setTimeout(() => {
    updateLeaderLine();
  }, 300);

  // Expose selectIndustry globally for external triggers if needed
  window.selectIndustry = selectIndustry;

  // 10D. Cosmic Shader Background for Industries Section (Disabled per user request)
  function initIndustryShaderBackground() {
    // Disabled to remove orange moving background over Earth canvas
    return;
    const canvas = document.getElementById('industryShaderCanvas');
    const section = document.getElementById('industries');
    if (!canvas || !section) return;

    let gl;
    try {
      gl = canvas.getContext('webgl2', { alpha: true, antialias: false, powerPreference: 'high-performance' });
    } catch (e) {
      return;
    }
    if (!gl) return;

    const vsSource = `#version 300 es
precision highp float;
in vec4 position;
void main(){
  gl_Position = position;
}`;

    const fsSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float
  a=rnd(i),
  b=rnd(i+vec2(1,0)),
  c=rnd(i+vec2(0,1)),
  d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}
float clouds(vec2 p) {
	float d=1., t=.0;
	for (float i=.0; i<3.; i++) {
		float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
		t=mix(t,d,a);
		d=a;
		p*=2./(i+1.);
	}
	return t;
}
void main(void) {
	vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
	vec3 col=vec3(0);
	float bg=clouds(vec2(st.x+T*.5,-st.y));
	uv*=1.-.3*(sin(T*.2)*.5+.5);
	for (float i=1.; i<12.; i++) {
		uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
		vec2 p=uv;
		float d=length(p);
		col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);
		float b=noise(i+p+bg*1.731);
		col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
		col=mix(col,vec3(bg*.25,bg*.137,bg*.05),d);
	}
	O=vec4(col,1);
}`;

    function createShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(program, 'resolution');
    const timeLoc = gl.getUniformLocation(program, 'time');

    let isVisible = false;
    let animId = null;

    function resize() {
      const rect = section.getBoundingClientRect();
      const dpr = Math.max(1, 0.5 * (window.devicePixelRatio || 1));
      const w = Math.floor(rect.width * dpr);
      const h = Math.floor(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    function render(now) {
      if (!isVisible) return;
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

      if (resLoc) gl.uniform2f(resLoc, canvas.width, canvas.height);
      if (timeLoc) gl.uniform1f(timeLoc, now * 1e-3);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible = true;
          resize();
          if (!animId) animId = requestAnimationFrame(render);
        } else {
          isVisible = false;
          if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
          }
        }
      });
    }, { threshold: 0.05 });

    observer.observe(section);
  }

  initIndustryShaderBackground();



  // =========================================================================
  // 10C. Portfolio & Verified Case Studies: Story-Flow Rows Controller
  // =========================================================================
  const caseStudiesData = [
    {
      index: "01",
      initials: "S11",
      name: "Studio 11 Salon & Spa",
      category: "Luxury Salon Chain • Retail",
      challenge: "Multi-location digital booking friction and fragmented local franchise presence across nationwide centers.",
      solution: "Architected unified high-speed booking portal, automated appointment sync, and localized franchise search visibility.",
      technologies: ["WordPress / Custom Engine", "Node.js API", "Geo-location routing", "High-performance CDN"],
      metrics: [
        { target: 210, prefix: "+", suffix: "%", decimals: 0, label: "ONLINE APPOINTMENTS" },
        { target: 40, prefix: "", suffix: "+", decimals: 0, label: "FRANCHISES UNIFIED" }
      ]
    },
    {
      index: "02",
      initials: "TNG",
      name: "TNG Global",
      category: "Enterprise Cloud Infrastructure • B2B",
      challenge: "Legacy corporate architecture struggling with high-concurrency client requests and data visibility.",
      solution: "Re-platformed into modern microservices with responsive enterprise dashboard and sub-50ms API response.",
      technologies: ["React", "Next.js", "TypeScript", "PostgreSQL", "AWS Elastic Cloud"],
      metrics: [
        { target: 99.99, prefix: "", suffix: "%", decimals: 2, label: "UPTIME GUARANTEED" },
        { target: 65, prefix: "", suffix: "%", decimals: 0, label: "LATENCY REDUCTION" }
      ]
    },
    {
      index: "03",
      initials: "PT",
      name: "Puratap Drinking Water Systems",
      category: "D2C E-Commerce • Clean Water Technology",
      challenge: "Conversion drop-offs during filter cartridge subscription checkout and field service lead capture.",
      solution: "Re-engineered checkout UX with instant 1-click recurring renewals and automated field tech dispatcher.",
      technologies: ["WooCommerce Headless", "Stripe Subscriptions", "Custom Lead Routing"],
      metrics: [
        { target: 42, prefix: "+", suffix: "%", decimals: 0, label: "CHECKOUT CONVERSION" },
        { target: 30000, prefix: "", suffix: "+", decimals: 0, separator: true, label: "ACTIVE SUBSCRIBERS" }
      ]
    },
    {
      index: "04",
      initials: "TB",
      name: "TechBehemoths Excellence Showcase",
      category: "Global Award Winning Web Architecture",
      challenge: "Deliver international-grade React.JS web performance under rigorous European benchmark standards.",
      solution: "Designed headless architecture achieving 100/100 Lighthouse performance metrics and automated SMM integration.",
      technologies: ["ReactJS", "Next.js", "Tailwind CSS", "Optimized WebGL", "Cloudflare Edge"],
      metrics: [
        { static: "2025", label: "TECHBEHEMOTHS GLOBAL WINNER" },
        { static: "Berlin, Germany", smaller: true, label: "AWARD LOCATION" }
      ]
    }
  ];

  function renderPortfolioStoryRows() {
    const listContainer = document.getElementById('portfolioRowsList');
    if (!listContainer) return;

    listContainer.innerHTML = caseStudiesData.map((cs) => {
      const metricsHtml = cs.metrics.map((m, mIdx) => {
        const divider = mIdx > 0 ? '<div class="result-metric-divider" aria-hidden="true"></div>' : '';
        if (m.static) {
          return `
            ${divider}
            <div class="result-metric-item">
              <div class="metric-number static-text ${m.smaller ? 'smaller-text' : ''}">${m.static}</div>
              <span class="metric-caption">${m.label}</span>
            </div>
          `;
        }
        return `
          ${divider}
          <div class="result-metric-item">
            <div class="metric-number"
                 data-target="${m.target}"
                 data-prefix="${m.prefix || ''}"
                 data-suffix="${m.suffix || ''}"
                 data-decimals="${m.decimals || 0}"
                 data-separator="${m.separator ? 'true' : 'false'}">
              ${m.prefix || ''}0${m.suffix || ''}
            </div>
            <span class="metric-caption">${m.label}</span>
          </div>
        `;
      }).join('');

      return `
        <article class="story-row-card" data-index="${cs.index}">
          <!-- Left 3px Gold Accent Bar -->
          <div class="row-accent-bar" aria-hidden="true"></div>

          <!-- 1. Client Cell -->
          <div class="row-cell cell-client">
            <div>
              <div class="client-badge-wrapper">
                <div class="client-badge" title="${cs.name}">
                  <span class="client-badge-initials">${cs.initials}</span>
                </div>
              </div>
              <div class="client-info">
                <h3 class="client-name">${cs.name}</h3>
                <span class="client-category">${cs.category}</span>
              </div>
            </div>
            <div class="client-index-num" aria-hidden="true">${cs.index}</div>
          </div>

          <!-- 2. Challenge Cell -->
          <div class="row-cell cell-challenge">
            <span class="mobile-cell-label" aria-hidden="true">CHALLENGE</span>
            <p class="challenge-text">${cs.challenge}</p>
          </div>

          <!-- 3. Arrow Cell 1 -->
          <div class="row-cell cell-arrow cell-arrow-1" aria-hidden="true">
            <div class="arrow-dashed-line"></div>
            <div class="arrow-circle"><span>&rarr;</span></div>
            <div class="arrow-dot"></div>
          </div>

          <!-- 4. Solution Cell -->
          <div class="row-cell cell-solution">
            <span class="mobile-cell-label" aria-hidden="true">SOLUTION</span>
            <p class="solution-text">${cs.solution}</p>
            <div class="solution-tech-divider" aria-hidden="true"></div>
            <span class="tech-label-mono">TECHNOLOGY</span>
            <div class="tech-chips-list">
              ${cs.technologies.map(tech => `<span class="tech-chip">${tech}</span>`).join('')}
            </div>
          </div>

          <!-- 5. Arrow Cell 2 -->
          <div class="row-cell cell-arrow cell-arrow-2" aria-hidden="true">
            <div class="arrow-dashed-line"></div>
            <div class="arrow-circle"><span>&rarr;</span></div>
            <div class="arrow-dot"></div>
          </div>

          <!-- 6. Result Cell -->
          <div class="row-cell cell-result">
            <span class="mobile-cell-label" aria-hidden="true">RESULT</span>
            <!-- Green Circular Check Badge with continuous soft ripple -->
            <div class="result-check-badge" title="Verified Client Result" aria-label="Verified Result">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 6.2L4.8 8.5L9.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="result-metrics-wrap">
              ${metricsHtml}
            </div>
          </div>
        </article>
      `;
    }).join('');

    initPortfolioStoryInteractions();
  }

  function initPortfolioStoryInteractions() {
    const cards = document.querySelectorAll('.story-row-card');
    if (!cards.length) return;

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Interactive Hover Spotlight (--mx, --my) & Micro-tones
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
      });

      card.addEventListener('mouseenter', () => {
        if (typeof AudioEngine !== 'undefined' && AudioEngine.playBeep) {
          AudioEngine.playBeep(680, 'sine', 0.035, 0.012);
        }
      });
    });

    // Staggered Entrance via IntersectionObserver (re-triggers on every visit)
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const card = entry.target;
          if (entry.isIntersecting) {
            card.classList.add('row-entered');

            if (prefersReducedMotion) {
              // Set final values immediately
              card.querySelectorAll('.metric-number[data-target]').forEach(el => {
                const target = parseFloat(el.getAttribute('data-target'));
                const prefix = el.getAttribute('data-prefix') || '';
                const suffix = el.getAttribute('data-suffix') || '';
                const decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;
                const separator = el.getAttribute('data-separator') === 'true';
                let formatted = decimals > 0 ? target.toFixed(decimals) : Math.round(target).toString();
                if (separator) formatted = Math.round(target).toLocaleString('en-US');
                el.textContent = `${prefix}${formatted}${suffix}`;
                el.classList.add('glow-finish');
              });
            } else {
              // Trigger number count-up after ~1.0s (aligned with result cell entrance)
              setTimeout(() => {
                animateRowCounters(card);
              }, 1000);
            }
          } else {
            // When scrolling out of view, reset so it fades in every time visited
            card.classList.remove('row-entered');
            card.querySelectorAll('.metric-number[data-target]').forEach(el => {
              const prefix = el.getAttribute('data-prefix') || '';
              const suffix = el.getAttribute('data-suffix') || '';
              el.textContent = `${prefix}0${suffix}`;
              el.classList.remove('glow-finish');
            });
          }
        });
      }, {
        threshold: window.innerWidth <= 768 ? 0.12 : 0.22,
        rootMargin: '0px 0px -40px 0px'
      });

      cards.forEach(card => observer.observe(card));
    } else {
      cards.forEach(card => {
        card.classList.add('row-entered');
        animateRowCounters(card);
      });
    }
  }

  // Animate counters over 1.4s with ease-out cubic curve
  function animateRowCounters(card) {
    const counterEls = card.querySelectorAll('.metric-number[data-target]');
    const duration = 1400; // 1.4s

    counterEls.forEach(el => {
      const target = parseFloat(el.getAttribute('data-target'));
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;
      const separator = el.getAttribute('data-separator') === 'true';

      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Ease-out cubic: 1 - (1 - t)^3
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = ease * target;

        let displayVal = '';
        if (decimals > 0) {
          displayVal = currentVal.toFixed(decimals);
        } else {
          const rounded = Math.round(currentVal);
          displayVal = separator ? rounded.toLocaleString('en-US') : rounded.toString();
        }

        el.textContent = `${prefix}${displayVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          // Snap to exact target formatted value
          let finalVal = decimals > 0 ? target.toFixed(decimals) : Math.round(target).toString();
          if (separator) finalVal = Math.round(target).toLocaleString('en-US');
          el.textContent = `${prefix}${finalVal}${suffix}`;

          // Brief gold glow on completion
          el.classList.add('glow-finish');
          setTimeout(() => {
            el.classList.remove('glow-finish');
          }, 900);

          if (typeof AudioEngine !== 'undefined' && AudioEngine.playBeep) {
            AudioEngine.playBeep(920, 'sine', 0.05, 0.015);
          }
        }
      }

      requestAnimationFrame(update);
    });
  }

  // Initialize Portfolio Story Rows
  renderPortfolioStoryRows();



  // =========================================================================
  // 11. Interactive 6-Step Project Estimator Logic (Three-Zone Console)
  // =========================================================================

  // Master Data Array for All Steps, Options, Timelines, and Weights
  const estimatorStepsData = [
    {
      id: 'capability',
      stepNum: 1,
      name: 'Capability',
      category: 'WHAT DO YOU NEED?',
      question: 'What primary digital capability are you looking to build?',
      hint: 'Choose one option to continue.',
      type: 'single',
      options: [
        {
          id: 'web',
          title: 'Full-Stack Web Development',
          desc: 'Websites, portals & web apps',
          icon: '🌐',
          weeks: 6,
          complexity: 40
        },
        {
          id: 'mobile',
          title: 'iOS & Android Mobile App',
          desc: 'Native-feel apps for both stores',
          icon: '📱',
          weeks: 10,
          complexity: 55
        },
        {
          id: 'guardian',
          title: 'Riyadvi Guardian Growth Funnel',
          desc: 'Ads, capture, CRM & telemetry',
          icon: '🛡️',
          weeks: 4,
          complexity: 35
        },
        {
          id: 'webgl',
          title: '3D WebGL Digital Experience',
          desc: 'Immersive tours & configurators',
          icon: '🧊',
          weeks: 8,
          complexity: 60
        },
        {
          id: 'enterprise',
          title: 'Custom Enterprise Software',
          desc: 'Internal systems & platforms',
          icon: '🏢',
          weeks: 14,
          complexity: 75
        }
      ]
    },
    {
      id: 'scale',
      stepNum: 2,
      name: 'Scale',
      category: 'SCALE & CAPACITY',
      question: 'What scale or volume does this solution need to handle?',
      hint: 'Select the target capacity for initial deployment.',
      type: 'single',
      options: [
        {
          id: 'starter',
          title: 'Starter Deployment',
          desc: 'Validated traffic, single region, core audience',
          icon: '🚀',
          weeks: 0,
          complexity: 0
        },
        {
          id: 'growth',
          title: 'Growth Tier',
          desc: 'High concurrency, multi-region CDN, automated pipelines',
          icon: '⚡',
          weeks: 3,
          complexity: 10
        },
        {
          id: 'enterprise_scale',
          title: 'Enterprise Infrastructure',
          desc: 'Mission-critical SLA, multi-cloud redundancy, global scale',
          icon: '🌐',
          weeks: 7,
          complexity: 25
        }
      ]
    },
    {
      id: 'features',
      stepNum: 3,
      name: 'Features',
      category: 'HIGH-IMPACT MODULES',
      question: 'Which advanced capabilities need to be integrated?',
      hint: 'Select all that apply. (Optional — skip if not needed)',
      type: 'multi',
      options: [
        {
          id: 'payments',
          title: 'Payments & Subscriptions',
          desc: 'Stripe, recurrent billing & automated invoicing',
          icon: '💳',
          weeks: 1,
          complexity: 4
        },
        {
          id: 'crm',
          title: 'CRM & Automation',
          desc: 'HubSpot/Salesforce sync & automated customer journeys',
          icon: '🔄',
          weeks: 1,
          complexity: 4
        },
        {
          id: 'ai',
          title: 'AI Chatbot / Agents',
          desc: 'Intelligent LLM assistant & custom knowledge base',
          icon: '🤖',
          weeks: 1,
          complexity: 4
        },
        {
          id: 'analytics',
          title: 'Analytics & Telemetry',
          desc: 'Custom funnel telemetry, heatmaps & conversion tracking',
          icon: '📊',
          weeks: 1,
          complexity: 4
        },
        {
          id: 'admin',
          title: 'Admin Dashboard',
          desc: 'Granular role-based permissions & audit logging',
          icon: '🖥️',
          weeks: 1,
          complexity: 4
        },
        {
          id: 'i18n',
          title: 'Multi-language / Global',
          desc: 'Localized currency, i18n routing & geo-adaptation',
          icon: '🌍',
          weeks: 1,
          complexity: 4
        }
      ]
    },
    {
      id: 'timeline',
      stepNum: 4,
      name: 'Timeline',
      category: 'TARGET TIMELINE',
      question: 'What is your ideal go-to-market milestone?',
      hint: 'Helps us benchmark scope against engineering velocity.',
      type: 'single',
      options: [
        {
          id: 'asap',
          title: 'As soon as possible',
          desc: 'Urgent sprint launch in under 6 weeks',
          icon: '⏱️',
          maxWeeks: 6
        },
        {
          id: 'standard',
          title: 'Standard pace',
          desc: 'Balanced rollout between 6 to 12 weeks',
          icon: '📅',
          maxWeeks: 12
        },
        {
          id: 'flexible',
          title: 'Flexible schedule',
          desc: 'Strategic horizon with phased iterations 12+ weeks',
          icon: '🎯',
          maxWeeks: 99
        }
      ]
    },
    {
      id: 'approach',
      stepNum: 5,
      name: 'Approach',
      category: 'EXECUTION APPROACH',
      question: 'How would you like our engineering team to execute?',
      hint: 'Determines sprint pacing, staging gates, and iteration velocity.',
      type: 'single',
      options: [
        {
          id: 'mvp',
          title: 'Lean MVP first',
          desc: 'Rapid core release with phased post-launch sprints',
          icon: '🏃',
          multiplier: 0.7
        },
        {
          id: 'balanced',
          title: 'Balanced build',
          desc: 'Full-feature release with rigorous QA & documentation',
          icon: '⚖️',
          multiplier: 1.0
        },
        {
          id: 'premium',
          title: 'Premium full-scale',
          desc: 'Zero-compromise polish, pentesting & white-glove onboarding',
          icon: '👑',
          multiplier: 1.15
        }
      ]
    },
    {
      id: 'contact',
      stepNum: 6,
      name: 'Contact',
      category: 'DELIVERY COORDINATES',
      question: 'Where should we dispatch your custom consultation blueprint?',
      hint: 'Our engineering director will review your scope within 2 business hours.',
      type: 'form'
    }
  ];

  // Estimator Application State
  let currentEstStep = 0;
  const estSelections = {
    capability: null,
    scale: null,
    features: [],
    timeline: null,
    approach: null,
    contact: null
  };
  let currentComplexityVal = 0;
  let gaugeAnimId = null;

  // DOM Elements
  const estStepperList = document.getElementById('estimatorStepperList');
  const stepperTrackProgress = document.getElementById('stepperTrackProgress');
  const qStepCounter = document.getElementById('estimatorStepCounter');
  const qStepCategory = document.getElementById('estimatorStepCategory');
  const qProgressBarFill = document.getElementById('qProgressBarFill');
  const qSlideContainer = document.getElementById('qSlideContainer');
  const estBackBtn = document.getElementById('estimatorPrevBtn');
  const estNextBtn = document.getElementById('estimatorNextBtn');
  const bpGaugeFillRing = document.getElementById('bpGaugeFillRing');
  const bpComplexityNum = document.getElementById('bpComplexityNum');
  const bpWeeksVal = document.getElementById('bpWeeksVal');
  const bpStatusPill = document.getElementById('bpStatusPill');

  const bpValCapability = document.getElementById('bpValCapability');
  const bpValScale = document.getElementById('bpValScale');
  const bpValFeatures = document.getElementById('bpValFeatures');
  const bpValTimeline = document.getElementById('bpValTimeline');
  const bpValApproach = document.getElementById('bpValApproach');

  const bpRowCapability = document.getElementById('bpRowCapability');
  const bpRowScale = document.getElementById('bpRowScale');
  const bpRowFeatures = document.getElementById('bpRowFeatures');
  const bpRowTimeline = document.getElementById('bpRowTimeline');
  const bpRowApproach = document.getElementById('bpRowApproach');

  // Gauge Circumference: 2 * Math.PI * 48 ~ 301.59
  const GAUGE_CIRCUMFERENCE = 301.59;

  // 1. Calculate Scope Metrics
  function calculateScopeMetrics() {
    const cap = estSelections.capability;
    const scale = estSelections.scale;
    const feats = estSelections.features || [];
    const tl = estSelections.timeline;
    const app = estSelections.approach;

    // Complexity: min(100, capability + scale + 4 * featuresCount)
    let complexity = 0;
    if (cap) {
      complexity = cap.complexity + (scale ? scale.complexity : 0) + (feats.length * 4);
      complexity = Math.min(100, complexity);
    }

    // Weeks calculation
    let weeksMin = 0;
    let weeksMax = 0;
    let weeksStr = '-';
    if (cap) {
      const baseWeeks = cap.weeks + (scale ? scale.weeks : 0) + feats.length;
      const mult = app ? app.multiplier : 1.0;
      weeksMin = Math.round(baseWeeks * mult);
      weeksMax = weeksMin + Math.max(2, Math.ceil(weeksMin * 0.3));
      weeksStr = `${weeksMin}-${weeksMax} weeks`;
    }

    // Timeline fit status
    let statusText = 'Select a capability';
    let statusClass = 'status-neutral';

    if (!cap) {
      statusText = 'Select a capability';
      statusClass = 'status-neutral';
    } else if (!tl) {
      statusText = 'Pick a launch timeline';
      statusClass = 'status-neutral';
    } else {
      if (weeksMin <= tl.maxWeeks) {
        statusText = 'On track';
        statusClass = 'status-green';
      } else if (weeksMin <= tl.maxWeeks + 4) {
        statusText = 'Tight: phase the launch';
        statusClass = 'status-gold';
      } else {
        statusText = 'Needs phased delivery';
        statusClass = 'status-orange';
      }
    }

    return {
      complexity,
      weeksMin,
      weeksMax,
      weeksStr,
      statusText,
      statusClass
    };
  }

  // 2. Animate Complexity Gauge & Number
  function updateComplexityGauge(targetVal) {
    if (!bpGaugeFillRing || !bpComplexityNum) return;

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targetOffset = GAUGE_CIRCUMFERENCE * (1 - targetVal / 100);

    bpGaugeFillRing.style.strokeDashoffset = targetOffset;

    if (prefersReducedMotion) {
      bpComplexityNum.textContent = targetVal;
      currentComplexityVal = targetVal;
      return;
    }

    const startVal = currentComplexityVal;
    const startTime = performance.now();
    const duration = 900; // 0.9s

    if (gaugeAnimId) cancelAnimationFrame(gaugeAnimId);

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (targetVal - startVal) * ease);

      bpComplexityNum.textContent = current;

      if (progress < 1) {
        gaugeAnimId = requestAnimationFrame(step);
      } else {
        bpComplexityNum.textContent = targetVal;
        currentComplexityVal = targetVal;
      }
    }

    gaugeAnimId = requestAnimationFrame(step);
  }

  // 3. Update Live Blueprint Panel
  function updateLiveBlueprint(flashFieldId = null) {
    const metrics = calculateScopeMetrics();

    // Update gauge
    updateComplexityGauge(metrics.complexity);

    // Update estimated window
    if (bpWeeksVal) {
      bpWeeksVal.textContent = metrics.weeksStr;
    }

    // Update status pill
    if (bpStatusPill) {
      bpStatusPill.textContent = metrics.statusText;
      bpStatusPill.className = `status-pill ${metrics.statusClass}`;
    }

    // Update Spec Rows
    const cap = estSelections.capability;
    const scale = estSelections.scale;
    const feats = estSelections.features;
    const tl = estSelections.timeline;
    const app = estSelections.approach;

    if (bpValCapability) {
      bpValCapability.textContent = cap ? cap.title : 'Pending';
      bpValCapability.className = `spec-val ${cap ? '' : 'pending'}`;
    }

    if (bpValScale) {
      bpValScale.textContent = scale ? scale.title : 'Pending';
      bpValScale.className = `spec-val ${scale ? '' : 'pending'}`;
    }

    if (bpValFeatures) {
      if (feats && feats.length > 0) {
        const shortNames = feats.map(f => f.title.split(' ')[0]).join(', ');
        bpValFeatures.textContent = `${feats.length}: ${shortNames}`;
        bpValFeatures.className = 'spec-val';
      } else if (currentEstStep > 2) {
        bpValFeatures.textContent = 'None selected (0)';
        bpValFeatures.className = 'spec-val';
      } else {
        bpValFeatures.textContent = 'Pending';
        bpValFeatures.className = 'spec-val pending';
      }
    }

    if (bpValTimeline) {
      bpValTimeline.textContent = tl ? tl.title : 'Pending';
      bpValTimeline.className = `spec-val ${tl ? '' : 'pending'}`;
    }

    if (bpValApproach) {
      bpValApproach.textContent = app ? app.title : 'Pending';
      bpValApproach.className = `spec-val ${app ? '' : 'pending'}`;
    }

    // Brief gold flash highlight on updated row
    if (flashFieldId) {
      const rowEl = document.getElementById(flashFieldId);
      if (rowEl) {
        rowEl.classList.remove('row-flash');
        void rowEl.offsetWidth; // Trigger reflow
        rowEl.classList.add('row-flash');
      }
    }
  }

  // 4. Update Stepper Nav (Zone 1)
  function renderStepperNav() {
    if (!estStepperList) return;

    estStepperList.innerHTML = estimatorStepsData.map((step, idx) => {
      let statusClass = 'pending';
      let iconContent = `${idx + 1}`;

      if (idx < currentEstStep) {
        statusClass = 'completed';
        iconContent = `&#10003;`;
      } else if (idx === currentEstStep) {
        statusClass = 'active';
      }

      return `
        <li>
          <button type="button" class="stepper-item-btn ${statusClass}" data-step-index="${idx}" ${idx < currentEstStep ? '' : 'disabled'}>
            <span class="step-circle" aria-hidden="true">${iconContent}</span>
            <span class="step-name">${step.name}</span>
          </button>
        </li>
      `;
    }).join('');

    // Attach click listeners to completed steps to jump back
    estStepperList.querySelectorAll('.stepper-item-btn.completed').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetStep = parseInt(btn.getAttribute('data-step-index'), 10);
        if (!isNaN(targetStep) && targetStep < currentEstStep) {
          currentEstStep = targetStep;
          renderEstimatorStep(currentEstStep);
          if (typeof AudioEngine !== 'undefined' && AudioEngine.playBeep) {
            AudioEngine.playBeep(780, 'sine', 0.04, 0.015);
          }
        }
      });
    });

    // Update connector track height
    if (stepperTrackProgress) {
      const progressPercent = (currentEstStep / (estimatorStepsData.length - 1)) * 100;
      stepperTrackProgress.style.height = `${progressPercent}%`;
    }
  }

  // 5. Render Question Step (Zone 2)
  function renderEstimatorStep(stepIdx) {
    if (stepIdx < 0 || stepIdx >= estimatorStepsData.length) return;

    const stepData = estimatorStepsData[stepIdx];

    // Header counters & progress bar
    if (qStepCounter) qStepCounter.textContent = `STEP ${stepIdx + 1} OF ${estimatorStepsData.length}`;
    if (qStepCategory) qStepCategory.textContent = stepData.category;
    if (qProgressBarFill) {
      const pct = ((stepIdx + 1) / estimatorStepsData.length) * 100;
      qProgressBarFill.style.width = `${pct}%`;
    }

    // Update Stepper Nav
    renderStepperNav();

    // Slide transition on container
    if (qSlideContainer) {
      qSlideContainer.classList.remove('slide-in-right');
      void qSlideContainer.offsetWidth;
      qSlideContainer.classList.add('slide-in-right');

      if (stepData.type === 'form') {
        // Step 6: Contact Delivery Coordinates Form
        qSlideContainer.innerHTML = `
          <h3 class="estimator-step-question">${stepData.question}</h3>
          <p class="q-hint-text">${stepData.hint}</p>
          <form class="est-contact-form" id="estContactForm" novalidate>
            <div class="est-field-group">
              <label class="est-field-label" for="estNameInput">YOUR NAME *</label>
              <input type="text" id="estNameInput" class="est-input" required placeholder="e.g. Alexander Vance" value="${estSelections.contact ? estSelections.contact.name : ''}">
            </div>
            <div class="est-field-group">
              <label class="est-field-label" for="estPhoneInput">MOBILE / WHATSAPP NUMBER *</label>
              <input type="tel" id="estPhoneInput" class="est-input" required placeholder="+91 / International with country code" value="${estSelections.contact ? estSelections.contact.phone : ''}">
            </div>
            <div class="est-field-group">
              <label class="est-field-label" for="estEmailInput">WORK EMAIL ADDRESS *</label>
              <input type="email" id="estEmailInput" class="est-input" required placeholder="alex@company.com" value="${estSelections.contact ? estSelections.contact.email : ''}">
            </div>
          </form>
        `;
      } else {
        // Steps 1 to 5: Options Cards Grid
        const optionsHtml = stepData.options.map((opt) => {
          let isSelected = false;
          if (stepData.type === 'multi') {
            isSelected = estSelections.features.some(f => f.id === opt.id);
          } else {
            isSelected = estSelections[stepData.id] && estSelections[stepData.id].id === opt.id;
          }

          return `
            <button type="button" 
                    class="est-option-card ${isSelected ? 'selected' : ''}" 
                    role="${stepData.type === 'multi' ? 'checkbox' : 'radio'}" 
                    aria-checked="${isSelected}" 
                    data-opt-id="${opt.id}">
              <div class="opt-icon-tile" aria-hidden="true">${opt.icon}</div>
              <div class="opt-text-wrap">
                <span class="opt-title">${opt.title}</span>
                <span class="opt-desc">${opt.desc}</span>
              </div>
              <div class="opt-check-circle" aria-hidden="true">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 6.2L4.8 8.5L9.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </button>
          `;
        }).join('');

        qSlideContainer.innerHTML = `
          <h3 class="estimator-step-question">${stepData.question}</h3>
          <p class="q-hint-text">${stepData.hint}</p>
          <div class="estimator-options-grid" role="${stepData.type === 'multi' ? 'group' : 'radiogroup'}" aria-label="${stepData.question}">
            ${optionsHtml}
          </div>
        `;

        // Card Click Listeners
        qSlideContainer.querySelectorAll('.est-option-card').forEach((card) => {
          card.addEventListener('click', () => {
            const optId = card.getAttribute('data-opt-id');
            const optObj = stepData.options.find(o => o.id === optId);
            if (!optObj) return;

            if (stepData.type === 'multi') {
              // Multi-select (Features)
              const existingIdx = estSelections.features.findIndex(f => f.id === optId);
              if (existingIdx > -1) {
                estSelections.features.splice(existingIdx, 1);
                card.classList.remove('selected');
                card.setAttribute('aria-checked', 'false');
              } else {
                estSelections.features.push(optObj);
                card.classList.add('selected');
                card.setAttribute('aria-checked', 'true');
              }
              updateLiveBlueprint('bpRowFeatures');
            } else {
              // Single choice
              estSelections[stepData.id] = optObj;
              qSlideContainer.querySelectorAll('.est-option-card').forEach(c => {
                c.classList.remove('selected');
                c.setAttribute('aria-checked', 'false');
              });
              card.classList.add('selected');
              card.setAttribute('aria-checked', 'true');

              // Flash matching row in Live Blueprint
              const flashMap = {
                capability: 'bpRowCapability',
                scale: 'bpRowScale',
                timeline: 'bpRowTimeline',
                approach: 'bpRowApproach'
              };
              updateLiveBlueprint(flashMap[stepData.id]);
            }

            // Audio feedback
            if (typeof AudioEngine !== 'undefined' && AudioEngine.playBeep) {
              AudioEngine.playBeep(880, 'sine', 0.045, 0.015);
            }

            // Update Next button enabled state
            checkNextButtonState();
          });
        });
      }
    }

    // Back & Next Buttons State
    if (estBackBtn) {
      estBackBtn.style.display = stepIdx > 0 ? 'inline-flex' : 'none';
    }

    if (estNextBtn) {
      estNextBtn.textContent = stepIdx === estimatorStepsData.length - 1 ? 'GET MY BLUEPRINT →' : 'NEXT STEP →';
    }

    checkNextButtonState();
  }

  // 6. Check whether Next Step Button is enabled
  function checkNextButtonState() {
    if (!estNextBtn) return;
    const step = estimatorStepsData[currentEstStep];

    if (step.type === 'single') {
      const isSelected = !!estSelections[step.id];
      estNextBtn.disabled = !isSelected;
    } else if (step.type === 'multi') {
      // Features step is optional, next step always enabled
      estNextBtn.disabled = false;
    } else if (step.type === 'form') {
      // Contact step is enabled for user to trigger validation
      estNextBtn.disabled = false;
    }
  }

  // 7. Navigation Listeners (Back & Next)
  if (estNextBtn) {
    estNextBtn.addEventListener('click', () => {
      const step = estimatorStepsData[currentEstStep];

      if (step.type === 'form') {
        // Step 6: Validate Contact Form
        const nameInput = document.getElementById('estNameInput');
        const phoneInput = document.getElementById('estPhoneInput');
        const emailInput = document.getElementById('estEmailInput');

        const nameVal = nameInput ? nameInput.value.trim() : '';
        const phoneVal = phoneInput ? phoneInput.value.trim() : '';
        const emailVal = emailInput ? emailInput.value.trim() : '';

        if (!nameVal || !phoneVal || !emailVal || !emailVal.includes('@')) {
          if (!nameVal && nameInput) nameInput.focus();
          else if (!phoneVal && phoneInput) phoneInput.focus();
          else if (emailInput) emailInput.focus();

          if (typeof AudioEngine !== 'undefined' && AudioEngine.playBeep) {
            AudioEngine.playBeep(320, 'sine', 0.12, 0.03);
          }
          return;
        }

        estSelections.contact = {
          name: nameVal,
          phone: phoneVal,
          email: emailVal
        };

        // =====================================================================
        // TODO: CONNECT REAL CONSULTATION BLUEPRINT API ENDPOINT HERE
        // Send estSelections (capability, scale, features, timeline, approach, contact)
        // Example:
        // fetch('/api/estimator-blueprint', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(estSelections)
        // });
        // =====================================================================

        // Sound confirmation
        if (typeof AudioEngine !== 'undefined' && AudioEngine.playBeep) {
          AudioEngine.playBeep(780, 'sine', 0.08, 0.02);
          setTimeout(() => AudioEngine.playBeep(1040, 'sine', 0.15, 0.03), 80);
        }

        // Render Success State in Zone 2
        renderEstimatorSuccessState();
        return;
      }

      // Steps 1 to 5: Advance to next step
      if (currentEstStep < estimatorStepsData.length - 1) {
        currentEstStep++;
        renderEstimatorStep(currentEstStep);
        if (typeof AudioEngine !== 'undefined' && AudioEngine.playBeep) {
          AudioEngine.playBeep(820, 'sine', 0.04, 0.015);
        }
      }
    });
  }

  if (estBackBtn) {
    estBackBtn.addEventListener('click', () => {
      if (currentEstStep > 0) {
        currentEstStep--;
        renderEstimatorStep(currentEstStep);
        if (typeof AudioEngine !== 'undefined' && AudioEngine.playBeep) {
          AudioEngine.playBeep(640, 'sine', 0.04, 0.012);
        }
      }
    });
  }

  // 8. Render Success State on Submit
  function renderEstimatorSuccessState() {
    if (!qSlideContainer) return;

    const firstName = estSelections.contact && estSelections.contact.name
      ? estSelections.contact.name.split(' ')[0]
      : 'Partner';
    const capabilityTitle = estSelections.capability
      ? estSelections.capability.title
      : 'Digital Architecture';
    const email = estSelections.contact ? estSelections.contact.email : 'your email';
    const metrics = calculateScopeMetrics();

    // Hide bottom action footer during success state
    const footerBar = document.getElementById('estimatorFooterBar');
    if (footerBar) footerBar.style.display = 'none';

    if (qStepCounter) qStepCounter.textContent = 'BLUEPRINT DISPATCHED';
    if (qStepCategory) qStepCategory.textContent = 'SCOPE SPECIFICATION READY';
    if (qProgressBarFill) qProgressBarFill.style.width = '100%';

    qSlideContainer.innerHTML = `
      <div class="est-success-state">
        <div class="est-success-check-badge" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6fd3a8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h3 class="est-success-title">Your blueprint is on its way</h3>
        <p class="est-success-text">
          Thank you, <strong>${firstName}</strong>! We've generated your tailored scope analysis for <strong>${capabilityTitle}</strong> (${metrics.weeksStr}). Our engineering directors are reviewing your requirements and will reach out to <strong>${email}</strong> within 2 business hours.
        </p>
        <button type="button" class="btn-est-reset" id="estResetBtn">START OVER</button>
      </div>
    `;

    const resetBtn = document.getElementById('estResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        resetEstimatorConsole();
      });
    }
  }

  // 9. Reset Estimator Console
  function resetEstimatorConsole() {
    currentEstStep = 0;
    estSelections.capability = null;
    estSelections.scale = null;
    estSelections.features = [];
    estSelections.timeline = null;
    estSelections.approach = null;
    estSelections.contact = null;

    const footerBar = document.getElementById('estimatorFooterBar');
    if (footerBar) footerBar.style.display = 'flex';

    updateLiveBlueprint();
    renderEstimatorStep(0);

    if (typeof AudioEngine !== 'undefined' && AudioEngine.playBeep) {
      AudioEngine.playBeep(720, 'sine', 0.05, 0.02);
    }
  }

  // Initialize Estimator Console on DOM ready
  updateLiveBlueprint();
  renderEstimatorStep(0);

  // =========================================================================
  // 12. Lead Capture Form with UTM Tracking & WhatsApp Sync
  // =========================================================================
  const leadForm = document.getElementById('riyadviLeadForm');
  const formFeedback = document.getElementById('formFeedback');

  // Parse URL UTM query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  utmFields.forEach((field) => {
    const input = document.getElementById(field);
    if (input && urlParams.has(field)) {
      input.value = urlParams.get(field);
    }
  });

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value || 'Client';
      const service = document.getElementById('contactService')?.value || 'Digital Solutions';
      
      if (formFeedback) {
        formFeedback.style.display = 'block';
        formFeedback.innerHTML = `Thank you, <strong>${name}</strong>! Your inquiry for <em>${service}</em> has been securely registered. A technical director will contact you within 2 hours.`;
      }
      AudioEngine.playBeep(920, 'sine', 0.15, 0.04);
      leadForm.reset();
    });

    const btnFreeConsult = document.getElementById('btnFreeConsult');
    if (btnFreeConsult) {
      btnFreeConsult.addEventListener('click', () => {
        const phone = document.getElementById('contactPhone')?.value || '';
        const name = document.getElementById('contactName')?.value || '';
        const text = encodeURIComponent(`Hello Riyadvi Team! I am ${name}. I would like to claim my Free Growth Consultation.`);
        window.open(`https://wa.me/918072487427?text=${text}`, '_blank');
      });
    }
  }

  // =========================================================================
  // 13. Riyadvi AI Assistant Terminal Logic
  // =========================================================================
  const terminalForm = document.getElementById('terminalForm');
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const chipBtns = document.querySelectorAll('.chip-btn');

  const assistantKnowledge = [
    {
      keywords: ['service', 'offer', 'what do you do', 'capability'],
      reply: "Riyadvi provides end-to-end digital capabilities: Web Development (React/Next.js), Mobile Apps (Flutter/React Native), Digital Marketing funnels, UI/UX Design, E-Commerce, 3D WebGL experiences, Custom Software, and our proprietary Riyadvi Guardian business growth protector."
    },
    {
      keywords: ['website', 'web dev', 'web application', 'react', 'next'],
      reply: "We build ultra-fast, high-converting web applications utilizing Next.js, React, Node.js, and headless CMS stacks. Our work is recognized globally by TechBehemoths (Berlin 2025 winner) and DesignRush."
    },
    {
      keywords: ['marketing', 'lead', 'ads', 'google', 'meta', 'seo', 'smm'],
      reply: "Our digital marketing focuses strictly on commercial ROI and verified revenue growth. With 100+ verified campaign leads and multi-channel performance funnels, we turn clicks into closed deals."
    },
    {
      keywords: ['mobile', 'app', 'ios', 'android', 'flutter'],
      reply: "We engineer native and cross-platform mobile apps using Flutter and React Native with 60fps animations, offline local caching, and seamless cloud synchronization."
    },
    {
      keywords: ['guardian', 'protector', 'growth system'],
      reply: "Riyadvi Guardian is our proprietary business-growth system following: PROTECT &rarr; MONITOR &rarr; ATTRACT &rarr; ENGAGE &rarr; CONVERT &rarr; GROW. It ensures your marketing budget isn't spent randomly, but systematically feeds a predictable acquisition pipeline."
    },
    {
      keywords: ['consultation', 'talk', 'contact', 'call', 'meeting', 'quote'],
      reply: "You can book a free growth consultation right now! Call us at +91 9080822034, chat via WhatsApp at +91 8072487427, or complete the contact form below."
    }
  ];

  function addTerminalLine(text, type = 'bot') {
    if (!terminalOutput) return;
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    line.innerHTML = text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function handleAssistantQuery(query) {
    if (!query.trim()) return;
    addTerminalLine(`&gt; ${query}`, 'system');

    const lower = query.toLowerCase();
    let matchedReply = "Riyadvi Software Technologies Pvt. Ltd. is your Digital Technology & Business Growth Partner. How can our engineering and growth team assist your business?";

    for (const item of assistantKnowledge) {
      if (item.keywords.some((k) => lower.includes(k))) {
        matchedReply = item.reply;
        break;
      }
    }

    setTimeout(() => {
      addTerminalLine(`[RIYADVI ASSISTANT]: ${matchedReply}`, 'bot');
      AudioEngine.playBeep(880, 'sine', 0.08, 0.02);
    }, 300);
  }

  if (terminalForm && terminalInput) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = terminalInput.value;
      terminalInput.value = '';
      handleAssistantQuery(val);
    });
  }

  chipBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const prompt = btn.getAttribute('data-prompt');
      handleAssistantQuery(prompt);
    });
  });

  // Modal close handlers (Story / Video Modal)
  const playBtn = document.getElementById('playBtn');
  const demoModal = document.getElementById('demoModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  if (playBtn && demoModal) {
    playBtn.addEventListener('click', () => demoModal.classList.add('open'));
  }
  if (modalCloseBtn && demoModal) {
    modalCloseBtn.addEventListener('click', () => demoModal.classList.remove('open'));
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) demoModal.classList.remove('open');
    });
  }

  // =========================================================================
  // Volumetric Studio 3D Stage & Overhead Spotlight Controller (#awards)
  // =========================================================================
  const awardsSection = document.getElementById('awards');
  const vstudioLightPools = document.getElementById('vstudioLightPools');
  const vstudioBeams = document.getElementById('vstudioBeams');
  const bulbs = [
    document.getElementById('vstudioBulb1'),
    document.getElementById('vstudioBulb2'),
    document.getElementById('vstudioBulb3')
  ].filter(Boolean);

  function setVStudioLights(on) {
    if (vstudioLightPools) {
      if (on) vstudioLightPools.classList.add('lights-on');
      else vstudioLightPools.classList.remove('lights-on');
    }
    if (vstudioBeams) {
      if (on) vstudioBeams.classList.add('lights-on');
      else vstudioBeams.classList.remove('lights-on');
    }
    bulbs.forEach(b => {
      if (on) b.classList.add('lit');
      else b.classList.remove('lit');
    });
  }

  let isFlickering = false;
  let flickerRunId = 0;

  async function triggerStudioFlicker(force = false) {
    if (isFlickering && !force) return;
    isFlickering = true;
    const currentRun = ++flickerRunId;

    // Reset lights to OFF state before boot-up sequence
    setVStudioLights(false);

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    
    // Realistic studio arc lamp boot-up flicker sequence
    await sleep(250);
    if (currentRun !== flickerRunId) return;
    setVStudioLights(true);
    await sleep(90);
    if (currentRun !== flickerRunId) return;
    setVStudioLights(false);
    await sleep(200);
    if (currentRun !== flickerRunId) return;
    setVStudioLights(true);
    await sleep(45);
    if (currentRun !== flickerRunId) return;
    setVStudioLights(false);
    await sleep(150);
    if (currentRun !== flickerRunId) return;
    setVStudioLights(true);
    await sleep(35);
    if (currentRun !== flickerRunId) return;
    setVStudioLights(false);
    await sleep(55);
    if (currentRun !== flickerRunId) return;
    setVStudioLights(true);
    await sleep(35);
    if (currentRun !== flickerRunId) return;
    setVStudioLights(false);
    await sleep(250);
    if (currentRun !== flickerRunId) return;
    setVStudioLights(true);

    isFlickering = false;
  }

  // Trigger flicker sequence EVERY time awards section scrolls into view
  if (awardsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          triggerStudioFlicker();
        } else {
          // When scrolled out of view, turn lights off so they trigger fresh when re-entering
          flickerRunId++;
          isFlickering = false;
          setVStudioLights(false);
        }
      });
    }, { threshold: 0.15 });
    observer.observe(awardsSection);
  } else {
    setTimeout(triggerStudioFlicker, 600);
  }

  // Also re-trigger whenever user clicks any Awards navigation link
  document.querySelectorAll('a[href="#awards"]').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(() => triggerStudioFlicker(true), 250);
    });
  });

  // =========================================================================
  // =========================================================================
  // 17. Straight Vertical Journey Timeline Engine (GSAP & ScrollTrigger)
  // =========================================================================
  function initStraightTimeline() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded.');
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const track = document.getElementById('timeline01Track') || document.getElementById('timelineStraightTrack');
    const lineFill = document.getElementById('straightLineFill');
    if (!track || !lineFill) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Straight vertical golden axis line fill as user scrolls
    if (prefersReducedMotion) {
      lineFill.style.height = '100%';
      document.querySelectorAll('.timeline-01-node-pin, .node-gold-pin').forEach(pin => pin.classList.add('active'));
      return;
    }

    gsap.fromTo(lineFill, {
      height: '0%'
    }, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: track,
        start: 'top 75%',
        end: 'bottom 45%',
        scrub: 0.5
      }
    });

    // 2. Animate each straight milestone node into view
    const rows = document.querySelectorAll('.timeline-01-row');
    rows.forEach((row) => {
      const pin = row.querySelector('.timeline-01-node-pin');
      const content = row.querySelector('.timeline-01-content-side');
      const imgCard = row.querySelector('.timeline-01-img-card');
      const isEven = row.classList.contains('row-even');

      if (content) gsap.set(content, { opacity: 0.3, x: isEven ? 20 : -20 });
      if (imgCard) gsap.set(imgCard, { opacity: 0.4, scale: 0.96 });

      ScrollTrigger.create({
        trigger: row,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => {
          if (pin) pin.classList.add('active');
          if (content) gsap.to(content, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' });
          if (imgCard) gsap.to(imgCard, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' });
        },
        onLeave: () => {
          if (pin) pin.classList.remove('active');
          if (content) gsap.to(content, { opacity: 0.3, x: isEven ? 20 : -20, duration: 0.3 });
          if (imgCard) gsap.to(imgCard, { opacity: 0.4, scale: 0.96, duration: 0.3 });
        },
        onEnterBack: () => {
          if (pin) pin.classList.add('active');
          if (content) gsap.to(content, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' });
          if (imgCard) gsap.to(imgCard, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' });
        },
        onLeaveBack: () => {
          if (pin) pin.classList.remove('active');
          if (content) gsap.to(content, { opacity: 0.3, x: isEven ? 20 : -20, duration: 0.3 });
          if (imgCard) gsap.to(imgCard, { opacity: 0.4, scale: 0.96, duration: 0.3 });
        }
      });
    });

    // 3. Connect line into 6-Step Systematic Methodology Box & sequential card activation
    const processBox = document.getElementById('timelineProcessBox');
    const terminalPin = document.getElementById('processTerminalPin');
    const processCards = document.querySelectorAll('.process-step-card');

    if (processBox) {
      ScrollTrigger.create({
        trigger: processBox,
        start: 'top 85%',
        end: 'bottom 15%',
        onEnter: () => {
          if (terminalPin) terminalPin.classList.add('active');
          processCards.forEach((card, idx) => {
            setTimeout(() => {
              card.classList.add('active');
            }, idx * 80);
          });
        },
        onEnterBack: () => {
          if (terminalPin) terminalPin.classList.add('active');
          processCards.forEach(card => card.classList.add('active'));
        },
        onLeaveBack: () => {
          if (terminalPin) terminalPin.classList.remove('active');
          processCards.forEach(card => card.classList.remove('active'));
        }
      });
    }

    // Also support fallback straight-milestone-node if any
    const legacyNodes = document.querySelectorAll('.straight-milestone-node');
    legacyNodes.forEach((node) => {
      const pin = node.querySelector('.node-gold-pin');
      const card = node.querySelector('.milestone-card-straight');
      const stem = node.querySelector('.node-branch-stem');

      gsap.set(card, { opacity: 0.25, x: 20 });
      gsap.set(stem, { scaleX: 0, transformOrigin: 'left center' });

      ScrollTrigger.create({
        trigger: node,
        start: 'top 78%',
        end: 'bottom 20%',
        onEnter: () => {
          if (pin) pin.classList.add('active');
          gsap.to(stem, { scaleX: 1, duration: 0.4, ease: 'power2.out' });
          gsap.to(card, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' });
        },
        onLeave: () => {
          if (pin) pin.classList.remove('active');
          gsap.to(stem, { scaleX: 0, duration: 0.3 });
          gsap.to(card, { opacity: 0.25, x: 20, duration: 0.3 });
        },
        onEnterBack: () => {
          if (pin) pin.classList.add('active');
          gsap.to(stem, { scaleX: 1, duration: 0.4, ease: 'power2.out' });
          gsap.to(card, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' });
        },
        onLeaveBack: () => {
          if (pin) pin.classList.remove('active');
          gsap.to(stem, { scaleX: 0, duration: 0.3 });
          gsap.to(card, { opacity: 0.25, x: 20, duration: 0.3 });
        }
      });
    });

    window.addEventListener('resize', () => {
      ScrollTrigger.refresh();
    }, { passive: true });
  }

  // Initialize Straight Timeline
  initStraightTimeline();

  // =========================================================================
  // 18. Universal Scroll-Triggered Fade-Up Reveal Engine
  //     Consistent, premium fade-up with blur-to-clear across the ENTIRE website.
  //     Easing: cubic-bezier(0.22, 1, 0.36, 1), Duration: ~900ms, Offset: ~42px.
  //     Independent staggered entrance for each card (100–140ms delay).
  //     Re-triggers smoothly when scrolling up/down on every visit.
  // =========================================================================
  const ScrollRevealEngine = (() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let observer = null;
    const registeredElements = new Set();

    // Registry of standalone elements (section headers, badges, titles, descriptions, standalone cards)
    const singleSelectors = [
      // About Section
      '#about .timeline-01-badge',
      '#about .timeline-01-title',
      '#about .timeline-01-desc',
      '#about .timeline-01-process-header',
      '#about .timeline-01-process-footer',

      // Awards Section
      '#awards .center-header .sub-badge',
      '#awards .center-header .section-title',
      '#awards .center-header .section-subtitle',

      // Services Section
      '#services .bento-services-header .sub-badge',
      '#services .bento-services-header .section-title',
      '#services .bento-services-header .section-subtitle',
      '#services .bento-services-header .bento-pill-cta',
      '#services .bento-category-tabs',

      // Industries Section
      '#industries .industries-header-left .sub-badge',
      '#industries .industries-header-left .section-title',
      '#industries .industries-header-left .section-subtitle',
      '#industries .industry-hud-stage .industry-hud-card',
      '#industries .industry-hud-stage .industry-hud-readout',

      // Guardian Section
      '#guardian .guardian-badges-row',
      '#guardian .guardian-title',
      '#guardian .guardian-lead-desc',
      '#guardian .guardian-shield-area',
      '#guardian .guardian-connector-stem',
      '#guardian .guardian-hero-cta',
      '#guardian .guardian-funnel-header .guardian-funnel-title',
      '#guardian .guardian-funnel-header .guardian-funnel-lead',
      '#guardian .guardian-consult-card',

      // Portfolio Section
      '#portfolio .center-header .sub-badge',
      '#portfolio .center-header .section-title',
      '#portfolio .center-header .section-subtitle',
      '#portfolio .portfolio-legend-row',

      // Global Presence (integrated inside Estimator)
      '#global-presence .center-header .sub-badge',
      '#global-presence .center-header .section-title',
      '#global-presence .center-header .section-subtitle',
      '#global-presence .global-map-console',
      '#estimator .estimator-sub-divider',

      // Estimator Section
      '#estimator .center-header .sub-badge',
      '#estimator .center-header .section-title',
      '#estimator .center-header .section-subtitle',

      // Contact Section
      '#contact .center-header .sub-badge',
      '#contact .center-header .section-title',
      '#contact .center-header .section-subtitle',
      '#contact .contact-lead-form'
    ];

    // Registry of card groups: multiple cards that stagger when scrolled into view
    const groupConfigs = [
      // About timeline milestone rows
      {
        container: '#about .timeline-01-items',
        items: '.timeline-01-row',
        staggerMs: 140
      },
      // About 6-step methodology cards
      {
        container: '#about .process-steps-grid',
        items: '.process-step-card',
        staggerMs: 100
      },
      // Awards credibility cards
      {
        container: '#awards .awards-grid',
        items: '.award-card',
        staggerMs: 130
      },
      // Bento Development Cards
      {
        container: '#bentoGroupDevelopment',
        items: '.bento-card',
        staggerMs: 120
      },
      // Bento Designing Cards
      {
        container: '#bentoGroupDesign',
        items: '.bento-card',
        staggerMs: 130
      },
      // Bento Marketing Cards
      {
        container: '#bentoGroupMarketing',
        items: '.bento-card',
        staggerMs: 130
      },
      // Industries 10 Index Rows
      {
        container: '#industries .industry-hud-index',
        items: '.industry-hud-row',
        staggerMs: 50
      },
      // Guardian 3 Feature Cards
      {
        container: '#guardian .guardian-features-row',
        items: '.guardian-feature-card',
        staggerMs: 130
      },
      // Guardian 4 Funnel Cards
      {
        container: '#guardian .guardian-funnel-grid',
        items: '.guardian-funnel-card',
        staggerMs: 130
      },
      // Portfolio Case Study Rows
      {
        container: '#portfolioStoryContainer',
        items: '.story-row-card',
        staggerMs: 140
      },
      // Global Presence Map Markers
      {
        container: '#global-presence .global-map-stage',
        items: '.map-marker-label',
        staggerMs: 140
      },
      // Estimator Console Zones
      {
        container: '#estimatorBox',
        items: '.estimator-stepper-zone, .estimator-question-zone, .estimator-blueprint-zone',
        staggerMs: 130
      },
      // Contact Direct Channels
      {
        container: '#contact .contact-channels-box',
        items: '.contact-channel-item',
        staggerMs: 120
      }
    ];

    function registerItem(el, delayMs = 0) {
      if (!el || registeredElements.has(el)) return;
      registeredElements.add(el);

      el.classList.add('scroll-reveal-item');
      if (delayMs > 0) {
        el.style.setProperty('--reveal-delay', `${delayMs}ms`);
        el.setAttribute('data-reveal-delay', delayMs);
      }

      // Check if element is already within or above the 85% viewport line on load
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < windowH * 0.85 && rect.bottom > 0) {
        el.classList.add('is-revealed');
        if (el.classList.contains('story-row-card')) {
          el.classList.add('row-entered');
        }
        setTimeout(() => {
          if (el.classList.contains('is-revealed')) {
            el.classList.add('is-settled');
          }
        }, 950 + delayMs);
      }

      if (observer) {
        observer.observe(el);
      }
    }

    function init() {
      if (prefersReducedMotion) {
        // Respect accessibility: do not add scroll-reveal-active, elements remain 100% visible
        return;
      }

      // Safe activation: activates reveal styles only once JS engine is loaded
      document.documentElement.classList.add('scroll-reveal-active');

      if (!('IntersectionObserver' in window)) {
        // Fallback for browsers without IntersectionObserver
        document.querySelectorAll(singleSelectors.join(',')).forEach(el => {
          el.classList.add('scroll-reveal-item', 'is-revealed', 'is-settled');
        });
        return;
      }

      observer = new IntersectionObserver((entries) => {
        const windowH = window.innerHeight || document.documentElement.clientHeight;
        entries.forEach(entry => {
          const el = entry.target;
          if (entry.isIntersecting) {
            el.classList.add('is-revealed');
            if (el.classList.contains('story-row-card')) {
              el.classList.add('row-entered');
            }
            const delayMs = parseFloat(el.getAttribute('data-reveal-delay') || 0);
            setTimeout(() => {
              if (el.classList.contains('is-revealed')) {
                el.classList.add('is-settled');
              }
            }, 950 + delayMs);
          } else {
            // Avoid repeatedly restarting animations unnecessarily
            // Only reset when element has scrolled well away (buffer of 150px below, 350px above)
            const rect = entry.boundingClientRect;
            if (rect.top > windowH + 150) {
              el.classList.remove('is-revealed', 'is-settled');
              if (el.classList.contains('story-row-card')) {
                el.classList.remove('row-entered');
              }
            } else if (rect.bottom < -350) {
              el.classList.remove('is-revealed', 'is-settled');
              if (el.classList.contains('story-row-card')) {
                el.classList.remove('row-entered');
              }
            }
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -15% 0px', // Triggers when element reaches 85% of viewport
        threshold: 0.05
      });

      // 1. Register all single selectors
      singleSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => registerItem(el, 0));
      });

      // 2. Register all staggered card groups
      groupConfigs.forEach(({ container, items, staggerMs }) => {
        const contEl = document.querySelector(container);
        if (!contEl) return;
        const itemEls = contEl.querySelectorAll(items);
        itemEls.forEach((item, idx) => {
          registerItem(item, idx * staggerMs);
        });
      });

      // 3. Register any custom elements marked with [data-reveal] or .scroll-reveal
      document.querySelectorAll('[data-reveal], .scroll-reveal').forEach(el => {
        registerItem(el, 0);
      });

      // 4. Bottom of page safety check: reveal remaining items when scrolled to end
      window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 70)) {
          document.querySelectorAll('.scroll-reveal-item:not(.is-revealed)').forEach(el => {
            el.classList.add('is-revealed', 'is-settled');
          });
        }
      }, { passive: true });
    }

    function refreshGroup(containerEl, staggerMs = 120) {
      if (!containerEl) return;
      const items = containerEl.querySelectorAll('.bento-card, .scroll-reveal-item');
      items.forEach((item, idx) => {
        item.classList.remove('is-revealed', 'is-settled');
        const delayMs = idx * staggerMs;
        item.style.setProperty('--reveal-delay', `${delayMs}ms`);
        item.setAttribute('data-reveal-delay', delayMs);
        setTimeout(() => {
          item.classList.add('is-revealed');
          setTimeout(() => {
            if (item.classList.contains('is-revealed')) {
              item.classList.add('is-settled');
            }
          }, 950 + delayMs);
        }, 40);
      });
    }

    function scanNewElements() {
      // Re-scan for dynamically rendered items (e.g. portfolio cards)
      groupConfigs.forEach(({ container, items, staggerMs }) => {
        const contEl = document.querySelector(container);
        if (!contEl) return;
        const itemEls = contEl.querySelectorAll(items);
        itemEls.forEach((item, idx) => {
          registerItem(item, idx * staggerMs);
        });
      });
    }

    return {
      init,
      registerItem,
      refreshGroup,
      scanNewElements
    };
  })();

  // Initialize Global Scroll-Triggered Fade-Up Engine
  ScrollRevealEngine.init();

});




// =========================================================================
// SERVICES SECTION: 3D COVERFLOW CAROUSEL & FULL-SCREEN CHAPTER VIEW ENGINE
// =========================================================================

(function initServicesCoverflowEngine() {
  // 1. DATA ARRAY: 9 SERVICES
  const SERVICES_DATA = [
    {
      id: 'web',
      category: 'development',
      categoryLabel: 'DEVELOPMENT',
      num: '01',
      tag: '01 // CORE',
      name: 'Web Development',
      oneLiner: 'We build high-performance, responsive, and scalable websites that deliver exceptional digital experiences.',
      detailTag: '01 // CORE ARCHITECTURE',
      detailTitle: 'Web Development',
      detailDesc: 'We build high-performance, responsive, and scalable websites that deliver exceptional digital experiences. From modern business websites to complex web applications, we combine cutting-edge technologies with intuitive functionality to help businesses establish a powerful online presence.',
      stack: ['React', 'Next.js', 'Node.js', 'TypeScript', 'TailwindCSS', 'GraphQL', 'Headless CMS', 'Edge CDN'],
      deliverables: [
        'Custom Website Development',
        'Responsive Web Design',
        'Full-Stack Web Applications',
        'API Integration & Development',
        'Website Optimization & Maintenance'
      ],
      renderVisual: function() {
        return `
          <div class="vis-code-window">
            <div class="vis-code-header">
              <div class="vis-code-dots">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <span class="vis-code-filename">WebCore.tsx - Riyadvi Framework</span>
            </div>
            <div class="vis-code-body">
              <div class="code-line"><span class="line-no">01</span><span class="kw">const</span> <span class="var">app</span> = <span class="fn">createServer</span>();</div>
              <div class="code-line"><span class="line-no">02</span><span class="kw">import</span> { <span class="type">NextApp</span>, <span class="type">React</span> } <span class="kw">from</span> <span class="str">'riyadvi'</span>;</div>
              <div class="code-line"><span class="line-no">03</span><span class="kw">async function</span> <span class="fn">renderMatrix</span>(<span class="param">stream</span>)</div>
              <div class="code-line"><span class="line-no">04</span>{</div>
              <div class="code-line"><span class="line-no">05</span>  <span class="kw">const</span> <span class="var">pipeline</span> = <span class="kw">await</span></div>
              <div class="code-line"><span class="line-no">06</span>  stream.<span class="fn">pipe</span>({</div>
              <div class="code-line"><span class="line-no">07</span>    latency: <span class="str">'0.4ms'</span>,</div>
              <div class="code-line"><span class="line-no">08</span>    caching: <span class="str">'edge-optimized'</span>,</div>
              <div class="code-line"><span class="line-no">09</span>    security: <span class="str">'quantum-tls'</span>,</div>
              <div class="code-line"><span class="line-no">10</span>  });</div>
              <div class="code-line"><span class="line-no">11</span>  <span class="kw">return</span> pipeline.<span class="fn">deploy</span>(<span class="str">'global'</span>);</div>
              <div class="code-line"><span class="line-no">12</span>} <span class="vis-code-cursor"></span></div>
            </div>
          </div>
        `;
      }
    },
    {
      id: 'custom',
      category: 'development',
      categoryLabel: 'DEVELOPMENT',
      num: '02',
      tag: '02 // ENTERPRISE',
      name: 'Custom Software Development',
      oneLiner: 'We transform complex business requirements into powerful, tailor-made software solutions.',
      detailTag: '02 // ENTERPRISE SYSTEMS',
      detailTitle: 'Custom Software Development',
      detailDesc: 'We transform complex business requirements into powerful, tailor-made software solutions. Our custom applications streamline workflows, automate operations, and improve productivity through scalable architecture and intelligent technology designed around your business needs.',
      stack: ['Node.js', 'Go', 'Python', 'Microservices', 'PostgreSQL', 'Redis', 'Kafka', 'Docker & K8s'],
      deliverables: [
        'Business Management Systems',
        'Enterprise Software Solutions',
        'Workflow Automation',
        'CRM & ERP Development',
        'Custom API & Backend Solutions'
      ],
      renderVisual: function() {
        return `
          <div class="vis-nodes-stage">
            <svg viewBox="0 0 360 220" class="vis-nodes-svg">
              <line x1="180" y1="35" x2="280" y2="65" class="vis-node-link" />
              <line x1="180" y1="35" x2="80" y2="75" class="vis-node-link" />
              <line x1="180" y1="35" x2="180" y2="110" class="vis-node-link" />
              <line x1="80" y1="75" x2="100" y2="175" class="vis-node-link" />
              <line x1="180" y1="110" x2="100" y2="175" class="vis-node-link" />
              <line x1="180" y1="110" x2="260" y2="175" class="vis-node-link" />
              <line x1="280" y1="65" x2="260" y2="175" class="vis-node-link" />
              
              <circle r="3.5" fill="#f0c75e" class="vis-pulse-dot">
                <animateMotion path="M180,35 L280,65 L260,175" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle r="3.5" fill="#6fd3a8" class="vis-pulse-dot">
                <animateMotion path="M180,35 L80,75 L100,175" dur="2.8s" repeatCount="indefinite" />
              </circle>
              <circle r="3.5" fill="#f0c75e" class="vis-pulse-dot">
                <animateMotion path="M180,35 L180,110 L260,175" dur="2s" repeatCount="indefinite" />
              </circle>

              <g transform="translate(180, 35)">
                <circle r="16" class="node-ring pulse" />
                <circle r="11" class="node-core gold" />
                <text y="22" class="node-label">API Gateway</text>
              </g>
              <g transform="translate(280, 65)">
                <circle r="14" class="node-ring" />
                <circle r="9" class="node-core" />
                <text y="20" class="node-label">Auth Microservice</text>
              </g>
              <g transform="translate(80, 75)">
                <circle r="14" class="node-ring" />
                <circle r="9" class="node-core" />
                <text y="20" class="node-label">Service Mesh</text>
              </g>
              <g transform="translate(180, 110)">
                <circle r="18" class="node-ring pulse" />
                <circle r="12" class="node-core gold" />
                <text y="24" class="node-label">Distributed Cluster</text>
              </g>
              <g transform="translate(100, 175)">
                <circle r="14" class="node-ring" />
                <circle r="9" class="node-core" />
                <text y="20" class="node-label">Cache Layer</text>
              </g>
              <g transform="translate(260, 175)">
                <circle r="16" class="node-ring pulse" />
                <circle r="10" class="node-core" />
                <text y="22" class="node-label">Cloud DB Node</text>
              </g>
            </svg>
          </div>
        `;
      }
    },
    {
      id: 'mobile',
      category: 'development',
      categoryLabel: 'DEVELOPMENT',
      num: '03',
      tag: '03 // MOBILE',
      name: 'Mobile App Development',
      oneLiner: 'We create feature-rich mobile applications that connect businesses with customers anytime, anywhere.',
      detailTag: '03 // MOBILE ENGINEERING',
      detailTitle: 'Mobile App Development',
      detailDesc: 'We create feature-rich mobile applications that connect businesses with customers anytime, anywhere. Our applications combine seamless performance, intuitive interfaces, and reliable functionality to deliver engaging experiences across mobile platforms.',
      stack: ['Flutter', 'React Native', 'Swift / iOS', 'Kotlin / Android', 'REST & GraphQL', 'SQLite', 'Firebase', 'App Store CI/CD'],
      deliverables: [
        'Android Application Development',
        'iOS Application Development',
        'Cross-Platform App Development',
        'Mobile UI/UX Design',
        'App Integration & Maintenance'
      ],
      renderVisual: function() {
        return `
          <div class="vis-phone-wrap">
            <div class="vis-phone-chassis">
              <div class="vis-phone-notch"></div>
              <div class="vis-phone-screen">
                <div class="vis-phone-header">
                  <span class="phone-time">9:41</span>
                  <span class="phone-icons">●●●</span>
                </div>
                <div class="vis-phone-list">
                  <div class="phone-row r1"><span class="row-icon">✦</span><span class="row-title">Analytics Dashboard</span><span class="row-badge">Live</span></div>
                  <div class="phone-row r2 active"><span class="row-icon">⚡</span><span class="row-title">Cloud Storage Sync</span><span class="row-badge green">100%</span></div>
                  <div class="phone-row r3"><span class="row-icon">✉</span><span class="row-title">Real-time Messaging</span><span class="row-badge">4 New</span></div>
                  <div class="phone-row r4"><span class="row-icon">🔒</span><span class="row-title">Biometric Vault</span><span class="row-badge">Active</span></div>
                </div>
                <div class="vis-phone-tap-ring"></div>
              </div>
            </div>
          </div>
        `;
      }
    },
    {
      id: 'ecommerce',
      category: 'development',
      categoryLabel: 'DEVELOPMENT',
      num: '04',
      tag: '04 // COMMERCE',
      name: 'E-Commerce Solutions',
      oneLiner: 'We develop powerful e-commerce platforms that turn visitors into customers.',
      detailTag: '04 // COMMERCE ARCHITECTURE',
      detailTitle: 'E-Commerce Solutions',
      detailDesc: 'We develop powerful e-commerce platforms that turn visitors into customers. From intuitive product discovery to secure checkout experiences, we build scalable online stores designed to simplify shopping, manage operations, and accelerate business growth.',
      stack: ['Shopify Plus', 'WooCommerce', 'Headless Commerce', 'Stripe API', 'Razorpay', 'Next.js Commerce', 'Algolia Search', 'Klaviyo'],
      deliverables: [
        'Custom E-Commerce Websites',
        'Online Store Development',
        'Shopping Cart & Checkout Integration',
        'Payment Gateway Integration',
        'Inventory & Order Management'
      ],
      renderVisual: function() {
        return `
          <div class="vis-ecom-card">
            <div class="ecom-top-row">
              <span class="ecom-engine-label">HEADLESS E-COMMERCE ENGINE</span>
              <span class="ecom-status-badge">SUB-SECOND CHECKOUT</span>
            </div>
            <div class="ecom-price-wrap">
              <span class="ecom-currency">$</span>
              <span class="ecom-counter-val">2,480.00</span>
            </div>
            <div class="ecom-items-list">
              <div class="ecom-item-row item1">
                <span class="item-name">Quantum Silk Architecture</span>
                <span class="item-price">$1,990.00</span>
              </div>
              <div class="ecom-item-row item2">
                <span class="item-name">Edge CDN &amp; Multi-Region</span>
                <span class="item-price">$490.00</span>
              </div>
            </div>
            <div class="ecom-sync-bar">
              <div class="sync-info">
                <span class="sync-dot"></span>
                <span class="sync-text">0.04s Instant Stripe / Shopify Sync</span>
              </div>
              <div class="sync-progress-track">
                <div class="sync-progress-line"></div>
              </div>
            </div>
          </div>
        `;
      }
    },
    {
      id: 'gamedev',
      category: 'development',
      categoryLabel: 'DEVELOPMENT',
      num: '05',
      tag: '05 // GAMING',
      name: 'Game Development',
      oneLiner: 'We bring creative ideas to life through immersive, interactive, and engaging gaming experiences.',
      detailTag: '05 // GAME ARCHITECTURE',
      detailTitle: 'Game Development',
      detailDesc: 'We bring creative ideas to life through immersive, interactive, and engaging gaming experiences. Combining innovative gameplay mechanics, captivating visuals, and advanced development technologies, we create games that entertain users and deliver memorable digital experiences.',
      stack: ['Unity 3D', 'Unreal Engine 5', 'C# / C++', 'WebGL / Three.js', 'Godot', 'Multiplayer Netcode', 'ShaderLab / HLSL', 'Blender'],
      deliverables: [
        '2D & 3D Game Development',
        'Game Design & Mechanics',
        'Interactive Gameplay Experiences',
        'Character & Environment Design',
        'Game Optimization & Testing'
      ],
      renderVisual: function() {
        return `
          <div class="vis-game-wrap">
            <div class="game-hud-bar">
              <span class="game-hud-lvl">STAGE 05 // BOSS RAID</span>
              <span class="game-hud-fps"><span class="game-fps-dot"></span> 120 FPS</span>
            </div>
            <div class="game-screen-arena">
              <div class="game-grid-plane"></div>
              <div class="game-target t1"></div>
              <div class="game-target t2"></div>
              <div class="game-laser-beam"></div>
              <div class="game-ship-fighter">
                <div class="ship-wing-left"></div>
                <div class="ship-cockpit"></div>
                <div class="ship-wing-right"></div>
                <div class="ship-thruster"></div>
              </div>
            </div>
            <div class="game-hud-bottom">
              <div class="game-bar-group">
                <span class="game-bar-lbl">SHIELD</span>
                <div class="game-bar-track"><div class="game-bar-fill gold" style="width: 88%;"></div></div>
              </div>
              <div class="game-bar-group">
                <span class="game-bar-lbl">HEALTH</span>
                <div class="game-bar-track"><div class="game-bar-fill green" style="width: 100%;"></div></div>
              </div>
              <span class="game-engine-tag">UNREAL / UNITY</span>
            </div>
          </div>
        `;
      }
    },
    {
      id: 'arvr',
      category: 'development',
      categoryLabel: 'DEVELOPMENT',
      num: '06',
      tag: '06 // SPATIAL',
      name: 'AR/VR Development',
      oneLiner: 'We create immersive Augmented Reality and Virtual Reality experiences connecting digital and physical worlds.',
      detailTag: '06 // SPATIAL COMPUTING',
      detailTitle: 'AR/VR Development',
      detailDesc: 'We create immersive Augmented Reality and Virtual Reality experiences that connect the digital and physical worlds. From interactive simulations to virtual environments, our solutions help businesses transform how people explore, learn, interact, and experience technology.',
      stack: ['WebXR', 'Unity XR', 'OpenXR', 'VisionOS', 'Three.js / WebGL', 'ARKit & ARCore', 'Spatial Audio', 'Hand Tracking'],
      deliverables: [
        'Augmented Reality Applications',
        'Virtual Reality Experiences',
        'Interactive 3D Environments',
        'Virtual Product Demonstrations',
        'AR/VR Simulations & Training'
      ],
      renderVisual: function() {
        return `
          <div class="vis-arvr-wrap">
            <div class="arvr-hud-header">
              <span class="arvr-engine-title">SPATIAL ENGINE // 6-DoF</span>
              <span class="arvr-status-pill"><span class="arvr-pulse-dot"></span> TRACKING</span>
            </div>
            <div class="arvr-viewport">
              <div class="arvr-holo-ring r-outer"></div>
              <div class="arvr-holo-ring r-inner"></div>
              <div class="arvr-reticle">
                <span class="reticle-line h"></span>
                <span class="reticle-line v"></span>
                <div class="reticle-center"></div>
              </div>
              <div class="arvr-point p1"></div>
              <div class="arvr-point p2"></div>
              <div class="arvr-point p3"></div>
              <div class="arvr-point p4"></div>
            </div>
            <div class="arvr-hud-footer">
              <div class="arvr-coords">X: 0.42 &nbsp;Y: 1.18 &nbsp;Z: -0.85</div>
              <div class="arvr-latency">4ms WebXR / VisionOS</div>
            </div>
          </div>
        `;
      }
    },
    {
      id: 'design',
      category: 'designing',
      categoryLabel: 'DESIGNING',
      num: '07',
      tag: '07 // DESIGN',
      name: 'UI/UX Design',
      oneLiner: 'We design meaningful digital experiences that combine visual creativity with effortless usability.',
      detailTag: '07 // DESIGN SYSTEMS',
      detailTitle: 'UI/UX Design',
      detailDesc: 'We design meaningful digital experiences that combine visual creativity with effortless usability. Through user-focused research, modern interface design, and intuitive navigation, we create digital products that engage users, strengthen brand identity, and make every interaction seamless.',
      stack: ['Figma', 'Design Systems', 'Interactive Prototypes', 'Wireframing', 'User Research', 'Motion Design', 'Design Tokens', 'Usability Testing'],
      deliverables: [
        'User Interface (UI) Design',
        'User Experience (UX) Design',
        'Website & App Design',
        'Wireframing & Prototyping',
        'Design Systems & Branding'
      ],
      renderVisual: function() {
        return `
          <div class="vis-wireframe-wrap">
            <div class="wf-badge-tag"><span class="wf-state-text">Wireframe &rarr; Polished UI</span></div>
            <div class="wf-artboard">
              <div class="wf-block wf-header"></div>
              <div class="wf-block wf-hero"></div>
              <div class="wf-cards-row">
                <div class="wf-block wf-card c1"></div>
                <div class="wf-block wf-card c2"></div>
                <div class="wf-block wf-card c3"></div>
              </div>
              <div class="wf-block wf-btn"></div>
            </div>
          </div>
        `;
      }
    },
    {
      id: '3d',
      category: 'designing',
      categoryLabel: 'DESIGNING',
      num: '08',
      tag: '08 // IMMERSIVE',
      name: '3D Modeling',
      oneLiner: 'We transform concepts and ideas into detailed, realistic, and visually compelling 3D models.',
      detailTag: '08 // 3D MODELING & CGI',
      detailTitle: '3D Modeling',
      detailDesc: 'We transform concepts and ideas into detailed, realistic, and visually compelling 3D models. From product visualization to architectural and digital assets, we combine precision, creativity, and advanced 3D techniques to bring every concept to life.',
      stack: ['Blender', 'Cinema 4D', 'ZBrush', 'Substance Painter', 'Three.js / WebGL', 'PBR Shaders', 'GLTF / USDZ', 'KeyShot'],
      deliverables: [
        '3D Product Modeling',
        '3D Asset Creation',
        'Architectural Visualization',
        '3D Texturing & Rendering',
        '3D Animation & Visualization'
      ],
      renderVisual: function() {
        return `
          <div class="vis-cube-stage">
            <div class="vis-cube-badge"><span class="cube-green-dot"></span> 3D MESH &middot; 60 FPS</div>
            <div class="vis-cube-viewport">
              <div class="vis-cube-obj">
                <div class="cube-face front"></div>
                <div class="cube-face back"></div>
                <div class="cube-face right"></div>
                <div class="cube-face left"></div>
                <div class="cube-face top"></div>
                <div class="cube-face bottom"></div>
                <div class="cube-core-energy"></div>
              </div>
            </div>
          </div>
        `;
      }
    },
    {
      id: 'marketing',
      category: 'marketing',
      categoryLabel: 'MARKETING',
      num: '09',
      tag: '09 // GROWTH',
      name: 'Digital Marketing',
      oneLiner: 'We help businesses strengthen their online presence, reach the right audience, and generate meaningful growth.',
      detailTag: '09 // DIGITAL MARKETING',
      detailTitle: 'Digital Marketing',
      detailDesc: 'We help businesses strengthen their online presence, reach the right audience, and generate meaningful growth through strategic digital marketing. By combining creativity, data-driven insights, and targeted campaigns, we turn digital visibility into measurable business opportunities.',
      stack: ['Google Ads', 'Meta Ads', 'Technical SEO', 'Conversion Rate Opt', 'HubSpot / Klaviyo', 'GA4 & Attribution', 'A/B Testing', 'Content Strategy'],
      deliverables: [
        'Search Engine Optimization (SEO)',
        'Social Media Marketing',
        'Search Engine Marketing (SEM)',
        'Content Marketing',
        'Performance Marketing & Analytics'
      ],
      renderVisual: function() {
        return `
          <div class="vis-funnel-wrap">
            <div class="funnel-row f1">
              <span class="funnel-stage-name">Attract</span>
              <div class="funnel-bar-track"><div class="funnel-bar-fill bar1" style="width: 100%;"></div></div>
              <span class="funnel-pct">100%</span>
            </div>
            <div class="funnel-row f2">
              <span class="funnel-stage-name">Capture</span>
              <div class="funnel-bar-track"><div class="funnel-bar-fill bar2" style="width: 82%;"></div></div>
              <span class="funnel-pct">82%</span>
            </div>
            <div class="funnel-row f3">
              <span class="funnel-stage-name">Convert</span>
              <div class="funnel-bar-track"><div class="funnel-bar-fill bar3" style="width: 64%;"></div></div>
              <span class="funnel-pct">64%</span>
            </div>
            <div class="funnel-row f4">
              <span class="funnel-stage-name">Grow</span>
              <div class="funnel-bar-track"><div class="funnel-bar-fill bar4" style="width: 46%;"></div></div>
              <span class="funnel-pct">46%</span>
            </div>
          </div>
        `;
      }
    }
  ];

  // Expose on window for easy editing
  window.SERVICES_DATA = SERVICES_DATA;

  // DOM Elements
  const stage = document.getElementById('servicesCoverflowStage');
  const prevBtn = document.getElementById('svcPrevBtn');
  const nextBtn = document.getElementById('svcNextBtn');
  const dotsWrap = document.getElementById('svcDotsWrap');
  const activeCaption = document.getElementById('svcActiveCaption');
  const exploreActiveBtn = document.getElementById('svcExploreActiveBtn');
  const exploreBtnText = document.getElementById('svcExploreBtnText');
  const filterChips = document.querySelectorAll('.svc-filter-chip');

  // Chapter View Elements
  const chapterModal = document.getElementById('serviceChapterModal');
  const chapterCloseBtn = document.getElementById('chapterCloseBtn');
  const chapterBackBtn = document.getElementById('chapterBackBtn');
  const chapterHugeIndex = document.getElementById('chapterHugeIndex');
  const chapterLeftTag = document.getElementById('chapterLeftTag');
  const chapterLeftName = document.getElementById('chapterLeftName');
  const chapterLeftVisualStage = document.getElementById('chapterLeftVisualStage');
  const chapterRightColumn = document.getElementById('chapterRightColumn');
  const chapterOverviewTag = document.getElementById('chapterOverviewTag');
  const chapterOverviewTitle = document.getElementById('chapterOverviewTitle');
  const chapterOverviewLead = document.getElementById('chapterOverviewLead');
  const chapterTechChips = document.getElementById('chapterTechChips');
  const chapterDeliverablesGrid = document.getElementById('chapterDeliverablesGrid');
  const chapterCtaTitle = document.getElementById('chapterCtaTitle');
  const chapterStartProjectBtn = document.getElementById('chapterStartProjectBtn');
  const chapterPrevServiceBtn = document.getElementById('chapterPrevServiceBtn');
  const chapterNextServiceBtn = document.getElementById('chapterNextServiceBtn');
  const chapterPrevServiceName = document.getElementById('chapterPrevServiceName');
  const chapterNextServiceName = document.getElementById('chapterNextServiceName');

  if (!stage) return;

  // State
  let currentFilter = 'development';
  let filteredServices = SERVICES_DATA;
  let cardElements = [];
  let target = 0;
  let pos = 0;
  let isDragging = false;
  let hasDragged = false;
  let startX = 0;
  let startPos = 0;
  let lastMountedIndex = -1;
  let currentChapterServiceId = null;
  let chapterObserver = null;

  // 2. BUILD CAROUSEL CARDS
  function buildCards() {
    filteredServices = (currentFilter === 'all')
      ? SERVICES_DATA
      : SERVICES_DATA.filter(s => s.category === currentFilter);

    stage.innerHTML = '';
    cardElements = [];
    lastMountedIndex = -1;
    target = 0;
    pos = 0;

    filteredServices.forEach((svc, index) => {
      const card = document.createElement('div');
      card.className = 'services-coverflow-card';
      card.setAttribute('data-service-id', svc.id);
      card.setAttribute('data-index', index);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', svc.name + ' - ' + svc.oneLiner);

      card.innerHTML = `
        <div class="svc-card-top">
          <span class="svc-card-tag">${svc.tag}</span>
          <span class="svc-card-category">${svc.categoryLabel}</span>
        </div>
        <div class="svc-card-art-box">
          <div class="svc-giant-number">${svc.num}</div>
          <div class="svc-live-visual-wrapper" style="display: none;"></div>
        </div>
        <div class="svc-card-bottom">
          <h3 class="svc-card-name">${svc.name}</h3>
          <p class="svc-card-oneliner">${svc.oneLiner}</p>
          <div class="svc-card-explore-row">
            <span class="svc-explore-label">EXPLORE SERVICE</span>
            <div class="svc-explore-icon-circle">+</div>
          </div>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (hasDragged) return;
        openChapterView(svc.id, card);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openChapterView(svc.id, card);
        }
      });

      stage.appendChild(card);
      cardElements.push(card);
    });

    buildDots();
    updateCaption();
    renderCoverflow(true);
  }

  // 3. BUILD DOTS
  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    filteredServices.forEach((svc, i) => {
      const dot = document.createElement('button');
      dot.className = 'svc-dot' + (i === Math.round(pos) ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to service ' + (i + 1));
      dot.addEventListener('click', () => {
        target = i;
      });
      dotsWrap.appendChild(dot);
    });
  }

  function updateDots() {
    if (!dotsWrap) return;
    const centerIndex = Math.max(0, Math.min(filteredServices.length - 1, Math.round(pos)));
    const dots = dotsWrap.querySelectorAll('.svc-dot');
    dots.forEach((dot, i) => {
      if (i === centerIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function updateCaption() {
    const centerIndex = Math.max(0, Math.min(filteredServices.length - 1, Math.round(pos)));
    const svc = filteredServices[centerIndex];
    if (!svc) return;

    if (activeCaption) {
      const curNo = String(centerIndex + 1).padStart(2, '0');
      const totNo = String(filteredServices.length).padStart(2, '0');
      const catCap = svc.categoryLabel.charAt(0) + svc.categoryLabel.slice(1).toLowerCase();
      activeCaption.textContent = `${curNo} / ${totNo} · ${catCap}`;
    }

    if (exploreBtnText) {
      exploreBtnText.textContent = `Explore ${svc.name} →`;
    }
  }

  // 4. COVERFLOW RENDER LOOP
  function renderCoverflow(forceMount) {
    if (!cardElements.length) return;
    const cardWidth = cardElements[0].offsetWidth || 340;
    const spacing = cardWidth * 0.82;
    const centerIndex = Math.max(0, Math.min(filteredServices.length - 1, Math.round(pos)));

    cardElements.forEach((card, i) => {
      const d = i - pos;
      const absD = Math.abs(d);
      const sign = Math.sign(d);

      // Positioning formula from spec
      const translateX = sign * (Math.min(absD, 1) * spacing + Math.max(absD - 1, 0) * spacing * 0.5);
      const rotateY = Math.max(-58, Math.min(58, -d * 40));
      const translateZ = -absD * 150;
      const scale = 1 - Math.min(absD, 2) * 0.06;
      const opacity = Math.max(0, 1 - absD * 0.32);
      const zIndex = Math.round(100 - absD * 10);
      const pointerEvents = opacity < 0.1 ? 'none' : 'auto';

      card.style.transform = `translate3d(calc(-50% + ${translateX.toFixed(2)}px), -50%, ${translateZ.toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      card.style.opacity = opacity.toFixed(3);
      card.style.zIndex = zIndex;
      card.style.pointerEvents = pointerEvents;

      if (i === centerIndex) {
        card.classList.add('is-active');
      } else {
        card.classList.remove('is-active');
      }
    });

    // Mount / Unmount live animated visual on active card
    if (centerIndex !== lastMountedIndex || forceMount) {
      lastMountedIndex = centerIndex;
      cardElements.forEach((card, i) => {
        const giantNum = card.querySelector('.svc-giant-number');
        const visualWrap = card.querySelector('.svc-live-visual-wrapper');
        const svc = filteredServices[i];

        if (i === centerIndex) {
          if (giantNum) giantNum.style.display = 'none';
          if (visualWrap) {
            visualWrap.style.display = 'flex';
            visualWrap.innerHTML = svc.renderVisual();
          }
        } else {
          if (giantNum) giantNum.style.display = 'flex';
          if (visualWrap) {
            visualWrap.style.display = 'none';
            visualWrap.innerHTML = ''; // free animation memory
          }
        }
      });

      updateDots();
      updateCaption();
    }
  }

  // Animation Loop (requestAnimationFrame)
  let isRafRunning = false;
  function startRafLoop() {
    if (isRafRunning) return;
    isRafRunning = true;

    function step() {
      if (!isDragging) {
        pos += (target - pos) * 0.13;
        if (Math.abs(target - pos) < 0.001) {
          pos = target;
          renderCoverflow(false);
          isRafRunning = false;
          return;
        }
      }
      renderCoverflow(false);
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function triggerMove(newTarget) {
    target = Math.max(0, Math.min(filteredServices.length - 1, newTarget));
    startRafLoop();
  }

  // 5. DRAG & TOUCH CONTROLS
  let isPointerDown = false;
  let downTargetCard = null;

  stage.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isPointerDown = true;
    isDragging = false;
    hasDragged = false;
    startX = e.clientX;
    startPos = pos;
    downTargetCard = e.target.closest('.services-coverflow-card');
  });

  stage.addEventListener('pointermove', (e) => {
    if (!isPointerDown) return;
    const deltaX = e.clientX - startX;
    if (!hasDragged && Math.abs(deltaX) > 8) {
      hasDragged = true;
      isDragging = true;
      stage.classList.add('is-dragging');
      try { stage.setPointerCapture(e.pointerId); } catch (_) {}
      startRafLoop();
    }
    if (isDragging) {
      // 280px drag = 1 card
      pos = startPos - (deltaX / 280);
      // Soft rubberband clamping
      const minPos = -0.5;
      const maxPos = filteredServices.length - 0.5;
      if (pos < minPos) pos = minPos + (pos - minPos) * 0.3;
      if (pos > maxPos) pos = maxPos + (pos - maxPos) * 0.3;
      target = pos;
    }
  });

  function endPointer(e) {
    if (!isPointerDown) return;
    const wasDragging = hasDragged;
    isPointerDown = false;
    isDragging = false;
    stage.classList.remove('is-dragging');
    try {
      if (stage.hasPointerCapture && stage.hasPointerCapture(e.pointerId)) {
        stage.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}

    if (wasDragging) {
      triggerMove(Math.round(pos));
    } else {
      // Direct click or tap on card
      const targetCard = e.target.closest('.services-coverflow-card') || downTargetCard;
      if (targetCard) {
        const svcId = targetCard.getAttribute('data-service-id');
        if (svcId) {
          openChapterView(svcId, targetCard);
        }
      }
    }
  }

  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);

  // 6. WHEEL / TRACKPAD HORIZONTAL SCROLL
  let wheelAccumulator = 0;
  let wheelTimeout = null;
  stage.addEventListener('wheel', (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 8) return;
    e.preventDefault();
    wheelAccumulator += delta;

    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      wheelAccumulator = 0;
    }, 200);

    if (Math.abs(wheelAccumulator) > 40) {
      const dir = Math.sign(wheelAccumulator);
      triggerMove(target + dir);
      wheelAccumulator = 0;
    }
  }, { passive: false });

  // 7. ARROW KEYS
  window.addEventListener('keydown', (e) => {
    // Only if chapter modal is NOT open
    if (chapterModal && chapterModal.style.display !== 'none') {
      if (e.key === 'Escape') {
        closeChapterView();
      }
      return;
    }

    if (e.key === 'ArrowLeft') {
      triggerMove(target - 1);
    } else if (e.key === 'ArrowRight') {
      triggerMove(target + 1);
    }
  });

  // 8. BUTTONS
  if (prevBtn) {
    prevBtn.addEventListener('click', () => triggerMove(target - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => triggerMove(target + 1));
  }

  if (exploreActiveBtn) {
    exploreActiveBtn.addEventListener('click', () => {
      const centerIndex = Math.max(0, Math.min(filteredServices.length - 1, Math.round(pos)));
      const svc = filteredServices[centerIndex];
      const card = cardElements[centerIndex];
      if (svc) {
        openChapterView(svc.id, card);
      }
    });
  }

  // 9. FILTER CHIPS
  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-selected', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-selected', 'true');
      currentFilter = chip.getAttribute('data-filter') || 'all';
      buildCards();
    });
  });

  // =========================================================================
  // CHAPTER VIEW FULL-SCREEN ENGINE
  // =========================================================================

  function populateChapterView(serviceId) {
    const svcIndex = SERVICES_DATA.findIndex(s => s.id === serviceId);
    if (svcIndex === -1) return;
    const svc = SERVICES_DATA[svcIndex];
    currentChapterServiceId = svc.id;

    // Left Column
    if (chapterHugeIndex) chapterHugeIndex.textContent = svc.num;
    if (chapterLeftTag) chapterLeftTag.textContent = svc.detailTag || svc.tag;
    if (chapterLeftName) chapterLeftName.textContent = svc.name;
    if (chapterLeftVisualStage) {
      chapterLeftVisualStage.innerHTML = svc.renderVisual();
    }

    // Right Column: Overview
    if (chapterOverviewTag) chapterOverviewTag.textContent = svc.detailTag || svc.tag;
    if (chapterOverviewTitle) chapterOverviewTitle.textContent = svc.detailTitle || svc.name;
    if (chapterOverviewLead) chapterOverviewLead.textContent = svc.detailDesc || svc.oneLiner;

    // Tech Stack Chips
    if (chapterTechChips) {
      chapterTechChips.innerHTML = '';
      (svc.stack || []).forEach((tag, idx) => {
        const chip = document.createElement('span');
        chip.className = 'chapter-tech-chip';
        chip.textContent = tag;
        chip.style.transitionDelay = (idx * 0.05 + 0.1) + 's';
        chapterTechChips.appendChild(chip);
      });
    }

    // Deliverables Grid
    if (chapterDeliverablesGrid) {
      chapterDeliverablesGrid.innerHTML = '';
      (svc.deliverables || []).forEach((deliv, idx) => {
        const card = document.createElement('div');
        card.className = 'chapter-deliverable-card';
        card.innerHTML = `
          <div class="deliverable-check-icon">&#10003;</div>
          <div class="deliverable-text">${deliv}</div>
        `;
        chapterDeliverablesGrid.appendChild(card);
      });
    }

    // CTA
    if (chapterCtaTitle) {
      chapterCtaTitle.textContent = `Ready to start your ${svc.name} project?`;
    }
    if (chapterStartProjectBtn) {
      chapterStartProjectBtn.setAttribute('data-service-preselect', svc.id);
      chapterStartProjectBtn.href = '#estimator';
    }

    // Neighbour Cards
    const prevIdx = (svcIndex - 1 + SERVICES_DATA.length) % SERVICES_DATA.length;
    const nextIdx = (svcIndex + 1) % SERVICES_DATA.length;
    const prevSvc = SERVICES_DATA[prevIdx];
    const nextSvc = SERVICES_DATA[nextIdx];

    if (chapterPrevServiceName) chapterPrevServiceName.textContent = prevSvc.name;
    if (chapterNextServiceName) chapterNextServiceName.textContent = nextSvc.name;

    if (chapterPrevServiceBtn) {
      chapterPrevServiceBtn.onclick = () => switchChapter(prevSvc.id);
    }
    if (chapterNextServiceBtn) {
      chapterNextServiceBtn.onclick = () => switchChapter(nextSvc.id);
    }

    // Setup IntersectionObserver for smooth reveal on scroll
    setupChapterObserver();
  }

  function setupChapterObserver() {
    if (chapterObserver) {
      chapterObserver.disconnect();
    }

    const items = chapterModal.querySelectorAll('.svc-reveal-item');
    chapterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      });
    }, {
      root: chapterRightColumn,
      threshold: 0.15
    });

    items.forEach(item => {
      item.classList.remove('is-revealed');
      chapterObserver.observe(item);
    });

    // Reveal top item immediately
    setTimeout(() => {
      const topSection = document.getElementById('chapterOverviewSection');
      if (topSection) topSection.classList.add('is-revealed');
    }, 100);
  }

  function openChapterView(serviceId, sourceCard) {
    if (!serviceId) {
      const centerIndex = Math.max(0, Math.min(filteredServices.length - 1, Math.round(pos)));
      serviceId = filteredServices[centerIndex]?.id || 'web';
    }
    populateChapterView(serviceId);
    if (!chapterModal) return;

    // Immediately reveal all chapter sections so content is 100% visible
    const items = chapterModal.querySelectorAll('.svc-reveal-item');
    items.forEach(el => el.classList.add('is-revealed'));

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    chapterModal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    if (sourceCard && !prefersReducedMotion) {
      const rect = sourceCard.getBoundingClientRect();
      const top = Math.max(0, Math.round(rect.top));
      const right = Math.max(0, Math.round(window.innerWidth - rect.right));
      const bottom = Math.max(0, Math.round(window.innerHeight - rect.bottom));
      const left = Math.max(0, Math.round(rect.left));

      chapterModal.style.transition = 'none';
      chapterModal.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px round 26px)`;
      chapterModal.style.opacity = '1';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          chapterModal.style.transition = 'clip-path 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease';
          chapterModal.style.clipPath = 'inset(0px 0px 0px 0px round 0px)';
          setTimeout(() => {
            chapterModal.style.clipPath = 'none';
          }, 550);
        });
      });
    } else {
      chapterModal.style.transition = 'opacity 0.35s ease';
      chapterModal.style.clipPath = 'none';
      chapterModal.style.opacity = '1';
    }

    if (chapterRightColumn) chapterRightColumn.scrollTop = 0;

    // Deep link hash
    history.replaceState(null, null, '#service-' + serviceId);

    if (typeof AudioEngine !== 'undefined' && AudioEngine.playBeep) {
      AudioEngine.playBeep(840, 'sine', 0.12, 0.03);
    }
  }

  function switchChapter(serviceId) {
    const inner = document.getElementById('chapterModalInner');
    if (inner) {
      inner.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      inner.style.opacity = '0';
      inner.style.transform = 'translateY(10px)';

      setTimeout(() => {
        populateChapterView(serviceId);
        if (chapterRightColumn) chapterRightColumn.scrollTop = 0;
        inner.style.opacity = '1';
        inner.style.transform = 'translateY(0)';
        history.replaceState(null, null, '#service-' + serviceId);
      }, 200);
    } else {
      populateChapterView(serviceId);
      if (chapterRightColumn) chapterRightColumn.scrollTop = 0;
      history.replaceState(null, null, '#service-' + serviceId);
    }
  }

  function closeChapterView() {
    if (!chapterModal) return;
    chapterModal.style.transition = 'opacity 0.35s ease';
    chapterModal.style.opacity = '0';

    setTimeout(() => {
      chapterModal.style.display = 'none';
      chapterModal.style.clipPath = 'none';
      document.body.style.overflow = '';
      if (chapterObserver) chapterObserver.disconnect();
      if (window.location.hash.startsWith('#service-')) {
        history.replaceState(null, null, '#services');
      }
    }, 350);
  }

  if (chapterCloseBtn) chapterCloseBtn.addEventListener('click', closeChapterView);
  if (chapterBackBtn) chapterBackBtn.addEventListener('click', closeChapterView);
  if (chapterStartProjectBtn) {
    chapterStartProjectBtn.addEventListener('click', () => {
      const match = SERVICES_DATA.find(s => s.id === currentChapterServiceId);
      closeChapterView();
      if (match) {
        const contactSelect = document.getElementById('contactService');
        if (contactSelect) {
          contactSelect.value = match.name;
        }
      }
    });
  }

  // Deep Link On Load & Hashchange
  function checkDeepLink() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#service-')) {
      const svcId = hash.replace('#service-', '').trim();
      const match = SERVICES_DATA.find(s => s.id === svcId);
      if (match) {
        setTimeout(() => {
          openChapterView(match.id, null);
        }, 300);
      }
    }
  }

  window.addEventListener('hashchange', checkDeepLink);

  // Initialize
  buildCards();
  checkDeepLink();
})();
