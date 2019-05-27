const fs = require('fs'),
  path = require('path');

const BASE_PATH = 'build/contracts';
const CONTRACTS_DIR = path.resolve(__dirname, `../${BASE_PATH}`);
const exceptions = [
  'AdminUpgradeabilityProxy\.json',
  'Initializable\.json',
  'Ownable\.json',
  'UpgradeabilityProxy\.json',
  'Proxy\.json',
  '.*UpgradeabilityTest\.json',
  '.*ERC165.*\.json',
]
const files = fs.readdirSync(CONTRACTS_DIR)
const exceptionsRegex = new RegExp(exceptions.join('|'));
let importStatements = [];
let exportStatements = [];

files
  .filter((f) => !f.match(exceptionsRegex))
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