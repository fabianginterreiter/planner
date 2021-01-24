import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addRecipe } from '../actions';
import { withRouter } from "react-router";

class NewRecipeForm extends Component {
  state = { name: '' }

  componentDidMount() {
    this.setState({ name: '' });
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `mutation {
            createRecipe(name: "${this.state.name}") {
              id
            }
          }
          `})
    })
      .then((response) => response.json()).then(response => this.props.history.push(`/recipes/${response.data.createRecipe.id}`));
  }

  render() {
    return <div>
      <form onSubmit={(e) => this.handleSubmit(e)}>
        <input type="text" value={this.state.name} onChange={e => this.handleChange(e)} />
      </form>
    </div>
  }
}

const mapStateToProps = state => ({
  recipes: state.recipes
})

const mapDispatchToProps = dispatch => ({
  addRecipe: recipe => dispatch(addRecipe(recipe))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NewRecipeForm))