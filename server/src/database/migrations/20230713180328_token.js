/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('tokens', (table) => {
        table.increments() // this represents the primary key.
        table.string('name') // this is a column.
        table.string('description') // this is a column.
        table.string('api_key') // this is a column.
        table.boolean('enabled').defaultTo(true) // this is a column.
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
        table.timestamp('expires_at').nullable()
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('tokens')
}
