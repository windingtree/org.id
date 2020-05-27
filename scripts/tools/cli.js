global.web3 = web3;
const { parseArgv } = require('./utils/cli');

// Commands modules
const {
    version,
    deploy,
    upgrade,
    makehash,
    call,
    tx,
    task
} = require('./commands');

// Truffle script body
const main = async () => {
    const args = parseArgv(process.argv, 6);

    switch (args.cmd) {
        case 'version':
            await version();
            break;
            
        case 'deploy':
            await deploy(args);
            break;

        case 'upgrade':
            await upgrade(args);
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
