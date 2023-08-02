require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const knex = require('knex');
const _ = require('lodash');
const knexFile = require('../../knexfile');

const dbConfig = Object.seal(knexFile[process.env.NODE_ENV || 'development']);

const execCommand = (cmd, callback = null, throwError = true) => {
    // eslint-disable-next-line no-console
    console.log(`Executing "${cmd}"`);

    return new Promise((resolve, reject) => {
        exec(cmd, async (error, stdout, stderr) => {
            if (callback) await callback(error, stdout, stderr);
            if (error && throwError) {
                reject(error);
            } else {
                resolve(stdout || stderr || error);
            }
        });
    });
};

const dropDB = async (event, callback) => {
    const config = _.cloneDeep(dbConfig); // clone so mutations won't affect main config
    delete config.connection.database; // delete this so knex can drop
    const connection = knex(config);
    const database_name = dbConfig.connection.database;
    console.log('dropping db');
    try {
        await connection.raw(`DROP DATABASE ${database_name}`);
        return callback(null, `Dropped db ${database_name} successfully`);
    } catch (e) {
        if (e.message.includes('exist')) {
            return callback(null, `Database ${database_name} does not exist`);
        }

        return callback(e.message);
    } finally {
        // await connection.destroy();
    }
};
const dbCreate = async (args, callback) => {
    const config = _.cloneDeep(dbConfig); // clone so mutations won't affect main config
    delete config.connection.database; // delete this so knex can drop
    const database_name = dbConfig.connection.database;
    const connection = knex(config);

    try {
        await connection.raw(`CREATE DATABASE ${database_name}; `);
        return callback(null, `Created Database ${database_name} successfully`);
    } catch (e) {
        if (e.message.includes('exist')) {
            return callback(null, `Database ${database_name} already exists, skipping db:create`);
        }

        return callback(e);
    } finally {
        // await connection.destroy();
    }
};
const dbMigrate = async (args, callback) => {
    const connection = knex(dbConfig);
    const database_name = dbConfig.connection.database;
    console.log(`Migrating ${database_name}`);
    try {
        await connection.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp" `); // for extensions
        await connection.migrate.latest();
        return callback(null, `Migrated  ${database_name} successfully`);
    } catch (e) {
        return callback(e.message);
    } finally {
        // await connection.destroy();
    }
};

const register = {
    'db:migrate': dbMigrate,
    'db:create': dbCreate,
};

const registerDev = {
    'db:drop': dropDB,
    // 'db:seed:all': dbSeedAll,
    // 'db:sync': dbSync,
    // bash,
};

const handler = async function (event, context, callback) {
    const command = typeof event === 'string' ? event : event.fn;

    // eslint-disable-next-line no-console
    console.log(`Running "${command}" in ${process.env.NODE_ENV} mode.`);

    const env = process.env.NODE_ENV;
    let handle;
    if (env === 'production') {
        handle = register[command];
    } else {
        const all = { ...register, ...registerDev };
        handle = all[command];
    }

    try {
        let res = '';
        if (handle) {
            res = await handle(event, callback, context);
        } else {
            // eslint-disable-next-line no-console
            console.error(`Command ${command} not found in environment ${env}`);
        }

        callback(null, res);
    } catch (e) {
        callback(e);
        process.exit(1);
    }
};

module.exports = {
    register,
    registerDev,
    handler,
};
