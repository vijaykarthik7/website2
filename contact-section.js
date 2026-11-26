    function initAllContactExperience() {
      if (!document.getElementById('contact')) return;

      // 1. Live Chennai Clock (IST)
      initLiveClock();

      // 2. Headline Word Rotator & Service Verb Locking
      initHeadlineRotator();

      // 3. Interactive Draggable 3D Globe Canvas (Centered on Chennai)
      initInteractiveGlobe();

      // 4. Background Particle Mesh & Cursor Easing Glow
      initParticleMesh();

      // 5. Radar Mini-Map in Headquarters Card
      initRadarCanvas();

      // 6. Interactive Card Spotlights & Copy Buttons
      initContactCards();

      // 7. Multi-step Stepper & Form Logic with Validation
      initBriefConsole();

      // 8. Dynamic Barcode Generator
      renderBarcode('RIYADVI-INIT-261126');
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAllContactExperience);
    } else {
      initAllContactExperience();
    }

    /* ==========================================================================
       1. LIVE CHENNAI IST CLOCK
       ========================================================================== */
    function initLiveClock() {
      const clockEl = document.getElementById('liveClock');
      if (!clockEl) return;

      function update() {
        const now = new Date();
        const options = {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        };
        clockEl.textContent = `${now.toLocaleTimeString('en-US', options)} IST`;
      }
      update();
      setInterval(update, 1000);
    }

    /* ==========================================================================
       2. HEADLINE WORD ROTATOR
       ========================================================================== */
    let isVerbLocked = false;
    let rotatorInterval = null;

    function initHeadlineRotator() {
      const wordEl = document.getElementById('rotatingWord');
      if (!wordEl) return;

      const words = ['scale', 'launch', 'automate', 'redesign', 'ship'];
      let idx = 0;

      function rotate() {
        if (isVerbLocked) return;
        wordEl.classList.add('blur-out');
        setTimeout(() => {
          idx = (idx + 1) % words.length;
          wordEl.textContent = words[idx];
          wordEl.classList.remove('blur-out');
          wordEl.classList.add('blur-in');
          setTimeout(() => {
            wordEl.classList.remove('blur-in');
          }, 350);
        }, 350);
      }

      rotatorInterval = setInterval(rotate, 3200);
    }

    function lockHeadlineVerb(verb) {
      isVerbLocked = true;
      const wordEl = document.getElementById('rotatingWord');
      if (!wordEl) return;
      wordEl.classList.add('blur-out');
      setTimeout(() => {
        wordEl.textContent = verb;
        wordEl.classList.remove('blur-out');
        wordEl.classList.add('blur-in');
        setTimeout(() => {
          wordEl.classList.remove('blur-in');
        }, 350);
      }, 350);
    }

    /* ==========================================================================
       3. DRAGGABLE DOTTED GOLD GLOBE (CANVAS)
       Centred on Chennai: 13.08°N, 80.27°E
       ========================================================================== */
    function initInteractiveGlobe() {
      const canvas = document.getElementById('globeCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      let width = 400, height = 320;
      let radius = 120;
      const satellites = [
        { angle: 0, speed: 0.015, dist: 160 },
        { angle: 2.1, speed: 0.015, dist: 160 },
        { angle: 4.2, speed: 0.015, dist: 160 }
      ];

      function resize() {
        if (!canvas.parentElement) return;
        width = canvas.width = canvas.parentElement.clientWidth || 400;
        height = canvas.height = canvas.parentElement.clientHeight || 320;
        radius = Math.min(width, height) * 0.36;
        satellites.forEach(s => s.dist = radius * 1.34);
      }
      resize();
      window.addEventListener('resize', resize, { passive: true });

      // Globe Settings
      let rotX = 0.22; // Latitude tilt for 13°N
      let rotY = -1.4; // Longitude offset for 80°E
      let autoSpeed = 0.002;
      let isDragging = false;
      let lastX = 0, lastY = 0;

      // Generate Fibonacci Sphere Dotted Grid
      const dotCount = 420;
      const dots = [];
      const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

      for (let i = 0; i < dotCount; i++) {
        const y = 1 - (i / (dotCount - 1)) * 2; // y goes from 1 to -1
        const r = Math.sqrt(1 - y * y); // radius at y
        const theta = phi * i; // golden angle increment
        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;
        dots.push({ x, y, z });
      }

      // Chennai Pin Coordinates in Spherical Math (Lat: 13.08°N, Lon: 80.27°E)
      const latRad = 13.08 * (Math.PI / 180);
      const lonRad = 80.27 * (Math.PI / 180);
      const chennaiVec = {
        x: Math.cos(latRad) * Math.sin(lonRad),
        y: -Math.sin(latRad),
        z: Math.cos(latRad) * Math.cos(lonRad)
      };

      // Mouse & Touch Dragging
      canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
      });
      window.addEventListener('mouseup', () => { isDragging = false; });
      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        rotY += dx * 0.006;
        rotX += dy * 0.006;
        rotX = Math.max(-1.1, Math.min(1.1, rotX));
        lastX = e.clientX;
        lastY = e.clientY;
      });

      // Touch handlers
      canvas.addEventListener('touchstart', (e) => {
        if (!e.touches.length) return;
        isDragging = true;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
      }, { passive: true });
      window.addEventListener('touchend', () => { isDragging = false; });
      window.addEventListener('touchmove', (e) => {
        if (!isDragging || !e.touches.length) return;
        const dx = e.touches[0].clientX - lastX;
        const dy = e.touches[0].clientY - lastY;
        rotY += dx * 0.006;
        rotX += dy * 0.006;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
      }, { passive: true });

      function rotatePoint(p, rx, ry) {
        // Rotate around Y
        let x1 = p.x * Math.cos(ry) + p.z * Math.sin(ry);
        let z1 = -p.x * Math.sin(ry) + p.z * Math.cos(ry);
        let y1 = p.y;
        // Rotate around X
        let y2 = y1 * Math.cos(rx) - z1 * Math.sin(rx);
        let z2 = y1 * Math.sin(rx) + z1 * Math.cos(rx);
        let x2 = x1;
        return { x: x2, y: y2, z: z2 };
      }

      let pingPulse = 0;

      function render() {
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2;
        const cy = height / 2;

        if (!isDragging) {
          rotY += autoSpeed;
        }

        // Draw Globe Wireframe Ring (Atmosphere rim)
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(232, 196, 104, 0.16)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Draw Elliptical Orbit Ring
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius * 1.34, radius * 0.45, -0.22, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(232, 196, 104, 0.18)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Satellites on Orbit
        satellites.forEach(sat => {
          sat.angle += sat.speed;
          const sx = cx + Math.cos(sat.angle) * sat.dist * Math.cos(-0.22) - Math.sin(sat.angle) * (sat.dist * 0.34) * Math.sin(-0.22);
          const sy = cy + Math.cos(sat.angle) * sat.dist * Math.sin(-0.22) + Math.sin(sat.angle) * (sat.dist * 0.34) * Math.cos(-0.22);
          
          ctx.beginPath();
          ctx.arc(sx, sy, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#f8e19a';
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#e8c468';
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // Draw Dotted Globe Points
        dots.forEach(d => {
          const rot = rotatePoint(d, rotX, rotY);
          const px = cx + rot.x * radius;
          const py = cy + rot.y * radius;
          
          // Only draw points facing the viewer (z > -0.15)
          if (rot.z > -0.2) {
            const alpha = Math.max(0.1, (rot.z + 0.2) / 1.2);
            ctx.beginPath();
            ctx.arc(px, py, 1.4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(232, 196, 104, ${alpha * 0.75})`;
            ctx.fill();
          }
        });

        // Draw Chennai Pin & Pulsing Marker
        const chRot = rotatePoint(chennaiVec, rotX, rotY);
        if (chRot.z > 0) {
          const chX = cx + chRot.x * radius;
          const chY = cy + chRot.y * radius;

          pingPulse += 0.05;
          const pingR = 5 + (Math.sin(pingPulse) + 1) * 7;
          const pingAlpha = (Math.cos(pingPulse) + 1) * 0.45;

          // Pulse ring
          ctx.beginPath();
          ctx.arc(chX, chY, pingR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(248, 225, 154, ${pingAlpha})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Center solid beacon
          ctx.beginPath();
          ctx.arc(chX, chY, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#f8e19a';
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#e8c468';
          ctx.fill();
          ctx.shadowBlur = 0;

          // Connecting Leader Line & Label
          ctx.beginPath();
          ctx.moveTo(chX, chY);
          ctx.lineTo(chX + 28, chY - 24);
          ctx.lineTo(chX + 75, chY - 24);
          ctx.strokeStyle = 'rgba(232, 196, 104, 0.6)';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.font = '600 10.5px "JetBrains Mono", monospace';
          ctx.fillStyle = '#f8e19a';
          ctx.fillText('CHENNAI', chX + 32, chY - 29);
        }

        requestAnimationFrame(render);
      }
      render();
    }

    /* ==========================================================================
       4. BACKGROUND PARTICLE MESH & CURSOR GLOW
       ========================================================================== */
    function initParticleMesh() {
      const canvas = document.getElementById('bgCanvas');
      const glowEl = document.getElementById('cursorGlow');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      let w, h;
      function resize() {
        const parent = canvas.parentElement || document.getElementById("contact");
        w = canvas.width = parent ? parent.offsetWidth : window.innerWidth;
        h = canvas.height = parent ? parent.offsetHeight : window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize, { passive: true });

      const count = 35;
      const particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.5 + 1
        });
      }

      let mouse = { x: -999, y: -999, targetX: -999, targetY: -999 };
      window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
      });

      function loop() {
        ctx.clearRect(0, 0, w, h);

        // Smooth cursor ambient glow lerp
        if (mouse.targetX !== -999) {
          mouse.x += (mouse.targetX - mouse.x) * 0.12;
          mouse.y += (mouse.targetY - mouse.y) * 0.12;
          if (glowEl) {
            glowEl.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
          }
        }

        for (let i = 0; i < count; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;

          // Connect nearby particles
          for (let j = i + 1; j < count; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 110) {
              const alpha = (1 - dist / 110) * 0.15;
              ctx.strokeStyle = `rgba(232, 196, 104, ${alpha})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }

          // Draw node
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(232, 196, 104, 0.4)';
          ctx.fill();
        }

        requestAnimationFrame(loop);
      }
      loop();
    }

    /* ==========================================================================
       5. RADAR MINI-MAP IN HEADQUARTERS CARD
       ========================================================================== */
    function initRadarCanvas() {
      const canvas = document.getElementById('radarCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      let w = 320, h = 160;
      function resizeRadar() {
        if (!canvas.parentElement) return;
        w = canvas.width = canvas.parentElement.clientWidth || 320;
        h = canvas.height = canvas.parentElement.clientHeight || 160;
      }
      resizeRadar();
      window.addEventListener('resize', resizeRadar, { passive: true });

      let angle = 0;
      let ping = 0;

      function drawRadar() {
        ctx.clearRect(0, 0, w, h);
        const cx = w * 0.68;
        const cy = h * 0.52;
        const maxR = Math.max(w, h) * 0.75;

        // Background Coordinate Grid
        ctx.strokeStyle = 'rgba(232, 196, 104, 0.07)';
        ctx.lineWidth = 1;
        const gridSize = 24;
        for (let x = 0; x < w; x += gridSize) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 0; y < h; y += gridSize) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // Range Concentric Rings
        for (let r = 24; r < maxR; r += 26) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(232, 196, 104, 0.14)';
          ctx.stroke();
        }

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(cx - maxR, cy); ctx.lineTo(cx + maxR, cy);
        ctx.moveTo(cx, cy - maxR); ctx.lineTo(cx, cy + maxR);
        ctx.strokeStyle = 'rgba(232, 196, 104, 0.16)';
        ctx.stroke();

        // Rotating Sweep Cone
        angle += 0.025;
        const sweepGrad = ctx.createConicGradient(angle, cx, cy);
        sweepGrad.addColorStop(0, 'rgba(232, 196, 104, 0.35)');
        sweepGrad.addColorStop(0.12, 'rgba(232, 196, 104, 0.0)');
        sweepGrad.addColorStop(1, 'rgba(232, 196, 104, 0.0)');

        ctx.fillStyle = sweepGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
        ctx.fill();

        // Pinging Mylapore Blip
        ping += 0.04;
        const pR = 4 + (Math.sin(ping) + 1) * 5;
        ctx.beginPath();
        ctx.arc(cx, cy, pR, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(248, 225, 154, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#f8e19a';
        ctx.fill();

        // Label
        ctx.font = '700 9.5px "JetBrains Mono", monospace';
        ctx.fillStyle = '#f8e19a';
        ctx.fillText('MYLAPORE', cx + 10, cy - 8);

        requestAnimationFrame(drawRadar);
      }
      drawRadar();
    }

    /* ==========================================================================
       6. CONTACT CARDS INTERACTION & CLIPBOARD TOAST
       ========================================================================== */
    function initContactCards() {
      // Spotlight tracker on cards
      const cards = document.querySelectorAll('[data-card]');
      cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        });
      });

      // Copy buttons with toast
      const copyBtns = document.querySelectorAll('[data-copy]');
      const toast = document.getElementById('toastBox');
      const toastMsg = document.getElementById('toastMsg');
      let toastTimer = null;

      copyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
          const text = btn.getAttribute('data-copy');
          try {
            if (navigator.clipboard && window.isSecureContext) {
              await navigator.clipboard.writeText(text);
            } else {
              // Fallback
              const ta = document.createElement('textarea');
              ta.value = text;
              document.body.appendChild(ta);
              ta.select();
              document.execCommand('copy');
              document.body.removeChild(ta);
            }
            showToast(`Copied: ${text}`);
          } catch (err) {
            showToast('Copied to clipboard');
          }
        });
      });

      function showToast(msg) {
        if (!toast || !toastMsg) return;
        toastMsg.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          toast.classList.remove('show');
        }, 3000);
      }
    }

    /* ==========================================================================
       7. STEPPER & PROJECT BRIEF LOGIC
       ========================================================================== */
    function initBriefConsole() {
      // Inputs
      const userNameInput = document.getElementById('userName');
      const companyInput = document.getElementById('companyName');
      const phoneInput = document.getElementById('phoneNumber');
      const emailInput = document.getElementById('emailAddress');
      const goalsInput = document.getElementById('projectGoals');
      const budgetRange = document.getElementById('budgetRange');
      const serviceRadios = document.querySelectorAll('input[name="serviceChoice"]');
      const timelineRadios = document.querySelectorAll('input[name="timelineChoice"]');

      // Ticket Elements
      const valClient = document.getElementById('valClient');
      const valCompany = document.getElementById('valCompany');
      const valService = document.getElementById('valService');
      const valBudget = document.getElementById('valBudget');
      const valTimeline = document.getElementById('valTimeline');
      const valReach = document.getElementById('valReach');
      const valGoals = document.getElementById('valGoals');
      const ticketRef = document.getElementById('ticketRef');
      const ticketStatusBadge = document.getElementById('ticketStatusBadge');
      const ringCircle = document.getElementById('ringCircle');
      const ringText = document.getElementById('ringText');

      // Generate Reference Code: BRF-YYMMDD-####
      let now = new Date();
      let yy = String(now.getFullYear()).slice(-2);
      let mm = String(now.getMonth() + 1).padStart(2, '0');
      let dd = String(now.getDate()).padStart(2, '0');
      let randRef = Math.floor(1000 + Math.random() * 9000);
      let currentRefCode = 'BRF-' + yy + mm + dd + '-' + randRef;
      if (ticketRef) ticketRef.textContent = currentRefCode;

      // Validation Functions
      function validateField(id) {
        if (id === 'userName') {
          if (!userNameInput.value.trim()) {
            showError('userName', 'Your name is required.');
            return false;
          }
          clearError('userName');
          return true;
        }
        if (id === 'companyName') {
          if (!companyInput.value.trim()) {
            showError('companyName', 'Company name is required.');
            return false;
          }
          clearError('companyName');
          return true;
        }
        if (id === 'phoneNumber') {
          const phoneRegex = /^[+]?[\d\s\-()]{7,20}$/;
          if (!phoneInput.value.trim() || !phoneRegex.test(phoneInput.value.trim())) {
            showError('phoneNumber', 'Valid phone number required.');
            return false;
          }
          clearError('phoneNumber');
          return true;
        }
        if (id === 'emailAddress') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
            showError('emailAddress', 'Valid email address required.');
            return false;
          }
          clearError('emailAddress');
          return true;
        }
        if (id === 'projectGoals') {
          if (!goalsInput.value.trim()) {
            showError('projectGoals', 'Please provide a brief project overview.');
            return false;
          }
          clearError('projectGoals');
          return true;
        }
        return true;
      }

      function validateAll() {
        let firstInvalid = null;
        const validName = validateField('userName');
        if (!validName && !firstInvalid) firstInvalid = userNameInput;

        const selectedService = document.querySelector('input[name="serviceChoice"]:checked');
        if (!selectedService) {
          const chipsGrid = document.querySelector('.service-chips-grid');
          if (chipsGrid) {
            chipsGrid.classList.remove('shake');
            void chipsGrid.offsetWidth;
            chipsGrid.classList.add('shake');
          }
          if (!firstInvalid && chipsGrid) firstInvalid = chipsGrid;
        }


        const validCompany = validateField('companyName');
        if (!validCompany && !firstInvalid) firstInvalid = companyInput;

        const validPhone = validateField('phoneNumber');
        if (!validPhone && !firstInvalid) firstInvalid = phoneInput;

        const validEmail = validateField('emailAddress');
        if (!validEmail && !firstInvalid) firstInvalid = emailInput;

        const validGoals = validateField('projectGoals');
        if (!validGoals && !firstInvalid) firstInvalid = goalsInput;

        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstInvalid.focus();
          return false;
        }
        return true;
      }

      function showError(id, msg) {
        const wrap = document.getElementById('wrap-' + id);
        const input = document.getElementById(id);
        const err = document.getElementById('err-' + id);
        if (wrap) {
          wrap.classList.remove('shake');
          void wrap.offsetWidth;
          wrap.classList.add('shake');
        }
        if (input) {
          input.classList.remove('is-valid');
          input.classList.add('is-invalid');
        }
        if (err) {
          err.textContent = msg;
          err.classList.add('visible');
        }
      }

      function clearError(id) {
        const input = document.getElementById(id);
        const err = document.getElementById('err-' + id);
        if (input) {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        }
        if (err) {
          err.textContent = '';
          err.classList.remove('visible');
        }
      }

      // Ticket Flash Feedback
      function flashTicketRow(rowId) {
        const row = document.getElementById(rowId);
        if (!row) return;
        row.classList.remove('flash');
        void row.offsetWidth;
        row.classList.add('flash');
      }

      // Update Completion Ring
      function updateCompletion() {
        const selectedService = document.querySelector('input[name="serviceChoice"]:checked');
        const fields = [
          userNameInput ? userNameInput.value.trim() : '',
          companyInput ? companyInput.value.trim() : '',
          (phoneInput ? phoneInput.value.trim() : '') || (emailInput ? emailInput.value.trim() : ''),
          selectedService ? selectedService.value : '',
          goalsInput ? goalsInput.value.trim() : ''
        ];
        const validCount = fields.filter(f => Boolean(f)).length;
        const pct = Math.round((validCount / fields.length) * 100);

        if (ringText) ringText.textContent = pct + '%';
        const circumference = 100.5;
        const offset = circumference - (pct / 100) * circumference;
        if (ringCircle) ringCircle.style.strokeDashoffset = offset;

        if (ticketStatusBadge) {
          if (pct === 100) {
            ticketStatusBadge.textContent = 'Ready';
            ticketStatusBadge.style.color = '#f8e19a';
            ticketStatusBadge.style.borderColor = '#e8c468';
          } else {
            ticketStatusBadge.textContent = 'Draft';
            ticketStatusBadge.style.color = 'var(--muted)';
            ticketStatusBadge.style.borderColor = 'var(--gold-border)';
          }
        }
      }

      // Live Input Sync to Ticket
      if (userNameInput) {
        userNameInput.addEventListener('input', () => {
          if (valClient) valClient.textContent = userNameInput.value.trim() || '—';
          flashTicketRow('rowClient');
          renderBarcode(userNameInput.value.trim() || currentRefCode);
          updateCompletion();
          if (userNameInput.value.trim()) clearError('userName');
        });
      }

      if (companyInput) {
        companyInput.addEventListener('input', () => {
          if (valCompany) valCompany.textContent = companyInput.value.trim() || '—';
          flashTicketRow('rowCompany');
          updateCompletion();
          if (companyInput.value.trim()) clearError('companyName');
        });
      }

      function syncReach() {
        const em = emailInput ? emailInput.value.trim() : '';
        const ph = phoneInput ? phoneInput.value.trim() : '';
        if (valReach) {
          if (em && ph) valReach.textContent = em + ' / ' + ph;
          else if (em) valReach.textContent = em;
          else if (ph) valReach.textContent = ph;
          else valReach.textContent = '—';
        }
        flashTicketRow('rowReach');
        updateCompletion();
      }

      if (phoneInput) {
        phoneInput.addEventListener('input', () => {
          syncReach();
          if (phoneInput.value.trim()) clearError('phoneNumber');
        });
      }

      if (emailInput) {
        emailInput.addEventListener('input', () => {
          syncReach();
          if (emailInput.value.trim()) clearError('emailAddress');
        });
      }

      // Service Chips Sync & Headline Verb Locking
      serviceRadios.forEach(radio => {
        radio.addEventListener('change', () => {
          if (valService) valService.textContent = radio.value;
          flashTicketRow('rowService');
          const verb = radio.getAttribute('data-verb');
          if (verb) lockHeadlineVerb(verb);
          renderBarcode(radio.value + '-' + currentRefCode);
        });
      });

      // Budget Slider Sync
      const budgetTiers = [
        { name: 'Starter Tier', range: 'Under $2,000', display: 'Starter <$2k' },
        { name: 'Growth Tier', range: '$2,000 – $5,000', display: 'Growth $2k–$5k' },
        { name: 'Scale Tier', range: '$5,000 – $15,000', display: 'Scale $5k–$15k' },
        { name: 'Enterprise Tier', range: '$15,000+', display: 'Enterprise $15k+' }
      ];

      const budgetTierName = document.getElementById('budgetTierName');
      const budgetTierRange = document.getElementById('budgetTierRange');

      if (budgetRange) {
        budgetRange.addEventListener('input', () => {
          const idx = parseInt(budgetRange.value, 10);
          const tier = budgetTiers[idx];
          if (budgetTierName) budgetTierName.textContent = tier.name;
          if (budgetTierRange) budgetTierRange.textContent = tier.range;
          if (valBudget) valBudget.textContent = tier ? tier.display : "";
          flashTicketRow('rowBudget');

          for (let i = 0; i <= 3; i++) {
            const t = document.getElementById('tick' + i);
            if (t) t.classList.toggle('active', i === idx);
          }
        });
      }

      // Goals & Character Count
      const charCountEl = document.getElementById('charCount');
      if (goalsInput) {
        goalsInput.addEventListener('input', () => {
          if (charCountEl) charCountEl.textContent = goalsInput.value.length;
          if (valGoals) valGoals.textContent = goalsInput.value.trim() || 'Awaiting project description...';
          flashTicketRow('rowGoals');
          updateCompletion();
          if (goalsInput.value.trim()) clearError('projectGoals');
        });
      }

      // Quick Prompt Buttons
      document.querySelectorAll('[data-insert]').forEach(btn => {
        btn.addEventListener('click', () => {
          const insertText = btn.getAttribute('data-insert');
          if (goalsInput) {
            if (goalsInput.value.trim().length > 0) {
              goalsInput.value = goalsInput.value.trim() + '\n\n' + insertText;
            } else {
              goalsInput.value = insertText;
            }
            goalsInput.dispatchEvent(new Event('input'));
            goalsInput.focus();
          }
        });
      });

      // Timeline Radios Sync
      timelineRadios.forEach(radio => {
        radio.addEventListener('change', () => {
          if (valTimeline) valTimeline.textContent = radio.value;
          flashTicketRow('rowTimeline');
        });
      });

      // Form Submission
      const form = document.getElementById('projectBriefForm');
      const successView = document.getElementById('successView');
      const receivedStamp = document.getElementById('receivedStamp');
      const successHeading = document.getElementById('successHeading');
      const successLead = document.getElementById('successLead');
      const successRef = document.getElementById('successRef');
      const btnSendAnother = document.getElementById('btnSendAnother');

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();

          if (!validateAll()) return;

          const actionType = e.submitter ? e.submitter.getAttribute('data-action') : 'START_PROJECT';
          const clientName = userNameInput.value.trim() || 'Partner';
          const clientEmail = emailInput.value.trim() || 'your email';

          // Visual Stamp Slam Animation
          if (receivedStamp) receivedStamp.classList.add('slam');

          // Burst Gold Confetti
          launchGoldConfetti();

          // Update Boarding Pass Status
          if (ticketStatusBadge) {
            ticketStatusBadge.textContent = 'Sent';
            ticketStatusBadge.classList.add('sent');
          }

          // Update Success View Copy
          if (successHeading) {
            if (actionType === 'FREE_CONSULTATION') {
              successHeading.textContent = 'Consultation requested, ' + clientName + '.';
            } else {
              successHeading.textContent = 'Project brief received, ' + clientName + '.';
            }
          }
          if (successLead) {
            successLead.innerHTML = 'Our technical team will review your scope and reply to <strong style="color:#fff;">' + clientEmail + '</strong> within 2 business hours. Your reference is <strong style="color:var(--gold);">' + currentRefCode + '</strong>.';
          }
          if (successRef) successRef.textContent = currentRefCode;

          // Transition form to success roadmap view
          form.style.display = 'none';
          if (successView) successView.style.display = 'flex';
        });
      }

      // Reset Button: Send Another Brief
      if (btnSendAnother) {
        btnSendAnother.addEventListener('click', () => {
          if (form) {
            form.reset();
            form.style.display = 'flex';
          }
          if (successView) successView.style.display = 'none';
          if (receivedStamp) receivedStamp.classList.remove('slam');
          if (ticketStatusBadge) {
            ticketStatusBadge.textContent = 'Draft';
            ticketStatusBadge.classList.remove('sent');
          }
          now = new Date();
          yy = String(now.getFullYear()).slice(-2);
          mm = String(now.getMonth() + 1).padStart(2, '0');
          dd = String(now.getDate()).padStart(2, '0');
          randRef = Math.floor(1000 + Math.random() * 9000);
          currentRefCode = 'BRF-' + yy + mm + dd + '-' + randRef;
          if (ticketRef) ticketRef.textContent = currentRefCode;

          if (valClient) valClient.textContent = '—';
          if (valCompany) valCompany.textContent = '—';
          if (valReach) valReach.textContent = '—';
          if (valGoals) valGoals.textContent = 'Awaiting project description...';
          updateCompletion();
        });
      }

      // Initialize Completion
      updateCompletion();
    }

    function renderBarcode(seedString) {
      const svg = document.getElementById('barcodeSvg');
      const caption = document.getElementById('barcodeCaption');
      if (!svg) return;

      // Simple deterministic hash pattern for barcodes
      let hash = 0;
      for (let i = 0; i < seedString.length; i++) {
        hash = (hash << 5) - hash + seedString.charCodeAt(i);
        hash |= 0;
      }

      svg.innerHTML = '';
      let x = 4;
      let binaryPattern = '';

      for (let i = 0; i < 48; i++) {
        const bit = ((hash ^ (i * 9973)) >>> (i % 31)) & 1;
        const width = bit ? 3 : 1.5;
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', 0);
        rect.setAttribute('width', width);
        rect.setAttribute('height', 40);
        rect.setAttribute('fill', '#e8c468');
        rect.setAttribute('opacity', bit ? '0.9' : '0.45');
        svg.appendChild(rect);
        x += width + (i % 2 === 0 ? 2 : 3);
        binaryPattern += bit ? '|' : ' ';
      }

      if (caption) {
        caption.textContent = seedString.toUpperCase().slice(0, 24);
      }
    }

    /* ==========================================================================
       9. GOLD CONFETTI BURST
       ========================================================================== */
    function launchGoldConfetti() {
      const canvas = document.getElementById('confettiCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = [];
      const colors = ['#e8c468', '#f8e19a', '#a87d22', '#ffffff', '#ffd700'];

      for (let i = 0; i < 120; i++) {
        particles.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * 300,
          y: canvas.height * 0.65,
          vx: (Math.random() - 0.5) * 16,
          vy: -(Math.random() * 18 + 8),
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 14,
          gravity: 0.45,
          opacity: 1
        });
      }

      function updateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;

        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.rotation += p.rotSpeed;
          p.opacity -= 0.009;

          if (p.opacity > 0) {
            active = true;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            ctx.restore();
          }
        });

        if (active) {
          requestAnimationFrame(updateConfetti);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      updateConfetti();
    }