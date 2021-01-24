import React from 'react';
import { Link } from "react-router-dom";
import Modal from './Modal';

class IngredientsOverview extends Modal {
  renderContent() {
    return <div><table border="1">{this.props.ingredients.map((ingredient) => <tbody key={ingredient.id}>
      {ingredient.amounts.map((amount, idx) => <tr key={amount.unit.id}>
        {idx === 0 && <td rowSpan={ingredient.amounts.length + 1}><Link to={`/ingredients/${ingredient.id}`}>{ingredient.name}</Link></td>}
        <td>{amount.amount} {amount.unit.short}</td>
      </tr>)}
    </tbody>)}</table>
      {(this.props.recipesWithoutIngredients && this.props.recipesWithoutIngredients.length) > 0 &&
        <div>Rezepte ohne Zutaten!<ul>
          {this.props.recipesWithoutIngredients.map((recipe) => <li key={recipe.id}><Link to={`/recipes/${recipe.id}`}>{recipe.name}</Link></li>)}
        </ul></div>}
    </div>
  }
}

export default IngredientsOverview;