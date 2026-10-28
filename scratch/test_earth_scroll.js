const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testEarth() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const profileDir = path.join(__dirname, 'chrome_profile_earth');
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9240',
    '--window-size=1920,1080',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + profileDir
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9240/json/list');
    const pages = await listRes.json();
    const pageObj = pages.find(p => p.type === 'page');
    const wsUrl = pageObj.webSocketDebuggerUrl;

    const ws = new WebSocket(wsUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const reqId = id++;
        const handler = (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.id === reqId) {
            ws.removeEventListener('message', handler);
            resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: reqId, method, params }));
      });
    }

    const consoleErrors = [];
    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        consoleErrors.push(msg.params.args.map(a => a.value).join(' '));
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        consoleErrors.push('EXCEPTION: ' + JSON.stringify(msg.params.exceptionDetails));
      }
    });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Page.navigate', { url: 'http://localhost:3000' });
    console.log('Navigating to http://localhost:3000 ...');
    await new Promise(r => setTimeout(r, 3500));

    async function evalCode(expr) {
      const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
      return res.result ? res.result.value : null;
    }

    const initStatus = await evalCode(`
      (() => {
        const eStage = document.getElementById('earthScrollStage');
        const eCanvas = document.getElementById('earthCanvas');
        const rStage = document.getElementById('rocketScrollStage');
        const vStage = document.getElementById('videoHeroStage');
        const ind = document.getElementById('industries');
        const guard = document.getElementById('guardian');
        const port = document.getElementById('portfolio');
        return {
          hasEarthStage: !!eStage,
          hasEarthCanvas: !!eCanvas,
          hasRocketStage: !!rStage,
          hasVideoHeroStage: !!vStage,
          earthOpacity: eStage ? window.getComputedStyle(eStage).opacity : null,
          earthVisibility: eStage ? window.getComputedStyle(eStage).visibility : null,
          indTop: ind ? ind.offsetTop : null,
          guardTop: guard ? guard.offsetTop : null,
          portTop: port ? port.offsetTop : null
        };
      })()
    `);
    console.log('Initial Status at Top:', initStatus);
    console.log('Console Errors:', consoleErrors);

    async function checkScroll(targetY, filename, label) {
      await evalCode(`
        if (window.lenis) {
          window.lenis.scrollTo(` + targetY + `, { immediate: true });
        } else {
          window.scrollTo(0, ` + targetY + `);
        }
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
      `);
      await new Promise(r => setTimeout(r, 1400));

      const status = await evalCode(`
        (() => {
          const eStage = document.getElementById('earthScrollStage');
          const rStage = document.getElementById('rocketScrollStage');
          const phase = document.getElementById('earthTelemetryPhase');
          const coords = document.getElementById('earthCoordinatesVal');
          const bar = document.getElementById('earthTelemetryProgress');
          return {
            scrollY: Math.round(window.scrollY),
            earthOpacity: eStage ? window.getComputedStyle(eStage).opacity : null,
            earthVisibility: eStage ? window.getComputedStyle(eStage).visibility : null,
            rocketOpacity: rStage ? window.getComputedStyle(rStage).opacity : null,
            phase: phase ? phase.textContent : null,
            coords: coords ? coords.textContent : null,
            progress: bar ? bar.style.width : null
          };
        })()
      `);
      console.log('=== ' + label + ' (target ' + targetY + ') ===', status);

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(__dirname, filename), Buffer.from(shot.data, 'base64'));
      console.log('Saved screenshot:', filename);
    }

    // 1. Industries (Section 6)
    await checkScroll(initStatus.indTop + 80, 'earth_01_industries.png', 'Section 6: Industries');

    // 2. Guardian (Section 7)
    await checkScroll(initStatus.guardTop + 100, 'earth_02_guardian.png', 'Section 7: Guardian Platform');

    // 3. Portfolio (Section 8)
    await checkScroll(initStatus.portTop + 120, 'earth_03_portfolio.png', 'Section 8: Portfolio');

    // 4. Section 9 Tech Ecosystem (Should fade out)
    const techTop = await evalCode(`document.querySelector('.section-tech-ecosystem')?.offsetTop`);
    if (techTop) {
      await checkScroll(techTop + 100, 'earth_04_exit.png', 'Section 9: Tech Ecosystem (Fade out)');
    }

    ws.close();
  } catch(e) {
    console.error(e);
  } finally {
    chromeProcess.kill();
  }
}

testEarth();
