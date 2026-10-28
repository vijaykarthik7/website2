const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, '..', 'script.js');
const text = fs.readFileSync(scriptPath, 'utf8');

// Find Section 3E start and end
const startPattern = '  // =========================================================================\r\n  // 3E. Lapp Workstation & AI Robot Avatar Scroll Animation Engine';
const startPatternLF = '  // =========================================================================\n  // 3E. Lapp Workstation & AI Robot Avatar Scroll Animation Engine';

const endPattern = '    requestAnimationFrame(lappRenderLoop);\r\n  }\r\n';
const endPatternLF = '    requestAnimationFrame(lappRenderLoop);\n  }\n';

let newText = text;
if (text.includes(startPattern)) {
  const startIdx = text.indexOf(startPattern);
  const endIdx = text.indexOf(endPattern, startIdx);
  if (endIdx !== -1) {
    newText = text.slice(0, startIdx) + text.slice(endIdx + endPattern.length);
    fs.writeFileSync(scriptPath, newText, 'utf8');
    console.log('Successfully removed Lapp engine (CRLF)');
  } else {
    console.error('End pattern not found (CRLF)');
  }
} else if (text.includes(startPatternLF)) {
  const startIdx = text.indexOf(startPatternLF);
  const endIdx = text.indexOf(endPatternLF, startIdx);
  if (endIdx !== -1) {
    newText = text.slice(0, startIdx) + text.slice(endIdx + endPatternLF.length);
    fs.writeFileSync(scriptPath, newText, 'utf8');
    console.log('Successfully removed Lapp engine (LF)');
  } else {
    console.error('End pattern not found (LF)');
  }
} else {
  console.error('Start pattern not found');
}
