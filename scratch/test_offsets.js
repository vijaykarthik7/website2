const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testOffsets() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9227',
    '--window-size=1920,1080',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + path.join(__dirname, 'chrome_profile_offsets')
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9227/json/list');
    const pages = await listRes.json();
    const wsUrl = pages[0].webSocketDebuggerUrl;
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
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise(r => setTimeout(r, 3500));

    const res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const ids = ['home', 'about', 'awards', 'trust', 'services', 'industries', 'guardian'];
          const pos = {};
          ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
              const rect = el.getBoundingClientRect();
              pos[id] = {
                offsetTop: el.offsetTop,
                rectTop: rect.top,
                height: el.offsetHeight
              };
            }
          });
          return JSON.stringify(pos);
        })()
      `,
      returnByValue: true
    });
    console.log('Offsets and heights:', res.result.value);

    // Now test scrolling Lenis to trust
    const scrollTest = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const trust = document.getElementById('trust');
          if (window.lenis) {
            window.lenis.scrollTo(trust, { immediate: true });
          } else {
            window.scrollTo(0, trust.offsetTop);
          }
          return {
            scrollY: window.scrollY,
            lenisScroll: window.lenis ? window.lenis.scroll : null,
            lenisLimit: window.lenis ? window.lenis.limit : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Scroll to trust test:', scrollTest.result.value);

    ws.close();
  } catch(e) {
    console.error(e);
  } finally {
    chromeProcess.kill();
  }
}

testOffsets();
