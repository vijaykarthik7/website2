const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function captureServices() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9236',
    '--window-size=1920,1080',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + path.join(__dirname, 'chrome_profile_services_clean')
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9236/json/list');
    const pages = await listRes.json();
    const pageObj = pages.find(p => p.type === 'page');
    const ws = new WebSocket(pageObj.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(m, params = {}) {
      return new Promise(res => {
        const rid = id++;
        const h = (e) => {
          const msg = JSON.parse(e.data);
          if (msg.id === rid) {
            ws.removeEventListener('message', h);
            res(msg.result);
          }
        };
        ws.addEventListener('message', h);
        ws.send(JSON.stringify({ id: rid, method: m, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise(r => setTimeout(r, 3500));

    // Scroll to services
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const s = document.getElementById('services');
          if (window.lenis && s) {
            window.lenis.scrollTo(s, { immediate: true });
          } else if (s) {
            s.scrollIntoView();
          }
          if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 1500));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'services_no_lights.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved services_no_lights.png successfully');

    ws.close();
  } catch(e) {
    console.error(e);
  } finally {
    chromeProcess.kill();
  }
}

captureServices();
