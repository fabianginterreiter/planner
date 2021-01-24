import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { setRecipe } from '../actions';
import './Recipe.css';

// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

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
      body: JSON.stringify({
        query: `{ recipes(id: ${id}) {  
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
    if (!window.confirm(`Rezept '${this.props.recipe.name}' wirklich löschen?`)) {
      return;
    }

    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `mutation {
            deleteRecipe(id: ${this.props.recipe.id})
          }
          `})
    }).then(() => this.props.history.push(`/recipes`));
  }

  renderSource(str) {
    if (validURL(str)) {
      return <a href={str} className="button-simple">{str}</a>
    } else {
      return str
    }
  }

  formatAmount(amount) {

    switch (amount) {
      case 0.25: return "¼";
      case 0.5: return "½";
      case 0.75: return "¾";
      default: return amount;
    }
  }

  render() {
    if (!this.props.recipe || !this.props.recipe.name) {
      return <div />;
    }

    return <div className="Recipe">
      <h1>{this.props.recipe.name}</h1>

      <h2>Zutaten</h2>
      {this.props.recipe.portions > 0 && <div className="portions">Rezept für {this.props.recipe.portions} Portionen.</div>}
      <ul>
        {this.props.recipe.additions.map((addition) => <li key={addition.ingredient.id}>{addition.amount > 0 ? this.formatAmount(addition.amount) : ''}{addition.unit ? addition.unit.short : ''} <Link to={`/ingredients/${addition.ingredient.id}`}>{addition.ingredient.name}</Link></li>)}
      </ul>

      <h2>Zubereitung</h2>
      <ol>
        {this.props.recipe.steps.map((step, idx) => <li key={idx}>{step.description.split("\n").map((i, key) => <div key={key}>{i}</div>)}</li>)}
      </ol>

      <footer>
        <div className="source">Quelle: {this.renderSource(this.props.recipe.source)}</div>
        <div className="options">
          <Link className="button-simple" to={`/recipes/${this.props.match.params.id}/edit`}>Edit</Link>
          <button className="button-simple" onClick={() => this.deleteRecipe()}>Delete</button>
        </div>
      </footer>
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