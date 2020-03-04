const fs = require('fs');
const path = require('path');

const BASE_PATH = 'build/contracts';
const DEPLOYMENTS_PATH = '.openzeppelin';
const CONTRACTS_DIR = path.resolve(__dirname, `../${BASE_PATH}`);
const DEPLOYMENTS_DIR = path.resolve(__dirname, `../${DEPLOYMENTS_PATH}`);
const bundle = [
    'OrgId.json',
    'OrgIdInterface.json'
];
const deploymentsInfo = [
    'mainnet-OrgId.json',
    'ropsten-OrgId.json',
    'rinkeby-OrgId.json'
];
const files = fs.readdirSync(CONTRACTS_DIR);
const deploymentsFiles = fs.readdirSync(DEPLOYMENTS_DIR);
const bundleRegex = new RegExp(bundle.join('|'));
const deploymentsRegex = new RegExp(deploymentsInfo.join('|'));
const importStatements = [];
const exportStatements = [];

files
    .filter(f => f.match(bundleRegex))
    .map(f => {
        const name = f.split('.')[0];
        importStatements.push(`const ${name}Contract = require('./${BASE_PATH}/${f}');`);
        exportStatements.push(`    ${name}Contract: ${name}Contract,`);
    });

const addresses = [];
deploymentsFiles
    .filter(f => f.match(deploymentsRegex))
    .map(f => {
        const network = f.split('-')[0];
        importStatements.push(`const ${network}Config = require('./${DEPLOYMENTS_PATH}/${f}');`);
        addresses.push(`        ${network}: ${network}Config.contract.proxy,`);
    });
exportStatements.push(`    addresses: {\n${addresses.join('\n')}\n    }`);

const result = `
${importStatements.join('\n')}

module.exports = {
${exportStatements.join('\n')}
};
`;

console.log(result);
