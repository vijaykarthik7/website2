const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testScroll() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const profileDir = path.join(__dirname, 'chrome_profile_scroll');
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9232',
    '--window-size=1920,1080',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + profileDir
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9232/json/list');
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

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise(r => setTimeout(r, 3500));

    async function evalCode(expr) {
      const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
      return res.result ? res.result.value : null;
    }

    const testOffsets = await evalCode(`
      (() => {
        const awards = document.getElementById('awards');
        const trust = document.getElementById('trust');
        const services = document.getElementById('services');
        const industries = document.getElementById('industries');
        return {
          awardsY: awards ? awards.offsetTop : null,
          trustY: trust ? trust.offsetTop : null,
          servicesY: services ? services.offsetTop : null,
          industriesY: industries ? industries.offsetTop : null,
          bodyH: document.body.scrollHeight
        };
      })()
    `);
    console.log('Offsets:', testOffsets);

    async function checkScroll(targetY, name) {
      await evalCode(`
        if (window.lenis) {
          window.lenis.scrollTo(` + targetY + `, { immediate: true });
        } else {
          window.scrollTo(0, ` + targetY + `);
        }
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
      `);
      await new Promise(r => setTimeout(r, 1200));

      const status = await evalCode(`
        (() => {
          const stage = document.getElementById('rocketScrollStage');
          const phase = document.getElementById('rocketTelemetryPhase');
          const alt = document.getElementById('rocketAltitudeVal');
          const bar = document.getElementById('rocketTelemetryProgress');
          return {
            scrollY: Math.round(window.scrollY),
            opacity: stage ? window.getComputedStyle(stage).opacity : null,
            visibility: stage ? window.getComputedStyle(stage).visibility : null,
            phase: phase ? phase.textContent : null,
            alt: alt ? alt.textContent : null,
            progress: bar ? bar.style.width : null
          };
        })()
      `);
      console.log('Scroll to ' + name + ' (target ' + targetY + '):', status);

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(__dirname, 'capture_' + name + '.png'), Buffer.from(shot.data, 'base64'));
    }

    await checkScroll(testOffsets.awardsY, '01_awards');
    await checkScroll(testOffsets.trustY, '02_trust');
    await checkScroll(testOffsets.servicesY, '03_services');
    await checkScroll(testOffsets.industriesY + 100, '04_industries');

    ws.close();
  } catch(e) {
    console.error(e);
  } finally {
    chromeProcess.kill();
  }
}

testScroll();
