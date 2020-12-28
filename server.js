const express = require('express');
const bodyParser = require('body-parser');
var { graphqlHTTP } = require('express-graphql');
var { GraphQLSchema, GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLString, GraphQLInt, GraphQLID, GraphQLFloat, GraphQLNonNull, GraphQLInputObjectType } = require('graphql');

const knex = require('knex')(require('./knexfile')['development']);

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var unitType = new GraphQLObjectType({
  name: 'Unit',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    short: { type: GraphQLString }
  }
});

var ingredientType = new GraphQLObjectType({
  name: 'Ingredient',
  fields: () => { return {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    defaultUnit: {
      type: unitType,
      resolve: ({default_unit_id}) => {
        return knex('units').where('id', default_unit_id).first();
      }
    },

    recipes: {
      type: new GraphQLList(recipeType),
      resolve: ({id}) =>  knex('recipes')
        .join('additions', 'recipes.id', 'additions.recipe_id')
        .where('additions.ingredient_id', id)
        .select('recipes.*')
    }}
  }
});

var stepType = new GraphQLObjectType({
  name: 'Step',
  fields: {
    id: { type: GraphQLID },
    position: { type: GraphQLInt },
    description: { type: GraphQLString }
  }
})

var additionType = new GraphQLObjectType({
  name: 'Addition',
  fields: {
    amount: {type: GraphQLFloat },
    position: {type: GraphQLInt },
    unit: {
      type: unitType,
      resolve: ({unit_id}) => {
        return knex('units').where('id', unit_id).first();
      }
    },
    ingredient: {
      type: ingredientType,
      resolve: ({ingredient_id}) => {
        return knex('ingredients').where('id', ingredient_id).first();
      }
    },
  }
});

var recipeType = new GraphQLObjectType({
  name: 'Recipe',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    source: { type: GraphQLString },
    portions: { type: GraphQLInt },
    steps: {
      type: GraphQLList(stepType),
      resolve: ({id}) => {
        return knex('steps').where('recipe_id', id);
      }
    },

    additions: {
      type: GraphQLList(additionType),
      resolve: ({id}) => {
        return knex('additions').where('recipe_id', id).orderBy('position');
      }
    }
  }
});



var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ingredients: {
      type: new GraphQLList(ingredientType),
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (_, {id}) => {
        var query = knex('ingredients');

        if (id) {
          query.where('id', id);
        }

        return query;
      }
    },

    recipes: {
      type: new GraphQLList(recipeType),
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (_, {id}) => {
        var query = knex('recipes');

        if (id) {
          query.where('id', id);
        }

        return query;
      }
    },

    units: {
      type: new GraphQLList(unitType),
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (_, {id}) => {
        var query = knex('units');

        if (id) {
          query.where('id', id);
        }

        return query;
      }
    }
  }
});

var mutationType = new GraphQLObjectType({
  name: 'Mutation',

  fields: {
    createRecipe: {
      type: recipeType,
      args: {
        name: { type: GraphQLString } 
      },
      resolve: (_, {name}) => {

      return knex.table('recipes').insert({
          'name':  name
        }).then((ids) => knex('recipes').where('id', ids[0]).first());
      }
    },

    updateRecipe: {
      type: recipeType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        source: { type: GraphQLString },
        portions: { type: GraphQLInt },
        additions: { 
          type: GraphQLList(new GraphQLInputObjectType({
            name: 'AdditionInputType',
            fields: {
              ingredientId: { type: GraphQLID },
              unitId: { type: GraphQLID },
              amount: { type: GraphQLFloat }
            }
          }))
        },

        steps: {
          type: GraphQLList( new GraphQLInputObjectType({
            name: 'StepsInputType',
            fields: {
              description: { type: GraphQLString }
            }
          }))
        }
      },

      resolve: (_, {id, name, source, portions, additions, steps}) => {
        return knex('recipes').where('id', id).update({
          name,
          source,
          portions
        })
        .then(() => knex('additions').where('recipe_id', id).del())
        .then(() => knex('additions').insert(additions.map((addition, index) => {
          return {
          "recipe_id": id,
          "ingredient_id": addition.ingredientId,
          "unit_id": addition.unitId,
          "amount": addition.amount,
          "position": index
        }})))
        .then(() => knex('steps').where('recipe_id', id).del())
        .then(() => knex('steps').insert(steps.map((step, index) => {
          return {
          "recipe_id": id,
          "position": index,
          "description": step.description
        }})))
        .then(() => knex('recipes').where('id', id).first());
      }
    },

    deleteRecipe: {
      type: GraphQLString,
      args: {
        id: { type: GraphQLID }
      },
      resolve: (_, {id}) => {
        return knex('recipes').where('id', id).del().then(() => { return "OK" });
      }
    },

    createIngredient: {
      type: ingredientType,
      args: {
        name: { type: GraphQLString }
      },
      resolve: (_, {name}) => knex('ingredients').insert({name}).then((ids) => knex('ingredients').where('id', ids[0]).first())
    },

    createIngredients: {
      type: GraphQLList(ingredientType),
      args: {
        names: { type: GraphQLList(GraphQLString) }
      },
      resolve: (_, {names}) => {
        console.log(names);

        return Promise.all(names.map((name) => knex('ingredients').insert({name}).then((ids) => (ids[0])))).then((ids) => {
          console.log(ids);
          return knex('ingredients').whereIn('id', ids);
        })
      }
    },

    updateIngredient: {
      type: ingredientType,
      args: {
        id: {type: GraphQLInt},
        name: {type: GraphQLString}
      },
      resolve: (_, {name}) => knex('ingredients').where('id', id).update({name}).then(() => knex('ingredients').where('id', id).first())
    },

    deleteIngredient: {
      type: GraphQLString,
      args: {
        id: { type: GraphQLInt}
      },
      resolve: (_, {id}) => knex('ingredients').where('id', id).del().then(() => { return "OK" })
    }
  }  
});

var schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

app.listen(port, () => console.log(`Listening on port ${port}`));