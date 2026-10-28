const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('src="assets/timeline_studio_chennai.jpg"', 'src="assets/timeline_studio_chennai.jpg?v=6.0"');
html = html.replace('src="assets/timeline_star_award.jpg"', 'src="assets/timeline_star_award.jpg?v=6.0"');
html = html.replace('src="assets/timeline_designrush_award.jpg"', 'src="assets/timeline_designrush_award.jpg?v=6.0"');
html = html.replace('src="assets/timeline_techbehemoths_award.jpg"', 'src="assets/timeline_techbehemoths_award.jpg?v=6.0"');
html = html.replace('src="assets/timeline_guardian3d_system.jpg"', 'src="assets/timeline_guardian3d_system.jpg?v=6.0"');

html = html.replace('styles.css?v=5.4', 'styles.css?v=6.0');
html = html.replace('script.js?v=4.5', 'script.js?v=5.0');

fs.writeFileSync('index.html', html, 'utf8');
console.log('✓ Updated image sources and cache busters in index.html');
