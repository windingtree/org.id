const path = require('path');
const fs = require('fs');
const { title, log } = require('../utils/stdout');
const { parseParams, applyArgs } = require('../utils/cli');
const expect = require('../utils/expect');
const packageJson = require('../../../package.json');
const truffleJs = require('../../../truffle');
const { project: config } = require('../utils/template');

const { commands } = require('@openzeppelin/cli');
const {
    Contracts,
    ProxyAdminProject,
    ZWeb3
} = require('@openzeppelin/upgrades');

module.exports = async (options) => {
    expect.all(options, {
        name: {
            type: 'string'
        },
        from: {
            type: 'address'
        },
        initMethod: {
            type: 'string',
            required: false
        },
        initArgs: {
            type: 'string',
            required: false
        }
    });

    const {
        name,
        from,
        initMethod,
        initArgs
    } = options;
    const network = await web3.eth.net.getNetworkType();
    let initArgsParsed = [];
    let deploymentConfig = Object.assign({}, config);

    const configFilePath = path.join(
        __dirname,
        `../../../.openzeppelin/${network}-${name}.json`
    );

    if (fs.existsSync(configFilePath)) {

        title('Detected existing deployment', `${network}-${name}.json`);
        log('Use "cmd=upgrade" for doing upgrade');
        return;
    }

    // Openzeppelin SDK setup
    ZWeb3.initialize(web3.currentProvider);

    // Rebuild contracts Using compiler settings from the truffle.js
    await commands.compile.action({
        solcVersion: truffleJs.compilers.solc.version,
        optimizer: truffleJs.compilers.solc.settings.optimizer.enabled,
        optimizerRuns: truffleJs.compilers.solc.settings.optimizer.runs
    });

    title('Deployment of the contract', name);
    log('Version', packageJson.version);
    log('Owner address', from);

    if (initMethod) {

        log('Initializing method', initMethod);
    }

    if (initArgs) {

        initArgsParsed = parseParams(initArgs);
        log('Initializing arguments', initArgsParsed);
    }

    // Preapare the deployment environment
    const ContractSchema = Contracts.getFromLocal(name);
    const truffleConfig = truffleJs.networks[
        network === 'private' ? 'development' : network
    ];
    const txParams = Object.assign({}, Contracts.getDefaultTxParams(), {
        from,
        gas: truffleConfig.gas || 8000000,
        gasPrice: truffleConfig.gasPrice || 40000000000
    });

    // Setup upgradeability project
    const project = new ProxyAdminProject(name, null, null, txParams);

    // Deployment of the contract
    const proxy = await project.createProxy(ContractSchema, Object.assign(
        {},
        !initMethod ? {} : {
            initMethod
        },
        !initArgsParsed ? {} : {
            initArgs: applyArgs(initArgsParsed, {
                '[OWNER]': from
            })
        }
    ));

    log('Contract deployed at address', proxy.address);

    // Creation of the deployment configuration file
    deploymentConfig.version = packageJson.version;
    deploymentConfig.owner = from;
    deploymentConfig.proxyAdmin = await project.getAdminAddress();
    deploymentConfig.contract.name = name;
    deploymentConfig.contract.proxy = proxy.address;
    deploymentConfig.contract.implementation =
        await project.getImplementation({
            packageName: name,
            contractName: name
        });

    deploymentConfig.blockNumber = await web3.eth.getBlockNumber();

    fs.writeFileSync(
        configFilePath,
        JSON.stringify(deploymentConfig, null, 2),
        {
            encoding: 'utf8'
        }
    );

    return deploymentConfig;
};
