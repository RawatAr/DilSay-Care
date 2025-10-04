exports.up = function(knex) {
  return knex.schema.createTable('slot_exceptions', function(table) {
    table.increments('id').primary();
    table.integer('slot_id').notNullable().references('id').inTable('slots').onDelete('CASCADE');
    table.date('exception_date').notNullable();
    table.time('start_time').nullable().comment('If null, slot is deleted for this date');
    table.time('end_time').nullable().comment('If null, slot is deleted for this date');
    table.timestamps(true, true);
    
    // Unique constraint to prevent duplicate exceptions for the same slot and date
    table.unique(['slot_id', 'exception_date']);
    table.index(['exception_date']);
    table.index(['slot_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('slot_exceptions');
};
