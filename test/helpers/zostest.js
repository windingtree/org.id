const { TestHelper, files: { ZosNetworkFile, ZosPackageFile } } = require('zos');
module.exports = (fileName = 'zos.test.json') => TestHelper({}, new ZosNetworkFile(new ZosPackageFile(fileName)));
