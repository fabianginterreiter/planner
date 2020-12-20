import React, { Component } from 'react';
import { connect } from 'react-redux'
import { setRecipes } from '../actions'

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
        const response = await fetch('/api/recipes');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
    
        return body;
      };

    render() {
        return <div>
                <ul>{this.props.recipes.map((recipe) => <li key={recipe.id}><Link to={`/recipes/${recipe.id}`}>{recipe.name}</Link></li>)}</ul>
            </div>
    }
}

const mapStateToProps = state => ({
    recipes: state.recipes
})

const mapDispatchToProps = dispatch => ({
    setRecipes: recipes => dispatch(setRecipes(recipes))
})

export default connect(mapStateToProps, mapDispatchToProps)(Recipes)