/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('webhooks', (table) => {
        table.bigInteger('id').primary();
        table.string('job_id').notNullable().unique().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('url').notNullable();
        table.string('request_id');
        table.integer('retry_count').defaultTo(0).notNullable();
        table.json('request_payload').notNullable();
        table.json('payload').notNullable();
        table.json('response_payload');
        table.jsonb('meta').defaultTo([]);
        table.string('status').defaultTo('pending').notNullable();
        table.timestamp('last_attempted_at');
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('webhooks');
};
