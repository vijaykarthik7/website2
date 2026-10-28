const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testHandani() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const profileDir = path.join(__dirname, 'chrome_profile_handani');
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9250',
    '--window-size=1920,1080',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + profileDir
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9250/json/list');
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
    await send('Page.navigate', { url: 'http://localhost:3000/' });
    await new Promise(r => setTimeout(r, 3500));

    // Test 1: Scroll to Section 9 (.section-tech-ecosystem / #techEcosystem)
    console.log('--- TEST 1: Section 9 (Tech Ecosystem) ---');
    const ecoState = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const eco = document.getElementById('techEcosystem');
          if (window.lenis && eco) {
            window.lenis.scrollTo(eco, { immediate: true });
          } else if (eco) {
            eco.scrollIntoView({ behavior: 'instant' });
          }
          window.dispatchEvent(new Event('scroll'));
          if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
          const stage = document.getElementById('handaniScrollStage');
          const earth = document.getElementById('earthScrollStage');
          return {
            scrollY: window.scrollY,
            handaniOpacity: stage ? window.getComputedStyle(stage).opacity : null,
            handaniVisibility: stage ? window.getComputedStyle(stage).visibility : null,
            earthOpacity: earth ? window.getComputedStyle(earth).opacity : null,
            phaseText: document.getElementById('handaniTelemetryPhase') ? document.getElementById('handaniTelemetryPhase').textContent : null,
            nodesText: document.getElementById('handaniNodesVal') ? document.getElementById('handaniNodesVal').textContent : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Tech Ecosystem state:', ecoState.result.value);

    await new Promise(r => setTimeout(r, 1200));
    let shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/handani_01_ecosystem.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/handani_01_ecosystem.png');

    // Test 2: Scroll to Section 10 (.section-clients / #clients)
    console.log('--- TEST 2: Section 10 (Clients) ---');
    const cliState = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const cli = document.getElementById('clients');
          if (window.lenis && cli) {
            window.lenis.scrollTo(cli, { immediate: true });
          } else if (cli) {
            cli.scrollIntoView({ behavior: 'instant' });
          }
          window.dispatchEvent(new Event('scroll'));
          if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
          const stage = document.getElementById('handaniScrollStage');
          return {
            scrollY: window.scrollY,
            handaniOpacity: stage ? window.getComputedStyle(stage).opacity : null,
            phaseText: document.getElementById('handaniTelemetryPhase') ? document.getElementById('handaniTelemetryPhase').textContent : null,
            nodesText: document.getElementById('handaniNodesVal') ? document.getElementById('handaniNodesVal').textContent : null,
            progressWidth: document.getElementById('handaniTelemetryProgress') ? document.getElementById('handaniTelemetryProgress').style.width : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Clients state:', cliState.result.value);

    await new Promise(r => setTimeout(r, 1200));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/handani_02_clients.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/handani_02_clients.png');

    // Test 3: Scroll past to Section 11 (#estimator)
    console.log('--- TEST 3: Section 11 (Estimator Exit) ---');
    const exitState = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const est = document.getElementById('estimator');
          if (window.lenis && est) {
            window.lenis.scrollTo(est, { immediate: true });
          } else if (est) {
            est.scrollIntoView({ behavior: 'instant' });
          }
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
    console.log('Estimator exit state:', exitState.result.value);

    await new Promise(r => setTimeout(r, 800));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/handani_03_exit.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/handani_03_exit.png');

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    chromeProcess.kill();
  }
}

testHandani();
