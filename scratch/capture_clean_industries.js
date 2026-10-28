const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const profileDir = path.join(__dirname, 'chrome_profile_clean_ind');
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9245',
    '--window-size=1920,1080',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + profileDir
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9245/json/list');
    const pages = await listRes.json();
    const pageObj = pages.find(p => p.type === 'page');
    const wsUrl = pageObj.webSocketDebuggerUrl;

    const ws = new WebSocket(wsUrl);
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
    await new Promise(r => setTimeout(r, 3000));

    // Scroll to #industries using Lenis
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const ind = document.getElementById('industries');
          if (window.lenis && ind) {
            window.lenis.scrollTo(ind, { immediate: true });
          } else if (ind) {
            ind.scrollIntoView({ behavior: 'instant' });
          }
          window.dispatchEvent(new Event('scroll'));
          if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
          return {
            scrollY: window.scrollY,
            indTop: ind ? ind.getBoundingClientRect().top : null,
            shaderCanvasExists: !!document.getElementById('industryShaderCanvas'),
            earthOpacity: document.getElementById('earthScrollStage') ? window.getComputedStyle(document.getElementById('earthScrollStage')).opacity : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Evaluated state:', evalRes.result.value);

    // Wait 1s for earth frame render
    await new Promise(r => setTimeout(r, 1000));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/industries_no_orange.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot: scratch/industries_no_orange.png');

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    chromeProcess.kill();
  }
}

main();
