const recipe = (state = {}, action) => {
    switch (action.type) {
      case 'SET_RECIPE':
        return action.recipe
      default:
        return state
    }
  }
  
  export default recipe;
  