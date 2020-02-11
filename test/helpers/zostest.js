const {
    TestHelper,
    files: {
        NetworkFile,
        ProjectFile
    }
} = require('@openzeppelin/cli');
module.exports = (fileName = 'zos.test.json') => TestHelper(
    {}, new NetworkFile(new ProjectFile(fileName))
);
