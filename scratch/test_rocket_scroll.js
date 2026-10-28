const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testRocket() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const profileDir = path.join(__dirname, 'chrome_profile_rocket2');
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9226',
    '--window-size=1920,1080',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + profileDir
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9226/json/list');
    const pages = await listRes.json();
    const pageObj = pages.find(p => p.type === 'page') || pages[0];
    const wsUrl = pageObj.webSocketDebuggerUrl;

    const ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

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

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Page.navigate', { url: 'http://localhost:3000' });
    console.log('Navigating to http://localhost:3000 ...');
    await new Promise(r => setTimeout(r, 3500));

    async function evalCode(expr) {
      const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
      return res.result ? res.result.value : null;
    }

    async function checkSection(sectionId, filename, label) {
      await evalCode(`
        const target = document.getElementById('` + sectionId + `');
        if (window.lenis && target) {
          window.lenis.scrollTo(target, { immediate: true });
        } else if (target) {
          target.scrollIntoView();
        }
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.update();
        }
      `);
      await new Promise(r => setTimeout(r, 1500));

      const secInfo = await evalCode(`
        (() => {
          const stage = document.getElementById('rocketScrollStage');
          const phase = document.getElementById('rocketTelemetryPhase');
          const alt = document.getElementById('rocketAltitudeVal');
          const bar = document.getElementById('rocketTelemetryProgress');
          return {
            scrollY: Math.round(window.scrollY),
            stageOpacity: stage ? window.getComputedStyle(stage).opacity : null,
            stageVisibility: stage ? window.getComputedStyle(stage).visibility : null,
            phase: phase ? phase.textContent : null,
            alt: alt ? alt.textContent : null,
            progressWidth: bar ? bar.style.width : null
          };
        })()
      `);
      console.log('=== ' + label + ' ===', secInfo);

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const shotPath = path.join(__dirname, filename);
      fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
      console.log('Screenshot written to:', filename);
    }

    // Test Section 3: Awards
    await checkSection('awards', 'rocket_test_01_awards.png', 'Section 3: Awards');

    // Test Section 4: Trust
    await checkSection('trust', 'rocket_test_02_trust.png', 'Section 4: Trust');

    // Test Section 5: Services
    await checkSection('services', 'rocket_test_03_services.png', 'Section 5: Services');

    // Test Section 6: Industries
    await checkSection('industries', 'rocket_test_04_industries.png', 'Section 6: Industries');

    ws.close();
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    try {
      chromeProcess.kill();
    } catch(e) {}
  }
}

testRocket();
