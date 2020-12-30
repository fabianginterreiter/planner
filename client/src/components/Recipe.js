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
          body: JSON.stringify({query: `{ recipes(id: ${id}) {  
            id
            name
            source
            portions
            steps {
              description
            }
            additions {
              amount
              unit {
                id
                name
                short
              }
              ingredient {
                id
                name
              }
            }
          }
        }`})
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
    
        return body.data.recipes[0];
      };

      deleteRecipe() {
        fetch('/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({query: `mutation {
            deleteRecipe(id: ${this.props.recipe.id})
          }
          `})
        }).then(() => this.props.history.push(`/recipes`));
      }

    render() {
      if (!this.props.recipe || !this.props.recipe.name) {
        return <div />;
      }

      return <div>
          <h1>{this.props.recipe.name}</h1>
          <Link to={`/recipes/${this.props.match.params.id}/edit`}>Edit</Link>
          <button onClick={() => this.deleteRecipe()}>Delete</button>

<br />
{this.props.recipe.source} - {this.props.recipe.portions}
          <h2>Zutaten</h2>
          <ul>
            {this.props.recipe.additions.map((addition) => <li key={addition.ingredient.id}>{addition.amount > 0 ? addition.amount : ''}{addition.unit ? addition.unit.short : ''} <Link to={`/ingredients/${addition.ingredient.id}`}>{addition.ingredient.name}</Link></li>)}
          </ul>

          <h2>Zubereitung</h2>
          <ol>
            {this.props.recipe.steps.map((step, idx) => <li key={idx}>{step.description.split("\n").map((i, key) => <div key={key}>{i}</div>)}</li>)}            
          </ol>
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