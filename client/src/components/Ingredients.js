import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { setIngredients } from '../actions'

class Ingredients extends Component {

  state = { loaded: false }

  componentDidMount() {
    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `{ 
        ingredients {id name}
        }`})
    }).then((response) => response.json()).then((body) => this.props.setIngredients(body.data.ingredients))
  }


  render() {
    return <div>
      <ul>
        {this.props.ingredients.map((ingredient) => <li key={ingredient.id}><Link to={`/ingredients/${ingredient.id}`}>{ingredient.name}</Link></li>)}
      </ul></div>
  }
}

const mapStateToProps = state => ({
  ingredients: state.ingredients
})

const mapDispatchToProps = dispatch => ({
  setIngredients: ingredients => dispatch(setIngredients(ingredients)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Ingredients))