const path = require('path');
const fs = require('fs');
const { title, log } = require('../utils/stdout');
const { parseParams, applyArgs } = require('../utils/cli');
const expect = require('../utils/expect');
const packageJson = require('../../../package.json');
const truffleJs = require('../../../truffle');

const { commands } = require('@openzeppelin/cli');
const { Semver, Contracts, App, AppProject, ZWeb3 } = require('@openzeppelin/upgrades');
const zeroAddress = '0x0000000000000000000000000000000000000000';

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
    },
    upgradeMethod: {
      type: 'string',
      required: false
    },
    upgradeArgs: {
      type: 'string',
      required: false
    },
    upgradeProxies: {
      type: 'string',
      required: false
    },
    dao: {
      type: 'address',
      required: false
    }
  });

  const {
    name,
    from,
    initMethod,
    initArgs,
    upgradeMethod,
    upgradeArgs,
    upgradeProxies,
    dao
  } = options;

  log('Contract name', name);

  ZWeb3.initialize(web3.currentProvider);

  // Using compiler settings from the truffle.js
  await commands.compile.action({
    solcVersion: truffleJs.compilers.solc.version,
    optimizer: truffleJs.compilers.solc.settings.optimizer.enabled,
    optimizerRuns: truffleJs.compilers.solc.settings.optimizer.runs
  });

  const ContractSchema = Contracts.getFromLocal(name);
  const network = await web3.eth.net.getNetworkType();
  const txParams = Object.assign({}, Contracts.getDefaultTxParams(), {
    from,
    gas: 60000000,
    gasPrice: await web3.eth.getGasPrice() * 1.2
  });
  const configFile = path.join(
    __dirname,
    `../../../.openzeppelin/${network}-${name}.json`
  );

  // Config template
  let config = {
    version: packageJson.version,
    contract: {
      name,
      implementation: null,
      proxy: null
    },
    owner: null,
    app: null,
    proxyAdmin: null,
    implementationDirectory: null,
    package: null,
    blockNumber: 0
  };

  // Parse transaction arguments
  let initArgsParsed = [];
  let upgradeArgsParsed = [];

  if (initArgs) {
    initArgsParsed = parseParams(initArgs);
  }

  if (upgradeArgs) {
    upgradeArgsParsed = parseParams(upgradeArgs);
  }

  // Parse list of instances to upgrade
  let upgradeProxiesParsed = [];

  if (upgradeProxies) {
    upgradeProxiesParsed = parseParams(upgradeProxies);
  }

  let app;
  let isDeployment = false;
  let isUpgrade = false;
  let appPackage;
  let deployedImplementation;

  try {
    config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    const currentBlock = await web3.eth.getBlockNumber();

    if (config.blockNumber > currentBlock) {
      log(
        'Outdated configuration file detected',
        `Current block number "${currentBlock}" is less than saved`
      );
      return;
    }
  } catch (e) {}

  log('Actual version', packageJson.version);
  log('Last known version', config.version);

  if (config.app) {
    
    app = await App.fetch(config.app, txParams);
    appPackage = await app.getPackage(name);
    
    if (appPackage) {

      const packageVersion = Semver.semanticVersionToString(appPackage.version);
      config.package = appPackage.package.address;

      log('Deployed version', packageVersion);
      
      if (Semver.semanticVersionEqual(appPackage.version, packageJson.version)) {
        title('Deployment or upgrade not required');
      } else {

        if (dao) {
          log('Creating upgrade proposal to the Dao [Not implemented yet]');
          // @todo Creation of the proposal

        } else {
          isUpgrade = true;
        }
      }
    }
  } else {
    isDeployment = true;
  }

  // Initialize AppProject
  const project = await AppProject.fetchOrDeploy(
    config.contract.name,
    config.version,
    txParams,
    {
      appAddress: config.app,
      proxyAdminAddress: config.proxyAdmin
    }
  );
  
  config.owner = from;
  config.app = project.app.address;
  config.proxyAdmin = await project.getAdminAddress() || (await project.ensureProxyAdmin()).address;

  log('App address', config.app);
  log('Proxy admin', config.proxyAdmin);
  
  const projectImplementationDirectory = await project.getCurrentDirectory();
  config.implementationDirectory = projectImplementationDirectory.address;
  const implementationAddress = await projectImplementationDirectory.getImplementation(name);
  appPackage = await project.app.getPackage(name);
  config.package = appPackage.package.address;

  // Deployment of very first implementation
  if (implementationAddress === zeroAddress) {
    deployedImplementation = await project.setImplementation(ContractSchema, name);
    config.contract.implementation = deployedImplementation.address;
    log('Contract implementation', deployedImplementation.address);
  }

  if (isDeployment) {

    title('New deployment');
    
    const deployedProxy = await project.createProxy(
      ContractSchema,
      Object.assign(
        {},
        initMethod ? { initMethod } : {},
        {
          initArgs: applyArgs(initArgsParsed, {
            '[APP]': config.app,
            '[PROXY_ADMIN]': config.proxyAdmin
          })
        }
      )
    );
    config.contract.proxy = deployedProxy.address;
    config.version = packageJson.version;

    log('Contract proxy', deployedProxy.address);

  } else if (isUpgrade) {

    title('Upgrading of the contract to version', packageJson.version);

    await project.newVersion(packageJson.version);
    deployedImplementation = await project.setImplementation(ContractSchema, name);
    config.contract.implementation = deployedImplementation.address;
    log('New implementation of the contract', deployedImplementation.address);

    upgradeProxiesParsed.unshift[config.contract.proxy];
    
    const upgradedContracts = await Promise.all(upgradeProxiesParsed.map(
      i => project.upgradeProxy(
        i,
        ContractSchema,
        Object.assign({},
          upgradeMethod ? {
            initMethod
          } : {},
          upgradeArgsParsed.length > 0 ? {
            initArgs: applyArgs(upgradeArgsParsed, {
              '[APP]': config.app,
              '[PROXY_ADMIN]': config.proxyAdmin
            })
          } : {}
        )
      )
    ));
    
    log('Contract upgraded at address', upgradedContracts[0].address);

    if (upgradedContracts.length > 1) {
      log('Upgraded proxies', upgradedContracts.map(p => p.address).join(', '));
    }

    config.version = packageJson.version;
  }

  // Save config
  if (fs.existsSync(configFile)) {
    fs.unlinkSync(configFile);
  }

  config.blockNumber = await web3.eth.getBlockNumber();
  
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2), {
    encoding: 'utf8'
  });
};
