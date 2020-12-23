const recipes = (state = [], action) => {
    switch (action.type) {
      case 'SET_RECIPES':
        return action.recipes;
      case 'ADD_RECIPE':
        return [...state, action.recipe];
      case 'DELETE_RECIPE':
        return state.filter(recipe => recipe.id !== action.recipe.id);
      default:
        return state;
    }
  }
  
  export default recipes;
  