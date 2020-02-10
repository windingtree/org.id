const { title, log } = require('../utils/stdout');
const packageJson = require('../../../package.json');

module.exports = async () => {
  title('WindingTree Command Line Interface');
  log('Version', packageJson.version);

  return {
    version: packageJson.version
  };
};
