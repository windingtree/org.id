global.web3 = web3;
const { parseArgv } = require('./utils/cli');

// Commands modules
const version = require('./commands/version');
const contract = require('./commands/contract');
const makehash = require('./commands/makehash');
const call = require('./commands/call');
const tx = require('./commands/tx');

// Truffle script body
const main = async () => {
  const args = parseArgv(process.argv, 6);

  await version();

  switch (args.cmd) {
    case 'contract':
      await contract(args);
      break;

    case 'makehash':
      await makehash(args);
      break;

    case 'call':
      await call(args);
      break;

    case 'tx':
      await tx(args);
      break;

    default:
      throw new Error('UNKNOWN_COMMAND');
  }
};

module.exports = callback => main()
  .then(() => callback())
  .catch(err => callback(err));
