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

    // Step 1B: Immediately load Frame 105 (Peak connection touch frame with radiant golden portal)
    loadFrame(105);

    // Step 2: Progressive Keyframe Stride across approach & connection peak (<150ms)
    const keyframes = [15, 30, 45, 60, 75, 80, 85, 90, 95, 100, 105, 115, 125, 135, 145, 155, 165, 175];
    keyframes.forEach(k => loadFrame(k));

    // Step 3: Stream all remaining frames progressively in background without skipping
    let nextIdxToLoad = 2;
    function loadNextBatch() {
      let count = 0;
      while (nextIdxToLoad <= TOTAL_FRAMES && count < 6) {
        if (!frames[nextIdxToLoad]) {
          loadFrame(nextIdxToLoad);
          count++;
        }
        nextIdxToLoad += 1;
      }
      if (nextIdxToLoad <= TOTAL_FRAMES) {
        setTimeout(loadNextBatch, 25);
      }
    }
    setTimeout(loadNextBatch, 60);

    // Scroll progress smoothly spans from Hero top into About Us timeline
    const aboutSection = document.getElementById('about');
    const videoHeroStage = document.getElementById('videoHeroStage');

    function updateScrollProgress(forcedProgress) {
      let progress;
      if (typeof forcedProgress === 'number') {
        progress = Math.max(0, Math.min(1, forcedProgress));
      } else if (aboutSection && heroSection) {
        const startY = 0;
        const totalDist = (aboutSection.offsetTop + aboutSection.offsetHeight) - window.innerHeight * 0.95;
        const currentY = window.scrollY || window.pageYOffset || 0;
        progress = Math.max(0, Math.min(1, (currentY - startY) / Math.max(1, totalDist - startY)));
      } else {
        const currentY = window.scrollY || window.pageYOffset || 0;
        progress = Math.max(0, Math.min(1, currentY / (window.innerHeight * 2.5)));
      }

      // Smooth Continuous Dual-Stage Scrub across Hero & all Timeline Milestones:
      // Stage 1 (progress 0.0 -> 0.28): Hands approach and connect at Frame 105 (golden portal bursts open at About Us header)
      // Stage 2 (progress 0.28 -> 1.0): Fluid continuous scrub across cosmic halo & empowered synthesis through all timeline milestones (Frame 105 -> 175)
      // NEVER gets stuck, frozen or paused anywhere in the scroll!
      const p_split = 0.28;
      let calculatedFrame;
      if (progress <= p_split) {
        const sub = progress / p_split;
        calculatedFrame = 1 + sub * (105 - 1);
      } else {
        const sub = (progress - p_split) / (1 - p_split);
        calculatedFrame = 105 + sub * (TOTAL_FRAMES - 105);
      }
      targetFrame = Math.max(1, Math.min(TOTAL_FRAMES, calculatedFrame));

      // Cue hint fade smoothly when scroll starts past 35px
      const currentScrollY = window.scrollY || window.pageYOffset || 0;
      if (scrollDownHint) {
        if (currentScrollY > 35) {
          scrollDownHint.style.opacity = '0';
          scrollDownHint.style.pointerEvents = 'none';
        } else {
          scrollDownHint.style.opacity = '0.9';
        }
      }

      // Cinematic text fade:
      // Keep hero headline, buttons, and stats clear on load, then gracefully fade out (0.02 to 0.20 of overall journey)
      // as the user scrolls away from Hero into About Us
      const overlayFade = progress < 0.02 ? 1 : Math.max(0, 1 - (progress - 0.02) / 0.18);
      const translateY = -progress * 80;

      if (heroEditorialCenter) {
        heroEditorialCenter.style.opacity = overlayFade.toFixed(2);
        const isMobile = window.innerWidth <= 768;
        heroEditorialCenter.style.transform = isMobile 
          ? `translateY(${translateY}px)` 
          : `translateX(-50%) translateY(${translateY}px)`;
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

      // Keep VideoHero canvas clear, radiant & visible throughout Hero and About Us
      const vCanvas = document.getElementById('videoHeroCanvas');
      if (vCanvas) {
        vCanvas.style.opacity = '0.88';
        vCanvas.style.filter = 'brightness(0.92) contrast(1.02)';
      }

      // Ambient warm golden glow throughout timeline
      if (videoHeroAmbient) {
        const ambVal = Math.min(0.65, 0.45 + progress * 0.20);
        videoHeroAmbient.style.opacity = ambVal.toFixed(2);
        videoHeroAmbient.style.transform = 'translate(-50%, -50%) scale(1)';
        videoHeroAmbient.style.background = 'radial-gradient(circle, rgba(244, 211, 107, 0.22) 0%, rgba(212, 175, 55, 0.07) 50%, transparent 70%)';
      }

      // Audio micro-haptic when fingers make full connection touch (around progress 0.26 to 0.35)
      if (progress >= 0.26 && progress <= 0.35) {
        if (!hasPlayedTouchChime) {
          AudioEngine.playBeep(1120, 'sine', 0.16, 0.03);
          hasPlayedTouchChime = true;
        }
      } else if (progress < 0.20 || progress > 0.45) {
        hasPlayedTouchChime = false;
      }
    }

    // ScrollTrigger: Smoothly animates Frame 1 to 175 across Hero and all About Us milestones without sticking
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && heroSection && aboutSection) {
      gsap.registerPlugin(ScrollTrigger);

      // Complete hand touching and full cinematic journey (Frame 1 to 175) across Hero and entire About section
      ScrollTrigger.create({
        trigger: heroSection,
        start: "top top",
        endTrigger: aboutSection,
        end: "bottom 95%",
        scrub: 0.18,
        onUpdate: (self) => {
          updateScrollProgress(self.progress);
        }
      });

      // Keep VideoHero canvas visible through ALL About Us milestones, then gracefully fade out ONLY when reaching Awards (Rocket handover)
      ScrollTrigger.create({
        trigger: aboutSection,
        start: "bottom 85%",
        end: "bottom 15%",
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

    // Direct scroll listener for smooth fallback & Lenis updates
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY || window.pageYOffset || 0;
      if (scrollDownHint) {
        if (currentScrollY > 35) {
          scrollDownHint.style.opacity = '0';
          scrollDownHint.style.pointerEvents = 'none';
        } else {
          scrollDownHint.style.opacity = '0.9';
        }
      }
      if (typeof ScrollTrigger === 'undefined' || ScrollTrigger.getAll().length === 0) {
        updateScrollProgress();
      }
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
  const chapterToolInspector = document.getElementById('chapterToolInspector');
  const chapterDeliverablesGrid = document.getElementById('chapterDeliverablesGrid');
  const chapterCtaTitle = document.getElementById('chapterCtaTitle');
  const chapterStartProjectBtn = document.getElementById('chapterStartProjectBtn');
  const chapterPrevServiceBtn = document.getElementById('chapterPrevServiceBtn');
  const chapterNextServiceBtn = document.getElementById('chapterNextServiceBtn');
  const chapterPrevServiceName = document.getElementById('chapterPrevServiceName');
  const chapterNextServiceName = document.getElementById('chapterNextServiceName');

  if (!stage) return;

  // State
  let currentFilter = 'all';
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
  let savedScrollY = 0;

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
  // RIYADVI SERVICE KNOWLEDGE BASE: TOOLS & DELIVERABLES DEEP-DIVE REPOSITORY
  // =========================================================================

  const TECH_TOOLS_DATA = {
    'React': {
      name: 'React',
      category: 'UI Component Architecture',
      logo: '<svg viewBox="-11.5 -10.23174 23 20.46348"><circle cx="0" cy="0" r="2.05" fill="#61dafb"/><g stroke="#61dafb" stroke-width="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>',
      what: 'A declarative, component-driven JavaScript library created by Meta for engineering responsive, reactive web applications.',
      why: 'Powers lightning-fast single-page web applications with virtual DOM diffing, reusable UI components, and massive ecosystem scalability.',
      details: ['Sub-millisecond UI updates via Virtual DOM', 'Modular component reusability reducing dev cycles', 'Strict TypeScript compatibility for bug-free code', 'Seamless mobile sharing via React Native']
    },
    'Next.js': {
      name: 'Next.js',
      category: 'Production React Framework',
      logo: '<svg viewBox="0 0 180 180"><mask height="180" id="mask-nxt" maskUnits="userSpaceOnUse" width="180" x="0" y="0"><circle cx="90" cy="90" fill="black" r="90"/></mask><g mask="url(#mask-nxt)"><circle cx="90" cy="90" fill="#000" r="90" stroke="#f0c75e" stroke-width="5"/><path d="M149.508 157.438L69.1478 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.137 149.508 157.438Z" fill="#fff"/><rect fill="#fff" height="72" width="12" x="115" y="54"/></g></svg>',
      what: 'The industry-standard full-stack React framework developed by Vercel for enterprise production environments.',
      why: 'Combines Server-Side Rendering (SSR) and Static Site Generation (SSG) to achieve sub-second loading speeds, perfect Google Lighthouse scores, and optimal SEO ranking.',
      details: ['Hybrid SSR and Static Site Generation', 'Automated image and font optimization', 'Zero-config Edge API routes & Server Actions', 'App Router architecture with streaming SSR']
    },
    'Node.js': {
      name: 'Node.js',
      category: 'Asynchronous JavaScript Runtime',
      logo: '<svg viewBox="0 0 256 289"><path d="M128 0L8.2 69.2v149.9L128 288.3l119.8-69.2V69.2L128 0zm71.7 187.6c-4.8 8.1-11.4 14.8-19.7 20.1-8.3 5.3-17.7 8-28.2 8-11.8 0-21.9-3.2-30.3-9.5-8.4-6.3-13.8-14.8-16.2-25.5l18.5-7.6c1.6 6.8 5 12.1 10.3 15.9 5.3 3.8 11.2 5.7 17.7 5.7 6.4 0 11.9-1.5 16.5-4.5 4.6-3 6.9-7.2 6.9-12.6 0-3.9-1.4-7.2-4.2-9.8-2.8-2.6-7.8-5-15-7.2l-14.3-4.4c-11.9-3.7-20.5-8.8-25.8-15.3-5.3-6.5-8-14.4-8-23.7 0-9.9 3.9-18.3 11.7-25.2 7.8-6.9 17.5-10.4 29.1-10.4 10.5 0 19.6 3 27.3 9 7.7 6 12.6 13.9 14.7 23.7l-18.2 7.4c-1.3-5.5-4.1-9.9-8.4-13.2-4.3-3.3-9.4-5-15.4-5-5.5 0-10.1 1.4-13.8 4.2-3.7 2.8-5.6 6.6-5.6 11.4 0 3.7 1.3 6.8 3.9 9.3 2.6 2.5 7.3 4.8 14.1 6.9l14.3 4.4c12.4 3.8 21.3 9.1 26.7 15.9 5.4 6.8 8.1 14.8 8.1 24.1.1 9.9-3.7 18.2-11.3 24.8z" fill="#68A063"/></svg>',
      what: 'An open-source, cross-platform JavaScript runtime engine built on Google Chrome’s high-speed V8 engine.',
      why: 'Enables high-throughput, non-blocking I/O microservices and REST/GraphQL APIs capable of handling tens of thousands of concurrent users with minimal server overhead.',
      details: ['Event-driven non-blocking I/O loop', 'Unified JavaScript stack across frontend & backend', 'Vast NPM ecosystem of audited packages', 'Microservices and serverless ready']
    },
    'TypeScript': {
      name: 'TypeScript',
      category: 'Strict Typed Engineering',
      logo: '<svg viewBox="0 0 256 256"><rect width="256" height="256" fill="#3178C6" rx="36"/><path d="M150 113.6h-34v82h-22v-82H60V96h90v17.6zm80.2 36.6c0 10.8-3.7 19.6-11.1 26.4-7.4 6.8-17.5 10.2-30.3 10.2-11.2 0-20.8-2.5-28.8-7.5v-19c8 6.4 17.4 9.6 28.2 9.6 6.6 0 11.6-1.5 15-4.5 3.4-3 5.1-7.2 5.1-12.6 0-4.6-1.5-8.5-4.5-11.7-3-3.2-8.5-6.5-16.5-9.9-10.8-4.6-18.4-9.8-22.8-15.6-4.4-5.8-6.6-13.2-6.6-22.2 0-10.4 3.7-18.8 11.1-25.2 7.4-6.4 17.1-9.6 29.1-9.6 9.8 0 18.8 2.2 27 6.6v18.2c-7.6-5.2-16.2-7.8-25.8-7.8-6.2 0-11 1.4-14.4 4.2-3.4 2.8-5.1 6.8-5.1 12 0 4.4 1.4 8.1 4.2 11.1 2.8 3 8.2 6.2 16.2 9.6 11 4.6 18.8 9.9 23.4 15.9 4.6 6 6.9 13.4 6.9 22.2z" fill="#FFF"/></svg>',
      what: 'A strongly typed programming language developed by Microsoft that builds on JavaScript by adding static type syntax.',
      why: 'Prevents over 75% of runtime bugs during development, provides intelligent autocomplete, and ensures clean contracts across complex enterprise codebases.',
      details: ['Static type checking eliminates runtime exceptions', 'Self-documenting interface definitions', 'Enhanced refactoring speed and developer velocity', 'Seamless compatibility with all JavaScript packages']
    },
    'TailwindCSS': {
      name: 'TailwindCSS',
      category: 'Atomic Styling Framework',
      logo: '<svg viewBox="0 0 24 24"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" fill="#38BDF8"/></svg>',
      what: 'A modern, utility-first CSS framework designed for building bespoke, responsive user interfaces without writing repetitive custom CSS.',
      why: 'Produces ultra-compact production CSS bundles (< 10 KB) through automated dead-code purging, eliminating CSS bloat and enforcing exact design system harmony.',
      details: ['Just-In-Time (JIT) compiler for lightning builds', 'Flawless responsive breakpoints for mobile/desktop', 'Zero CSS bloat via automated purge scanning', 'Consistent design tokens for spacing & typography']
    },
    'GraphQL': {
      name: 'GraphQL',
      category: 'Data Query Specification',
      logo: '<svg viewBox="0 0 400 400"><path fill="#E10098" d="M57.468 302.007l-13.376-23.169L200 46.846l155.908 231.992-13.376 23.169L200 93.184z"/><path fill="#E10098" d="M369.284 278.838l-13.376-23.169L200 353.154 44.092 255.669l-13.376 23.169L200 399.492z"/><circle fill="#E10098" cx="200" cy="46.846" r="32"/><circle fill="#E10098" cx="355.908" cy="278.838" r="32"/><circle fill="#E10098" cx="44.092" cy="278.838" r="32"/></svg>',
      what: 'An open-source data query and manipulation language for APIs, along with a server runtime for executing queries with existing data.',
      why: 'Allows clients to request precisely the exact data required and nothing more, saving client bandwidth and aggregating multiple database requests into a single network payload.',
      details: ['Zero over-fetching and zero under-fetching', 'Single consolidated endpoint across all services', 'Strongly-typed schema contracts with introspection', 'Real-time WebSocket subscriptions support']
    },
    'Headless CMS': {
      name: 'Headless CMS',
      category: 'Decoupled Content Architecture',
      logo: '<svg viewBox="0 0 24 24"><path d="M4 4h16v4H4V4zm0 6h16v4H4v-4zm0 6h10v4H4v-4z" fill="#f0c75e"/><circle cx="18" cy="18" r="3" fill="#68A063"/></svg>',
      what: 'An API-first content management system (Sanity, Strapi, Contentful) separating editorial workflows from the frontend presentation layer.',
      why: 'Gives marketing teams the power to edit and publish content instantly while keeping the website immune to WordPress vulnerabilities and 10x faster.',
      details: ['Zero plugin bloat or database bottlenecks', 'Multi-channel omnichannel content syndication', 'Real-time live previews before publishing', 'Bank-grade security with decoupled API layers']
    },
    'Edge CDN': {
      name: 'Edge CDN',
      category: 'Global Content Delivery',
      logo: '<svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" fill="#f0c75e"/></svg>',
      what: 'A global network of edge computing servers (Cloudflare, AWS CloudFront) distributed across 300+ metropolitan hubs worldwide.',
      why: 'Caches and serves static assets and API responses within 20 milliseconds of users anywhere on Earth, eliminating server lag.',
      details: ['Sub-25ms global content delivery latency', 'Integrated Layer 3/4/7 DDoS attack mitigation', 'Automated Brotli compression & WebP conversion', 'Serverless Edge Workers for instant redirects']
    },
    'Go': {
      name: 'Go / Golang',
      category: 'Concurrent Backend Language',
      logo: '<svg viewBox="0 0 256 96"><path d="M37.4 51.5c-1.3 6.6-6 10.3-13.4 10.3-9.5 0-15.6-7.3-15.6-17.5 0-10.3 6.1-17.6 15.6-17.6 7.7 0 12.3 4.2 13.5 10.8h8.8C45 28.7 36 20 24 20 10.7 20 0 30.6 0 44.3c0 13.6 10.5 24.3 24 24.3 11.9 0 21.2-8.5 22.3-21.3h-8.9v4.2zm45.2-7.2c0-13.7-10.7-24.3-24-24.3S34.6 30.6 34.6 44.3c0 13.6 10.7 24.3 24 24.3s24-10.7 24-24.3zm-8.8 0c0 10.2-6.1 17.5-15.2 17.5s-15.2-7.3-15.2-17.5c0-10.2 6.1-17.5 15.2-17.5s15.2 7.3 15.2 17.5z" fill="#00ADD8"/></svg>',
      what: 'An open-source, compiled language designed by Google for extreme concurrency, speed, and simplicity.',
      why: 'Used for mission-critical backend systems and microservices where microsecond performance and high concurrency are required.',
      details: ['Goroutines enabling millions of lightweight threads', 'Compiled directly to bare-metal machine code', 'Minimal memory footprint under heavy server loads', 'Native gRPC and cloud microservices integration']
    },
    'Python': {
      name: 'Python',
      category: 'AI & Data Engineering',
      logo: '<svg viewBox="0 0 256 255"><path d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V28.187S194.202.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z" fill="#366D9C"/><path d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.71c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v61.472s-4.767 28.436 62.519 28.436zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z" fill="#FFD43B"/></svg>',
      what: 'A high-level, versatile programming language renowned for data science, artificial intelligence, and automated scripting.',
      why: 'Powers our backend automation, predictive analytics pipelines, data scraping engines, and machine learning models.',
      details: ['Industry standard for AI, ML, and data processing', 'Rapid API prototyping with FastAPI & Django', 'Extensive statistical and computational libraries', 'Seamless integration with cloud computing engines']
    },
    'Microservices': {
      name: 'Microservices',
      category: 'Distributed Architecture',
      logo: '<svg viewBox="0 0 24 24"><path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm-11 11h7v7H3v-7zm11 0h7v7h-7v-7z" fill="none" stroke="#f0c75e" stroke-width="2"/><circle cx="12" cy="12" r="2" fill="#68A063"/></svg>',
      what: 'An architectural pattern structuring an application as a collection of independently deployable, loosely coupled services.',
      why: 'Prevents single points of failure, allows targeted horizontal scaling of high-demand features, and accelerates team deployment cycles.',
      details: ['Isolated failure domains prevent full system outages', 'Independent scaling of specific high-traffic modules', 'Flexible technology stack choice per service', 'Continuous independent CI/CD deployments']
    },
    'PostgreSQL': {
      name: 'PostgreSQL',
      category: 'Enterprise Relational Database',
      logo: '<svg viewBox="0 0 256 264"><path d="M125.7 0C56.2 0 0 57.5 0 128.5c0 40 18.4 75.6 47.1 98.7l.7.5 21.6-26.7-.7-.5c-20.7-16.7-34-42.3-34-72 0-49.8 39.5-90.2 88.2-90.2 48.7 0 88.2 40.4 88.2 90.2 0 23.3-8.2 44.6-21.8 61.1l26.2 19.3c18.8-22.9 30.2-52.2 30.2-80.4C245.7 57.5 192.2 0 125.7 0z" fill="#336791"/></svg>',
      what: 'The world’s most advanced open-source object-relational database system known for reliability, robust feature sets, and data integrity.',
      why: 'Guarantees strict ACID compliance, complex relational queries, native JSONB indexing, and rock-solid enterprise transaction processing.',
      details: ['100% ACID compliant data transaction safety', 'Native JSONB support for hybrid document storage', 'Advanced indexing (B-Tree, GIN, GiST)', 'High-availability replication and point-in-time recovery']
    },
    'Redis': {
      name: 'Redis',
      category: 'In-Memory Cache & Key-Value',
      logo: '<svg viewBox="0 0 256 220"><path d="M256 160.6l-128 59.4-128-59.4L0 60.4 128 1l128 59.4v100.2z" fill="#D82C20"/><path d="M128 36.4L33.7 80.2l94.3 43.8 94.3-43.8L128 36.4z" fill="#FFF"/></svg>',
      what: 'An ultra-fast, in-memory data store used as a database, cache, streaming engine, and message broker.',
      why: 'Reduces database load by up to 90% and provides sub-millisecond query responses for user sessions, shopping carts, and live counters.',
      details: ['Sub-millisecond data retrieval speeds in RAM', 'Pub/Sub messaging for real-time notifications', 'Session state management across clustered servers', 'Automated cache expiration and eviction policies']
    },
    'Kafka': {
      name: 'Kafka',
      category: 'Distributed Event Streaming',
      logo: '<svg viewBox="0 0 256 360"><circle cx="128" cy="180" r="40" fill="#231F20"/><circle cx="50" cy="80" r="30" fill="#f0c75e"/><circle cx="206" cy="80" r="30" fill="#f0c75e"/><circle cx="50" cy="280" r="30" fill="#f0c75e"/><circle cx="206" cy="280" r="30" fill="#f0c75e"/></svg>',
      what: 'A distributed event store and stream-processing platform for high-performance data pipelines and streaming analytics.',
      why: 'Handles millions of events per second with fault tolerance, powering real-time financial tracking, event queues, and microservice messaging.',
      details: ['Processes millions of events per second', 'Persistent, ordered, and immutable message logs', 'Fault-tolerant distributed cluster architecture', 'Decouples producer and consumer services']
    },
    'Docker & K8s': {
      name: 'Docker & Kubernetes',
      category: 'Containerization & Orchestration',
      logo: '<svg viewBox="0 0 24 24"><path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186" fill="#2496ED"/></svg>',
      what: 'Enterprise containerization packaging applications with their dependencies, managed by Kubernetes automated cluster orchestration.',
      why: 'Eliminates "works on my machine" issues and provides auto-healing, auto-scaling cloud deployments with zero downtime updates.',
      details: ['Automated horizontal container scaling', 'Zero-downtime rolling canary deployments', 'Self-healing cluster restarts for crashed pods', 'Consistent environments from dev to production']
    },
    'Flutter': {
      name: 'Flutter',
      category: 'Cross-Platform Mobile UI',
      logo: '<svg viewBox="0 0 256 317"><path d="M157.6 0L0 157.6l48.8 48.8L255.2 0H157.6z" fill="#47C5FB"/><path d="M157.6 157.6L77.9 237.3l48.8 48.8 30.9-30.9 97.6-97.6H157.6z" fill="#47C5FB"/><path d="M126.7 286.1l30.9 30.9h97.6l-79.7-79.7-48.8 48.8z" fill="#00569E"/></svg>',
      what: 'Google’s open-source UI software development kit for crafting natively compiled mobile, web, and desktop apps from a single codebase.',
      why: 'Delivers buttery 60/120fps native performance across iOS and Android while slashing development and maintenance costs in half.',
      details: ['Single unified Dart codebase for iOS & Android', 'Impeller hardware-accelerated 120 FPS rendering', 'Rich widget catalog matching native iOS/Material design', 'Stateful Hot Reload for rapid UI iterations']
    },
    'React Native': {
      name: 'React Native',
      category: 'Native Mobile Framework',
      logo: '<svg viewBox="-11.5 -10.23174 23 20.46348"><circle cx="0" cy="0" r="2.05" fill="#61dafb"/><g stroke="#61dafb" stroke-width="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>',
      what: 'Meta’s framework for writing native iOS and Android mobile applications using React and JavaScript.',
      why: 'Enables rapid mobile shipping with true native UI components, native device API access, and cross-platform code sharing with web apps.',
      details: ['Direct access to native device sensors and hardware', 'Share up to 80% code between web and mobile platforms', 'Over-the-air (OTA) updates bypassing app store delays', 'Backed by Meta, Shopify, and Microsoft']
    },
    'Swift / iOS': {
      name: 'Swift / iOS',
      category: 'Apple Native Platform',
      logo: '<svg viewBox="0 0 256 256"><rect width="256" height="256" rx="48" fill="#F05138"/><path d="M196.2 195.3c-23.7 23.3-64.8 28.5-98.8 11.2C65.5 190.2 45 162.7 39.8 140c-.7-3.1 3-5.3 5-3 23.3 27 57.7 38.3 88.5 28.3 3.5-1.1 5.8-5 4-8.3-9-16.7-27.5-35.3-51.2-46.7-4.2-2-1.3-8.3 3.3-7.7 25.3 3.5 53.7 18 69.8 37.3 1.8 2.2 5.3 1.5 6.2-1.3 6.3-20.3 5.3-48.2-12.8-70.8-2.3-2.8 1-6.7 4.2-5 34.3 18.7 54.7 56.5 45.7 94.7-1 4.2 2.3 8.3 6.5 7.7 15.3-2 30-10.7 40.7-22.3 3.2-3.5 8.7.3 7 4.5-9.8 24.3-30.8 45.3-50.7 48.7z" fill="#FFF"/></svg>',
      what: 'Apple’s native programming language and development toolchain for building high-performance apps across iPhone, iPad, Apple Watch, and Mac.',
      why: 'Provides maximum access to Apple hardware, iOS 18+ spatial design patterns, Secure Enclave, Apple Pay, and native widget ecosystems.',
      details: ['SwiftUI declarative reactive interface architecture', 'Direct Metal GPU acceleration for games & heavy visuals', 'Hardware-backed biometric authentication (FaceID)', 'Seamless Apple Watch, iPad, and CarPlay extensions']
    },
    'Kotlin / Android': {
      name: 'Kotlin / Android',
      category: 'Google Android Platform',
      logo: '<svg viewBox="0 0 256 256"><path d="M256 256H0V0h256L128 128z" fill="#7F52FF"/><path d="M128 128L0 256V0z" fill="#E2445C"/></svg>',
      what: 'Google’s preferred, modern programming language for native Android operating system development.',
      why: 'Guarantees concise, null-safe native Android performance with Jetpack Compose UI, deep background service support, and Play Store optimization.',
      details: ['Jetpack Compose modern declarative Android UI', 'Built-in null safety preventing app crash null-pointers', 'Optimized for 10,000+ diverse Android device models', 'Deep integration with Google Play In-App Billing']
    },
    'REST & GraphQL': {
      name: 'REST & GraphQL',
      category: 'Hybrid API Architecture',
      logo: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z" fill="#f0c75e"/></svg>',
      what: 'Dual-protocol API design providing standard REST endpoints for simple integrations and GraphQL for complex nested client queries.',
      why: 'Gives client apps flexibility to fetch bulk data with zero round trips while maintaining backward compatibility with third-party software.',
      details: ['Universal compatibility across mobile and web clients', 'High cacheability on Edge CDN servers', 'Strict OpenAPI and GraphQL schema specifications', 'Token-based rate limiting and DDoS protection']
    },
    'SQLite': {
      name: 'SQLite',
      category: 'Embedded Local Database',
      logo: '<svg viewBox="0 0 256 256"><rect width="256" height="256" rx="40" fill="#003B57"/><path d="M128 60c-40 0-70 12-70 28v80c0 16 30 28 70 28s70-12 70-28V88c0-16-30-28-70-28zm0 18c35 0 54 9 54 10s-19 10-54 10-54-9-54-10 19-10 54-10z" fill="#00A9E0"/></svg>',
      what: 'A lightweight, zero-configuration SQL database engine embedded directly into mobile devices and client applications.',
      why: 'Enables 100% offline-first application capabilities, allowing mobile users to view and edit data without an active internet connection.',
      details: ['Zero latency local database reads directly in app', 'Offline data persistence with background cloud sync', 'Full SQL query syntax on mobile devices', 'Encrypted database storage via SQLCipher']
    },
    'Firebase': {
      name: 'Firebase',
      category: 'Google Cloud Mobile Backend',
      logo: '<svg viewBox="0 0 256 353"><path d="M0 283.4L37.8 45.9c.7-4.4 6-6.2 9.2-3.1l41.6 40.7L0 283.4z" fill="#FFA000"/><path d="M136.6 142.4L96.8 66c-1.9-3.7-7.2-3.7-9.1 0L0 283.4l136.6-141z" fill="#F57C00"/><path d="M0 283.4l123.7 69.1c2.7 1.5 5.9 1.5 8.6 0L256 283.4 136.6 142.4 0 283.4z" fill="#FFCA28"/></svg>',
      what: 'Google’s comprehensive platform for mobile application infrastructure, live synchronization, authentication, and analytics.',
      why: 'Provides real-time database sync, push notification dispatching, remote crash reporting, and user analytics with zero server maintenance.',
      details: ['Cloud Firestore real-time client data synchronization', 'Firebase Cloud Messaging (FCM) push notifications', 'Crashlytics real-time exception tracking', 'Secure Google, Apple, and phone authentication']
    },
    'App Store CI/CD': {
      name: 'App Store CI/CD',
      category: 'Automated Mobile DevOps',
      logo: '<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 3.5l-5-2.5V17l5 2.5 5-2.5v-5l-5 2.5z" fill="#f0c75e"/></svg>',
      what: 'Automated continuous integration and deployment pipelines (Fastlane, GitHub Actions) for Apple App Store and Google Play.',
      why: 'Eliminates manual build errors, runs automated test suites on real virtual devices, and automates screenshot and binary releases.',
      details: ['One-click or automated git-tag app store releases', 'Automated code signing and certificate management', 'Beta distribution via TestFlight and Play Console', 'Pre-release unit, widget, and integration testing']
    },
    'Shopify Plus': {
      name: 'Shopify Plus',
      category: 'Enterprise E-Commerce Engine',
      logo: '<svg viewBox="0 0 256 292"><path d="M217.7 44.8c-.5-.4-1.3-.4-1.8 0L193.3 63c-3-8.8-10.6-14.8-20.5-14.8-1.5 0-3 .2-4.5.5C163.5 19.8 141.2 0 114.5 0 94.6 0 76.5 11.7 68.3 29.8 54.1 33.5 45.4 46.5 45 61.3L15.3 84.7c-1.1.9-1.3 2.5-.5 3.7l64.3 200.5c.6 1.8 2.3 3.1 4.2 3.1h139.4c1.9 0 3.6-1.3 4.2-3.1l64.3-200.5c.8-1.2.6-2.8-.5-3.7L217.7 44.8z" fill="#95BF47"/></svg>',
      what: 'The leading enterprise commerce platform powering world-class retail brands with 99.99% uptime and unlimited checkout bandwidth.',
      why: 'Handles massive flash-sale volume (over 10,000 orders/minute) with PCI-DSS Level 1 security and automated international currency conversion.',
      details: ['Handles 10,000+ orders per minute during flash sales', 'Shopify Scripts and custom checkout customization', 'Multi-currency and multi-language global storefronts', 'Wholesale B2B and direct-to-consumer in one store']
    },
    'WooCommerce': {
      name: 'WooCommerce',
      category: 'Customizable Open E-Commerce',
      logo: '<svg viewBox="0 0 256 153"><path d="M228.6 0H27.4C12.3 0 0 12.3 0 27.4v98.2c0 15.1 12.3 27.4 27.4 27.4h201.2c15.1 0 27.4-12.3 27.4-27.4V27.4C256 12.3 243.7 0 228.6 0z" fill="#96588A"/><path d="M47.7 43.8c4.6 18.5 12.4 39.8 19.3 57.6h.4c7-17.8 14.7-39.1 19.3-57.6h17.8L77.6 109H60L30.9 43.8h16.8zm75.4 34.6c0-19.7 13.9-35.8 33.8-35.8 19.9 0 33.8 16.1 33.8 35.8 0 19.7-13.9 35.8-33.8 35.8-19.9 0-33.8-16.1-33.8-35.8zm50.8 0c0-11.8-7.5-20.9-17-20.9s-17 9.1-17 20.9c0 11.8 7.5 20.9 17 20.9s17-9.1 17-20.9z" fill="#FFF"/></svg>',
      what: 'An open-source, fully customizable eCommerce platform that gives businesses 100% ownership of their store data and hosting.',
      why: 'Perfect for custom product configurations, bespoke checkout flows, zero monthly transaction fee models, and unlimited customizations.',
      details: ['Zero percentage-based transaction fees', '100% data ownership and self-hosted control', 'Unlimited custom product variations and attributes', 'Extensive payment gateway and shipping integrations']
    },
    'Headless Commerce': {
      name: 'Headless Commerce',
      category: 'Decoupled Shopping Engine',
      logo: '<svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="#f0c75e"/></svg>',
      what: 'An architectural approach separating the customer-facing frontend storefront from the backend commerce management system.',
      why: 'Enables sub-second page transitions, rich 3D product customizers, and freedom to change backend systems without rebuilding the frontend.',
      details: ['Instant sub-second catalog navigation and filters', 'Custom checkout workflows and one-click buying', 'Multi-brand storefronts sharing one backend inventory', 'Maximum conversion rates via bespoke UX design']
    },
    'Stripe API': {
      name: 'Stripe API',
      category: 'Global Payment Infrastructure',
      logo: '<svg viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#635BFF"/><path d="M19.6 15.6c0-1.8 1.5-2.5 3.9-2.5 3.5 0 7.9 1.1 11.4 3V8.8c-3.8-1.5-7.6-2.2-11.4-2.2-9.4 0-15.6 4.9-15.6 13.1 0 12.8 17.5 10.7 17.5 16.3 0 2.2-1.9 2.9-4.6 2.9-4 0-9.2-1.7-13.3-3.9v7.4c4.6 2 9.2 2.9 13.3 2.9 9.7 0 16.5-4.8 16.5-13.3-.1-13.6-17.7-11.2-17.7-16.4z" fill="#FFF"/></svg>',
      what: 'The gold-standard financial infrastructure platform powering online payments, subscriptions, and payouts in 135+ currencies.',
      why: 'Provides frictionless one-click Apple Pay, Google Pay, credit cards, automated fraud detection via Stripe Radar, and recurring billing.',
      details: ['Accepts Apple Pay, Google Pay, cards, & local methods', 'Radar AI real-time fraud and chargeback protection', 'Automated recurring billing, subscriptions, & invoicing', 'PCI-DSS Service Provider Level 1 compliance']
    },
    'Razorpay': {
      name: 'Razorpay',
      category: 'Smart Payment Gateway',
      logo: '<svg viewBox="0 0 256 256"><rect width="256" height="256" rx="40" fill="#0C2340"/><path d="M140 36L70 170h54l-20 50 86-134h-50z" fill="#02A6FD"/></svg>',
      what: 'India’s leading omnichannel payment gateway supporting UPI, Netbanking, Cards, Wallets, and EMI options.',
      why: 'Delivers the highest payment success rates in the Asian market with instant UPI QR codes, intent flows, and instant bank settlements.',
      details: ['Instant UPI AutoPay and QR code checkouts', '100+ payment modes across all Indian banks', 'Smart dynamic routing for maximum payment success rates', 'Instant customer refund APIs and webhook automation']
    },
    'Next.js Commerce': {
      name: 'Next.js Commerce',
      category: 'High-Speed Storefront Architecture',
      logo: '<svg viewBox="0 0 180 180"><circle cx="90" cy="90" fill="#000" r="90" stroke="#f0c75e" stroke-width="5"/><path d="M149.508 157.438L69.1478 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.137 149.508 157.438Z" fill="#fff"/></svg>',
      what: 'An enterprise-grade headless e-commerce starter kit developed by Vercel for building blazing fast online storefronts.',
      why: 'Provides instant search, dynamic filter facets, and edge-rendered product detail pages that load instantaneously.',
      details: ['Edge-cached product catalog pages', 'Instant optimistic cart updates', 'Algolia and MeiliSearch out of the box', 'Seamless Shopify and BigCommerce backends']
    },
    'Algolia Search': {
      name: 'Algolia Search',
      category: 'Real-Time Neural Search Engine',
      logo: '<svg viewBox="0 0 256 256"><rect width="256" height="256" rx="40" fill="#5468FF"/><path d="M128 48a80 80 0 1056.6 136.6l31.4 31.4a8 8 0 0011.4-11.4l-31.4-31.4A80 80 0 00128 48zm0 16a64 64 0 110 128 64 64 0 010-128z" fill="#FFF"/></svg>',
      what: 'A lightning-fast, AI-powered search-as-a-service engine that delivers real-time search results within milliseconds.',
      why: 'Boosts e-commerce conversion rates by showing instant, typo-tolerant search results and dynamic filters as users type every letter.',
      details: ['Sub-15ms search response times across millions of SKUs', 'Typo tolerance and semantic AI query understanding', 'Dynamic merchandising rules and sponsored pinning', 'Personalized recommendations based on browsing history']
    },
    'Klaviyo': {
      name: 'Klaviyo',
      category: 'E-Commerce Marketing Automation',
      logo: '<svg viewBox="0 0 256 256"><rect width="256" height="256" rx="40" fill="#252525"/><path d="M60 60h136v40H60V60zm0 68h90v40H60v-40z" fill="#f0c75e"/></svg>',
      what: 'An intelligent customer data platform and marketing automation system built specifically for e-commerce brands.',
      why: 'Recovers abandoned shopping carts, sends automated post-purchase upsells, and segments customers to drive 30%+ more revenue.',
      details: ['Automated abandoned checkout recovery sequences', 'Deep predictive purchase value segmentation', 'Omnichannel SMS and email behavioral triggers', 'Direct revenue attribution tracking per campaign']
    },
    'Unity 3D': {
      name: 'Unity 3D',
      category: 'Real-Time 3D Game Engine',
      logo: '<svg viewBox="0 0 256 256"><path d="M128 12.3L23.4 72.7v120.9L128 254l104.6-60.4V72.7L128 12.3zm0 33.3l69.7 40.2-26.8 15.5-42.9-24.8-42.9 24.8-26.8-15.5 69.7-40.2zm-75.5 63.8l26.8 15.5v49.5l-26.8-15.5V109.4zm85.5 97.4l-32.9-19v-31l32.9 19 32.9-19v31l-32.9 19zm65.5-47.9l-26.8 15.5v-49.5l26.8-15.5v49.5z" fill="#FFF"/></svg>',
      what: 'The world’s most versatile real-time 3D development platform used by millions of developers for games and simulations.',
      why: 'Deploys games and interactive 3D simulations across 20+ platforms (Mobile, PC, Console, WebGL, AR/VR) with a single codebase.',
      details: ['Universal Render Pipeline (URP) for mobile & desktop', 'PhysX physics engine for realistic rigid-body simulation', 'Robust C# scripting architecture and visual scripting', 'Massive asset store ecosystem accelerating timelines']
    },
    'Unreal Engine 5': {
      name: 'Unreal Engine 5',
      category: 'Photorealistic Cinematic Engine',
      logo: '<svg viewBox="0 0 256 256"><circle cx="128" cy="128" r="120" fill="#0E1128" stroke="#f0c75e" stroke-width="6"/><path d="M128 50c-43 0-78 35-78 78s35 78 78 78c33 0 61-20 72-49l-26-8c-8 20-27 34-46 34-30 0-54-24-54-55s24-55 54-55c19 0 36 10 45 25l-22 13 65 14 10-63-22 13c-14-23-38-38-76-38z" fill="#FFF"/></svg>',
      what: 'Epic Games’ state-of-the-art 3D creation tool delivering photorealistic visuals and immersive interactive experiences.',
      why: 'Powers AAA console-grade games and high-end interactive virtual worlds with revolutionary Nanite virtualized geometry and Lumen lighting.',
      details: ['Lumen dynamic global illumination with real-time bounces', 'Nanite virtualized micropolygon geometry', 'Chaos physics and destruction simulation', 'C++ and Blueprint visual scripting architecture']
    },
    'C# / C++': {
      name: 'C# / C++',
      category: 'High-Performance Systems Languages',
      logo: '<svg viewBox="0 0 256 256"><rect width="256" height="256" rx="40" fill="#178600"/><path d="M150 90c-10-10-25-15-40-15-30 0-50 20-50 53s20 53 50 53c15 0 30-5 40-15l15 15c-15 15-35 22-55 22-42 0-72-28-72-75s30-75 72-75c20 0 40 7 55 22l-15 15zm40 25h12v12h12v12h-12v12h-12v-12h-12v-12h12v-12zm-30 0h12v12h12v12h-12v12h-12v-12h-12v-12h12v-12z" fill="#FFF"/></svg>',
      what: 'The foundational high-performance programming languages for real-time game development, graphics rendering, and physics computation.',
      why: 'Provides direct hardware memory control, minimal garbage collection pauses, and execution speeds essential for 60/120fps games.',
      details: ['Zero-overhead hardware abstractions and pointers', 'Deterministic memory management for smooth framerates', 'High-performance cache-friendly data structures', 'Direct GPU pipeline shader and graphics API access']
    },
    'WebGL / Three.js': {
      name: 'WebGL / Three.js',
      category: 'In-Browser 3D Graphics',
      logo: '<svg viewBox="0 0 256 256"><rect width="256" height="256" rx="40" fill="#040404"/><path d="M60 190L128 60l68 130H60z" fill="none" stroke="#f0c75e" stroke-width="12"/><circle cx="128" cy="140" r="18" fill="#61dafb"/></svg>',
      what: 'JavaScript 3D library and low-level browser API that renders GPU-accelerated 3D graphics inside any modern web browser without plugins.',
      why: 'Allows visitors to interact with 3D product models, architectural walkthroughs, and browser games directly on mobile and desktop web pages.',
      details: ['Zero plugin requirement running on mobile and desktop', 'Custom GLSL vertex and fragment shader materials', 'GLTF/USDZ 3D model loaders with PBR textures', 'Smooth 60 FPS animation via requestAnimationFrame']
    },
    'Godot': {
      name: 'Godot',
      category: 'Lightweight Open Game Engine',
      logo: '<svg viewBox="0 0 256 256"><rect width="256" height="256" rx="40" fill="#478CBF"/><circle cx="90" cy="140" r="20" fill="#FFF"/><circle cx="166" cy="140" r="20" fill="#FFF"/><circle cx="90" cy="140" r="10" fill="#000"/><circle cx="166" cy="140" r="10" fill="#000"/><path d="M100 180h56v10h-56z" fill="#FFF"/></svg>',
      what: 'A lightweight, feature-packed open-source 2D and 3D game engine designed with dedicated node-based scene architecture.',
      why: 'Ideal for 2D platformers, lightweight casual mobile games, and rapid game mechanics prototyping with small executable sizes.',
      details: ['Pure dedicated 2D physics and rendering engine', 'Lightweight engine executable under 50 MB', 'Node and Scene tree hierarchical architecture', 'Zero royalty fees and 100% open-source freedom']
    },
    'Multiplayer Netcode': {
      name: 'Multiplayer Netcode',
      category: 'Real-Time Game Synchronization',
      logo: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#f0c75e"/></svg>',
      what: 'Client-server networking architecture with state synchronization, client-side prediction, and lag compensation.',
      why: 'Ensures snappy, competitive online multiplayer gameplay where players across different continents experience synchronized action without rubber-banding.',
      details: ['Client-side prediction and server reconciliation', 'Lag compensation and rollback netcode algorithms', 'Binary UDP packet serialization for low bandwidth', 'Lobby matchmaking and dedicated authoritative servers']
    },
    'ShaderLab / HLSL': {
      name: 'ShaderLab / HLSL',
      category: 'GPU Graphic Shader Programming',
      logo: '<svg viewBox="0 0 24 24"><path d="M12 3L2 12l10 9 10-9-10-9zm0 3.5L18.5 12 12 17.5 5.5 12 12 6.5z" fill="#f0c75e"/></svg>',
      what: 'High-Level Shader Languages executed directly on graphics processing units (GPUs) to compute custom lighting, materials, and visual FX.',
      why: 'Creates custom stylized art, water reflections, hologram effects, energy shields, and cinematic visual atmospheres.',
      details: ['Real-time compute shaders for millions of particles', 'Custom procedural materials and dynamic noise textures', 'Screen-space post-processing visual filters', 'Direct GPU hardware optimization for mobile thermal limits']
    },
    'Blender': {
      name: 'Blender',
      category: '3D Creation & Animation Suite',
      logo: '<svg viewBox="0 0 256 208"><circle cx="128" cy="128" r="32" fill="#E87D0D"/><path d="M128 32C75 32 32 75 32 128s43 96 96 96 96-43 96-96c0-21-7-41-19-57l35-35c4-4 4-10 0-14s-10-4-14 0l-37 37c-17-17-38-27-61-27z" fill="#E87D0D"/><circle cx="128" cy="128" r="16" fill="#FFF"/></svg>',
      what: 'The world-leading open-source 3D computer graphics software toolset used for modeling, rigging, animation, rendering, and compositing.',
      why: 'Enables our 3D artists to create hyper-detailed polygonal meshes, UV unwraps, skeletal character rigs, and photorealistic asset renders.',
      details: ['Advanced polygonal and subdivision surface modeling', 'Full character armature skeletal rigging and skinning', 'Cycles photorealistic ray-tracing render engine', 'Non-Linear Animation (NLA) editors for game assets']
    },
    'WebXR': {
      name: 'WebXR',
      category: 'Immersive Web Standard',
      logo: '<svg viewBox="0 0 24 24"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-11 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm8 0c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill="#f0c75e"/></svg>',
      what: 'A web standard API providing direct access to Virtual Reality (VR) and Augmented Reality (AR) headsets in web browsers.',
      why: 'Allows users on Apple Vision Pro, Meta Quest, and smartphones to experience interactive 3D and AR environments instantly without app downloads.',
      details: ['Zero app installation required directly in mobile browsers', 'Compatible with Meta Quest, Apple Vision Pro, & Android', '6 Degrees of Freedom (6-DoF) head and controller tracking', 'Spatial environment plane detection and anchoring']
    },
    'Unity XR': {
      name: 'Unity XR',
      category: 'Multi-Headset Spatial Engine',
      logo: '<svg viewBox="0 0 256 256"><path d="M128 12.3L23.4 72.7v120.9L128 254l104.6-60.4V72.7L128 12.3zm0 33.3l69.7 40.2-26.8 15.5-42.9-24.8-42.9 24.8-26.8-15.5 69.7-40.2z" fill="#FFF"/></svg>',
      what: 'Unity’s integrated extended reality framework providing cross-platform VR/AR headset deployment.',
      why: 'Allows building complex virtual training simulators, industrial digital twins, and VR games deployed across Quest, HTC Vive, and Pico.',
      details: ['XR Interaction Toolkit for grabbing, teleporting, & UI', 'Single project deployment to Quest, Vive, & VisionOS', 'Optimized foveated rendering for maximum sharpness', 'Multi-user shared spatial coordinate tracking']
    },
    'OpenXR': {
      name: 'OpenXR',
      category: 'Open Cross-Platform XR Standard',
      logo: '<svg viewBox="0 0 256 128"><path d="M128 0L24 64l104 64 104-64L128 0zm0 30l55 34-55 34-55-34 55-34z" fill="#00AEEF"/></svg>',
      what: 'A royalty-free, open standard from the Khronos Group providing high-performance access to XR hardware platforms.',
      why: 'Future-proofs spatial applications by eliminating proprietary vendor lock-in across headsets and AR glasses.',
      details: ['Universal industry standard supported by all major brands', 'Low latency direct hardware driver communication', 'Cross-platform hand tracking and spatial anchor extensions', 'Guaranteed future hardware backwards compatibility']
    },
    'VisionOS': {
      name: 'VisionOS',
      category: 'Apple Spatial Computing Platform',
      logo: '<svg viewBox="0 0 256 256"><rect width="256" height="256" rx="50" fill="#000"/><circle cx="128" cy="128" r="70" fill="none" stroke="#f0c75e" stroke-width="8"/><circle cx="128" cy="128" r="30" fill="#FFF"/></svg>',
      what: 'Apple’s spatial operating system engineered for Apple Vision Pro with revolutionary eye tracking and hand gestures.',
      why: 'Builds ultra-luxury spatial commerce, digital showroom environments, and productive spatial apps with photorealistic passthrough.',
      details: ['Intuitive look-and-pinch gesture interaction', 'RealityKit photorealistic PBR rendering and shadows', 'Shared spatial audio positioning relative to room geometry', 'Seamless integration with iOS and iPadOS ecosystems']
    },
    'ARKit & ARCore': {
      name: 'ARKit & ARCore',
      category: 'Mobile Augmented Reality',
      logo: '<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="#f0c75e" stroke-width="2"/></svg>',
      what: 'Native mobile Augmented Reality software kits by Apple (ARKit) and Google (ARCore) using smartphone cameras and LiDAR.',
      why: 'Allows over 2 billion mobile users to preview furniture in their living room, try on glasses, or view digital interactive guides.',
      details: ['LiDAR and camera-based horizontal/vertical plane detection', 'Environmental real-time lighting estimation & shadows', 'True-to-scale millimeter real world dimensions', 'Face tracking and gesture recognition']
    },
    'Spatial Audio': {
      name: 'Spatial Audio',
      category: '3D Binaural Sound Architecture',
      logo: '<svg viewBox="0 0 24 24"><path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" fill="#f0c75e"/><path d="M19 12c0 2.21-.9 4.21-2.34 5.66l1.41 1.41C19.9 17.25 21 14.76 21 12s-1.1-5.25-2.93-7.07l-1.41 1.41C18.1 7.79 19 9.79 19 12z" fill="#68A063"/></svg>',
      what: 'HRTF (Head-Related Transfer Function) acoustic processing that positions sounds realistically in three-dimensional physical space.',
      why: 'Dramatically enhances immersion by making users perceive audio coming from specific physical locations in their room.',
      details: ['Binaural spatial localization tailored to human hearing', 'Dynamic Doppler shift and distance attenuation physics', 'Real-time room acoustic reverb based on room materials', 'Head-tracked rotation matching user orientation']
    },
    'Hand Tracking': {
      name: 'Hand Tracking',
      category: 'Computer Vision Interaction',
      logo: '<svg viewBox="0 0 24 24"><path d="M21 9c0-.55-.45-1-1-1s-1 .45-1 1v4.5l-2.48-1.7c-.38-.26-.88-.29-1.28-.08-.5.26-.74.83-.56 1.36L16.2 17H11c-.55 0-1 .45-1 1s.45 1 1 1h6.5c.83 0 1.58-.42 2-1.1l3.05-5.2c.28-.48.45-1.04.45-1.7V9zm-8-5c0-.55-.45-1-1-1s-1 .45-1 1v6h2V4zm-4 2c0-.55-.45-1-1-1s-1 .45-1 1v4h2V6z" fill="#f0c75e"/></svg>',
      what: 'Computer vision algorithms using headset cameras to detect and track 26 individual skeletal joints on each human hand in real time.',
      why: 'Enables controller-free, natural interactions where users pinch, grab, push buttons, and manipulate digital objects naturally.',
      details: ['Sub-millimeter finger joint skeletal tracking', 'Natural pinch and grasp gesture recognition', 'Zero hardware controller requirements', 'Haptic audio-visual confirmation feedback']
    },
    'Figma': {
      name: 'Figma',
      category: 'Collaborative Product Design',
      logo: '<svg viewBox="0 0 200 300"><path d="M50 300c27.6 0 50-22.4 50-50v-50H50c-27.6 0-50 22.4-50 50s22.4 50 50 50z" fill="#0ACF83"/><path d="M0 150c0-27.6 22.4-50 50-50h50v100H50c-27.6 0-50-22.4-50-50z" fill="#A259FF"/><path d="M0 50C0 22.4 22.4 0 50 0h50v100H50C22.4 100 0 77.6 0 50z" fill="#F24E1E"/><path d="M100 0h50c27.6 0 50 22.4 50 50s-22.4 50-50 50h-50V0z" fill="#FF7262"/><path d="M200 150c0 27.6-22.4 50-50 50s-50-22.4-50-50 22.4-50 50-50 50 22.4 50 50z" fill="#1ABCFE"/></svg>',
      what: 'The industry-standard cloud-native interface design, prototyping, and design system collaboration platform.',
      why: 'Enables our designers, engineers, and clients to co-design in real time, review prototypes, and inspect design tokens for development.',
      details: ['Real-time multiplayer design collaboration', 'Auto-Layout 5.0 mirroring CSS flexbox architecture', 'Interactive component variant state matrices', 'Direct design-to-code token synchronization']
    },
    'Design Systems': {
      name: 'Design Systems',
      category: 'Scalable UI Standardization',
      logo: '<svg viewBox="0 0 24 24"><path d="M4 6h16V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z" fill="#f0c75e"/></svg>',
      what: 'A centralized repository of reusable UI components, design guidelines, color palettes, and typographic hierarchies.',
      why: 'Guarantees 100% visual and functional consistency across web and mobile apps while speeding up feature releases by 3x.',
      details: ['Single source of truth for all brand assets and UI', 'Eliminates design discrepancies across product teams', 'Accelerates developer onboarding and component reuse', 'Built with accessibility (WCAG 2.1 AA) baked in']
    },
    'Interactive Prototypes': {
      name: 'Interactive Prototypes',
      category: 'Simulated User Flows',
      logo: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="#f0c75e"/></svg>',
      what: 'High-fidelity, clickable simulations of mobile and web applications with real micro-animations, transitions, and user inputs.',
      why: 'Tests usability and user journeys before writing a single line of backend code, saving thousands of dollars in redevelopment.',
      details: ['Realistic touch gestures and micro-interactions', 'Accurate simulation of conditional logic and forms', 'Pre-development stakeholder sign-off and alignment', 'User testing validation with recorded task funnels']
    },
    'Wireframing': {
      name: 'Wireframing',
      category: 'Information Architecture',
      logo: '<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-4h6v4zm0-6H6V7h6v4zm6 6h-4v-4h4v4zm0-6h-4V7h4v4z" fill="#f0c75e"/></svg>',
      what: 'Low-fidelity structural blueprints mapping screen layout, content prioritization, navigation hierarchies, and conversion zones.',
      why: 'Focuses on user journey logic and cognitive load without visual distractions, establishing solid UX foundations early.',
      details: ['Low-fidelity structural blueprints of key user paths', 'Eliminates cognitive friction before styling phases', 'Optimized visual hierarchy and button placement', 'Rapid feedback loops with minimal turnaround time']
    },
    'User Research': {
      name: 'User Research',
      category: 'Data-Driven UX Discovery',
      logo: '<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#f0c75e"/></svg>',
      what: 'Systematic study of target users through behavioral analytics, customer interviews, survey data, and heatmaps.',
      why: 'Bases design decisions on verified user data rather than guesswork, directly improving customer retention and purchase intent.',
      details: ['In-depth customer discovery interviews and personas', 'Heatmap and click-tracking behavioral audits', 'Competitor benchmarking and opportunity gap analysis', 'Empathy maps identifying core customer pain points']
    },
    'Motion Design': {
      name: 'Motion Design',
      category: 'Kinetic UI & Micro-Interactions',
      logo: '<svg viewBox="0 0 24 24"><path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.04-4.09l-2.54-1.49C16.14 17.82 14.2 19 12 19z" fill="#f0c75e"/></svg>',
      what: 'Fluid micro-animations, transitions, and gesture responses that give digital interfaces a living, responsive feel.',
      why: 'Guides user attention to primary calls to action, confirms input actions, and creates a high-end luxury feel.',
      details: ['Physics-based spring curve transitions and damping', 'Visual feedback confirming successful user actions', 'Engaging scroll-linked spatial transformations', 'Lottie / Rive vector animations under 20 KB']
    },
    'Design Tokens': {
      name: 'Design Tokens',
      category: 'Cross-Platform Style Constants',
      logo: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#f0c75e"/></svg>',
      what: 'Platform-agnostic key-value pairs (colors, spacing, typography, shadows) exported from Figma directly to code.',
      why: 'Enables changing a brand color or spacing value once in design and having it instantly propagate across web, iOS, and Android.',
      details: ['Automated JSON synchronization from Figma to GitHub', 'Zero manual CSS/Swift style synchronization errors', 'Enforces strict global brand consistency', 'Supports dynamic dark mode and high-contrast themes']
    },
    'Usability Testing': {
      name: 'Usability Testing',
      category: 'Empirical UX Validation',
      logo: '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#0ACF83"/></svg>',
      what: 'Observing real representative users as they attempt to accomplish specific tasks on interactive prototypes.',
      why: 'Identifies navigational roadblocks, checkout drop-off triggers, and confusing wording before commercial deployment.',
      details: ['Quantitative task completion rate measurements', 'Time-on-task and cognitive friction benchmarks', 'Recorded screen sessions and audio think-aloud commentary', 'Iterative usability score improvement cycles']
    },
    'Cinema 4D': {
      name: 'Cinema 4D',
      category: 'Motion Graphics 3D Engine',
      logo: '<svg viewBox="0 0 256 256"><circle cx="128" cy="128" r="120" fill="#001B44"/><path d="M128 50a78 78 0 100 156 78 78 0 000-156zm0 126a48 48 0 110-96 48 48 0 010 96z" fill="#f0c75e"/></svg>',
      what: 'Maxon’s professional 3D package famous for procedural MoGraph tools, dynamic simulations, and broadcast motion graphics.',
      why: 'Powers our complex procedural animations, floating tech product visuals, dynamic typography, and commercial splash sequences.',
      details: ['MoGraph toolset for procedural cloning and effectors', 'Redshift GPU photorealistic rendering engine integration', 'Soft body, cloth, and fluid dynamics simulations', 'Seamless workflow exchange with After Effects']
    },
    'ZBrush': {
      name: 'ZBrush',
      category: 'Digital Sculpting Standard',
      logo: '<svg viewBox="0 0 256 256"><rect width="256" height="256" rx="40" fill="#2B2B2B"/><path d="M60 70h136l-80 116h80" fill="none" stroke="#f0c75e" stroke-width="20" stroke-linecap="round"/></svg>',
      what: 'The industry-standard digital sculpting tool that combines 3D/2.5D modeling, texturing, and painting with millions of polygons.',
      why: 'Used to sculpt organic characters, intricate product ergonomics, and hyper-detailed skin/surface textures that traditional CAD cannot create.',
      details: ['Sculpts up to 100 million polygons per subtool', 'DynaMesh real-time topology reconstruction', 'ZRemesher automated quad topology optimization', 'High-poly to low-poly normal map baking']
    },
    'Substance Painter': {
      name: 'Substance Painter',
      category: 'PBR 3D Texture Painting',
      logo: '<svg viewBox="0 0 256 256"><rect width="256" height="256" rx="40" fill="#E65100"/><path d="M70 70h116v116H70z" fill="#FFF"/><path d="M90 90h76v76H90z" fill="#E65100"/></svg>',
      what: 'Adobe’s reference 3D texturing software allowing artists to paint photorealistic materials onto 3D models in real time.',
      why: 'Generates physical micro-scratches, metallic reflections, wear-and-tear, and custom PBR map layers matching real-world physics.',
      details: ['Physically Based Rendering (PBR) metal/roughness workflow', 'Smart Materials that automatically adapt to mesh curvature', '4K/8K texture map baking (AO, Normal, Curvature)', 'Export presets for Unreal, Unity, Three.js, and GLTF']
    },
    'PBR Shaders': {
      name: 'PBR Shaders',
      category: 'Physically Based Rendering Materials',
      logo: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="#f0c75e" stroke-width="2"/><path d="M12 2a10 10 0 000 20v-20z" fill="#f0c75e"/></svg>',
      what: 'Material models that simulate real-world light physics: albedo, roughness, metallic, normal, ambient occlusion, and subsurface scattering.',
      why: 'Ensures 3D models react realistically under any lighting condition, whether in bright daylight, neon night scenes, or studio spots.',
      details: ['Energy conservation law compliant light calculations', 'Micro-facet surface roughness physics simulations', 'Consistent visual fidelity across all 3D viewports', 'Accurate metal conductor vs dielectric material behavior']
    },
    'GLTF / USDZ': {
      name: 'GLTF / USDZ',
      category: 'Compact 3D File Standards',
      logo: '<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 3.5l-5-2.5V17l5 2.5 5-2.5v-5l-5 2.5z" fill="#f0c75e"/></svg>',
      what: 'Optimized 3D transmission formats known as the "JPEG of 3D", supported natively by iOS AR Quick Look and WebGL browsers.',
      why: 'Compresses heavy 3D models down to a few megabytes for sub-second downloads on smartphones without losing textural quality.',
      details: ['Draco geometric compression reducing file size by 70%', 'Embedded textures, animations, and PBR materials', 'Direct AR Quick Look preview on all iPhones (USDZ)', 'Open Khronos standard supported across all browsers (GLTF)']
    },
    'KeyShot': {
      name: 'KeyShot',
      category: 'Photorealistic Product Rendering',
      logo: '<svg viewBox="0 0 256 256"><rect width="256" height="256" rx="40" fill="#003E7E"/><circle cx="128" cy="128" r="60" fill="#f0c75e"/></svg>',
      what: 'Real-time ray-tracing software specifically designed for luxury product visualization, automotive CAD rendering, and marketing imagery.',
      why: 'Transforms industrial CAD models into studio-lit, camera-ready marketing shots with accurate optical dispersion and caustics.',
      details: ['Real-time scientific ray-tracing preview engine', 'Scientifically accurate material index of refraction (IOR)', 'Virtual studio lighting HDRI environment creator', 'Automated product colorway configuration batch rendering']
    },
    'Google Ads': {
      name: 'Google Ads',
      category: 'High-Intent Search Advertising',
      logo: '<svg viewBox="0 0 256 256"><path d="M43.8 181.8l63.8-110.5c7.3-12.7 23.5-17.1 36.2-9.8l10.9 6.3c12.7 7.3 17.1 23.5 9.8 36.2L100.7 214.5c-7.3 12.7-23.5 17.1-36.2 9.8L53.6 218c-12.7-7.3-17.1-23.5-9.8-36.2z" fill="#FBBC04"/><path d="M212.2 181.8l-63.8-110.5c-7.3-12.7-23.5-17.1-36.2-9.8l-10.9 6.3c12.7 7.3 17.1 23.5 9.8 36.2l63.8 110.5c7.3 12.7 23.5 17.1 36.2 9.8l10.9-6.3c12.7-7.3 17.1-23.5 9.8-36.2z" fill="#4285F4"/><circle cx="58.7" cy="201.2" r="30.2" fill="#34A853"/></svg>',
      what: 'Google’s advertising platform displaying targeted ads across Google Search, YouTube, Display Network, and Performance Max campaigns.',
      why: 'Captures customers at the precise moment they are actively searching for your exact services with high buying intent.',
      details: ['High-intent search keyword targeting with negative match lists', 'Performance Max automated multi-channel machine learning', 'Target ROAS (Return On Ad Spend) automated bidding', 'Conversion tracking synced directly with CRM sales data']
    },
    'Meta Ads': {
      name: 'Meta Ads',
      category: 'Social Audience Acquisition',
      logo: '<svg viewBox="0 0 256 256"><path d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128c70.7 0 128-57.3 128-128S198.7 0 128 0zm68 135c-7.5 13-19.4 20.8-32.6 20.8-17.8 0-30.8-14.3-43.4-32.3-11.8-16.7-22.3-28.7-34.4-28.7-10.5 0-18.7 7.7-24.5 18.2l-18-9.8c8.9-16.3 23-28.4 42.5-28.4 21 0 35.8 16.5 48.6 34.6 10.9 15.5 20.6 26.4 30.2 26.4 7.6 0 13.9-4.8 19-14.2l12.6 13.4z" fill="#0081FB"/></svg>',
      what: 'Behavioral targeting advertising platform on Instagram and Facebook reaching over 3 billion active monthly users.',
      why: 'Builds brand awareness, tests video creative hooks, and retargets website visitors with personalized carousel offers.',
      details: ['Lookalike audiences based on high-value customers', 'Dynamic product retargeting based on viewed items', 'High-converting Instagram Reels and Stories video ads', 'Meta Conversions API (CAPI) for cookie-independent tracking']
    },
    'Technical SEO': {
      name: 'Technical SEO',
      category: 'Search Engine Optimization',
      logo: '<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="#f0c75e"/></svg>',
      what: 'Optimizing website code, server architecture, structured data schemas, and crawl efficiency for search engine bots.',
      why: 'Secures sustainable organic Google page #1 rankings without ongoing advertising costs.',
      details: ['JSON-LD structured schema markup (Organization, Product, FAQ)', 'Core Web Vitals performance optimization (LCP, INP, CLS)', 'Automated XML sitemaps, canonical tags, and robots.txt', 'Zero broken links and optimized internal link distribution']
    },
    'Conversion Rate Opt': {
      name: 'Conversion Rate Opt (CRO)',
      category: 'Revenue Optimization Science',
      logo: '<svg viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" fill="#0ACF83"/></svg>',
      what: 'Systematic analysis and optimization of web pages to increase the percentage of visitors who convert into paying leads.',
      why: 'Doubles or triples your revenue from existing website traffic without having to spend extra money on ads.',
      details: ['Checkout funnel drop-off analysis and friction removal', 'Persuasive copywriting and value proposition refinement', 'High-contrast Call-To-Action (CTA) placement testing', 'Form field optimization reducing abandonment']
    },
    'HubSpot / Klaviyo': {
      name: 'HubSpot / Klaviyo',
      category: 'CRM & Lead Nurturing',
      logo: '<svg viewBox="0 0 256 256"><rect width="256" height="256" rx="40" fill="#FF7A59"/><circle cx="128" cy="128" r="40" fill="#FFF"/></svg>',
      what: 'Enterprise customer relationship management and automated email/SMS lead nurturing software.',
      why: 'Automatically follows up with new leads within 60 seconds, nurtures prospects through email drip sequences, and tracks deal pipelines.',
      details: ['Instant automated lead response sequences', 'Behavioral email workflows based on page visits', 'Automated sales pipeline deal stage progression', 'Detailed attribution reporting from first click to closed sale']
    },
    'GA4 & Attribution': {
      name: 'GA4 & Attribution',
      category: 'Advanced Web Analytics',
      logo: '<svg viewBox="0 0 256 256"><rect width="256" height="256" rx="40" fill="#F9AB00"/><path d="M150 170V80h-24v90h24zm40 0V50h-24v120h24zm-80 0v-50H86v50h24z" fill="#FFF"/></svg>',
      what: 'Google Analytics 4 event-driven tracking and multi-touch revenue attribution modeling.',
      why: 'Provides crystal-clear visibility into which marketing channels produce actual profitable revenue versus wasted ad spend.',
      details: ['Custom event tracking for button clicks, video plays, and forms', 'Data-driven multi-touch attribution modeling', 'Cross-device user journey tracking', 'Automated anomaly detection alerts for revenue changes']
    },
    'A/B Testing': {
      name: 'A/B Testing',
      category: 'Split Experimentation Science',
      logo: '<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="#f0c75e"/></svg>',
      what: 'Simultaneously testing two variations of a headline, offer, or landing page against live traffic to see which performs better.',
      why: 'Replaces opinion-based arguments with cold statistical evidence, ensuring every redesign measurably grows revenue.',
      details: ['95%+ statistical significance confidence intervals', 'Simultaneous variant split testing on live visitor traffic', 'Heatmap and scroll-depth analysis on both variations', 'Continuous compound conversion rate growth']
    },
    'Content Strategy': {
      name: 'Content Strategy',
      category: 'Brand Authority & Inbound Funnels',
      logo: '<svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="#f0c75e"/></svg>',
      what: 'Strategic planning, creation, and distribution of high-value technical articles, case studies, video hooks, and whitepapers.',
      why: 'Positions your company as the authoritative market leader, builds buyer trust, and drives organic inbound leads.',
      details: ['Top-of-funnel educational search content', 'Commercial investigation guides and comparison matrices', 'Customer case studies proving tangible ROI metrics', 'Repurposing master content into LinkedIn, video, & newsletters']
    }
  };

  // Helper function to get tool data with intelligent fallback
  function getToolData(name) {
    if (TECH_TOOLS_DATA[name]) return TECH_TOOLS_DATA[name];
    
    // Check aliases
    const clean = name.trim();
    for (const key of Object.keys(TECH_TOOLS_DATA)) {
      if (clean.toLowerCase() === key.toLowerCase() || clean.includes(key) || key.includes(clean)) {
        return TECH_TOOLS_DATA[key];
      }
    }

    // High-tech fallback
    return {
      name: name,
      category: 'Core Engineering Tool',
      logo: '<svg viewBox="0 0 24 24"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" fill="none" stroke="#f0c75e" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="#f0c75e"/></svg>',
      what: `An industry-standard technology utilized in our engineering pipeline for reliable, high-speed execution of ${name}.`,
      why: `Selected for its proven reliability, modern developer tooling, and strict adherence to enterprise performance benchmarks.`,
      details: ['Production-verified stability and performance', 'Clean modular architecture and maintainability', 'High compatibility with our core framework stack', 'Continuous updates and active security auditing']
    };
  }

  // =========================================================================
  // DELIVERABLES DATABASE (What It Means, What We Deliver, Business Impact)
  // =========================================================================

  const DELIVERABLES_DATA = {
    // 1. Web Development
    'Custom Website Development': {
      meaning: 'Building a bespoke, ground-up digital platform tailored specifically to your brand identity, business workflows, and audience goals — completely free from cookie-cutter WordPress themes, bloated templates, or restrictive page-builder plugins.',
      inclusions: [
        'Tailored UI/UX architecture designed specifically for brand conversion goals',
        'Clean, modular, and semantic codebase engineered for extreme speed and scalability',
        'Custom headless CMS or admin portal integration for effortless content management',
        'Enterprise-grade security, OWASP compliance, and zero vulnerability plugin bloat'
      ],
      impact: 'Differentiates your brand from competitors, scales without software limits, and maximizes your online conversion rates.'
    },
    'Responsive Web Design': {
      meaning: 'Engineering adaptive, fluid interface layouts that dynamically recalibrate typography, navigation structures, touch targets, and visual media across smartphones, tablets, laptops, and ultra-wide 4K desktop screens.',
      inclusions: [
        'Fluid clamp typography and proportional layout scaling across all screen sizes',
        'Touch-optimized swipe gestures and thumb-zone friendly mobile navigation',
        'Dynamic responsive image serving (WebP/AVIF) matching device resolution',
        'Cross-browser rendering tests across iOS Safari, Android Chrome, and Desktop'
      ],
      impact: 'Guarantees that 100% of mobile visitors have a frictionless browsing and purchasing experience, directly lowering bounce rates.'
    },
    'Full-Stack Web Applications': {
      meaning: 'Engineering complete, multi-tier web platforms that combine reactive user-facing frontends with scalable backend servers, database systems, user authentication, and third-party cloud integrations.',
      inclusions: [
        'Multi-role secure authentication (OAuth 2.0, JWT, Magic Links, Role-Based Access)',
        'Relational or NoSQL database architecture with automated backups and replication',
        'Real-time WebSocket event dispatching for live updates, notifications, and data sync',
        'Comprehensive administrative dashboards with analytics, user management, and exports'
      ],
      impact: 'Replaces multiple expensive third-party SaaS subscriptions with your own proprietary, custom-built business infrastructure.'
    },
    'API Integration & Development': {
      meaning: 'Connecting your platform seamlessly with external services (payment gateways, CRMs, logistics, ERPs, SMS/email) and engineering custom RESTful or GraphQL endpoints for third-party consumers.',
      inclusions: [
        'Secure webhook listeners with fault-tolerant retry queues and deduplication',
        'End-to-end payload encryption and OAuth token refresh flows',
        'Standardized OpenAPI (Swagger) documentation and developer sandbox testing',
        'High-speed response caching and API rate limiting to protect backend servers'
      ],
      impact: 'Automates manual data transfers between business systems, saving hundreds of hours in human labor and eliminating data entry errors.'
    },
    'Website Optimization & Maintenance': {
      meaning: 'Continuous technical monitoring, speed audits, security patch applications, and database optimizations ensuring your web application maintains sub-second loading speeds and 99.99% uptime.',
      inclusions: [
        'Google Core Web Vitals optimization (LCP under 1.2s, INP under 50ms, zero CLS)',
        'JavaScript bundle size reduction, code-splitting, and asset tree-shaking',
        '24/7 automated uptime and latency monitoring with incident alerting',
        'Routine database vacuuming, index optimization, and encrypted automated backups'
      ],
      impact: 'Protects organic search engine rankings, prevents downtime revenue loss, and guarantees customer trust.'
    },

    // 2. Custom Software Development
    'Business Management Systems': {
      meaning: 'Bespoke operational software engineered around your company’s exact internal workflows, approvals, billing rules, and departmental hierarchies.',
      inclusions: [
        'Centralized company dashboard tracking live revenue, projects, and inventory',
        'Role-based permission controls (RBAC) ensuring employees see only authorized data',
        'Automated document generation (PDF invoices, contracts, compliance reports)',
        'Audit logging tracking every user action for accountability and compliance'
      ],
      impact: 'Eliminates messy spreadsheets and disconnected tools, giving executives total real-time control over their business operations.'
    },
    'Enterprise Software Solutions': {
      meaning: 'Large-scale, distributed software architecture engineered for mission-critical reliability, multi-tenant security, and high-volume data processing.',
      inclusions: [
        'Microservices or modular monolith architecture designed for high availability',
        'Enterprise single sign-on (SSO) supporting Okta, Microsoft Azure AD, and SAML',
        'Zero-downtime database migrations and automated failover clustering',
        'Rigorous SOC 2 and GDPR compliance data handling standards'
      ],
      impact: 'Provides enterprise-grade scalability that empowers your company to handle rapid corporate growth without system breakdowns.'
    },
    'Workflow Automation': {
      meaning: 'Engineering automated digital pipelines that replace repetitive manual tasks with background event-driven triggers, notifications, and validations.',
      inclusions: [
        'Multi-stage approval flows with automated email and Slack notifications',
        'Scheduled cron background jobs for automated report generation and data syncing',
        'Smart input validation and optical character recognition (OCR) document scanning',
        'Automated customer onboarding sequences and contract generation'
      ],
      impact: 'Dramatically reduces human operational overhead, eliminates costly manual errors, and speeds up task execution by 10x.'
    },
    'CRM & ERP Development': {
      meaning: 'Proprietary Customer Relationship Management and Enterprise Resource Planning platforms built to match your unique sales pipeline and inventory logistics.',
      inclusions: [
        'Custom lead capture funnels with automated scoring and sales rep assignment',
        'Real-time inventory tracking with threshold alerts and purchase order generation',
        'Integrated customer interaction timeline (emails, calls, purchases, tickets)',
        'Custom forecasting algorithms calculating projected quarterly revenue'
      ],
      impact: 'Gives your sales and operations teams a tailor-made tool that increases deal closing rates and optimizes inventory costs.'
    },
    'Custom API & Backend Solutions': {
      meaning: 'High-throughput, secure backend server architectures engineered in Go, Node.js, or Python to power complex business logic and serve millions of requests.',
      inclusions: [
        'Horizontally scalable containerized backend services running on Docker/K8s',
        'Sub-millisecond data caching layer via distributed Redis clusters',
        'Asynchronous event queues (RabbitMQ/Kafka) for heavy computation jobs',
        'Bank-grade SSL/TLS encryption, JWT authentication, and rate limiting'
      ],
      impact: 'Forms the rock-solid engine powering your entire digital business, built to handle millions of daily users without breaking a sweat.'
    },

    // 3. Mobile App Development
    'Android Application Development': {
      meaning: 'Native and modern Android apps engineered in Kotlin and Jetpack Compose, optimized to run flawlessly across thousands of diverse smartphone models.',
      inclusions: [
        'Modern declarative UI built with Jetpack Compose matching Material Design 3',
        'Deep Android OS integration (Background services, WorkManager, App Widgets)',
        'Google Play Store compliance, in-app billing, and Play Integrity security',
        'Battery-efficient background processing and offline SQLite caching'
      ],
      impact: 'Taps into the worldwide Android user base with a smooth, 5-star rated app that customers love using daily.'
    },
    'iOS Application Development': {
      meaning: 'Premium native iOS applications crafted in Swift and SwiftUI, taking full advantage of Apple’s hardware, security, and fluid gesture animations.',
      inclusions: [
        'SwiftUI reactive interface architecture designed for iPhone, iPad, and Watch',
        'Native Apple Pay checkout and Face ID / Touch ID biometric authentication',
        'Interactive iOS Home Screen widgets and Live Activities dynamic island updates',
        'Apple App Store review preparation, guidelines compliance, and TestFlight betas'
      ],
      impact: 'Positions your brand at the highest echelon of the market, monetizing high-spending Apple consumers with a luxury mobile experience.'
    },
    'Cross-Platform App Development': {
      meaning: 'Building dual iOS and Android mobile apps from a single, unified codebase using Flutter or React Native, saving months of development time.',
      inclusions: [
        'Single codebase powering simultaneous iOS and Android releases',
        'Natively compiled 60/120 FPS performance with hardware GPU acceleration',
        'Shared business logic, state management, and API networking layers',
        'Substantially reduced development timeline and long-term maintenance overhead'
      ],
      impact: 'Cuts your mobile development costs by up to 50% while shipping to both major app stores twice as fast.'
    },
    'Mobile UI/UX Design': {
      meaning: 'Designing mobile interfaces that prioritize ergonomics, thumb-zone accessibility, rapid visual clarity, and addictive micro-interactions.',
      inclusions: [
        'Ergonomic thumb-friendly navigation structures and swipeable bottom sheets',
        'High-contrast typography readable in bright sunlight on mobile displays',
        'Haptic vibration feedback confirming button taps and successful transactions',
        'Interactive Figma prototype validation with real user testing sessions'
      ],
      impact: 'Maximizes daily active users (DAU) and app store retention by making your mobile app intuitive and delightful to navigate.'
    },
    'App Integration & Maintenance': {
      meaning: 'Ongoing mobile OS version compatibility updates, crash monitoring, third-party SDK maintenance, and push notification management.',
      inclusions: [
        'Annual iOS and Android OS major version compatibility and API upgrades',
        'Real-time crash tracking via Firebase Crashlytics with automated bug triage',
        'Segmented push notification broadcast system via Firebase Cloud Messaging',
        'Continuous performance monitoring for memory leaks and battery consumption'
      ],
      impact: 'Ensures your app never breaks when Apple or Google release new OS updates, maintaining high app store ratings and user retention.'
    },

    // 4. E-Commerce Solutions
    'Custom E-Commerce Websites': {
      meaning: 'Custom-built, high-converting digital storefronts engineered with sub-second page loads, custom product builders, and frictionless checkout flows.',
      inclusions: [
        'Bespoke product page designs with image zoom, 360-degree spins, and variant selectors',
        'Optimistic instant add-to-cart drawers and multi-currency price conversion',
        'Sub-second search facets filtering by size, color, brand, and price in real time',
        'Custom promotional banners, bundle deals, and tiered volume discount logic'
      ],
      impact: 'Elevates your digital brand above commoditized stores, dramatically boosting average order value (AOV) and conversion percentages.'
    },
    'Online Store Development': {
      meaning: 'Full-service development of scalable Shopify Plus or WooCommerce stores, complete with inventory management, taxes, and shipping integrations.',
      inclusions: [
        'Automated sales tax calculation (Avalara / TaxJar) and global VAT compliance',
        'Live carrier shipping rate calculators (FedEx, UPS, DHL, BlueDart) with tracking',
        'Customer self-service portals for order tracking, reorders, and returns',
        'Automated transactional emails for order confirmations, shipping, and delivery'
      ],
      impact: 'Gives your business a reliable, 24/7 automated revenue engine that handles thousands of daily orders seamlessly.'
    },
    'Shopping Cart & Checkout Integration': {
      meaning: 'Engineering streamlined, distraction-free checkout funnels optimized to eliminate shopping cart abandonment and maximize completed orders.',
      inclusions: [
        'One-click express checkout options (Apple Pay, Google Pay, Shop Pay, PayPal)',
        'Address autocomplete APIs (Google Places) reducing mobile typing friction',
        'Transparent shipping costs and estimated delivery dates upfront before payment',
        'Automated abandoned cart recovery workflows saving lost sales'
      ],
      impact: 'Recovers thousands of dollars in lost revenue every month by converting hesitant shoppers into paid customers.'
    },
    'Payment Gateway Integration': {
      meaning: 'Integrating multi-currency, secure payment gateways (Stripe, Razorpay, PayPal) with automated recurring subscriptions and fraud prevention.',
      inclusions: [
        'Multi-currency processing supporting 135+ global currencies and local cards',
        'Recurring subscription billing logic with customer self-service cancellation/upgrades',
        'AI-backed fraud protection (Stripe Radar) preventing chargebacks and stolen card fraud',
        'Instant refund processing and automated ledger synchronization with accounting'
      ],
      impact: 'Provides your customers with their preferred, trusted payment methods while eliminating payment failure and chargeback risks.'
    },
    'Inventory & Order Management': {
      meaning: 'Synchronizing stock levels in real time across your online store, physical warehouses, retail POS terminals, and third-party marketplaces.',
      inclusions: [
        'Real-time multi-warehouse inventory synchronization preventing overselling',
        'Automated low-stock alerts and purchase order generation for suppliers',
        'Barcode scanner integration for rapid warehouse picking and packing',
        'Centralized order fulfillment status updates sent automatically to customers'
      ],
      impact: 'Eliminates costly stockouts, prevents accidental overselling, and slashes warehouse order fulfillment times.'
    },

    // 5. Game Development
    '2D & 3D Game Development': {
      meaning: 'Full-cycle game production across Unity and Unreal Engine, creating captivating gameplay loops, fluid physics, and polished visuals.',
      inclusions: [
        'Complete game architecture built in clean C# or C++ with modular component design',
        'Dynamic camera controllers, player locomotion, and interactive obstacle mechanics',
        'Optimized draw calls and GPU batching ensuring smooth 60/120 FPS on target hardware',
        'Cross-platform deployment to PC, Android, iOS, and WebGL browsers'
      ],
      impact: 'Brings your creative game vision to life as a commercially viable, addictive product that commands user engagement.'
    },
    'Game Design & Mechanics': {
      meaning: 'Designing the mathematical rules, reward loops, player progression systems, and difficulty curves that keep players engaged for hours.',
      inclusions: [
        'Comprehensive Game Design Document (GDD) detailing all systems and character balancing',
        'Addictive core game loop design with dopamine-rewarding milestones and feedback',
        'Balanced progression leveling formulas and in-game economy tuning',
        'Prototype greybox testing validating fun mechanics before artistic asset production'
      ],
      impact: 'Ensures the game is genuinely fun and engaging before investing heavily in visual art, maximizing player retention.'
    },
    'Interactive Gameplay Experiences': {
      meaning: 'Crafting responsive player interactions, kinetic combat systems, satisfying button feedbacks, and immersive world storytelling.',
      inclusions: [
        'Juicy feedback design (screen shake, hit-stop, particle bursts, controller rumble)',
        'Interactive environmental destruction and dynamic physics-based obstacles',
        'Branching dialogue systems and in-game interactive cinematic sequences',
        'Intuitive input mapping supporting touchscreens, gamepads, and keyboard/mouse'
      ],
      impact: 'Turns a good game into an unforgettable, shareable experience that players recommend to their friends.'
    },
    'Character & Environment Design': {
      meaning: 'Creating memorable 2D/3D characters, weapon models, atmospheric environments, and stylized or photorealistic visual worlds.',
      inclusions: [
        'Concept art sheets detailing character silhouettes, colors, and personality expressions',
        'Optimized 3D game models with clean quad topology and low draw-call materials',
        'Dynamic lighting setups, volumetric fog, and ambient atmospheric audio',
        'Modular environment tile sets enabling rapid procedural level design'
      ],
      impact: 'Gives your game a distinctive, recognizable visual identity that stands out in crowded app stores and gaming marketplaces.'
    },
    'Game Optimization & Testing': {
      meaning: 'Rigorous profiling of CPU/GPU bottlenecks, memory leaks, physics simulations, and QA playtesting across target devices.',
      inclusions: [
        'Deep Unity/Unreal Profiler audits eliminating framerate stutter and memory spikes',
        'LOD (Level of Detail) mesh setups and occlusion culling for vast environments',
        'Automated stress-testing simulating hundreds of concurrent on-screen entities',
        'Comprehensive device matrix QA testing across low-end and high-end hardware'
      ],
      impact: 'Prevents negative app store reviews by ensuring your game runs buttery smooth without heating up devices or crashing.'
    },

    // 6. AR/VR Development
    'Augmented Reality Applications': {
      meaning: 'Interactive mobile and headset AR applications that overlay 3D digital objects, data visualizations, and guides onto the physical world.',
      inclusions: [
        'True-to-scale 3D product projection on floors, tables, and walls in real time',
        'Surface plane detection, environmental occlusion, and real-time shadow casting',
        'Gesture-based object scaling, 360-degree rotation, and colorway customization',
        'Instant browser WebXR AR access without requiring native app downloads'
      ],
      impact: 'Boosts customer purchase confidence and reduces returns by 40% by letting buyers test products in their physical room before buying.'
    },
    'Virtual Reality Experiences': {
      meaning: 'Fully immersive, 360-degree digital worlds for Meta Quest, HTC Vive, and Apple Vision Pro that transport users into interactive simulations.',
      inclusions: [
        'High-framerate (90/120 Hz) stereoscopic 3D environments preventing motion sickness',
        'Intuitive physical controller interactions (picking up tools, opening doors, turning knobs)',
        'Spatialized 3D audio providing directional acoustic immersion',
        'Multiplayer collaborative virtual rooms where remote teams meet as avatars'
      ],
      impact: 'Revolutionizes employee training and client presentations by immersing people in safe, repeatable, photorealistic virtual environments.'
    },
    'Interactive 3D Environments': {
      meaning: 'Explorable virtual showrooms, architectural walkthroughs, and branded digital worlds running inside web browsers or native apps.',
      inclusions: [
        'First-person or orbit camera navigation with collision detection and floor constraints',
        'Interactive hot-spots that reveal specs, videos, or pricing upon approach',
        'Photorealistic baked lighting combined with real-time reflections and shadows',
        'Optimized for instant browser loading on standard mobile and laptop hardware'
      ],
      impact: 'Enables real estate developers, automotive brands, and luxury retailers to showcase multi-million dollar spaces before construction begins.'
    },
    'Virtual Product Demonstrations': {
      meaning: 'Digital 3D twins of complex industrial machinery, consumer electronics, or medical devices that users can inspect and test interactively.',
      inclusions: [
        'Interactive exploded view animations revealing internal gears, chips, and components',
        'Step-by-step interactive operation guides demonstrating product features',
        'Customizable material and color configurations with instant visual updates',
        'Direct link to "Request Quote" or "Buy Now" checkout workflows'
      ],
      impact: 'Eliminates the astronomical cost of shipping physical heavy machinery to trade shows, empowering your sales team worldwide.'
    },
    'AR/VR Simulations & Training': {
      meaning: 'Gamified, metric-tracked virtual reality training modules for industrial safety, medical procedures, flight simulation, and equipment operation.',
      inclusions: [
        'Physics-accurate simulation of hazardous real-world scenarios in 100% safety',
        'Automated scoring tracking procedure time, precision, and safety protocol adherence',
        'Instant replay and error breakdown for instructors and compliance certification',
        'Substantially reduced training facility, travel, and consumable material costs'
      ],
      impact: 'Reduces on-the-job industrial accidents while training staff 4x faster compared to traditional classroom manuals.'
    },

    // 7. UI/UX Design
    'User Interface (UI) Design': {
      meaning: 'Crafting visually stunning, high-contrast, modern interface layouts with intentional typography, color theory, iconography, and spatial breathing room.',
      inclusions: [
        'High-fidelity screen mockups in Figma crafted to pixel-perfection',
        'Harmonious typographic hierarchies establishing effortless visual scannability',
        'Bespoke iconography and micro-graphic illustrations tailored to your brand',
        'Dark mode and light mode color palette specifications with WCAG AA contrast'
      ],
      impact: 'Instills instant credibility and luxury appeal, making prospective customers feel your product is world-class from the very first second.'
    },
    'User Experience (UX) Design': {
      meaning: 'Engineering intuitive user journeys, eliminating confusing roadblocks, and making complex workflows feel effortless and logical.',
      inclusions: [
        'Customer journey mapping and task flow optimization from signup to checkout',
        'Information architecture and intuitive navigation categorization',
        'Friction-audit of existing screens identifying where users get confused or drop off',
        'Cognitive load reduction ensuring every screen has one clear, primary call to action'
      ],
      impact: 'Dramatically improves software adoption, reduces user frustration support tickets, and increases long-term customer retention.'
    },
    'Website & App Design': {
      meaning: 'Holistic product design spanning marketing landing pages, mobile apps, and SaaS dashboards to ensure a unified digital experience.',
      inclusions: [
        'Responsive layout mockups across desktop, tablet, and mobile viewport widths',
        'Conversion-focused landing page layouts with high-visibility CTA sections',
        'Intuitive form input styling, validation error messaging, and success dialogs',
        'Export-ready developer design assets with automated CSS inspect values'
      ],
      impact: 'Unifies all your customer touchpoints into a cohesive, high-converting digital experience that commands premium pricing.'
    },
    'Wireframing & Prototyping': {
      meaning: 'Creating clickable, interactive mockups that simulate real app transitions, gestures, and user inputs before starting code development.',
      inclusions: [
        'Low-fidelity wireframe blueprints validating content placement and logic early',
        'High-fidelity clickable Figma prototypes with realistic page transitions',
        'Interactive component states (hover, active, disabled, loading, error)',
        'Shareable prototype links for client stakeholder reviews and user feedback'
      ],
      impact: 'Saves thousands of dollars in wasted engineering rework by validating and perfecting product design before coding begins.'
    },
    'Design Systems & Branding': {
      meaning: 'Building comprehensive UI component libraries and brand style guides that allow engineering teams to ship new screens with 100% consistency.',
      inclusions: [
        'Centralized Figma component library with variants, auto-layout, and props',
        'Standardized design tokens for colors, spacing, radius, and elevation shadows',
        'Brand voice, logo usage guidelines, and illustration rules documentation',
        'Direct synchronization with frontend React/Tailwind component systems'
      ],
      impact: 'Speeds up future product feature development by 3x while ensuring zero visual discrepancies across growing teams.'
    },

    // 8. 3D Modeling
    '3D Product Modeling': {
      meaning: 'Transforming industrial CAD drawings, real-world sketches, or photos into hyper-realistic, mathematically precise 3D digital models.',
      inclusions: [
        'Millimeter-accurate polygonal modeling based on technical manufacturing blueprints',
        'Subdivision surface smoothing for flawless curvature under extreme camera close-ups',
        'Optimized low-poly mesh variants baked with high-poly normal maps for web performance',
        'Clean, non-overlapping UV unwrapping prepared for realistic texture painting'
      ],
      impact: 'Allows you to launch marketing campaigns, create 3D ads, and take pre-orders months before physical manufacturing begins.'
    },
    '3D Asset Creation': {
      meaning: 'Producing production-ready 3D game props, environmental architecture, weapons, and vehicles optimized for real-time graphics engines.',
      inclusions: [
        'Clean quad topology optimized for efficient GPU vertex and raster processing',
        'PBR texture sets (Albedo, Normal, Roughness, Metallic, Ambient Occlusion)',
        'Level of Detail (LOD) mesh tiers automatically switching based on camera distance',
        'Clean pivot points, real-world scale alignment, and asset store standard naming'
      ],
      impact: 'Fills your game or virtual world with rich, immersive assets without causing framerate stutter or memory crashes.'
    },
    'Architectural Visualization': {
      meaning: 'Photorealistic 3D interior and exterior architectural renderings that bring floor plans to life with realistic sunlight, materials, and furnishings.',
      inclusions: [
        'Precise 3D modeling of buildings, facades, structural pillars, and landscapes',
        'Physically accurate sun positioning, atmospheric lighting, and night illumination',
        'Interior staging with luxury designer furniture, fabrics, and decor styling',
        'High-resolution 4K/8K still renders and cinematic camera fly-through animations'
      ],
      impact: 'Sells residential and commercial real estate properties off-plan before construction crews even break ground.'
    },
    '3D Texturing & Rendering': {
      meaning: 'Applying real-world physical materials (leather, brushed titanium, polished marble, glass) and computing photorealistic ray-traced renders.',
      inclusions: [
        'Hand-crafted PBR material maps capturing micro-scratches, dust, and reflections',
        'Subsurface scattering simulation for realistic skin, marble, and organic surfaces',
        'Ray-traced depth of field, caustics, and optical lens dispersion effects',
        'Render passes (Beauty, Shadow, Reflection, Cryptomatte) for advanced compositing'
      ],
      impact: 'Delivers imagery indistinguishable from high-end studio photography at a fraction of the cost of physical photoshoots.'
    },
    '3D Animation & Visualization': {
      meaning: 'Creating fluid, kinetic 3D motion sequences: exploded product assemblies, character animations, mechanical demonstrations, and commercial reveals.',
      inclusions: [
        'Skeletal rigging with inverse kinematics (IK/FK) for fluid organic and character motion',
        'Mechanical gear, hinge, and piston constraint setups for industrial machinery',
        'Cinematic camera choreography with dynamic focal lengths, cuts, and motion blur',
        'Full HD / 4K 60 FPS video render delivery formatted for commercial broadcasts'
      ],
      impact: 'Captivates audience attention on social media and investor decks, visually explaining complex tech features in seconds.'
    },

    // 9. Digital Marketing
    'Search Engine Optimization (SEO)': {
      meaning: 'Comprehensive technical, on-page, and authority optimization engineered to rank your website at the top of Google for high-intent search keywords.',
      inclusions: [
        'In-depth competitor keyword gap analysis targeting terms with high commercial intent',
        'Technical website architecture audit (Core Web Vitals, crawl budget, sitemaps)',
        'Strategic content creation answering exact customer buying queries',
        'High-authority backlink outreach and digital PR placements on industry publications'
      ],
      impact: 'Delivers an endless stream of highly qualified inbound customer leads every month with zero ongoing cost per click.'
    },
    'Social Media Marketing': {
      meaning: 'Strategic brand storytelling, short-form video hooks, and community building across Instagram, LinkedIn, YouTube, and X.',
      inclusions: [
        'Monthly editorial content calendars aligned with sales promotions and industry trends',
        'High-retention short-form video production (Instagram Reels, TikToks, YouTube Shorts)',
        'Compelling copywriting crafted to spark comments, shares, and website clicks',
        'Proactive community engagement responding to inquiries and building brand affinity'
      ],
      impact: 'Builds an engaged, loyal community around your brand that drives organic word-of-mouth sales and customer trust.'
    },
    'Search Engine Marketing (SEM)': {
      meaning: 'Managing highly targeted Google Search, Shopping, and YouTube paid ad campaigns with laser precision to capture ready-to-buy prospects.',
      inclusions: [
        'Granular keyword bidding targeting users ready to purchase right now',
        'Continuous negative keyword pruning eliminating wasted advertising budget',
        'High-converting responsive search ad copy with automated dynamic asset insertion',
        'Real-time conversion tracking synced with your CRM to optimize for actual closed revenue'
      ],
      impact: 'Generates immediate customer inquiries and sales within 24 hours of campaign launch with transparent, measurable ROI.'
    },
    'Content Marketing': {
      meaning: 'Producing authoritative, insightful industry content (case studies, whitepapers, comparison guides) that educates prospects into buying from you.',
      inclusions: [
        'Detailed customer case studies demonstrating measurable ROI and transformation',
        'Comparative buying guides highlighting your unique technological advantages',
        'Search-optimized long-form pillar articles establishing undisputed market leadership',
        'Lead magnet creation (PDF guides, templates, calculators) capturing corporate emails'
      ],
      impact: 'Shortens complex B2B sales cycles by addressing objections upfront and educating decision-makers before they even speak to sales.'
    },
    'Performance Marketing & Analytics': {
      meaning: 'Data-driven paid social acquisition (Meta Ads, LinkedIn Ads) combined with advanced funnel tracking, attribution modeling, and conversion rate testing.',
      inclusions: [
        'Targeted audience segmentation (Lookalikes, website retargeting, email list matching)',
        'Rigorous creative hook A/B testing finding the lowest cost-per-acquisition winners',
        'Google Analytics 4 custom event tracking tracking every step of your buying funnel',
        'Executive dashboard reporting weekly customer acquisition costs (CAC) and ROAS'
      ],
      impact: 'Scales your revenue predictably like a machine, knowing that every dollar invested in marketing returns multiple dollars in net profit.'
    }
  };

  // Helper function to get deliverable data with intelligent fallback
  function getDeliverableData(name) {
    if (DELIVERABLES_DATA[name]) return DELIVERABLES_DATA[name];

    const clean = name.trim();
    for (const key of Object.keys(DELIVERABLES_DATA)) {
      if (clean.toLowerCase() === key.toLowerCase() || clean.includes(key) || key.includes(clean)) {
        return DELIVERABLES_DATA[key];
      }
    }

    return {
      meaning: `Professional ${name} tailored to your business needs, engineered with modern industry best practices and strict quality assurance.`,
      inclusions: [
        'Tailored engineering and design aligned with your brand objectives',
        'Rigorous testing and quality validation across target environments',
        'Standardized documentation and smooth operational handover',
        'Dedicated post-launch warranty and technical support'
      ],
      impact: 'Provides your business with reliable digital capabilities that streamline operations and accelerate customer revenue.'
    };
  }


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

    // Tech Stack Chips with Interactive Deep-Dive Logos & Explanations
    if (chapterTechChips) {
      chapterTechChips.innerHTML = '';
      if (chapterToolInspector) {
        chapterToolInspector.style.display = 'none';
        chapterToolInspector.innerHTML = '';
      }
      activeToolName = null;

      (svc.stack || []).forEach((tag, idx) => {
        const toolData = getToolData(tag);
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chapter-tech-chip';
        chip.setAttribute('data-tool', tag);
        chip.setAttribute('aria-expanded', 'false');
        chip.setAttribute('aria-label', `View details and logo for ${tag}`);
        chip.style.transitionDelay = (idx * 0.05 + 0.1) + 's';

        chip.innerHTML = `
          <span class="chip-mini-logo">${toolData.logo}</span>
          <span class="chip-label">${tag}</span>
          <span class="chip-expand-dot">+</span>
        `;

        chip.addEventListener('click', (e) => {
          e.stopPropagation();
          handleToolChipClick(tag, chip);
        });

        chapterTechChips.appendChild(chip);
      });
    }

    // Deliverables Grid with Interactive Expandable Deep-Dive Cards
    if (chapterDeliverablesGrid) {
      chapterDeliverablesGrid.innerHTML = '';
      (svc.deliverables || []).forEach((deliv, idx) => {
        const delivData = getDeliverableData(deliv);
        const card = document.createElement('div');
        card.className = 'chapter-deliverable-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-expanded', 'false');
        card.setAttribute('aria-label', `${deliv} - Click to expand details`);
        card.style.transitionDelay = (idx * 0.08 + 0.1) + 's';

        card.innerHTML = `
          <div class="deliverable-header">
            <div class="deliverable-check-icon">&#10003;</div>
            <div class="deliverable-text">${deliv}</div>
            <div class="deliverable-toggle-hint">
              <span class="deliverable-hint-text">Details</span>
              <div class="deliverable-plus-icon">+</div>
            </div>
          </div>
          <div class="deliverable-expand-drawer">
            <div class="deliverable-inner-content">
              <div class="deliv-info-block">
                <span class="deliv-block-label">WHAT IT MEANS</span>
                <p class="deliv-block-desc">${delivData.meaning}</p>
              </div>
              <div class="deliv-info-block">
                <span class="deliv-block-label">WHAT WE DELIVER</span>
                <ul class="deliv-list">
                  ${delivData.inclusions.map(inc => `<li><span class="deliv-bullet">&bull;</span> <span>${inc}</span></li>`).join('')}
                </ul>
              </div>
              <div class="deliv-info-block deliv-impact-box">
                <span class="deliv-block-label">BUSINESS VALUE</span>
                <p class="deliv-block-desc">${delivData.impact}</p>
              </div>
            </div>
          </div>
        `;

        card.addEventListener('click', () => {
          handleDeliverableCardClick(card, deliv);
        });

        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleDeliverableCardClick(card, deliv);
          }
        });

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

    // Initialize animation states for newly loaded service
    resetChapterAnimations();
  }

  let chapterScrollTicking = false;

  function getActiveChapterScrollContainer() {
    if (window.innerWidth <= 900) {
      return document.getElementById('chapterModalInner') || chapterRightColumn;
    }
    return chapterRightColumn;
  }

  let activeToolName = null;

  function handleToolChipClick(toolName, chipEl) {
    if (!chapterToolInspector) return;

    if (activeToolName === toolName) {
      activeToolName = null;
      chipEl.classList.remove('is-active');
      chipEl.setAttribute('aria-expanded', 'false');
      chapterToolInspector.style.display = 'none';
      chapterToolInspector.innerHTML = '';
      return;
    }

    activeToolName = toolName;
    const allChips = chapterTechChips.querySelectorAll('.chapter-tech-chip');
    allChips.forEach(c => {
      c.classList.remove('is-active');
      c.setAttribute('aria-expanded', 'false');
    });
    chipEl.classList.add('is-active');
    chipEl.setAttribute('aria-expanded', 'true');

    const toolData = getToolData(toolName);

    chapterToolInspector.innerHTML = `
      <div class="tool-inspector-card">
        <div class="tool-inspector-header">
          <div class="tool-inspector-logo-wrap">
            ${toolData.logo}
          </div>
          <div class="tool-inspector-title-group">
            <div class="tool-inspector-badge">${toolData.category}</div>
            <h4 class="tool-inspector-title">${toolData.name}</h4>
          </div>
          <button type="button" class="tool-inspector-close-btn" aria-label="Close details" id="toolInspectorCloseBtn">&times;</button>
        </div>
        <div class="tool-inspector-body">
          <div class="tool-info-block">
            <span class="tool-block-label">WHAT IS THIS TOOL?</span>
            <p class="tool-block-desc">${toolData.what}</p>
          </div>
          <div class="tool-info-block">
            <span class="tool-block-label">WHY WE USE IT:</span>
            <p class="tool-block-desc">${toolData.why}</p>
          </div>
          <div class="tool-info-block">
            <span class="tool-block-label">KEY CAPABILITIES &amp; HIGHLIGHTS:</span>
            <ul class="tool-highlights-list">
              ${toolData.details.map(d => `<li><span class="tool-bullet">✦</span> <span>${d}</span></li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
    chapterToolInspector.style.display = 'block';

    const closeBtn = document.getElementById('toolInspectorCloseBtn');
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.stopPropagation();
        activeToolName = null;
        chipEl.classList.remove('is-active');
        chipEl.setAttribute('aria-expanded', 'false');
        chapterToolInspector.style.display = 'none';
        chapterToolInspector.innerHTML = '';
      };
    }
  }

  function handleDeliverableCardClick(cardEl, delivName) {
    const isExpanded = cardEl.classList.contains('is-expanded');

    if (chapterDeliverablesGrid) {
      const allCards = chapterDeliverablesGrid.querySelectorAll('.chapter-deliverable-card');
      allCards.forEach(c => {
        if (c !== cardEl) {
          c.classList.remove('is-expanded');
          c.setAttribute('aria-expanded', 'false');
        }
      });
    }

    if (isExpanded) {
      cardEl.classList.remove('is-expanded');
      cardEl.setAttribute('aria-expanded', 'false');
    } else {
      cardEl.classList.add('is-expanded');
      cardEl.setAttribute('aria-expanded', 'true');
    }
  }

  function resetChapterAnimations() {
    if (!chapterModal) return;

    activeToolName = null;
    if (chapterToolInspector) {
      chapterToolInspector.style.display = 'none';
      chapterToolInspector.innerHTML = '';
    }

    const allChips = chapterModal.querySelectorAll('.chapter-tech-chip');
    allChips.forEach(c => {
      c.classList.remove('is-active');
      c.setAttribute('aria-expanded', 'false');
    });

    const allCards = chapterModal.querySelectorAll('.chapter-deliverable-card');
    allCards.forEach(c => {
      c.classList.remove('is-expanded');
      c.setAttribute('aria-expanded', 'false');
    });

    // Remove is-revealed from all sections
    const items = chapterModal.querySelectorAll('.svc-reveal-item');
    items.forEach(el => el.classList.remove('is-revealed'));

    // Remove step-reached from all timeline steps
    const steps = chapterModal.querySelectorAll('.chapter-timeline-step');
    steps.forEach(s => s.classList.remove('step-reached'));

    // Reset timeline track
    const track = document.getElementById('chapterTimelineTrack');
    if (track) {
      track.style.height = '0px';
      track.classList.remove('has-progress');
    }

    // Measure and set background track height accurately between marker 1 and marker 6
    requestAnimationFrame(() => {
      const wrap = document.getElementById('chapterTimelineWrap');
      const trackBg = document.getElementById('chapterTimelineTrackBg');
      if (wrap && trackBg) {
        const allSteps = wrap.querySelectorAll('.chapter-timeline-step');
        if (allSteps.length >= 2) {
          const firstStep = allSteps[0];
          const lastStep = allSteps[allSteps.length - 1];
          const totalDistance = lastStep.offsetTop - firstStep.offsetTop;
          trackBg.style.top = (firstStep.offsetTop + 12) + 'px';
          trackBg.style.height = totalDistance + 'px';
          if (track) {
            track.style.top = (firstStep.offsetTop + 12) + 'px';
          }
        }
      }
    });
  }

  function onChapterScroll() {
    if (!chapterScrollTicking) {
      requestAnimationFrame(() => {
        updateChapterScrollState();
        chapterScrollTicking = false;
      });
      chapterScrollTicking = true;
    }
  }

  function updateChapterScrollState() {
    if (!chapterModal || chapterModal.style.display === 'none') return;

    const scrollContainer = getActiveChapterScrollContainer();
    if (!scrollContainer) return;

    const containerRect = scrollContainer.getBoundingClientRect();
    const containerHeight = scrollContainer.clientHeight || window.innerHeight;

    // 1. REVEAL SECTIONS & CARDS AS USER SCROLLS DOWN
    const items = chapterModal.querySelectorAll('.svc-reveal-item');
    const revealThreshold = containerRect.top + containerHeight * 0.88;

    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.top <= revealThreshold) {
        item.classList.add('is-revealed');
      }
    });

    // 2. TIMELINE ANIMATED CONNECTING LINE & STEP LIGHTING (1 -> 2 -> 3 -> 4 -> 5 -> 6)
    const wrap = document.getElementById('chapterTimelineWrap');
    const track = document.getElementById('chapterTimelineTrack');
    const trackBg = document.getElementById('chapterTimelineTrackBg');
    if (!wrap || !track) return;

    const steps = wrap.querySelectorAll('.chapter-timeline-step');
    if (steps.length === 0) return;

    const firstStep = steps[0];
    const lastStep = steps[steps.length - 1];
    const firstMarker = firstStep.querySelector('.step-marker');
    const lastMarker = lastStep.querySelector('.step-marker');
    if (!firstMarker || !lastMarker) return;

    const totalTrackLength = lastStep.offsetTop - firstStep.offsetTop;

    if (trackBg) {
      trackBg.style.top = (firstStep.offsetTop + 12) + 'px';
      trackBg.style.height = totalTrackLength + 'px';
    }
    track.style.top = (firstStep.offsetTop + 12) + 'px';

    const m0Rect = firstMarker.getBoundingClientRect();
    const mLastRect = lastMarker.getBoundingClientRect();
    const m0CenterY = m0Rect.top + m0Rect.height / 2;
    const mLastCenterY = mLastRect.top + mLastRect.height / 2;

    // Trigger focus line at 62% down the container
    const triggerY = containerRect.top + containerHeight * 0.62;

    // Calculate progression from step 1 to step 6
    let progress = 0;
    if (mLastCenterY > m0CenterY) {
      progress = (triggerY - m0CenterY) / (mLastCenterY - m0CenterY);
      progress = Math.max(0, Math.min(1, progress));
    }

    const currentHeight = progress * totalTrackLength;
    track.style.height = currentHeight + 'px';

    if (progress > 0.01) {
      track.classList.add('has-progress');
    } else {
      track.classList.remove('has-progress');
    }

    // Step-by-step lighting up as the line reaches each circle
    steps.forEach((step) => {
      const marker = step.querySelector('.step-marker');
      if (!marker) return;
      const markerRect = marker.getBoundingClientRect();
      const markerCenterY = markerRect.top + markerRect.height / 2;

      // When the trigger line reaches or passes the step marker
      if (triggerY >= markerCenterY - 6) {
        step.classList.add('step-reached');
      } else {
        step.classList.remove('step-reached');
      }
    });
  }

  function setupChapterObserver() {
    resetChapterAnimations();
  }

  function openChapterView(serviceId, sourceCard) {
    if (!serviceId) {
      const centerIndex = Math.max(0, Math.min(filteredServices.length - 1, Math.round(pos)));
      serviceId = filteredServices[centerIndex]?.id || 'web';
    }
    populateChapterView(serviceId);
    if (!chapterModal) return;

    resetChapterAnimations();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Save exact scroll position before modal locks the body
    savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

    // Prevent background scrolling completely while modal is open
    document.documentElement.classList.add('service-modal-open');
    document.body.classList.add('service-modal-open');
    document.body.style.overflow = 'hidden';
    if (window.lenis) {
      window.lenis.stop();
    }

    chapterModal.style.display = 'block';

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
    const modalInner = document.getElementById('chapterModalInner');
    if (modalInner) modalInner.scrollTop = 0;

    // Smoothly reveal top overview section and initialize scroll view states
    setTimeout(() => {
      const topSection = document.getElementById('chapterOverviewSection');
      if (topSection) topSection.classList.add('is-revealed');
      updateChapterScrollState();
    }, 120);

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
        resetChapterAnimations();
        if (chapterRightColumn) chapterRightColumn.scrollTop = 0;
        inner.scrollTop = 0;
        inner.style.opacity = '1';
        inner.style.transform = 'translateY(0)';
        history.replaceState(null, null, '#service-' + serviceId);

        setTimeout(() => {
          const topSection = document.getElementById('chapterOverviewSection');
          if (topSection) topSection.classList.add('is-revealed');
          updateChapterScrollState();
        }, 120);
      }, 200);
    } else {
      populateChapterView(serviceId);
      resetChapterAnimations();
      if (chapterRightColumn) chapterRightColumn.scrollTop = 0;
      history.replaceState(null, null, '#service-' + serviceId);
      setTimeout(() => {
        const topSection = document.getElementById('chapterOverviewSection');
        if (topSection) topSection.classList.add('is-revealed');
        updateChapterScrollState();
      }, 120);
    }
  }

  function closeChapterView() {
    if (!chapterModal) return;
    chapterModal.style.transition = 'opacity 0.35s ease';
    chapterModal.style.opacity = '0';

    setTimeout(() => {
      chapterModal.style.display = 'none';
      chapterModal.style.clipPath = 'none';
      document.documentElement.classList.remove('service-modal-open');
      document.body.classList.remove('service-modal-open');
      document.body.style.overflow = '';
      if (window.lenis) {
        window.lenis.start();
        window.lenis.resize();
      }
      if (savedScrollY > 0) {
        window.scrollTo(0, savedScrollY);
        if (window.lenis) {
          window.lenis.scrollTo(savedScrollY, { immediate: true });
        }
      }
      resetChapterAnimations();
      if (window.location.hash.startsWith('#service-') || window.location.hash === '#services') {
        const cleanUrl = window.location.pathname + window.location.search;
        history.replaceState(null, null, cleanUrl);
      }
    }, 350);
  }

  // Attach scroll listeners to both potential scrolling containers
  if (chapterRightColumn) {
    chapterRightColumn.addEventListener('scroll', onChapterScroll, { passive: true });
  }
  const modalInnerEl = document.getElementById('chapterModalInner');
  if (modalInnerEl) {
    modalInnerEl.addEventListener('scroll', onChapterScroll, { passive: true });
  }
  window.addEventListener('resize', onChapterScroll, { passive: true });

  // Isolate wheel and touch events within the modal so background never scrolls
  if (chapterModal) {
    chapterModal.addEventListener('wheel', (e) => {
      const isScrollable = e.target.closest('#chapterRightColumn') ||
                           (window.innerWidth <= 900 && e.target.closest('#chapterModalInner'));
      if (!isScrollable) {
        e.preventDefault();
      }
      e.stopPropagation();
    }, { passive: false });

    chapterModal.addEventListener('touchmove', (e) => {
      const isScrollable = e.target.closest('#chapterRightColumn') ||
                           (window.innerWidth <= 900 && e.target.closest('#chapterModalInner'));
      if (!isScrollable) {
        e.preventDefault();
      }
      e.stopPropagation();
    }, { passive: false });
  }

  if (chapterCloseBtn) chapterCloseBtn.addEventListener('click', closeChapterView);
  if (chapterBackBtn) {
    chapterBackBtn.addEventListener('click', () => {
      // Revert filter to 'all' so all services are visible when coming back
      if (currentFilter !== 'all') {
        currentFilter = 'all';
        filterChips.forEach(c => {
          const isAll = (c.getAttribute('data-filter') || 'all') === 'all';
          c.classList.toggle('active', isAll);
          c.setAttribute('aria-selected', isAll ? 'true' : 'false');
        });
        buildCards();
      }
      closeChapterView();
    });
  }
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

  // Expose chapter view controls globally
  window.openChapterView = openChapterView;
  window.switchChapter = switchChapter;
  window.closeChapterView = closeChapterView;

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
    } else if (hash === '#services') {
      const cleanUrl = window.location.pathname + window.location.search;
      history.replaceState(null, null, cleanUrl);
    }
  }

  window.addEventListener('hashchange', checkDeepLink);

  // Initialize
  buildCards();
  checkDeepLink();
})();
