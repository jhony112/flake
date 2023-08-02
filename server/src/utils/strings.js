const moment = require('moment');
const randomstring = require('randomstring');
const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_', 30);
// if Speed is 1000 IDs per second
// More than 1 quadrillion years or 175,511,224,026,816T IDs needed, in order to have a 1% probability of at least one collision

const generateBatchId = () => nanoid();

const generateChars = (length = 12, charset = 'alphanumeric', capitalization = 'uppercase', readable = true) =>
    randomstring.generate({ length, readable, charset, capitalization });
const camelize = (str) =>
    str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
        .replace(/\s+/g, '');
const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);
const moneyFormat = (m, dec = false) => {
    if (dec) {
        return parseFloat(m)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    return m.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
const withCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const abbreviateNumber = (num, fixed) => {
    if (num === null) {
        return null;
    } // terminate early
    if (num === 0) {
        return '0';
    } // terminate early
    fixed = !fixed || fixed < 0 ? 0 : fixed; // number of decimal places to show
    const b = num.toPrecision(2).split('e'); // get power
    const k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3); // floor at decimals, ceiling at trillions
    const c = k < 1 ? num.toFixed(0 + fixed) : (num / 10 ** (k * 3)).toFixed(1 + fixed); // divide by power
    const d = c < 0 ? c : Math.abs(c); // enforce -0 is 0
    const e = d + ['', 'K', 'M', 'B', 'T'][k]; // append power
    return e;
};
const isTest = function () {
    return process.env.NODE_ENV === 'test';
};
const getEnv = (name, fallback = null, raw = false) => {
    const value = raw ? name : process.env[name];

    if (value) {
        if (typeof fallback === 'number') {
            return Number(value);
        }
        return value;
    }
    return fallback;
};
const isDev = function () {
    return process.env.NODE_ENV === 'development';
};
const parseEnv = function (env, integer = true) {
    return integer ? parseInt(env, 10) : env;
};
const isLocal = function () {
    return process.env.NODE_ENV === 'local';
};
const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;
const isProd = function () {
    return process.env.NODE_ENV === 'production';
};
const isDebug = function () {
    return process.env.DEBUG || false;
};
const getArgs = () => {
    const args = {};
    process.argv.slice(2, process.argv.length).forEach((arg) => {
        // long arg
        if (arg.slice(0, 2) === '--') {
            const longArg = arg.split('=');
            const longArgFlag = longArg[0].slice(2, longArg[0].length);
            const longArgValue = longArg.length > 1 ? longArg[1] : true;
            args[longArgFlag] = longArgValue;
        }
        // flags
        else if (arg[0] === '-') {
            const flags = arg.slice(1, arg.length).split('');
            flags.forEach((flag) => {
                args[flag] = true;
            });
        }
    });
    return args;
};
const infoLog = (tag = 'INFO', msg = '', raw = true) => {
    if (!raw) return console.log(`[SETTLEMENT] [${tag}]:`, msg);
    return console.log(`${tag} - ${moment().format('DD/MM/YYYY h:mm:ss a')}`, msg);
};
const errorLog = (tag = 'INFO', msg = '', raw = true) => {
    if (!raw) return console.log(`[SETTLEMENT] [${tag}]:`, msg);
    return console.error(`${tag} :  ${moment().format('DD/MM/YYYY h:mm:ss a')}`, msg);
};
module.exports = {
    isDev,
    getRandomArbitrary,
    isProd,
    isLocal,
    isTest,
    camelize,
    parseEnv,
    capitalize,
    moneyFormat,
    withCommas,
    infoLog,
    errorLog,
    isDebug,
    getArgs,
    abbreviateNumber,
    generateChars,
    getEnv,
    generateBatchId,
};
