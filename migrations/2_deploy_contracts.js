const WTIndex = artifacts.require('WTIndex');


module.exports = function (deployer, network, accounts) {
  if (network == 'mainnent' || network == 'ropsten') {
    console.log('Network:', network);
    console.log('Accounts:', accounts);

    const lifTokenAddress = (network == 'mainnent')
      ? '0xeb9951021698b42e4399f9cbb6267aa35f82d59d'
      : '0x5FDFBa355A30FB00ee12965cf3a1c24CA8DF77FB';

    deployer.deploy(WTIndex).then(function (wtIndexContract) {
      console.log('WTIndex address:', wtIndexContract.address);
      wtIndexContract.setLifToken(lifTokenAddress).then(function (tx) {
        console.log('LifToken set on tx:', tx.tx);
      });
    });
  }
};
