
exports.up = function (knex) {
  return knex.schema
    .createTable('units', (table) => {
      table.increments();
      table.string('name', 50).notNullable();
      table.string('short', 20).notNullable();
    })
    .createTable('ingredients', (table) => {
      table.increments('id');
      table.string('name', 255).notNullable();
      table.integer('default_unit_id');
      table.text('description');
      table.boolean('vegan');
      table.boolean('vegetarian');
    })
    .createTable('recipes', (table) => {
      table.increments('id');
      table.timestamps(false, true);
      table.string('name', 255).notNullable();
      table.string('source', 255).notNullable();
      table.integer('portions');
      table.text('description');
      table.integer('time');
    })
    .createTable('additions', (table) => {
      table.integer('recipe_id').unsigned().notNullable();
      table.foreign('recipe_id').references('id').inTable('recipes');
      table.integer('ingredient_id').unsigned().notNullable();
      table.foreign('ingredient_id').references('id').inTable('ingredients');
      table.integer('unit_id');
      table.float('amount').notNullable();
      table.integer('position');
      table.unique(['recipe_id', 'ingredient_id']);
      table.string('description', 100);
    })
    .createTable('steps', (table) => {
      table.text('description').notNullable();
      table.integer('recipe_id').unsigned().notNullable();
      table.foreign('recipe_id').references('id').inTable('recipes');
      table.integer('position');
      table.unique(['recipe_id', 'position']);
    })
    .createTable('entries', (table) => {
      table.integer('year').notNullable();
      table.integer('month').notNullable();
      table.integer('day').notNullable();
      table.integer('portions').notNullable();
      table.integer('recipe_id').notNullable();
      table.foreign('recipe_id').references('id').inTable('recipes');
      table.unique(['recipe_id', 'year', 'month', 'day']);
    });
};

exports.down = function (knex) {

};
