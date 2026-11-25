/**
 * DESIGN 2: THE DIGITAL PERSPECTIVE — INTERACTIVE ENGINE
 * Riyadvi Software Technologies
 * Handles:
 * - Manifesto Generative Particle Canvas
 * - 9 Disciplines Desktop Interactive Composer
 * - Capability Explorer Tab Switching
 * - Editorial Carousel Drag & Arrow Controls
 * - Sticky Subnav ScrollSpy
 * - Reading Progress Bar for Insight Articles
 * - Respects prefers-reduced-motion
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initManifestoCanvas(prefersReducedMotion);
  initDisciplinesComposer();
  initCapabilityExplorer();
  initTrendingCarousel();
  initSubnavScrollSpy();
  initReadingProgressBar();
  initSmoothScroll();
  initHeroVisuals(prefersReducedMotion);
});

/* ==========================================================================
   1. MANIFESTO GENERATIVE PARTICLE WAVE CANVAS
   ========================================================================== */
function initManifestoCanvas(reducedMotion) {
  const canvas = document.getElementById('manifestoCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId = null;
  let width, height;

  function resize() {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const nodes = [];
  const nodeCount = reducedMotion ? 12 : 28;

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * (reducedMotion ? 0.2 : 0.6),
      vy: (Math.random() - 0.5) * (reducedMotion ? 0.2 : 0.6),
      radius: Math.random() * 2 + 1.5,
      gold: Math.random() > 0.6
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          const alpha = (1 - dist / 120) * 0.25;
          ctx.strokeStyle = nodes[i].gold || nodes[j].gold 
            ? `rgba(201, 164, 92, ${alpha})` 
            : `rgba(255, 255, 255, ${alpha * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = n.gold ? '#C9A45C' : '#FFFFFF';
      ctx.shadowBlur = n.gold ? 8 : 0;
      ctx.shadowColor = 'rgba(201, 164, 92, 0.6)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    animationId = requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('beforeunload', () => {
    if (animationId) cancelAnimationFrame(animationId);
  });
}

/* ==========================================================================
   2. NINE DISCIPLINES INTERACTIVE COMPOSER (LANDING PAGE)
   ========================================================================== */
const DISCIPLINES_DATA = [
  {
    num: '01',
    name: 'Web Development',
    quote: '"Digital experiences built to do more than look good."',
    desc: 'Connecting information architecture, edge rendering, and sub-second execution into web applications that serve as high-performing digital flagships.',
    slug: 'web-development',
    accent: '#C9A45C',
    metric: '99.9% Uptime &middot; &lt;0.8s LCP Edge',
    architectures: [
      'Headless Storefronts & Edge Middleware',
      'Next.js App Router & React Server Components',
      'Sub-second LCP Performance Tuning',
      'Enterprise API & Microservice Orchestration'
    ],
    problem: 'When slow page speed, brittle legacy CMS systems, or poor core web vitals hinder enterprise pipeline conversion and brand authority.'
  },
  {
    num: '02',
    name: 'Custom Software Development',
    quote: '"Software that follows the way your business actually works."',
    desc: 'Replacing disconnected SaaS subscriptions and manual workarounds with resilient, purpose-built distributed architectures engineered around proprietary workflows.',
    slug: 'custom-software-development',
    accent: '#82B1FF',
    metric: 'mTLS Zero-Trust &middot; 45k req/s Mesh',
    architectures: [
      'Distributed Event-Driven Microservices',
      'High-Throughput Go & Rust Core Engines',
      'mTLS Zero-Trust Internal Networking',
      'Resilient PostgreSQL & Redis Clustered Caching'
    ],
    problem: 'When off-the-shelf software forces compromise, creates data silos, and scales subscription costs faster than company revenue.'
  },
  {
    num: '03',
    name: 'Mobile App Development',
    quote: '"Useful experiences designed for the devices people carry every day."',
    desc: 'Crafting native iOS, Android, and cross-platform applications engineered for tactile precision, battery efficiency, and offline resilience.',
    slug: 'mobile-app-development',
    accent: '#B388FF',
    metric: '60 FPS Tactile &middot; Offline-First Sync',
    architectures: [
      'Swift / SwiftUI Native iOS Architectures',
      'Kotlin Jetpack Compose Android Platforms',
      'React Native & Flutter Unified Cross-Platform',
      'Offline-First SQLite / WatermelonDB Sync'
    ],
    problem: 'When mobile apps suffer from battery drain, sluggish frame rates, poor offline behavior, or platform-inconsistent UX.'
  },
  {
    num: '04',
    name: 'E-Commerce Solutions',
    quote: '"Connected shopping experiences from discovery to delivery."',
    desc: 'Building high-converting headless storefronts, frictionless checkout funnels, and real-time inventory synchronization systems.',
    slug: 'ecommerce-solutions',
    accent: '#FFD180',
    metric: 'Sub-second Checkout &middot; Zero Cart Lag',
    architectures: [
      'Headless Shopify Plus & MedusaJS Backends',
      'Algolia & Typesense Instant Predictive Search',
      'Stripe Global Multi-Currency Orchestration',
      'Real-Time ERP & Inventory Webhook Pipelines'
    ],
    problem: 'When monolithic e-commerce platforms buckle under traffic spikes, exhibit cart latency, or prevent bespoke UX experiments.'
  },
  {
    num: '05',
    name: 'Game Development',
    quote: '"Interactive worlds shaped by imagination, mechanics, and engineering."',
    desc: 'Developing immersive 2D and 3D gameplay systems, custom physics pipelines, and synchronized multiplayer networks in Unity and Unreal Engine.',
    slug: 'game-development',
    accent: '#FF8A80',
    metric: 'Deterministic Physics &middot; Low Latency Netcode',
    architectures: [
      'Unity 6 & Unreal Engine 5 Real-Time Pipelines',
      'Deterministic Physics & Simulation Engines',
      'Photon & WebRTC Low-Latency Multiplayer',
      'Cross-Platform Asset Bundling & Shader Optimization'
    ],
    problem: 'When interactive projects need high-fidelity 60/120 FPS rendering, robust network synchronization, and fluid gameplay ergonomics.'
  },
  {
    num: '06',
    name: 'AR/VR Development',
    quote: '"Digital experiences that move beyond the boundaries of a screen."',
    desc: 'Spatial computing, mixed-reality simulation, and interactive digital twins engineered for industrial training, medical practice, and architectural visualization.',
    slug: 'ar-vr-development',
    accent: '#80D8FF',
    metric: '6DoF Tracking &middot; Spatial UI Depth',
    architectures: [
      'Apple VisionOS Spatial Computing Architecture',
      'Meta Quest OpenXR Native C++ Engines',
      'WebXR Lightweight Browser Immersion',
      'Precision 6DoF Spatial Tracking & Occlusion'
    ],
    problem: 'When industrial training, spatial commerce, or medical procedures require risk-free, photorealistic immersion that 2D screens cannot deliver.'
  },
  {
    num: '07',
    name: 'UI/UX Design',
    quote: '"Thoughtful interactions that make complex experiences feel natural."',
    desc: 'User research, design token architectures, and atomic component systems that transform complex enterprise workflows into intuitive, joyful interfaces.',
    slug: 'ui-ux-design',
    accent: '#CCFF90',
    metric: 'WCAG 2.2 AA &middot; Scalable Design Tokens',
    architectures: [
      'Figma Token Studio & Design Systems Architecture',
      'WCAG 2.2 AAA Accessibility Conformance',
      'Rapid Interactive Micro-Interaction Prototyping',
      'Qualitative User Research & Usability Telemetry'
    ],
    problem: 'When complex operational workflows confuse operators, increase error rates, and reduce enterprise end-user satisfaction.'
  },
  {
    num: '08',
    name: '3D Modeling',
    quote: '"Giving ideas form, dimension, and a sense of reality."',
    desc: 'Hard-surface and organic modeling, PBR material synthesis, and optimized polygonal topologies for real-time WebGL, games, and industrial prototyping.',
    slug: '3d-modeling',
    accent: '#EA80FC',
    metric: 'PBR Shaders &middot; WebGL Sub-50k Poly',
    architectures: [
      'Subdivision Surface & Parametric Hard Modeling',
      'Substance 3D PBR Material Shading Pipelines',
      'glTF / Draco Geometry Compression for WebGL',
      'Three.js & WebGPU Real-Time Scene Composition'
    ],
    problem: 'When digital products lack tactile presence, product visualizations feel static, or 3D assets bloat web load times.'
  },
  {
    num: '09',
    name: 'Digital Marketing',
    quote: '"Connecting meaningful messages with the people they are meant to reach."',
    desc: 'Technical SEO, Generative Engine Optimization (GEO), first-party attribution modeling, and data-driven performance campaigns.',
    slug: 'digital-marketing',
    accent: '#FFAB40',
    metric: 'Algorithmic GEO &middot; Multi-Touch Attribution',
    architectures: [
      'Generative Engine Optimization (GEO) Frameworks',
      'First-Party Server-Side Attribution Tracking',
      'Programmatic SEO & Content Graph Architectures',
      'Multi-Touch Pipeline Conversion Funnels'
    ],
    problem: 'When marketing spend increases while qualified enterprise pipeline stagnates due to opaque third-party cookie attribution.'
  }
];

function initDisciplinesComposer() {
  const tabs = document.querySelectorAll('.d2-discipline-tab');
  const stage = document.getElementById('d2StageDisplay');
  if (!tabs.length || !stage) return;

  const numEl = stage.querySelector('.d2-stage-num');
  const titleEl = stage.querySelector('.d2-stage-headline') || stage.querySelector('.d2-stage-title') || stage.querySelector('h3');
  const quoteEl = stage.querySelector('.d2-stage-quote');
  const descEl = stage.querySelector('.d2-stage-body') || stage.querySelector('.d2-stage-desc') || stage.querySelector('#d2StageBody');
  const metricEl = stage.querySelector('.d2-stage-tag') || stage.querySelector('#d2StageMetric');
  const archEl = stage.querySelector('#d2StageArchitectures');
  const probEl = stage.querySelector('#d2StageProblem');
  const linkEl = stage.querySelector('.d2-stage-link') || stage.querySelector('#d2StageLink') || stage.querySelector('.d2-btn-primary');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const index = parseInt(tab.getAttribute('data-index'), 10) || 0;
      const data = DISCIPLINES_DATA[index];
      if (!data) return;

      // Animate update
      stage.style.opacity = '0.4';
      stage.style.transform = 'translateY(4px)';

      setTimeout(() => {
        if (numEl) numEl.textContent = `${data.num} // ${data.name.toUpperCase()}`;
        if (titleEl) titleEl.textContent = data.name;
        if (quoteEl) quoteEl.textContent = data.quote;
        if (descEl) descEl.textContent = data.desc;
        if (metricEl) metricEl.innerHTML = data.metric || 'Enterprise Scalability';
        if (archEl && data.architectures) {
          archEl.innerHTML = data.architectures.map(a => `<li>${a}</li>`).join('');
        }
        if (probEl && data.problem) {
          probEl.textContent = data.problem;
        }
        if (linkEl) {
          linkEl.setAttribute('href', `/services/${data.slug}`);
          linkEl.innerHTML = `<span>Explore ${data.name}</span> <span class="d2-btn-arrow">&rarr;</span>`;
        }
        stage.style.opacity = '1';
        stage.style.transform = 'translateY(0)';
      }, 120);
    });
  });
}

