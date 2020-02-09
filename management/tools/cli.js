global.web3 = web3;
const { parseArgv } = require('./utils/cli');

// Commands modules
const version = require('./commands/version');
const contract = require('./commands/contract');

// Truffle script body
const main = async () => {
  const args = parseArgv(process.argv, 6);
  // const params = parseParams(args.params);

  await version();

  switch (args.cmd) {
    case 'contract':
      await contract(args);
      break;

    default:
      throw new Error('UNKNOWN_COMMAND');
  }
};

module.exports = callback => main()
  .then(() => callback())
  .catch(err => callback(err));
