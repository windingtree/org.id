const path = require('path');
const fs = require('fs');
const { parseParamsReplacements, applyParamsReplacements } = require('../utils/tasks');
const { title, log } = require('../utils/stdout');
const { buildTaskOptions } = require('../utils/tasks');
const expect = require('../utils/expect');

module.exports = async (options) => {
    title('Run predefined tasks list');

    expect.all(options, {
        file: {
            type: 'string'
        },
        params: {
            type: 'string',
            required: false
        }
    });

    const {
        file,
        params
    } = options;
    var parsedParamsReplacements;

    log('Task file name', file);

    if (params) {
        parsedParamsReplacements = parseParamsReplacements(params);
        log(
            'Commands params replacements provided',
            JSON.stringify(parsedParamsReplacements, null, 2)
        );
    }

    let taskJson;

    try {
        const jsonString = fs.readFileSync(
            path.join(process.cwd(), file),
            'utf8'
        );
        taskJson = JSON.parse(jsonString);
    } catch (e) {
        log('Unable to read ORG.ID Tasks JSON file due to error', e.message);
        return;
    }

    if (!taskJson) {
        return taskJson;
    }

    const resultsScope = [];
    let command;

    for (const task of taskJson) {
        
        task.parameters = applyParamsReplacements(
            task.parameters,
            parsedParamsReplacements
        );

        try {
            command = require(`./${task.command}`);
        } catch (e) {} // eslint-disable-line no-empty

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