/* ==========================================================================
   3. CAPABILITY EXPLORER (DETAIL PAGES)
   ========================================================================== */
function initCapabilityExplorer() {
  const capNav = document.getElementById('d2CapNav');
  const capStage = document.getElementById('d2CapStage');
  if (!capNav || !capStage) return;

  const btns = capNav.querySelectorAll('.d2-cap-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.getAttribute('data-cap-target');
      const allPanels = capStage.querySelectorAll('.d2-cap-panel');
      allPanels.forEach(p => {
        if (p.id === targetId) {
          p.style.display = 'flex';
          p.style.opacity = '0';
          setTimeout(() => { p.style.opacity = '1'; }, 20);
        } else {
          p.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. TRENDING CAROUSEL (DRAG & ARROWS)
   ========================================================================== */
function initTrendingCarousel() {
  const viewport = document.getElementById('d2CarouselViewport');
  const prevBtn = document.getElementById('d2CarouselPrev');
  const nextBtn = document.getElementById('d2CarouselNext');
  if (!viewport) return;

  const cardWidth = 388; // 360px + 28px gap

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

  // Pointer drag support
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  viewport.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - viewport.offsetLeft;
    scrollLeft = viewport.scrollLeft;
  });

  viewport.addEventListener('mouseleave', () => { isDown = false; });
  viewport.addEventListener('mouseup', () => { isDown = false; });

  viewport.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - viewport.offsetLeft;
    const walk = (x - startX) * 1.5;
    viewport.scrollLeft = scrollLeft - walk;
  });
}

/* ==========================================================================
   5. SUBNAV SCROLLSPY
   ========================================================================== */
function initSubnavScrollSpy() {
  const subnav = document.getElementById('d2Subnav');
  const anchors = document.querySelectorAll('.d2-subnav-anchor');
  if (!anchors.length) return;

  const sectionIds = Array.from(anchors).map(a => {
    const href = a.getAttribute('href');
    return (href && href.startsWith('#')) ? href.substring(1) : null;
  }).filter(Boolean);

  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  function onScroll() {
    const scrollPos = window.scrollY + 140;
    let currentId = null;

    for (let i = sections.length - 1; i >= 0; i--) {
      if (sections[i].offsetTop <= scrollPos) {
        currentId = sections[i].getAttribute('id');
        break;
      }
    }

    if (!currentId && sections.length) {
      currentId = sections[0].getAttribute('id');
    }

    anchors.forEach(a => {
      if (a.getAttribute('href') === `#${currentId}`) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   6. READING PROGRESS BAR
   ========================================================================== */
function initReadingProgressBar() {
  const bar = document.getElementById('d2ReadingProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }, { passive: true });
}

/* ==========================================================================
   7. SMOOTH SCROLL WITH OFFSET
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').substring(1);
      if (!targetId) return;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 130;
        const elemPos = targetEl.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elemPos - headerOffset,
          behavior: 'smooth'
        });
        history.pushState(null, null, `#${targetId}`);
      }
    });
  });
}

/* ==========================================================================
   8. SERVICE-SPECIFIC HERO VISUAL ANIMATIONS
   ========================================================================== */
function initHeroVisuals(reducedMotion) {
  // Can be extended with per-service SVG/Canvas micro-animations
}
