import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from "react-router";
import {Link } from "react-router-dom";
import { setRecipe } from '../actions'

class Recipe extends Component {
  componentDidMount() {
    this.props.setRecipe(null);

    this.callApi(this.props.match.params.id)
      .then(res => this.props.setRecipe(res))
      .catch(err => console.log(err));
    }

    callApi = async (id) => {
        const response = await fetch('/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({query: `{ recipes(id: ${id}) { id, name } }`})
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
    
        return body.data.recipes[0];
      };

    render() {
      if (!this.props.recipe) {
        return <div />;
      }

      return <div>
          {this.props.recipe.name}
          <Link to={`/recipes/${this.props.match.params.id}/edit`}>Edit</Link>
          </div>
    }
}

const mapStateToProps = state => ({
  recipe: state.recipe
})

const mapDispatchToProps = dispatch => ({
  setRecipe: recipe => dispatch(setRecipe(recipe))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Recipe))