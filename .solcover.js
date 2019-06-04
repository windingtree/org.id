module.exports = {
  norpc: true,
  deepSkip: true,
  copyPackages: [
    // 'zos-lib', // Including this package breaks coverage process due crappy code style in the zos-lib/.../App.sol
    'zos',
    'openzeppelin-solidity',
  ]
}
