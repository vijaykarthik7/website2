const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(__dirname, 'chrome_profile_verify_removal');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9224',
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
      const res = await fetch('http://127.0.0.1:9224/json');
      const tabs = await res.json();
      const pageTab = tabs.find((t) => t.type === 'page');
      if (pageTab && pageTab.webSocketDebuggerUrl) {
        cdpUrl = pageTab.webSocketDebuggerUrl;
        break;
      }
    } catch (e) {}
  }

  if (!cdpUrl) {
    console.error('Could not connect to CDP');
    chromeProcess.kill();
    process.exit(1);
  }

  const ws = new globalThis.WebSocket(cdpUrl);
  let msgId = 1;
  const pending = new Map();
  const consoleErrors = [];

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'Runtime.consoleAPICalled' && data.params.type === 'error') {
      consoleErrors.push(data.params.args.map((a) => a.value || a.description).join(' '));
    }
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

  await sleep(3000);

  // 1. Verify DOM absence of removed sections
  const domCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const hasEco = !!document.getElementById('techEcosystem');
      const hasClients = !!document.getElementById('clients');
      const ecoClass = !!document.querySelector('.section-tech-ecosystem');
      const clientsClass = !!document.querySelector('.section-clients');
      return { hasEco, hasClients, ecoClass, clientsClass };
    })()`,
    returnByValue: true
  });
  console.log('DOM Check (should all be false):', domCheck.result.value);

  // 2. Test Estimator Section with Handani
  console.log('--- Testing Estimator Section ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const est = document.getElementById('estimator');
      if (est) est.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`
  });
  await sleep(1500);

  const estState = await send('Runtime.evaluate', {
    expression: `(() => {
      const handani = document.getElementById('handaniScrollStage');
      const lapp = document.getElementById('lappScrollStage');
      const earth = document.getElementById('earthScrollStage');
      const hStyle = window.getComputedStyle(handani);
      const lStyle = window.getComputedStyle(lapp);
      const eStyle = window.getComputedStyle(earth);
      const hPhase = document.getElementById('handaniTelemetryPhase')?.textContent;
      const hProg = document.getElementById('handaniTelemetryProgress')?.style.width;

      return {
        handaniOpacity: hStyle.opacity,
        handaniVisibility: hStyle.visibility,
        lappOpacity: lStyle.opacity,
        earthOpacity: eStyle.opacity,
        handaniPhase: hPhase,
        handaniProgress: hProg
      };
    })()`,
    returnByValue: true
  });
  console.log('Estimator State:', estState.result.value);

  const shotEst = await send('Page.captureScreenshot', { format: 'png' });
  const pEst = path.join(__dirname, 'verify_after_removal_estimator.png');
  fs.writeFileSync(pEst, Buffer.from(shotEst.data, 'base64'));
  fs.copyFileSync(pEst, 'C:\\Users\\vijay\\.gemini\\antigravity-ide\\brain\\2e6b3d44-ba1b-4cbd-a276-742fd5401624\\verify_after_removal_estimator.png');

  // 3. Test Contact Section with Lapp
  console.log('--- Testing Contact Section ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const contact = document.getElementById('contact');
      if (contact) contact.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`
  });
  await sleep(1500);

  const contactState = await send('Runtime.evaluate', {
    expression: `(() => {
      const handani = document.getElementById('handaniScrollStage');
      const lapp = document.getElementById('lappScrollStage');
      const lStyle = window.getComputedStyle(lapp);
      const hStyle = window.getComputedStyle(handani);
      const lPhase = document.getElementById('lappTelemetryPhase')?.textContent;
      const lProg = document.getElementById('lappTelemetryProgress')?.style.width;

      return {
        lappOpacity: lStyle.opacity,
        lappVisibility: lStyle.visibility,
        handaniOpacity: hStyle.opacity,
        lappPhase: lPhase,
        lappProgress: lProg
      };
    })()`,
    returnByValue: true
  });
  console.log('Contact State:', contactState.result.value);

  const shotContact = await send('Page.captureScreenshot', { format: 'png' });
  const pContact = path.join(__dirname, 'verify_after_removal_contact.png');
  fs.writeFileSync(pContact, Buffer.from(shotContact.data, 'base64'));
  fs.copyFileSync(pContact, 'C:\\Users\\vijay\\.gemini\\antigravity-ide\\brain\\2e6b3d44-ba1b-4cbd-a276-742fd5401624\\verify_after_removal_contact.png');

  // 4. Test Footer Section
  console.log('--- Testing Footer Section ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const footer = document.querySelector('.footer');
      if (footer) footer.scrollIntoView({ behavior: 'instant', block: 'end' });
    })()`
  });
  await sleep(1500);

  const footerState = await send('Runtime.evaluate', {
    expression: `(() => {
      const footer = document.querySelector('.footer');
      const lapp = document.getElementById('lappScrollStage');
      const fStyle = window.getComputedStyle(footer);
      const lStyle = window.getComputedStyle(lapp);
      return {
        footerBg: fStyle.backgroundColor,
        lappOpacity: lStyle.opacity,
        lappVisibility: lStyle.visibility
      };
    })()`,
    returnByValue: true
  });
  console.log('Footer State:', footerState.result.value);

  const shotFooter = await send('Page.captureScreenshot', { format: 'png' });
  const pFooter = path.join(__dirname, 'verify_after_removal_footer.png');
  fs.writeFileSync(pFooter, Buffer.from(shotFooter.data, 'base64'));
  fs.copyFileSync(pFooter, 'C:\\Users\\vijay\\.gemini\\antigravity-ide\\brain\\2e6b3d44-ba1b-4cbd-a276-742fd5401624\\verify_after_removal_footer.png');

  console.log('Console errors:', consoleErrors);

  ws.close();
  chromeProcess.kill();
  console.log('All verification checks complete!');
}

main().catch(console.error);
