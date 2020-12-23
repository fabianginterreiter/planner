import React, { Component } from 'react';
import { connect } from 'react-redux'
import { setRecipes, deleteRecipe } from '../actions'
import NewRecipeForm from './NewRecipeForm';

import {
    Link
  } from "react-router-dom";

class Recipes extends Component {
    componentDidMount() {
        this.callApi()
      .then(res => this.props.setRecipes(res))
      .catch(err => console.log(err));
    }

    callApi = async () => {
        const response = await fetch('/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({query: "{ recipes { id, name } }"})
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
    
        return body.data.recipes;
      };

    deleteRecipe(recipe) {
      fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({query: `mutation {
          deleteRecipe(id: ${recipe.id})
        }
        `})
      }).then(() => this.props.deleteRecipe(recipe));
    }

    render() {
        return <div>
          <NewRecipeForm />
                <ul>{this.props.recipes.map((recipe) => <li key={recipe.id}><Link to={`/recipes/${recipe.id}`}>{recipe.name}</Link> <button onClick={() => this.deleteRecipe(recipe)}>Delete</button></li>)}</ul>
            </div>
    }
}

const mapStateToProps = state => ({
    recipes: state.recipes
})

const mapDispatchToProps = dispatch => ({
    setRecipes: recipes => dispatch(setRecipes(recipes)),
    deleteRecipe: recipe => dispatch(deleteRecipe(recipe))
})

export default connect(mapStateToProps, mapDispatchToProps)(Recipes)