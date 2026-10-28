const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function captureGuardian() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + path.join(__dirname, 'chrome_profile')
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9222/json/list');
    const pages = await listRes.json();
    let wsUrl = pages.length > 0 ? pages[0].webSocketDebuggerUrl : null;
    
    if (!wsUrl) {
      const newRes = await fetch('http://127.0.0.1:9222/json/new');
      const newPage = await newRes.json();
      wsUrl = newPage.webSocketDebuggerUrl;
    }

    const ws = new WebSocket(wsUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
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
    console.log('Navigated, waiting 3s for page load...');
    await new Promise(r => setTimeout(r, 3000));

    // Scroll directly to guardian section
    await send('Runtime.evaluate', {
      expression: `
        const sec = document.getElementById('guardian');
        if (sec) {
          const top = sec.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: top - 20, behavior: 'instant' });
          if (window.lenis) window.lenis.scrollTo(top - 20, { immediate: true });
        }
      `
    });

    await new Promise(r => setTimeout(r, 1200));

    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    const outPath = path.join(__dirname, 'guardian_redesigned_view.png');
    fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
    console.log('Saved screenshot of redesigned guardian section to:', outPath);

    ws.close();
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    try { chromeProcess.kill(); } catch (e) {}
  }
}

captureGuardian();
