/* eslint-disable no-console */
const Redis = require('ioredis');
// const { isTest, isLocal } = require('../utils/strings');

const REDIS_URL = process.env.REDIS_URL || 'localhost';

let client = null;
let connected = false;
const urls = REDIS_URL.split(',');

const loadClient = (redisOpts = {}) => {
    if (client) return client;
    client = new Redis({ host: urls[0], lazyConnect: true, ...redisOpts });
    // if (isTest() || isLocal()) {
    //   client = new Redis({ host: urls[0], lazyConnect: true });
    // } else {
    //   const nodes = urls.map((u) => {
    //     return { host: u, port: 6379 };
    //   });
    //   console.log(nodes);
    //   client = new Redis.Cluster(nodes, {
    //     scaleReads: 'all',
    //     lazyConnect: true,
    //   });
    // }
    // client = new Redis(`redis://${urls[0]}`);
    client.on('error', (err) => console.log('Redis Client Error', err));

    client.on('connect', () => {
        console.log('Redis Connected');
        connected = true;
    });

    client.on('end', () => {
        console.log('Redis Ended');
        connected = false;
    });

    return client;
};

const destroyClient = async () => {
    if (client && connected) {
        try {
            await client.quit();
        } catch (e) {
            console.log(e);
            console.log('failed to close');
        }
    }
};

const isConnected = () => connected;

module.exports = { loadClient, destroyClient, isConnected };
