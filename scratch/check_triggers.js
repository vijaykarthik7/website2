const fs = require('fs');
const js = fs.readFileSync('script.js', 'utf8');

const regexes = [
  /video/i,
  /rocket/i,
  /earth/i,
  /handani/i,
  /lapp/i
];

console.log('--- Search in script.js ---');
const lines = js.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('ScrollTrigger.create') || l.includes('Scroll Stage') || l.includes('Full-Bleed')) {
    console.log(`${idx+1}: ${l.trim()}`);
  }
});
