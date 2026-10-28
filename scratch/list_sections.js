const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /<section[\s\S]*?>/g;
let match;
let i = 1;
while ((match = regex.exec(html)) !== null) {
  const tag = match[0];
  const idMatch = tag.match(/id=["']([^"']+)["']/);
  const classMatch = tag.match(/class=["']([^"']+)["']/);
  console.log(`${i}. ID: ${idMatch ? '#' + idMatch[1] : 'NONE'} | Class: ${classMatch ? '.' + classMatch[1] : 'NONE'}`);
  i++;
}

// Check footer
const footerMatch = html.match(/<footer[\s\S]*?>/);
if (footerMatch) {
  console.log(`Footer: ${footerMatch[0].substring(0, 80)}`);
}
