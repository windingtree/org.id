const { title, log } = require('../utils/stdout');
const { parseParams, parseCallResult } = require('../utils/cli');
const expect = require('../utils/expect');

const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');

module.exports = async (options) => {
    title('Contract method call');

    expect.all(options, {
        name: {
            type: 'string'
        },
        address: {
            type: 'address'
        },
        method: {
            type: 'string',
            required: false
        },
        args: {
            type: 'string',
            required: false
        }
    });

    const {
        name,
        address,
        method,
        args
    } = options;

    log('Contract name', name);
    log('Method', method);

    let argsParsed = [];

    if (args) {
        argsParsed = parseParams(args);
    }

    log('Arguments', `[${args || ''}]`);

    ZWeb3.initialize(web3.currentProvider);

    const ContractSchema = Contracts.getFromLocal(name);
    const contract = ContractSchema.at(address);

    const result = await (await contract.methods[method].apply(contract, argsParsed)).call();
    log('Result', parseCallResult(result));
};
