import { combineReducers } from 'redux'

import recipes from './recipes';
import recipe from './recipe';
import units from './units';
import ingredients from './ingredients';
import ingredient from './ingredient';

export default combineReducers({
  recipes, recipe, units, ingredients, ingredient
})
