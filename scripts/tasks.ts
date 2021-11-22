import { task } from 'hardhat/config';

// Deployment task
task('deploy', 'Deploys the ORGiD contract')
  .setAction(async (_, hre) => {
    const contractName = 'OrgId';
    const contract = await hre.ethers.getContractFactory(contractName);
    console.log(`Deploying the ${contractName} proxy...`);
    const proxy = await hre.upgrades.deployProxy(
      contract,
      [],
      {
        initializer: 'initialize'
      }
    );
    await proxy.deployed();
    console.log(`${contractName} proxy deployed to:`, proxy.address);
  });

// Transfers proxy admin ownership
task('transfer', 'Transfer proxy admin ownership')
  .addParam('address', 'New proxy admin owner address')
  .setAction(async (args, hre) => {
    const newOwner = args.address;
    await hre.upgrades.admin.transferProxyAdminOwnership(newOwner);
  });

// Upgrade task
task('upgrade', 'Upgrade the ORGiD contract')
  .addParam('name', 'Name of the new contract implementation')
  .addParam('proxy', 'Address of the proxy to upgrade')
  .setAction(async (args, hre) => {
    const contractName = args.name;
    const contract = await hre.ethers.getContractFactory(contractName);
    const proxyAddress = args.proxy;
    console.log(`Upgrading the ${contractName} proxy...`);
    const proxy = await hre.upgrades.upgradeProxy(proxyAddress, contract);
    console.log(`${contractName} proxy upgraded at: ${proxy.address}`);
  });

// Deploys an instance of the contract that can be used for upgrade
task('prepare', 'Prepare an upgrade')
  .addParam('name', 'Name of the new contract implementation')
  .addParam('proxy', 'Address of the proxy to upgrade')
  .setAction(async (args, hre) => {
    const contractName = args.name;
    const contract = await hre.ethers.getContractFactory(contractName);
    const proxyAddress = args.proxy;
    console.log(`Deploying the ${contractName} instance...`);
    const instanceAddress = await hre.upgrades.prepareUpgrade(proxyAddress, contract);
    console.log(`${contractName} instance deployed at: ${instanceAddress}`);
  });
