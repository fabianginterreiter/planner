
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
        table.integer('default_unit_id');
        table.foreign('default_unit_id').references('id').inTable('units');
    })
    .createTable('recipes', function (table) {
       table.increments('id');
       table.timestamps(false, true);
       table.string('name', 255).notNullable();
       table.string('source', 255).notNullable();
       table.integer('portions');
    })
    .createTable('additions', function(table) {
        table.integer('recipe_id').unsigned().notNullable();
        table.foreign('recipe_id').references('id').inTable('recipes');
        table.integer('ingredient_id').unsigned().notNullable();
        table.foreign('ingredient_id').references('id').inTable('ingredients');
        table.integer('unit_id');
        table.float('amount').notNullable();
        table.integer('position');
        table.unique(['recipe_id', 'ingredient_id']);
    })
    .createTable('steps', function (table) {
        table.text('description').notNullable();
        table.integer('recipe_id').unsigned().notNullable();
        table.foreign('recipe_id').references('id').inTable('recipes');
        table.integer('position');
        table.unique(['recipe_id', 'position']);
    })
    .createTable('entries', function (table) {
        table.integer('year').notNullable();
        table.integer('month').notNullable();
        table.integer('day').notNullable();
        table.integer('portions').notNullable();
        table.integer('recipe_id').notNullable();
        table.foreign('recipe_id').references('id').inTable('recipes');
        table.unique(['recipe_id', 'year', 'month', 'day']);
    })
};

exports.down = function(knex) {
  
};
