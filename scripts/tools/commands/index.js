const version = require('./version');
const deploy = require('./deploy');
const upgrade = require('./upgrade');
const makehash = require('./makehash');
const call = require('./call');
const tx = require('./tx');
const task = require('./task');

module.exports = {
    version,
    deploy,
    upgrade,
    makehash,
    call,
    tx,
    task
};
