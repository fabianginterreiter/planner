import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from "react-router";
import { setIngredients } from '../actions';
import { Link } from "react-router-dom";
import InputSelectForm from './InputSelectForm';

class Week extends Component {

  state = { days: [], recipes: [] }

  componentDidMount() {
    const today = new Date();

    var days = [];

    for (var i = 0; i < 7; i++) {
        var day = new Date();
        day.setDate(today.getDate() + i);
        days.push({
            date: day,
            year: day.getFullYear(), 
            month: day.getMonth() + 1, 
            day: day.getDate() ,
            key: `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`,
            entries: []
        });
    }

    this.setState({
        days
    })

    const daysString = JSON.stringify(days.map((d) => (`${d.year}-${d.month}-${d.day}`)));

    fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({query: `{
            recipes {id name}
            entries(days: ${daysString}) {
              day
              entries {
                portions,
                recipe {
                  id
                  name
                }
              }
            }
          
          }`})
        }).then((response) => response.json()).then((body) => this.setState({
            recipes: body.data.recipes,
            days: days.map((day, idx) => ({...day, entries: body.data.entries[idx].entries}))
        }))
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
                body: JSON.stringify({query: `mutation {
                  createRecipe(name: "${value.name}") {
                    id name
                  }
                }
                `})})
                .then((response) => response.json()).then((body) => this.saveEntry(key, body.data.createRecipe))
        } else  {
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
            body: JSON.stringify({query: `mutation {
                createEntry(day: "${key}", portions: 2, recipeId: ${value.id}) {
                recipe {
                    id
                    name
                }
                portions
                }
            }
            `})}).then((response) => response.json()).then((body) => this.setState({
                days: this.state.days.map((day) => {
                    if (day.key === key) {
                        return {...day, entries: [...day.entries, body.data.createEntry]}
                    } else {
                        return day;
                    }
                })
            }))
    }
   
    render() {
      return <div>
          {this.state.days.map((day, idx) => 
            <div key={idx}>
              {day.date.toDateString()} aaaa {day.day.year}
              <ul>{day.entries.map((entry, idx) => <li key={idx}><Link to={`/recipes/${entry.recipe.id}`}>{entry.recipe.name}</Link></li>)}</ul>
            <InputSelectForm 
                value={null} 
                values={this.state.recipes} 
                onChange={(value) => this.handleAddingRecipe(day.key, value)}
                clearAfterChange={true}
                />
            </div>)}
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