const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(__dirname, 'chrome_profile_verify_handani_contact');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9227',
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
      const res = await fetch('http://127.0.0.1:9227/json');
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

  console.log('Waiting for preloader to finish...');
  await send('Runtime.evaluate', {
    expression: `new Promise((resolve) => {
      const check = () => {
        const p = document.getElementById('riyadviPreloader');
        if (!p || p.classList.contains('preloader-hidden') || window.getComputedStyle(p).display === 'none') {
          resolve(true);
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    })`,
    awaitPromise: true
  });
  await sleep(1000);

  // 1. Scroll to Estimator
  console.log('--- TEST 1: Estimator Section ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const est = document.getElementById('estimator');
      if (est) {
        window.scrollTo({ top: est.offsetTop + 100, behavior: 'instant' });
        window.dispatchEvent(new Event('scroll'));
      }
    })()`
  });
  await sleep(1500);

  const estState = await send('Runtime.evaluate', {
    expression: `(() => {
      const handani = document.getElementById('handaniScrollStage');
      const hStyle = window.getComputedStyle(handani);
      const phase = document.getElementById('handaniTelemetryPhase')?.textContent;
      const prog = document.getElementById('handaniTelemetryProgress')?.style.width;
      return {
        handaniOpacity: hStyle.opacity,
        handaniVisibility: hStyle.visibility,
        phase,
        prog
      };
    })()`,
    returnByValue: true
  });
  console.log('Estimator State:', estState.result.value);

  const shotEst = await send('Page.captureScreenshot', { format: 'png' });
  const pEst = path.join(__dirname, 'handani_section_estimator.png');
  fs.writeFileSync(pEst, Buffer.from(shotEst.data, 'base64'));
  fs.copyFileSync(pEst, 'C:\\Users\\vijay\\.gemini\\antigravity-ide\\brain\\2e6b3d44-ba1b-4cbd-a276-742fd5401624\\handani_section_estimator.png');

  // 2. Scroll to Contact Section
  console.log('--- TEST 2: Contact Section ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const contact = document.getElementById('contact');
      if (contact) {
        window.scrollTo({ top: contact.offsetTop + 150, behavior: 'instant' });
        window.dispatchEvent(new Event('scroll'));
      }
    })()`
  });
  await sleep(1500);

  const contactState = await send('Runtime.evaluate', {
    expression: `(() => {
      const handani = document.getElementById('handaniScrollStage');
      const hStyle = window.getComputedStyle(handani);
      const phase = document.getElementById('handaniTelemetryPhase')?.textContent;
      const prog = document.getElementById('handaniTelemetryProgress')?.style.width;
      return {
        handaniOpacity: hStyle.opacity,
        handaniVisibility: hStyle.visibility,
        phase,
        prog
      };
    })()`,
    returnByValue: true
  });
  console.log('Contact State:', contactState.result.value);

  const shotContact = await send('Page.captureScreenshot', { format: 'png' });
  const pContact = path.join(__dirname, 'handani_section_contact.png');
  fs.writeFileSync(pContact, Buffer.from(shotContact.data, 'base64'));
  fs.copyFileSync(pContact, 'C:\\Users\\vijay\\.gemini\\antigravity-ide\\brain\\2e6b3d44-ba1b-4cbd-a276-742fd5401624\\handani_section_contact.png');

  // 3. Scroll to Footer Section
  console.log('--- TEST 3: Footer Section ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const footer = document.querySelector('.footer');
      if (footer) {
        footer.scrollIntoView({ behavior: 'instant', block: 'end' });
        window.dispatchEvent(new Event('scroll'));
      }
    })()`
  });
  await sleep(1500);

  const footerState = await send('Runtime.evaluate', {
    expression: `(() => {
      const footer = document.querySelector('.footer');
      const fStyle = window.getComputedStyle(footer);
      const handani = document.getElementById('handaniScrollStage');
      const hStyle = window.getComputedStyle(handani);
      return {
        footerBg: fStyle.backgroundColor,
        handaniOpacity: hStyle.opacity,
        handaniVisibility: hStyle.visibility
      };
    })()`,
    returnByValue: true
  });
  console.log('Footer State:', footerState.result.value);

  const shotFooter = await send('Page.captureScreenshot', { format: 'png' });
  const pFooter = path.join(__dirname, 'handani_section_footer.png');
  fs.writeFileSync(pFooter, Buffer.from(shotFooter.data, 'base64'));
  fs.copyFileSync(pFooter, 'C:\\Users\\vijay\\.gemini\\antigravity-ide\\brain\\2e6b3d44-ba1b-4cbd-a276-742fd5401624\\handani_section_footer.png');

  console.log('Console errors:', consoleErrors);

  ws.close();
  chromeProcess.kill();
  console.log('All tests completed successfully!');
}

main().catch(console.error);
