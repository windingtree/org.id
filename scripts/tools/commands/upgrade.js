const path = require('path');
const fs = require('fs');
const { title, log } = require('../utils/stdout');
const { parseParams, applyArgs } = require('../utils/cli');
const expect = require('../utils/expect');
const packageJson = require('../../../package.json');
const truffleJs = require('../../../truffle');

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
    let deploymentConfig;

    const configFilePath = path.join(
        __dirname,
        `../../../.openzeppelin/${network}-${name}.json`
    );

    if (!fs.existsSync(configFilePath)) {

        title(
            'Deployment not found. There should exist the following configuration file',
            `${network}-${name}.json`
        );
        log('Use "cmd=deploy" for make new deployment');
        return;
    }

    deploymentConfig = require(configFilePath);

    if (deploymentConfig.version === packageJson.version) {

        title(
            'Contract version has the same version as already deployed',
            packageJson.version
        );
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

    title('Upgrading of the contract', name);
    log('New version', packageJson.version);
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
        gas: truffleConfig.gas,
        gasPrice: truffleConfig.gasPrice
    });

    // Setup upgradeability project
    const project = await ProxyAdminProject.fetch(
        name,
        txParams,
        deploymentConfig.proxyAdmin
    );

    // Upgrading of the contract
    const proxy = await project.upgradeProxy(
        deploymentConfig.contract.proxy,
        ContractSchema,
        Object.assign(
            {},
            !initMethod ? {} : {
                initMethod
            },
            !initArgsParsed ? {} : {
                initArgs: applyArgs(initArgsParsed, {
                    '[OWNER]': from,
                    '[PROXY_ADMIN]': deploymentConfig.proxyAdmin
                })
            }
        ));

    log('Contract upgraded at address', proxy.address);

    // Creation of the deployment configuration file
    deploymentConfig.version = packageJson.version;
    deploymentConfig.owner = from;
    deploymentConfig.contract.name = name;
    deploymentConfig.contract.proxy = proxy.address;
    deploymentConfig.contract.implementation =
        await project.getImplementation({
            packageName: name,
            contractName: name
        });

    deploymentConfig.blockNumber = await web3.eth.getBlockNumber();

    fs.unlinkSync(configFilePath);
    fs.writeFileSync(
        configFilePath,
        JSON.stringify(deploymentConfig, null, 2),
        {
            encoding: 'utf8'
        }
    );

    return deploymentConfig;
};
