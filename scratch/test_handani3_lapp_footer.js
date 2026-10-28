const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(__dirname, 'chrome_profile_footer_lapp');

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

  console.log('Waiting for page and frame preloading...');
  await sleep(3000);

  // TEST 1: Section 11 (Estimator) - Should have Handani active, Lapp inactive
  console.log('--- TEST 1: Section 11 (Estimator) ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const est = document.getElementById('estimator');
      if (est) window.scrollTo({ top: est.offsetTop + 100, behavior: 'instant' });
    })()`
  });
  await sleep(1500);

  const estState = await send('Runtime.evaluate', {
    expression: `(() => {
      const lapp = document.getElementById('lappScrollStage');
      const handani = document.getElementById('handaniScrollStage');
      const hPhase = document.getElementById('handaniTelemetryPhase');
      const hProg = document.getElementById('handaniTelemetryProgress');
      return {
        handaniOpacity: handani?.style.opacity,
        handaniVisibility: handani?.style.visibility,
        lappOpacity: lapp?.style.opacity,
        lappVisibility: lapp?.style.visibility,
        handaniPhase: hPhase?.textContent,
        handaniProgress: hProg?.style.width
      };
    })()`,
    returnByValue: true
  });
  console.log('Estimator state:', estState.result.value);

  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  const p1 = path.join(__dirname, 'verify_01_estimator_handani.png');
  fs.writeFileSync(p1, Buffer.from(shot1.data, 'base64'));
  fs.copyFileSync(p1, 'C:\\Users\\vijay\\.gemini\\antigravity-ide\\brain\\2e6b3d44-ba1b-4cbd-a276-742fd5401624\\verify_01_estimator_handani.png');
  console.log('Saved Estimator shot');

  // TEST 2: Section 12 (Contact - section before footer) - Should have Lapp active, Handani inactive
  console.log('--- TEST 2: Section 12 (Contact) ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const contact = document.getElementById('contact');
      if (contact) window.scrollTo({ top: contact.offsetTop + 100, behavior: 'instant' });
    })()`
  });
  await sleep(1500);

  const contactState = await send('Runtime.evaluate', {
    expression: `(() => {
      const lapp = document.getElementById('lappScrollStage');
      const handani = document.getElementById('handaniScrollStage');
      const lPhase = document.getElementById('lappTelemetryPhase');
      const lProg = document.getElementById('lappTelemetryProgress');
      return {
        handaniOpacity: handani?.style.opacity,
        lappOpacity: lapp?.style.opacity,
        lappVisibility: lapp?.style.visibility,
        lappPhase: lPhase?.textContent,
        lappProgress: lProg?.style.width
      };
    })()`,
    returnByValue: true
  });
  console.log('Contact state:', contactState.result.value);

  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  const p2 = path.join(__dirname, 'verify_02_contact_lapp.png');
  fs.writeFileSync(p2, Buffer.from(shot2.data, 'base64'));
  fs.copyFileSync(p2, 'C:\\Users\\vijay\\.gemini\\antigravity-ide\\brain\\2e6b3d44-ba1b-4cbd-a276-742fd5401624\\verify_02_contact_lapp.png');
  console.log('Saved Contact shot');

  // TEST 3: Footer Section - Should have Lapp active with AI robot manifested
  console.log('--- TEST 3: Footer Section ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const footer = document.getElementById('footer');
      if (footer) window.scrollTo({ top: footer.offsetTop + 100, behavior: 'instant' });
    })()`
  });
  await sleep(1500);

  const footerState = await send('Runtime.evaluate', {
    expression: `(() => {
      const lapp = document.getElementById('lappScrollStage');
      const handani = document.getElementById('handaniScrollStage');
      const lPhase = document.getElementById('lappTelemetryPhase');
      const lProg = document.getElementById('lappTelemetryProgress');
      return {
        handaniOpacity: handani?.style.opacity,
        lappOpacity: lapp?.style.opacity,
        lappVisibility: lapp?.style.visibility,
        lappPhase: lPhase?.textContent,
        lappProgress: lProg?.style.width
      };
    })()`,
    returnByValue: true
  });
  console.log('Footer state:', footerState.result.value);

  const shot3 = await send('Page.captureScreenshot', { format: 'png' });
  const p3 = path.join(__dirname, 'verify_03_footer_lapp.png');
  fs.writeFileSync(p3, Buffer.from(shot3.data, 'base64'));
  fs.copyFileSync(p3, 'C:\\Users\\vijay\\.gemini\\antigravity-ide\\brain\\2e6b3d44-ba1b-4cbd-a276-742fd5401624\\verify_03_footer_lapp.png');
  console.log('Saved Footer shot');

  ws.close();
  chromeProcess.kill();
  console.log('All tests completed successfully!');
}

main().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
