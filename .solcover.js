module.exports = {
  norpc: true,
  deepSkip: true,
  copyPackages: [
    'zos-lib',
    'zos',
    'openzeppelin-solidity',
  ],
  skipFiles: [
    'Migrations.sol',
    'App.sol'
  ]
}
