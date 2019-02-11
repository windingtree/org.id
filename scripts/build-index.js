const fs = require('fs'),
  path = require('path');

const BASE_PATH = 'build/contracts';
const CONTRACTS_DIR = path.resolve(__dirname, `../${BASE_PATH}`);
const exceptions = [
  'AdminUpgradeabilityProxy.json',
  'Initializable.json',
  'UpgradeabilityProxy.json',
  'Proxy.json',
]
const files = fs.readdirSync(CONTRACTS_DIR)
let importStatements = [];
let exportStatements = [];

files
  .filter((f) => exceptions.indexOf(f) === -1)
  .map((f) => {
    const name = f.split('.')[0];
    importStatements.push(`const ${name}Contract = require('./${BASE_PATH}/${f}');`);
    exportStatements.push(`  ${name}Contract: ${name}Contract,`);
  });

const result = `
${importStatements.join('\n')}

module.exports = {
${exportStatements.join('\n')}
};
`

console.log(result);