const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testHandani3Sections() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const profileDir = path.join(__dirname, 'chrome_profile_handani3');
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9260',
    '--window-size=1920,1080',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + profileDir
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9260/json/list');
    const pages = await listRes.json();
    const pageObj = pages.find(p => p.type === 'page');
    const ws = new WebSocket(pageObj.webSocketDebuggerUrl);
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
    await send('Page.navigate', { url: 'http://localhost:3000/' });
    await new Promise(r => setTimeout(r, 3500));

    // 1. Section 9: Tech Ecosystem
    console.log('--- TEST 1: Section 9 (Tech Ecosystem) ---');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('techEcosystem');
          if (window.lenis && el) window.lenis.scrollTo(el, { immediate: true });
          window.dispatchEvent(new Event('scroll'));
          if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 1200));
    let shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/handani_3s_01_ecosystem.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/handani_3s_01_ecosystem.png');

    // 2. Section 10: Client Logos
    console.log('--- TEST 2: Section 10 (Clients) ---');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('clients');
          if (window.lenis && el) window.lenis.scrollTo(el, { immediate: true });
          window.dispatchEvent(new Event('scroll'));
          if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 1200));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/handani_3s_02_clients.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/handani_3s_02_clients.png');

    // 3. Section 11: Estimator (The 3rd Section!)
    console.log('--- TEST 3: Section 11 (Estimator) ---');
    const estState = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('estimator');
          if (window.lenis && el) window.lenis.scrollTo(el, { immediate: true });
          window.dispatchEvent(new Event('scroll'));
          if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
          const stage = document.getElementById('handaniScrollStage');
          return {
            scrollY: window.scrollY,
            handaniOpacity: stage ? window.getComputedStyle(stage).opacity : null,
            handaniVisibility: stage ? window.getComputedStyle(stage).visibility : null,
            phaseText: document.getElementById('handaniTelemetryPhase') ? document.getElementById('handaniTelemetryPhase').textContent : null,
            nodesText: document.getElementById('handaniNodesVal') ? document.getElementById('handaniNodesVal').textContent : null,
            progressWidth: document.getElementById('handaniTelemetryProgress') ? document.getElementById('handaniTelemetryProgress').style.width : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Estimator state:', estState.result.value);

    await new Promise(r => setTimeout(r, 1200));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/handani_3s_03_estimator.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/handani_3s_03_estimator.png');

    // 4. Section 12: Assistant Exit
    console.log('--- TEST 4: Section 12 (Assistant Exit) ---');
    const exitState = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('assistant');
          if (window.lenis && el) window.lenis.scrollTo(el, { immediate: true });
          window.dispatchEvent(new Event('scroll'));
          if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
          const stage = document.getElementById('handaniScrollStage');
          return {
            scrollY: window.scrollY,
            handaniOpacity: stage ? window.getComputedStyle(stage).opacity : null,
            handaniVisibility: stage ? window.getComputedStyle(stage).visibility : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Assistant exit state:', exitState.result.value);

    await new Promise(r => setTimeout(r, 800));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/handani_3s_04_exit.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/handani_3s_04_exit.png');

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    chromeProcess.kill();
  }
}

testHandani3Sections();
