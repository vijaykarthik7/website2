const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(__dirname, 'chrome_profile_lapp');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${userDataDir}`,
    '--window-size=1920,1080',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:3000/'
  ]);

  let cdpUrl = null;
  for (let i = 0; i < 30; i++) {
    await sleep(400);
    try {
      const res = await fetch('http://127.0.0.1:9222/json');
      const tabs = await res.json();
      const pageTab = tabs.find((t) => t.type === 'page');
      if (pageTab && pageTab.webSocketDebuggerUrl) {
        cdpUrl = pageTab.webSocketDebuggerUrl;
        break;
      }
    } catch (e) {
      // retry
    }
  }

  if (!cdpUrl) {
    console.error('Could not connect to CDP');
    chromeProcess.kill();
    process.exit(1);
  }

  console.log('Connected to CDP at:', cdpUrl);
  const ws = new globalThis.WebSocket(cdpUrl);

  let msgId = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  await new Promise((res) => (ws.onopen = res));

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');

  console.log('Waiting for page and initial frame load...');
  await sleep(3000);

  // 1. Test Section 11: Estimator
  console.log('--- TEST 1: Section 11 (Estimator) ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const est = document.getElementById('estimator');
      if (est) {
        window.scrollTo({ top: est.offsetTop + 100, behavior: 'instant' });
      }
    })()`
  });
  await sleep(1500);

  const estState = await send('Runtime.evaluate', {
    expression: `(() => {
      const lapp = document.getElementById('lappScrollStage');
      const handani = document.getElementById('handaniScrollStage');
      const phase = document.getElementById('lappTelemetryPhase');
      const prog = document.getElementById('lappTelemetryProgress');
      return {
        lappOpacity: lapp?.style.opacity,
        lappVisibility: lapp?.style.visibility,
        handaniOpacity: handani?.style.opacity,
        phaseText: phase?.textContent,
        progressWidth: prog?.style.width
      };
    })()`,
    returnByValue: true
  });
  console.log('Estimator state:', estState.result.value);

  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  const p1 = path.join(__dirname, 'lapp_01_estimator.png');
  fs.writeFileSync(p1, Buffer.from(shot1.data, 'base64'));
  fs.copyFileSync(p1, 'C:\\Users\\vijay\\.gemini\\antigravity-ide\\brain\\2e6b3d44-ba1b-4cbd-a276-742fd5401624\\lapp_01_estimator.png');
  console.log('Saved Estimator shot');

  // 2. Test Section 12: Contact
  console.log('--- TEST 2: Section 12 (Contact) ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const contact = document.getElementById('contact');
      if (contact) {
        window.scrollTo({ top: contact.offsetTop + 200, behavior: 'instant' });
      }
    })()`
  });
  await sleep(1500);

  const contactState = await send('Runtime.evaluate', {
    expression: `(() => {
      const lapp = document.getElementById('lappScrollStage');
      const handani = document.getElementById('handaniScrollStage');
      const phase = document.getElementById('lappTelemetryPhase');
      const prog = document.getElementById('lappTelemetryProgress');
      return {
        lappOpacity: lapp?.style.opacity,
        lappVisibility: lapp?.style.visibility,
        handaniOpacity: handani?.style.opacity,
        phaseText: phase?.textContent,
        progressWidth: prog?.style.width
      };
    })()`,
    returnByValue: true
  });
  console.log('Contact state:', contactState.result.value);

  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  const p2 = path.join(__dirname, 'lapp_02_contact.png');
  fs.writeFileSync(p2, Buffer.from(shot2.data, 'base64'));
  fs.copyFileSync(p2, 'C:\\Users\\vijay\\.gemini\\antigravity-ide\\brain\\2e6b3d44-ba1b-4cbd-a276-742fd5401624\\lapp_02_contact.png');
  console.log('Saved Contact shot');

  ws.close();
  chromeProcess.kill();
  console.log('All tests completed successfully!');
}

main().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
