import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from "react-router";
import {Link } from "react-router-dom";
import { setRecipe } from '../actions'

class RecipeEdit extends Component {
state = {
    recipe : {
        name: '',
        source: ''
    }
}

  componentDidMount() {
    this.props.setRecipe(null);

    this.callApi(this.props.match.params.id)
      .then(res => {
          this.props.setRecipe(res);
          this.setState({recipe:res})
      })
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

    handleNameChange(e) {
        this.setState({recipe: {name: e.target.value}});
    }

    handleSave(e) {
        fetch('/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({query: `mutation {
            updateRecipe(id: ${this.props.match.params.id}, name: "${this.state.recipe.name}") {
              id
            }
          }
          `})
        }).then((e) => this.props.history.push(`/recipes/${this.props.match.params.id}`));
    }

    render() {
      if (!this.state.recipe) {
        return <div />;
      }

      return <div> Edit
         Title: <input type="text" value={this.state.recipe.name} onChange={(e) => this.handleNameChange(e)} /><br />
         <br />
         <button onClick={(e) => this.handleSave(e)}>Save</button> <Link to={`/recipes/${this.props.match.params.id}`}>Cancel</Link>
          </div>
    }
}

const mapStateToProps = state => ({
  recipe: state.recipe
})

const mapDispatchToProps = dispatch => ({
  setRecipe: recipe => dispatch(setRecipe(recipe))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RecipeEdit))