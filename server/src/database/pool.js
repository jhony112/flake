require('dotenv').config()
const { Pool } = require('pg')
const moment = require('moment')
const { getTimeDifference } = require('../utils/time')
const { isDev } = require('../utils/strings')
// const { publish } = require('../services/cache.service')
const retry_ms = 5000

let pool

pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    max: 20, // Maximum number of clients in the pool
    min: 10, // Minimum number of clients in the pool
    idleTimeoutMillis: 30000, // Maximum idle time before removing a client
    connectionTimeoutMillis: 500, // Maximum time to wait for a connection
})

pool.on('error', (err) => {
    console.log('🗂️ db error on pool ', err)
    if (err.code && err.code.startsWith('5')) {
        // . terminated by admin?
        try_reconnect(retry_ms)
    }
})

function try_reconnect(ts) {
    setTimeout(() => {
        console.log('reconnecting...')
        pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            max: 20, // Maximum number of clients in the pool
            min: 10, // Minimum number of clients in the pool
            idleTimeoutMillis: 30000, // Maximum idle time before removing a client
            connectionTimeoutMillis: 5000, // Maximum time to wait for a connection
        })
        pool.on('error', (err) => {
            console.log('db error on connecting', err)
            if (err.code && err.code.startsWith('5')) {
                // . terminated by admin?
                try_reconnect(ts)
            }
        })
    }, ts)
}
let error_count = 0
const max_error = () => error_count >= 20
async function connectAndQuery(query, params) {
    const client = null
    try {
        // client = await pool.connect()
        if (isDev()) {
            console.log('Query ', query)
        }
        const start = new moment()
        const res = await pool.query(query, params)
        // client.release(true)
        console.log(pool.totalCount, 'total in pool')
        console.log(pool.idleCount, 'total idle')
        console.log(`Query took ${  getTimeDifference(start)  }seconds`)
        return res.rows
    } catch (err) {
        if (
            err.toString().includes('timeout exceeded when trying to connect')
        ) {
            if (max_error()) {
                console.log('⛔️ something is wrong somewhere so lets restart')
                console.log('critical', {
                    type: 'va',
                    error: 'connection timeout happened too many times',
                    time: Date.now(),
                    action: 'restart in x number of minutes',
                })
                error_count = 0
            }
            error_count += 1
        }

        if (!max_error()) {
            console.log('errors', {
                type: 'va',
                error: err.toString() || 'error',
                time: Date.now(),
                action: 'restart in x number of minutes',
            })
        }

        // Add something here to check for connection errors and end/restart app
        console.error('🗂️ global-error', err.message)
        // if(client)client.release(true)
        throw err
    }
}

module.exports = { connectAndQuery }
