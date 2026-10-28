const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function captureMid() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const profileDir = path.join(__dirname, 'chrome_profile_handani_mid');
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9255',
    '--window-size=1920,1080',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + profileDir
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9255/json/list');
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

    // Scroll to middle of Section 9 (Y = 10300)
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          if (window.lenis) {
            window.lenis.scrollTo(10280, { immediate: true });
          } else {
            window.scrollTo(0, 10280);
          }
          window.dispatchEvent(new Event('scroll'));
          if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
        })()
      `
    });

    await new Promise(r => setTimeout(r, 1500));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/handani_mid_evolution.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/handani_mid_evolution.png');

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    chromeProcess.kill();
  }
}

captureMid();
