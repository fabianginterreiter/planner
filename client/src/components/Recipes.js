import React, { Component } from 'react';
import { connect } from 'react-redux'
import { setRecipes, deleteRecipe } from '../actions'
import NewRecipeForm from './NewRecipeForm';
import { withRouter } from "react-router";

import {
  Link
} from "react-router-dom";
import queryString from 'query-string';

class Recipes extends Component {
  componentDidMount() {
    this.callApi()
      .then(res => this.props.setRecipes(res))
      .catch(err => console.log(err));
  }

  createFilter(params) {
    var filter = '';
    if (params.unitId) {
      filter = `( unitId: ${params.unitId} )`;
    }

    return filter;
  }

  callApi = async () => {
    const params = queryString.parse(this.props.location.search);
    var filter = this.createFilter(params);


    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query: `{ recipes ${filter} { id, name } }` })
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body.data.recipes;
  };



  render() {
    return <div>
      <ul>
        {this.props.recipes.map((recipe) => <li key={recipe.id}><Link to={`/recipes/${recipe.id}`}>{recipe.name}</Link></li>)}
      </ul>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Recipes))