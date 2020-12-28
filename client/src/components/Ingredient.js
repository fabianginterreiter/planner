import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from "react-router";
import { setIngredient } from '../actions';
import {Link } from "react-router-dom";

class Ingredient extends Component {

  state = { loaded:false }

  componentDidMount() {
    fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({query: `{ 
        ingredients (id: ${this.props.match.params.id}) {id name recipes {
            id
            name
          }}
        }`})
        }).then((response) => response.json()).then((body) => this.props.setIngredient(body.data.ingredients[0])).then(() => this.setState({loaded:true}))
    }

   
    render() {
        if (!this.state.loaded) {
            return <div />
        }

      return <div>
          <h1>{this.props.ingredient.name}</h1>
          <div><h2>Rezepte</h2>
          {this.props.ingredient.recipes.length > 0 && <ul>
                {this.props.ingredient.recipes.map((recipe) => <li key={recipe.id}><Link to={`/recipes/${recipe.id}`}>{recipe.name}</Link></li>)}              
            </ul>}
          </div></div>
    }
}

const mapStateToProps = state => ({
  ingredient: state.ingredient
})

const mapDispatchToProps = dispatch => ({
  setIngredient: ingredient => dispatch(setIngredient(ingredient)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Ingredient))