const express = require('express');
const bodyParser = require('body-parser');
var { graphqlHTTP } = require('express-graphql');
var { GraphQLSchema, GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLString, GraphQLInt, GraphQLID } = require('graphql');

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
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    defaultUnit: {
      type: unitType,
      resolve: ({default_unit_id}) => {
        return knex('units').where('id', default_unit_id).first();
      }
    }
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
    id: { type: GraphQLID },
    amount: {type: GraphQLInt },
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
    steps: {
      type: GraphQLList(stepType),
      resolve: ({id}) => {
        return knex('steps').where('recipe_id', id);
      }
    },

    additions: {
      type: GraphQLList(additionType),
      resolve: ({id}) => {
        return knex('additions').where('recipe_id', id);
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
        name: { type: GraphQLString }
      },

      resolve: (_, {id, name}) => {
        return knex('recipes').where('id', id).update({
          name
        }).then(() => knex('recipes').where('id', id).first());
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