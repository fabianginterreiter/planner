import { combineReducers } from 'redux'

import recipes from './recipes';
import recipe from './recipe';

export default combineReducers({
    recipes, recipe
})
