const recipes = (state = [], action) => {
    switch (action.type) {
      case 'SET_RECIPES':
        return action.recipes
      case 'ADD_RECIPE':
        return [...state, { id: action.id, name: action.name }]
      default:
        return state
    }
  }
  
  export default recipes;
  