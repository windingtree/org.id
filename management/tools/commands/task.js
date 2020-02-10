const path = require('path');
const fs = require('fs');
const { title, log } = require('../utils/stdout');
const { buildTaskOptions } = require('../utils/tasks');
const expect = require('../utils/expect');

module.exports = async (options) => {
  title('Run predefined tasks list');

  expect.all(options, {
    file: {
      type: 'string'
    }
  });

  const { file } = options;

  log('Task file name', file);

  let taskJson;

  try {
    const jsonString = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
    taskJson = JSON.parse(jsonString);
  } catch (e) {
    log('Unable to read ORG.ID JSON file due to error', e.message);
  }

  if (!taskJson) {
    return taskJson;
  }

  const resultsScope = [];
  let command;

  for (const task of taskJson) {

    try {
      command = require(`./${task.command}`);
    } catch (e) {}
    
    if (typeof command !== 'function') {
      log('Unable to find task command', task.command);
      log('Task stopped');
      return;
    } else {
      const taskOptions = buildTaskOptions(task.parameters, resultsScope);
      resultsScope.push(await command(taskOptions));
      command = undefined;
    }
  }

  return taskJson;
};
