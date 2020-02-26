const { assertEvent } = require('../helpers/assertions');
const { toBN } = require('../helpers/common');

/**
 * Adds deposit
 * @param {Object} orgId OrgId instance
 * @param {string} from Sender address
 * @param {string} id The organization Id
 * @param {string} value The value of Lif tokens to deposit
 * @param {boolean} tokenAllowance If not null it should be an instance of the token
 * @returns {Promise}
 */
module.exports.addDeposit = async (
    orgId,
    from,
    id,
    value,
    tokenAllowance = null
) => {

    if (tokenAllowance) {
        await tokenAllowance
            .methods['approve(address,uint256)'](
                orgId.address,
                value
            )
            .send({ from });
    }

    let organization = await orgId.methods['getOrganization(bytes32)'](id).call();
    const depositBefore = organization.deposit;
    const result = await orgId
        .methods['addDeposit(bytes32,uint256)'](
            id,
            value
        )
        .send({ from });
    assertEvent(result, 'LifDepositAdded', [
        [
            'orgId',
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
    organization = await orgId.methods['getOrganization(bytes32)'](id).call();
    (toBN(organization.deposit)).should.eq.BN(
        toBN(depositBefore).add(toBN(value))
    );
};

/**
 * Submits deposit withdrawal request
 * @param {Object} orgId OrgId instance
 * @param {string} from Sender address
 * @param {string} id The organization Id
 * @param {string} value The value of Lif tokens to withdraw
 * @returns {Promise}
 */
module.exports.submitWithdrawalRequest = async (
    orgId,
    from,
    id,
    value
) => {
    const timeBefore = await orgId.methods['currentTime()']().call();
    const delay = await orgId.methods['getWithdrawDelay()']().call();
    const result = await orgId
        .methods['submitWithdrawalRequest(bytes32,uint256)'](
            id,
            value
        )
        .send({ from });
    assertEvent(result, 'WithdrawalRequested', [
        [
            'orgId',
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
            p => (toBN(p)).should.eq.BN(toBN(timeBefore).add(toBN(delay)))
        ]
    ]);
};
