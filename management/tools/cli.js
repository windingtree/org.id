global.web3 = web3;
const { parseArgv } = require('./utils/cli');

// Commands modules
const {
    version,
    contract,
    makehash,
    call,
    tx,
    task
} = require('./commands');

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

        case 'task':
            await task(args);
            break;

        default:
            throw new Error('UNKNOWN_COMMAND');
    }
};

module.exports = callback => main()
    .then(() => callback())
    .catch(err => callback(err));
