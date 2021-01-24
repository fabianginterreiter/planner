const ingredient = (state = null, action) => {
  switch (action.type) {
    case 'SET_INGREDIENT':
      return action.ingredient;
    default:
      return state
  }
}

export default ingredient;
