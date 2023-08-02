/**
 * Register command for all stages
 * @type {string}
 */
const { registerDev, register, handler } = require('../../services/cli.service');

// eslint-disable-next-line no-unused-vars
register['cmd:sample1'] = (args, callback, context) => {
    console.log('Running sample 1 command for all stages');
};

/**
 * Register commands for development only
 * @type {string}
 */
// eslint-disable-next-line no-unused-vars
registerDev['cmd:sample2'] = (args, callback, context) => {
    console.log('Running sample command 2 only on development');
};

module.exports = handler;
