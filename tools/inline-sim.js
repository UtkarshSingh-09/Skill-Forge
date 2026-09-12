const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '../assets/sim/index.template.html');
const bundlePath = path.join(__dirname, '../assets/sim/bundle.js');
const outputPath = path.join(__dirname, '../assets/sim/index.html');

const template = fs.readFileSync(templatePath, 'utf8');
const bundle = fs.readFileSync(bundlePath, 'utf8');

const inlined = template.replace(
  '<script src="./bundle.js"></script>',
  `<script>\n${bundle}\n</script>`
);

fs.writeFileSync(outputPath, inlined, 'utf8');
console.log('Inlined bundle.js into index.html successfully! Output size:', (inlined.length / 1024).toFixed(1), 'KB');
