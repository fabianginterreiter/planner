
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('units').del()
  .then(() => knex('units').insert([
      {id: 1, name: 'Gramm', short: 'gr'},
      {id: 2, name: 'Messerspitze', short: 'Msp'}
  ]))
  .then(() => knex('ingredients').del())
    .then(() => knex('ingredients').insert([
      {id: 1, name: 'Zucker', default_unit_id: 1},
      {id: 2, name: 'Salz', default_unit_id: 2}
    ]))
    .then(() => knex('recipes').del())
    .then(() => knex('recipes').insert([
        {id: 1, name: 'Pesto'},
        {id: 2, name: 'Sellerieschnitzel'},
        {id: 3, name: 'Tomatensauce'}
      ]))
      .then(() => knex('additions').del())
      .then(() => knex('additions').insert([
        {id: 1, recipe_id: 1, ingredient_id: 1, unit_id: 1, amount: 100, position: 1},
        {id: 2, recipe_id: 1, ingredient_id: 2, unit_id: 2, amount: 1, position: 2}
      ]))
      .then(() => knex('steps').del())
      .then(() => knex('steps').insert([
        {id: 1, recipe_id: 1, description: 'Hello Step 1', position: 1},
        {id: 2, recipe_id: 1, description: 'Hello Step 2', position: 2}
      ]))
      ;
};
