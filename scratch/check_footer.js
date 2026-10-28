const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(__dirname, 'chrome_profile_footer_check');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9223',
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
      const res = await fetch('http://127.0.0.1:9223/json');
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

  await sleep(3000);

  // Scroll exactly so footer fills the bottom of the screen or footer is centered
  const inspectRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const footer = document.querySelector('.footer');
      footer.scrollIntoView({ behavior: 'instant', block: 'end' });
      const fStyle = window.getComputedStyle(footer);
      const lapp = document.getElementById('lappScrollStage');
      const lappHud = document.getElementById('lappTelemetryHud');
      const lStyle = window.getComputedStyle(lapp);
      const contact = document.getElementById('contact');
      const cRect = contact.getBoundingClientRect();
      const fRect = footer.getBoundingClientRect();

      return {
        footerBg: fStyle.backgroundColor,
        footerZIndex: fStyle.zIndex,
        footerRect: { top: fRect.top, bottom: fRect.bottom, height: fRect.height },
        contactRect: { top: cRect.top, bottom: cRect.bottom },
        lappOpacity: lStyle.opacity,
        lappVisibility: lStyle.visibility,
        lappZIndex: lStyle.zIndex,
        scrollY: window.scrollY,
        maxScroll: document.documentElement.scrollHeight - window.innerHeight
      };
    })()`,
    returnByValue: true
  });

  console.log('Inspection:', JSON.stringify(inspectRes.result.value, null, 2));

  // Take a full viewport screenshot when scrolled to bottom
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const p = path.join(__dirname, 'exact_footer_view.png');
  fs.writeFileSync(p, Buffer.from(shot.data, 'base64'));
  fs.copyFileSync(p, 'C:\\Users\\vijay\\.gemini\\antigravity-ide\\brain\\2e6b3d44-ba1b-4cbd-a276-742fd5401624\\exact_footer_view.png');
  console.log('Saved exact_footer_view.png');

  ws.close();
  chromeProcess.kill();
}

main().catch(console.error);
