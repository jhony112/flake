const logger = require('../config/logger');

async function runCallback(name, callback, ...args) {
    // Perform some operations or logic
    try {
        if (callback) {
            await callback(...args);
            return true;
        }
        return false;
    } catch (e) {
        logger.error(`Failed to run callback ${name}`, e);
        console.log(e);
        return false;
    }
}

module.exports = { runCallback };
