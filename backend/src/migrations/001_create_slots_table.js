exports.up = function(knex) {
  return knex.schema.createTable('slots', function(table) {
    table.increments('id').primary();
    table.integer('day_of_week').notNullable().comment('0=Sunday, 1=Monday, ..., 6=Saturday');
    table.time('start_time').notNullable();
    table.time('end_time').notNullable();
    table.date('created_for_date').notNullable().comment('The original date this slot was created for');
    table.boolean('is_recurring').defaultTo(true);
    table.timestamps(true, true);
    
    // Index for efficient querying by day of week
    table.index(['day_of_week']);
    table.index(['created_for_date']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('slots');
};
