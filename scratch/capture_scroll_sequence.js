const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function captureSequence() {
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
    await new Promise(r => setTimeout(r, 3000));

    // Get document height
    const docHeightRes = await send('Runtime.evaluate', {
      expression: 'Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)'
    });
    const totalHeight = docHeightRes.result.value || 12000;
    console.log('Total document height:', totalHeight);

    // Get section offsets
    const sectionsRes = await send('Runtime.evaluate', {
      expression: `
        Array.from(document.querySelectorAll('section')).map(s => ({
          id: s.id || s.className,
          top: s.offsetTop,
          height: s.offsetHeight
        }))
      `,
      returnByValue: true
    });
    console.log('Sections:', JSON.stringify(sectionsRes.result.value, null, 2));

    const scrollPoints = [
      { name: '01_hero', y: 0 },
      { name: '02_about_hands', y: 1200 },
      { name: '03_timeline_end', y: 2200 },
      { name: '04_process_to_awards', y: 2900 },
      { name: '05_awards_studio', y: 3800 },
      { name: '06_trust', y: 4800 },
      { name: '07_services', y: 6000 },
      { name: '08_guardian', y: 7500 },
      { name: '09_portfolio', y: 8800 },
      { name: '10_estimator_contact', y: 10500 }
    ];

    for (const pt of scrollPoints) {
      await send('Runtime.evaluate', {
        expression: `window.scrollTo({ top: ${pt.y}, behavior: 'instant' }); if (window.lenis) window.lenis.scrollTo(${pt.y}, { immediate: true });`
      });
      await new Promise(r => setTimeout(r, 800));

      const { data } = await send('Page.captureScreenshot', { format: 'png' });
      const outPath = path.join(__dirname, `screen_${pt.name}.png`);
      fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
      console.log(`Saved screenshot: ${pt.name} at y=${pt.y}`);
    }

    ws.close();
  } catch (err) {
    console.error('Error in captureSequence:', err);
  } finally {
    try { chromeProcess.kill(); } catch (e) {}
  }
}

captureSequence();
