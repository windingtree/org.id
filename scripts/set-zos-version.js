const fs = require('fs'),
  path = require('path'),
  zosConfig = require('../zos.json'),
  packageFile = require('../package.json');

zosConfig.version = packageFile.version;

console.log(JSON.stringify(zosConfig, false, '  '));