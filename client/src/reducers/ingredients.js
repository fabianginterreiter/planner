const ingredients = (state = [], action) => {
    switch (action.type) {
      case 'SET_INGREDIENTS':
        return [ ...action.ingredients];
      default:
        return state;
    }
  }
  
  export default ingredients;
  