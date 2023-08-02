/* eslint-disable no-console */
const { loadClient } = require('../redis')

const remove = async (key) => {
    if (!key) {
        console.warn('no key present to delete cache')
        return false
    }
    try {
        const redisClient = loadClient()
        if (
            redisClient.status !== 'connecting' &&
            redisClient.status !== 'ready'
        ) {
            await redisClient.connect()
        }
        await redisClient.del(key)
        return true
    } catch (e) {
        console.error(`Error deleting cache: ${key}`, e)
        return false
    }
}

const get = async (key) => {
    if (!key) {
        console.warn('no key present to get cache')
        return false
    }
    try {
        const redisClient = loadClient()
        if (
            redisClient.status !== 'connecting' &&
            redisClient.status !== 'ready'
        ) {
            await redisClient.connect()
        }
        const data = await redisClient.get(key)
        return JSON.parse(data)
    } catch (e) {
        console.log(`Error fetching cache: ${key}`, e)
        return null
    }
}

const set = async (key, data, expireInSecs = null) => {
    if (!key) {
        console.warn('no key present to save cache')
        return false
    }
    if (!data) {
        console.warn('no data present to save cache')
        return false
    }
    try {
        const redisClient = loadClient()

        if (
            redisClient.status !== 'connecting' &&
            redisClient.status !== 'ready'
        ) {
            await redisClient.connect()
        }

        const dataString = JSON.stringify(data)
        await redisClient.set(key, dataString)
        const expire = expireInSecs || process.env.CACHE_EXPIRY || 60 * 60
        if (expire) {
            await redisClient.expire(key, expire)
        }

        return true
    } catch (e) {
        console.error(`Error setting cache: ${key}: ${data}`, e)
        return false
    }
}

module.exports = { get, set, remove }
