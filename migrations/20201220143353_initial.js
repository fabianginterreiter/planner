
exports.up = function(knex) {
    return knex.schema
    .createTable('units', function (table) {
        table.increments();
        table.timestamps(false, true);
        table.string('name', 50).notNullable();
        table.string('short', 20).notNullable();
    })
    .createTable('ingredients', function (table) {
        table.increments('id');
        table.timestamps(false, true);
        table.string('name', 255).notNullable();
        table.integer('default_unit_id').notNullable();
        table.foreign('default_unit_id').references('id').inTable('units');
    })
    .createTable('recipes', function (table) {
       table.increments('id');
       table.timestamps(false, true);
       table.string('name', 255).notNullable();
       table.string('source', 255);
    })
    .createTable('additions', function(table) {
        table.increments();
        table.timestamps(false, true);
        table.integer('recipe_id').unsigned().notNullable();
        table.foreign('recipe_id').references('id').inTable('recipes');
        table.integer('ingredient_id').unsigned().notNullable();
        table.foreign('ingredient_id').references('id').inTable('ingredients');
        table.integer('unit_id').notNullable();
        table.foreign('unit_id').references('id').inTable('units');
        table.integer('amount').notNullable();
        table.integer('position');
    })
    .createTable('steps', function (table) {
        table.increments('id');
        table.timestamps(false, true);
        table.text('description').notNullable();
        table.integer('recipe_id').unsigned().notNullable();
        table.foreign('recipe_id').references('id').inTable('recipes');
        table.integer('position');
    });
};

exports.down = function(knex) {
  
};
