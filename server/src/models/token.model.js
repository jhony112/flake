const db = require('../database/knex')

/**
 * Represents a token entry in the tokens table.
 *
 * @class
 * @name Token
 */
class Token {
    constructor() {
        this.tableName = 'tokens'
    }

    /**
     * Create a new token entry.
     *
     * @param {Object} tokenData - The data for the token entry.
     * @param {string} tokenData.name - The token name.
     * @param {string} tokenData.description - The token description.
     * @param {string} tokenData.api_key - The token api-key.
     * @returns {Promise<Object>} A promise that resolves to the created token entry.
     * @throws {Error} If an error occurs while creating the token.
     *
     * @memberof token
     * @instance
     */
    async add(tokenData) {
        try {
            const token = await db(this.tableName)
                .insert(tokenData)
                .returning('api-key')

            return token
        } catch (error) {
            console.error('Error creating token:', error)
            return null
        }
    }

    async replace(tokenData) {
        try {
            const token = await db(this.tableName)
                .insert(tokenData)
                .onConflict('api_key')
                .merge()
                .returning('*')

            return token
        } catch (error) {
            console.error('Error creating token:', error)
            return null
        }
    }

    async getByApiKey(apiKey) {
        try {
            const token = await db(this.tableName)
                .where({ api_key: apiKey })
                .first()
            return token
        } catch (error) {
            console.error('Error retrieving token by job ID:', error)
            return null
        }
    }

    async delete(apiKey) {
        try {
            const deletedToken = await db(this.tableName)
                .where({ api_key: apiKey })
                .del()
            return deletedToken
        } catch (error) {
            console.error('Error deleting token:', error)
            return null
        }
    }
}

module.exports = Token
