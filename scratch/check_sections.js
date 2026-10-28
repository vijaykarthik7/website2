const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const regex = /<section[^>]*id="([^"]+)"[^>]*>/g;
let m;
let i = 1;
while ((m = regex.exec(html)) !== null) {
  console.log(i++, m[1]);
}
