const fs = require('fs');
const path = require('path');

const excludedFiles = ['index.js']; // List of files to exclude from requiring

// Get all files in the current directory
const files = fs.readdirSync(__dirname);

// Filter out excluded files and require the remaining ones
const classes = files
    .filter((file) => !excludedFiles.includes(file))
    // eslint-disable-next-line global-require,import/no-dynamic-require
    .map((file) => require(path.join(__dirname, file)));

let currentProvider = null;
// Export the classes
module.exports = {
    getQueueProvider: (name, ...args) => {
        const Class = classes.find((cls) => cls.name === name);

        if (!Class) {
            throw new Error(`Class '${name}' not found.`);
        }

        return new Class(...args);
    },
    setQueueProvider: (provider) => {
        currentProvider = provider;
    },
    getCurrentProvider: () => currentProvider,
};

// const MyClass = require('./index');
//
// // Example usage
// const classAInstance = MyClass.getClassByName('ClassA', arg1, arg2, ...);
// const classBInstance = MyClass.getClassByName('ClassB', arg1, arg2, ...);
// const classCInstance = MyClass.getClassByName('ClassC', arg1, arg2, ...);
