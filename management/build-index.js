/* eslint-disable */
const fs = require('fs'),
  path = require('path');

const BASE_PATH = 'build/contracts';
const CONTRACTS_DIR = path.resolve(__dirname, `../${BASE_PATH}`);
const bundle = [
  'Organization\.json',
  'OrganizationInterface\.json',
  'SegmentDirectory\.json',
  'SegmentDirectoryInterface\.json',
  'WindingTreeEntrypoint\.json',
];
const files = fs.readdirSync(CONTRACTS_DIR);
const bundleRegex = new RegExp(bundle.join('|'));
const importStatements = [];
const exportStatements = [];

files
  .filter((f) => f.match(bundleRegex))
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
`;

console.log(result);
