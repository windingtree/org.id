const { TestHelper, files: { ZosNetworkFile, ZosPackageFile } } = require('zos');
module.exports = (fileName = 'zos.dev.json') => TestHelper({}, new ZosNetworkFile(new ZosPackageFile(fileName)));
