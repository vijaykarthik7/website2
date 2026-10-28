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

  console.log('Waiting for page load...');
  await sleep(2500);

  const checkAssistant = await send('Runtime.evaluate', {
    expression: `(() => {
      const assistant = document.getElementById('assistant');
      const demoSection = document.querySelector('.section-interactive-demo');
      const estimator = document.getElementById('estimator');
      const contact = document.getElementById('contact');
      return {
        hasAssistantId: !!assistant,
        hasInteractiveDemoClass: !!demoSection,
        estimatorTop: estimator?.offsetTop,
        contactTop: contact?.offsetTop,
        estimatorNextSiblingTag: estimator?.nextElementSibling?.tagName,
        estimatorNextSiblingId: estimator?.nextElementSibling?.id
      };
    })()`,
    returnByValue: true
  });

  console.log('DOM Check Result:', checkAssistant.result.value);

  // Scroll to estimator and bottom of estimator to view seamless transition to contact
  await send('Runtime.evaluate', {
    expression: `(() => {
      const est = document.getElementById('estimator');
      if (est) {
        window.scrollTo({ top: est.offsetTop + est.offsetHeight - 400, behavior: 'instant' });
      }
    })()`
  });

  await sleep(1000);

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  const shotPath = path.join(__dirname, 'verified_no_assistant.png');
  fs.writeFileSync(shotPath, Buffer.from(screenshot.data, 'base64'));
  console.log('Screenshot saved to:', shotPath);

  // Copy to brain artifacts
  const artifactDest = 'C:\\Users\\vijay\\.gemini\\antigravity-ide\\brain\\2e6b3d44-ba1b-4cbd-a276-742fd5401624\\verified_no_assistant.png';
  fs.copyFileSync(shotPath, artifactDest);
  console.log('Copied to artifact dir:', artifactDest);

  ws.close();
  chromeProcess.kill();
  console.log('Done!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
