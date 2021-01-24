import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from "react-router";
import { setIngredients } from '../actions';
import { Link } from "react-router-dom";
import InputSelectForm from './InputSelectForm';
import './Calendar.css';
import IngredientsOverview from './IngredientsOverview';

class Week extends Component {
  constructor(props) {
    super(props);

    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setDate(minDate.getDate() + 30);
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(minDate.getDate() + 7);

    this.state = {
      days: [],
      recipes: [],
      showShoppingList: false,
      minDate: minDate.toISOString().split('T')[0],
      maxDate: maxDate.toISOString().split('T')[0],
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    }
  }

  getDays(startDate, endDate) {
    var days = [];

    var max = endDate.getDate() - startDate.getDate();

    for (var i = 0; i < max; i++) {
      var day = new Date();
      day.setDate(startDate.getDate() + i);
      days.push({
        date: day,
        year: day.getFullYear(),
        month: day.getMonth() + 1,
        day: day.getDate(),
        key: `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`,
        entries: []
      });
    }

    return days;
  }

  componentDidMount() {
    this.loadDays(this.state.startDate, this.state.endDate);
  }


  loadDays(startDate, endDate) {
    this.setState({
      startDate, endDate
    }, () => {

      var days = this.getDays(new Date(startDate), new Date(endDate));

      const daysString = JSON.stringify(days.map((d) => (`${d.year}-${d.month}-${d.day}`)));

      fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `{
            recipes {id name}
            entries(days: ${daysString}) {
              day
              entries {
                portions,
                recipe {
                  id
                  name
                  portions
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
              }
            }
          
          }`})
      }).then((response) => response.json()).then((body) => this.setState({
        recipes: body.data.recipes,
        days: days.map((day, idx) => ({ ...day, entries: body.data.entries[idx].entries }))
      }))
    });
  }

  handleAddingRecipe(key, value) {
    if (!value) {
      return;
    }

    if (!value.id || value.id === 0) {
      console.log("Create: " + value.name);

      fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation {
                  createRecipe(name: "${value.name}") {
                    id name
                  }
                }
                `})
      })
        .then((response) => response.json()).then((body) => this.saveEntry(key, body.data.createRecipe))
    } else {
      this.saveEntry(key, value);
    }
  }

  saveEntry(key, value) {
    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `mutation {
                createEntry(day: "${key}", portions: 2, recipeId: ${value.id}) {
                recipe {
                  id
                  name
                  portions
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
                portions
                }
            }
            `})
    }).then((response) => response.json()).then((body) => this.setState({
      days: this.state.days.map((day) => {
        if (day.key === key) {
          return { ...day, entries: [...day.entries, body.data.createEntry] }
        } else {
          return day;
        }
      })
    }))
  }

  getValues(text, recipesToFilter) {
    return new Promise((resolve, reject) => {
      resolve(this.state.recipes.filter(value => !recipesToFilter.includes(value.id) && value.name.toLowerCase().startsWith(text.toLowerCase())));
    });
  }

  handlePortionsChange(e, key, recipeId) {
    const portions = e.target.value;

    this.setState({
      days: this.state.days.map((day) => {
        if (key === day.key) {
          return {
            ...day, entries: day.entries.map((entry) => {
              if (entry.recipe.id === recipeId) {
                return { ...entry, portions };
              }
              return entry;
            })
          };
        }
        return day;
      })
    })

    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `mutation {
            updateEntry(day: "${key}", portions: ${portions}, recipeId: ${recipeId}) {
            portions
            }
        }
        `})
    });
  }

  handleEntryDelete(key, recipeId) {
    this.setState({
      days: this.state.days.map((day) => {
        if (key === day.key) {
          return { ...day, entries: day.entries.filter((entry) => entry.recipe.id !== recipeId) };
        }
        return day;
      })
    })

    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `mutation {
            deleteEntry(day: "${key}", recipeId: ${recipeId})
        }
        `})
    });
  }

  getIngredientsOverview() {
    var ingredients = {};

    this.state.days.forEach((day) => day.entries.forEach((entry) => {
      entry.recipe.additions.forEach((addition) => {
        if (!ingredients[addition.ingredient.id]) {
          ingredients[addition.ingredient.id] = {
            id: addition.ingredient.id,
            name: addition.ingredient.name,
            amounts: []
          };
        }

        const amount = addition.amount / Math.max(entry.recipe.portions, 1) * Math.max(entry.portions, 1);

        var amountUnitIndex = ingredients[addition.ingredient.id].amounts.findIndex((amount) => addition.unit ? amount.unit.id === addition.unit.id : amount.unit.id === 0);

        if (amountUnitIndex < 0) {
          ingredients[addition.ingredient.id].amounts.push({
            unit: addition.unit ? addition.unit : { id: 0, name: '' },
            amount
          })
        } else {
          ingredients[addition.ingredient.id].amounts[amountUnitIndex].amount = ingredients[addition.ingredient.id].amounts[amountUnitIndex].amount + amount
        }
      })
    }));

    return Object.keys(ingredients).map((key) => ingredients[key]);
  }

  getRecipesWithoutIngredients() {
    const recipes = [];
    const ids = [];

    this.state.days.forEach((day) => day.entries.forEach((entry) => {
      if (entry.recipe.additions.length === 0 && !ids.includes(entry.recipe.id)) {
        recipes.push(entry.recipe);
        ids.push(entry.recipe.id);
      }
    }));

    return recipes;
  }

  render() {
    return <div>
      {this.state.showShoppingList && <IngredientsOverview ingredients={this.getIngredientsOverview()} recipesWithoutIngredients={this.getRecipesWithoutIngredients()} onClose={() => this.setState({ showShoppingList: false })} />}

Zwischen <input type="date" value={this.state.startDate} min={this.state.minDate} max={this.state.endDate} onChange={(e) => this.loadDays(e.target.value, this.state.endDate)} /> und
<input type="date" value={this.state.endDate} min={this.state.startDate} max={this.state.maxDate} onChange={(e) => this.loadDays(this.state.startDate, e.target.value)} />
      <div><button onClick={() => this.setState({ showShoppingList: true })}>Shopping List</button></div>

      <table>
        {this.state.days.map((day, idx) =>
          <tbody key={idx} className="day">
            <tr><th colSpan="3"> {day.date.toDateString()}</th></tr>

            {day.entries.map((entry, idx) => <tr key={idx}>
              <td><Link to={`/recipes/${entry.recipe.id}`}>{entry.recipe.name}</Link> </td>
              <td><input type="number" value={entry.portions} onChange={(e) => this.handlePortionsChange(e, day.key, entry.recipe.id)} min="1" /></td>
              <td><button onClick={() => this.handleEntryDelete(day.key, entry.recipe.id)}>Delete</button></td>
            </tr>)}
            <tr><td colSpan="3">
              <InputSelectForm
                value={null}
                onSubmit={(value) => this.handleAddingRecipe(day.key, value)}
                clearOnSubmit={true}
                clearOnCancel={true}
                placeholder={'Rezept'}
                values={(text) => this.getValues(text, day.entries.map((entry, idx) => entry.recipe.id))} /></td></tr>
          </tbody>)}

      </table>

    </div>
  }
}

const mapStateToProps = state => ({
  ingredients: state.ingredients
})

const mapDispatchToProps = dispatch => ({
  setIngredients: ingredients => dispatch(setIngredients(ingredients)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Week))