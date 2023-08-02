require('dotenv').config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
    development: {
        client: 'postgresql',
        debug: true,
        connection: {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
        },
        pool: {
            min: 5,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: 'src/database/migrations',
        },
        seeds: {
            directory: 'src/database/seeds',
        },
    },

    staging: {
        client: 'postgresql',
        debug: true,
        connection: {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
        },
        pool: {
            min: 5,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: 'src/database/migrations',
        },
        seeds: {
            directory: 'src/database/seeds',
        },
    },

    production: {
        client: 'postgresql',
        connection: {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
        },
        pool: {
            min: 5,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: 'src/database/migrations',
        },
        seeds: {
            directory: 'src/database/seeds',
        },
    },
};
