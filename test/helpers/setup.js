const { TestHelper } = require('@openzeppelin/cli');

// Set up upgradeability project
const setUpProject = async from => {
    const project = await TestHelper({
        from
    });
    return project;
};
module.exports.setUpProject = setUpProject;

// Deploy an upgradable smart contract
module.exports.deployContract = async (project, contract) => {
    const instance = await project.createProxy(contract, {
        initMethod: 'initialize',
        initArgs: []
    });
    return instance;
};
