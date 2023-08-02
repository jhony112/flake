const db = require('../database/knex');

/**
 * @property {number} id - The unique identifier of the webhook.
 * @property {string} job_id - The job ID associated with the webhook.
 * @property {string} url - The URL endpoint where the webhook should be sent.
 * @property {number} retry_count - The number of times the webhook has been retried.
 * @property {object} request_payload - The payload data sent with the webhook request.
 * @property {object} [response_payload] - The payload data received in response to the webhook request.
 * @property {string} status - The status of request.
 * @property {Date} [last_attempted_at] - The timestamp of the last attempted webhook request.
 * @property {Date} created_at - The timestamp indicating when the webhook was created.
 * @property {Date} updated_at - The timestamp indicating the last update to the webhook.
 */

/**
 * Represents a webhook entry in the webhooks table.
 *
 * @class
 * @name Webhook
 */
class Webhook {
    constructor() {
        this.tableName = 'webhooks';
    }

    /**
     * Create a new webhook entry.
     *
     * @param {Object} webhookData - The data for the webhook entry.
     * @param {string} webhookData.job-id - The job-id or any unique identifier.
     * @param {string} webhookData.url - The URL endpoint where the webhook should be sent.
     * @param {Object} webhookData.request_payload - The URL endpoint where the webhook should be sent.
     * @returns {Promise<Object>} A promise that resolves to the created webhook entry.
     * @throws {Error} If an error occurs while creating the webhook.
     *
     * @memberof Webhook
     * @instance
     */
    async add(webhookData) {
        try {
            const webhook = await db(this.tableName).insert(webhookData).returning('job_id');

            return webhook;
        } catch (error) {
            console.error('Error creating webhook:', error);
            return null;
        }
    }

    async addSafe(webhookData) {
        try {
            const createdWebhook = await db(this.tableName)
                .insert(webhookData)
                .onConflict('job_id')
                .merge()
                .returning(['id', 'job_id', 'payload', 'request_id', 'request_payload', 'url']);

            return createdWebhook ? createdWebhook[0] : null;
        } catch (error) {
            console.error('Error creating webhook:', error);
            return null;
        }
    }

    async getPaginate(pageOptions, exclusionList = []) {
        try {
            const { limit, offset, where } = pageOptions;

            const totalItemsQuery = db(this.tableName).count('id as count').where(where);
            const [{ count }] = await totalItemsQuery;
            const totalItems = parseInt(count, 10);

            const allWebhook = await db(this.tableName)
                .select('*')
                .where(where)
                .limit(limit || 10)
                .offset(offset || 0)
                .orderBy('id', 'desc');

            const values = allWebhook || [];
            values.forEach((v) => {
                // eslint-disable-next-line no-param-reassign
                exclusionList.forEach((e) => (v[e] ? delete v[e] : ''));
            });
            const totalPages = Math.ceil(totalItems / limit || 10);
            const page = offset > 0 ? offset * limit : 1;
            return { jobs: values, meta: { total: totalItems, pages: totalPages, current_page: page } };
        } catch (error) {
            console.error('Error fetching webhook:', error);
            return null;
        }
    }

    /**
     *
     * @param webhookData
     * @return {Promise<null|awaited Knex.QueryBuilder<TRecord, DeferredKeySelection<TRecord, never>[]>>}
     */

    async create(webhookData) {
        try {
            const webhook = await db(this.tableName).insert(webhookData).returning('*');

            return webhook;
        } catch (error) {
            console.error('Error creating webhook:', error);
            return null;
        }
    }

    /**
     *
     * @param id
     * @return {Promise<null|awaited Knex.QueryBuilder<TRecord, DeferredKeySelection.AddUnionMember<UnwrapArrayMember<TResult>, undefined>>>}
     */
    async getById(id) {
        try {
            const webhook = await db(this.tableName).where({ id }).first();
            return webhook;
        } catch (error) {
            console.error('Error retrieving webhook by ID:', error);
            return null;
        }
    }

    /**
     *
     * @param jobId
     * @return {Promise<null|awaited Knex.QueryBuilder<TRecord, DeferredKeySelection.AddUnionMember<UnwrapArrayMember<TResult>, undefined>>>}
     */
    async getByJobId(jobId) {
        try {
            const webhook = await db(this.tableName).where({ job_id: jobId }).first();
            return webhook;
        } catch (error) {
            console.error('Error retrieving webhook by job ID:', error);
            return null;
        }
    }

    /**
     *
     * @param jobId
     * @param exclusionList
     * @return {Promise<null|awaited Array>>}
     */
    async getByJobIdOrRequestId(jobId, exclusionList = []) {
        try {
            const webhook = await db(this.tableName).where((builder) => {
                builder.where('job_id', jobId).orWhere('request_id', jobId).limit(10);
            });
            const values = webhook;
            values.forEach((v) => {
                // eslint-disable-next-line no-param-reassign
                exclusionList.forEach((e) => delete v[e]);
            });

            return values;
        } catch (error) {
            console.error('Error retrieving webhook by job ID:', error);
            return null;
        }
    }

    async delete(id) {
        try {
            const deletedCount = await db(this.tableName).where({ id }).del();
            return deletedCount;
        } catch (error) {
            console.error('Error deleting webhook:', error);
            return null;
        }
    }

    async update(id, data) {
        try {
            const update = await db(this.tableName)
                .where({ id })
                .onConflict('job_id')
                .merge()
                .update({ ...data });
            return update;
        } catch (error) {
            console.error('Error deleting webhook:', error);
            return null;
        }
    }

    async updateRetry(id, data, number = 1) {
        try {
            const update = await db(this.tableName)
                .where({ id })
                .increment('retry_count', number)
                // .onConflict('job_id')
                // .merge()
                .update({
                    ...data,
                    meta: db.raw('meta || ?', JSON.stringify(data.meta)),
                });

            return update;
        } catch (error) {
            console.error('Error updating webhook:', error);
            return null;
        }
    }

    async incrementRetry(id, number = 1) {
        try {
            const update = await db(this.tableName).where({ id }).increment('retry_count', number);
            return update;
        } catch (error) {
            console.error('Error deleting webhook:', error);
            return null;
        }
    }

    async batchDelete(ids) {
        try {
            const deletedCount = await db(this.tableName).whereIn('id', ids).del();
            return deletedCount;
        } catch (error) {
            console.error('Error deleting webhooks:', error);
            return null;
        }
    }

    async deleteOldRecords() {
        try {
            const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
            const deletedCount = await db(this.tableName)
                .where('status', 'sent')
                .where('created_at', '<', cutoffDate)
                .del();
            return deletedCount;
        } catch (error) {
            console.error('Error deleting old records:', error);
            return null;
        }
    }
}

module.exports = Webhook;
