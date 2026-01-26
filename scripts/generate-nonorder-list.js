const fs = require('fs');
const path = require('path');

const NONORDER_DIR = path.join(__dirname, '../data/persona/nonorder');
const OUTPUT_FILE = path.join(__dirname, '../data/persona/nonorder.js');

try {
    const files = fs.readdirSync(NONORDER_DIR);
    const personas = files
        .filter(file => file.endsWith('.js'))
        .map(file => path.basename(file, '.js'));

    const content = `window.personaNonOrder = ${JSON.stringify(personas, null, 4)};\n`;

    fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
    console.log(`Generated ${OUTPUT_FILE} with ${personas.length} personas.`);
} catch (err) {
    console.error('Error generating nonorder list:', err);
    process.exit(1);
}
