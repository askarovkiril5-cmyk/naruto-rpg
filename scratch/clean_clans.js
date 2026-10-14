const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'server', 'clanTemplates.js');
let content = fs.readFileSync(file, 'utf8');

const regex = /,\s*\{\s*clan:\s*'Нара'[\s\S]*?\{\s*clan:\s*'Кагуя'[\s\S]*?\}\s*\];/;
if (!regex.test(content)) {
  console.error('Regex match failed!');
  process.exit(1);
}

const updated = content.replace(regex, '\n];');
fs.writeFileSync(file, updated, 'utf8');
console.log('Successfully removed non-canonical clans from server/clanTemplates.js!');
