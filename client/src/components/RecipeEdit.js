import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from "react-router";
import {Link } from "react-router-dom";
import InputSelectForm from './InputSelectForm';
import { setUnits, setRecipe, setRecipeName, setRecipeSource, setRecipeStepDescription, 
  addRecipeStep, deleteRecipeStep, setRecipePortions, setRecipeAdditionAmount, 
  setRecipeAdditionUnit, setIngredients, addRecipeAddition, deleteRecipeAddition, setRecipeAdditionIngredient } from '../actions'

class RecipeEdit extends Component {

  componentDidMount() {
    this.callApi(this.props.match.params.id)
      .then(res => {
          this.props.setRecipe(res);
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
        units {id name short}
        ingredients {id name}
      }`})
      });
      const body = await response.json();
      if (response.status !== 200) throw Error(body.message);
  
      this.props.setUnits(body.data.units);
      this.props.setIngredients(body.data.ingredients);

      return body.data.recipes[0];
    };

    handleSave = (e) => {
      e.preventDefault();

      Promise.all(this.props.recipe.additions.filter((addition) => !(addition.ingredient.id > 0)).map((addition) => fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({query: `
          mutation {
            createIngredient(
              name: "${addition.ingredient.name}", 
            ) {
              id
              name
            }
          }`})
      }).then((e) => e.json() ).then((body) => body.data.createIngredient))).then((newIngredients) => { return fetch('/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({query: `
            mutation {
              updateRecipe(
                id: ${this.props.match.params.id}, 
                name: "${this.props.recipe.name}", 
                source: "${this.props.recipe.source}",
                portions: ${this.props.recipe.portions},
                steps: [${this.props.recipe.steps.map((step) => {return `{description: """${step.description}"""}`}).join(',')}],
                additions: [
                  ${this.props.recipe.additions.map((add) => {return `{amount:${add.amount}, 
                  ingredientId:${(add.ingredient.id > 0 ? add.ingredient.id : newIngredients.find((ingredient) => add.ingredient.name === ingredient.name).id)}, 
                  unitId:${add.unit ? add.unit.id : 0}}`}).join(',')}],
              ) {
                id
              }
            }`})})}).then((e) => {
              this.props.history.push(`/recipes/${this.props.recipe.id}`);
            });
    }

    handleIngredientChange(idx, ingredient) {
      console.log(ingredient);
      this.props.setRecipeAdditionIngredient(idx, ingredient);
    }

    createAddition(e) {
      e.preventDefault();
      this.props.addRecipeAddition({amount: 1, ingredient: null, unit: {id: 0}})
    }

    render() {
      if (!this.props.recipe) {
        return <div />;
      }

      return <div> 
        <h2>Edit</h2>
        <form>
          <div>
         <label htmlFor="title">Title:</label> <input id="title" type="text" value={this.props.recipe.name} onChange={(e) => this.props.setRecipeName(e.target.value)} />
         </div>
         <div>
         <label htmlFor="source">Source:</label> <input id="source" type="text" value={this.props.recipe.source} onChange={(e) => this.props.setRecipeSource(e.target.value)} />
         </div>
         <div>
         <label htmlFor="portions">Portions:</label> <input id="portions" type="number" min="0" step="1" value={this.props.recipe.portions} onChange={(e) => this.props.setRecipePortions(e.target.value)} />
         </div>

         <h2>Zutaten</h2>

        <div>
          <table>
            <thead>
              <tr>
                <th>Menge</th>
                <th>Einheit</th>
                <th>Zutat</th>
              </tr>
            </thead>
            <tbody>
              {this.props.recipe.additions.map((addition, idx) => <tr key={idx}>
                <td><input type="number" min="0" step="0.1" value={addition.amount} onChange={(e) => this.props.setRecipeAdditionAmount(idx, e.target.value)} /></td>
                <td>
                <select value={addition.unit ? addition.unit.id : 0} 
                  onChange={(e) => this.props.setRecipeAdditionUnit(idx, this.props.units.find(unit => unit.id === e.target.value))}>
                  <option value={0}></option>
                  {this.props.units.map((unit, idx) => <option value={unit.id} key={unit.id}>{unit.name} ({unit.short})</option>)}
                  </select>                  
                </td>
                <td><InputSelectForm value={addition.ingredient} values={this.props.ingredients} onChange={(ingredient) => this.handleIngredientChange(idx, ingredient)} /></td>
                <td><button onClick={(e) => {
                  e.preventDefault();
                  this.props.deleteRecipeAddition(idx);}}>Delete</button></td>
              </tr>)} 
            </tbody>
          </table>
          <button onClick={(e) => this.createAddition(e)}>Add</button>
        </div>

         <h2>Zubereitung</h2>

         <div>
          {this.props.recipe.steps.map((step, idx) => <div key={idx}><textarea value={step.description}
           onChange={(e) => this.props.setRecipeStepDescription(idx, e.target.value)} />
           <button onClick={(e) => { e.preventDefault() ; this.props.deleteRecipeStep(idx); }}>Delete</button>
           </div>)}
           <button onClick={(e) => { e.preventDefault(); this.props.addRecipeStep(); }}>Add</button>
         </div>
         <button onClick={(e) => this.handleSave(e)}>Save</button> <Link to={`/recipes/${this.props.match.params.id}`}>Cancel</Link>
         </form></div>
    }
}

const mapStateToProps = state => ({
  recipe: state.recipe,
  units: state.units,
  ingredients: state.ingredients
})

const mapDispatchToProps = dispatch => ({
  setUnits: units => dispatch(setUnits(units)),
  setIngredients: ingredients => dispatch(setIngredients(ingredients)),
  setRecipe: recipe => dispatch(setRecipe(recipe)),
  setRecipeName: name => dispatch(setRecipeName(name)),
  setRecipeSource: source => dispatch(setRecipeSource(source)),
  setRecipeStepDescription: (index, description) => dispatch(setRecipeStepDescription(index, description)),
  addRecipeStep: () => dispatch(addRecipeStep()),
  deleteRecipeStep: (index) => dispatch(deleteRecipeStep(index)),
  setRecipePortions: (portions) => dispatch(setRecipePortions(portions)),
  setRecipeAdditionAmount: (index, amount) => dispatch(setRecipeAdditionAmount(index, amount)),
  setRecipeAdditionUnit: (index, unit) => dispatch(setRecipeAdditionUnit(index, unit)),
  setRecipeAdditionIngredient: (index, ingredient) => dispatch(setRecipeAdditionIngredient(index, ingredient)),
  addRecipeAddition: (ingredient) => dispatch(addRecipeAddition(ingredient)),
  deleteRecipeAddition: (index) => dispatch(deleteRecipeAddition(index)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RecipeEdit))