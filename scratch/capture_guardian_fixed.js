const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function capture() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const profileDir = path.join(__dirname, 'chrome_profile_guardian');
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9228',
    '--window-size=1920,1080',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + profileDir
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9228/json/list');
    const pages = await listRes.json();
    let wsUrl = pages[0].webSocketDebuggerUrl;

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
    console.log('Page navigating...');
    await new Promise(r => setTimeout(r, 3500));

    // Scroll to guardian
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('guardian');
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      `
    });
    await new Promise(r => setTimeout(r, 1000));

    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    const outPath = path.join(__dirname, 'guardian_new_screenshot.png');
    fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
    console.log('Successfully captured screenshot:', outPath);

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    try { chromeProcess.kill(); } catch (e) {}
  }
}

capture();
