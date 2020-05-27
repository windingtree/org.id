const { assertEvent } = require('../helpers/assertions');
const { toBN } = require('../helpers/common');

/**
 * Adds deposit
 * @param {Object} lifDeposit LifDeposit instance
 * @param {string} from Sender address
 * @param {string} id The organization Id
 * @param {string} value The value of Lif tokens to deposit
 * @param {boolean} tokenAllowance If not null it should be an instance of the token
 * @returns {Promise}
 */
module.exports.addDeposit = async (
    lifDeposit,
    from,
    id,
    value,
    tokenAllowance = null
) => {

    if (tokenAllowance) {
        await tokenAllowance
            .methods['approve(address,uint256)'](
                lifDeposit.address,
                value
            )
            .send({ from });
    }

    const depositBefore = await lifDeposit.methods['balanceOf(bytes32)'](id).call();
    const result = await lifDeposit
        .methods['addDeposit(bytes32,uint256)'](
            id,
            value
        )
        .send({ from });
    assertEvent(result, 'LifDepositAdded', [
        [
            'organization',
            p => (p).should.equal(id)
        ],
        [
            'sender',
            p => (p).should.equal(from)
        ],
        [
            'value',
            p => (p).should.equal(value)
        ]
    ]);
    const depositAfter = await lifDeposit.methods['balanceOf(bytes32)'](id).call();
    (toBN(depositAfter)).should.eq.BN(
        toBN(depositBefore).add(toBN(value))
    );
};

/**
 * Submits deposit withdrawal request
 * @param {Object} lifDeposit LifDeposit instance
 * @param {string} from Sender address
 * @param {string} lifDepositOwner LifDeposit owner address
 * @param {string} id The organization Id
 * @param {string} value The value of Lif tokens to withdraw
 * @returns {Promise<{Object}>}
 */
module.exports.submitWithdrawalRequest = async (
    lifDeposit,
    from,
    lifDepositOwner,
    id,
    value
) => {
    const timeBefore = await lifDeposit.methods['currentTime()']().call();
    const delay = await lifDeposit.methods['getWithdrawDelay()']().call();
    // stop the time
    await lifDeposit.methods['setCurrentTime(uint256)'](timeBefore).send({
        from: lifDepositOwner
    });
    let withdrawTime;
    const result = await lifDeposit
        .methods['submitWithdrawalRequest(bytes32,uint256)'](
            id,
            value
        )
        .send({ from });
    assertEvent(result, 'WithdrawalRequested', [
        [
            'organization',
            p => (p).should.equal(id)
        ],
        [
            'sender',
            p => (p).should.equal(from)
        ],
        [
            'value',
            p => (p).should.equal(value)
        ],
        [
            'withdrawTime',
            p => {
                withdrawTime = p;
                (toBN(p)).should.eq.BN(toBN(timeBefore).add(toBN(delay)));
            }
        ]
    ]);
    return {
        value,
        withdrawTime
    };
};

/**
 * Withdrawal deposit
 * @param {Object} lifDeposit LifDeposit instance
 * @param {string} from Sender address
 * @param {string} lifDepositOwner OrgId owner address
 * @param {string} id The organization Id
 * @param {string} rewindTime Flag for time machine activation
 * @returns {Promise}
 */
module.exports.withdrawDeposit = async (
    lifDeposit,
    from,
    lifDepositOwner,
    id,
    rewindTime = false
) => {
    const timeBefore = await lifDeposit.methods['currentTime()']().call();
    const delay = await lifDeposit.methods['getWithdrawDelay()']().call();
    const withdrawTime = toBN(timeBefore).add(toBN(delay)).toString();
    const request = await lifDeposit
        .methods['getWithdrawalRequest(bytes32)'](id)
        .call();
    
    if (rewindTime) {
        await lifDeposit.methods['setCurrentTime(uint256)'](withdrawTime).send({
            from: lifDepositOwner
        });
    }
    
    const result = await lifDeposit
        .methods['withdrawDeposit(bytes32)'](id)
        .send({ from });
    assertEvent(result, 'DepositWithdrawn', [
        [
            'organization',
            p => (p).should.equal(id)
        ],
        [
            'sender',
            p => (p).should.equal(from)
        ],
        [
            'value',
            p => (p).should.equal(request.value)
        ]
    ]);
    (await lifDeposit
        .methods['getWithdrawalRequest(bytes32)'](id)
        .call()).should.has.property('exist').to.false;
};
