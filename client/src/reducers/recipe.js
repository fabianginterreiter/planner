const recipe = (state = null, action) => {
    switch (action.type) {
      case 'SET_RECIPE':
        return action.recipe;
      case 'SET_RECIPE_NAME':
        return { ...state, name: action.name };
      case 'SET_RECIPE_SOURCE':
        return { ...state, source: action.source };
      case 'SET_RECIPE_STEP_DESCRIPTION':
        return { ...state, steps: state.steps.map((step, idx) => {
          if (idx === action.index) {
            return {...step, description: action.description}
          } else {
            return step;
          }
        })}
      case 'ADD_RECIPE_STEP':
        return { ...state, steps: [...state.steps, {description:''}]};
      case 'DELETE_RECIPE_STEP':
        return { ...state, steps: state.steps.filter((step, idx) => {
          return idx !== action.index;
        })};
      case 'SET_RECIPE_PORTIONS':
        return { ...state, portions: action.portions };
      case 'SET_RECIPE_ADDITION_AMOUNT':
        return { ...state, additions: state.additions.map((addition, idx) => {
          if (idx === action.index) {
            return {...addition, amount: action.amount};
          }

          return addition;
        })}
      case 'SET_RECIPE_ADDITION_UNIT':
        return { ...state, additions: state.additions.map((addition, idx) => {
          if (idx === action.index) {
            return {...addition, unit: action.unit}
          }
          return addition;
        })}
      case 'SET_RECIPE_ADDITION_INGREDIENT':
        return { ...state, additions: state.additions.map((addition, idx) => {
          if (idx === action.index) {
            return {...addition, ingredient: action.ingredient}
          }
          return addition;
        })}
      case 'DELETE_RECIPE_ADDITION':
        return {...state, additions: state.additions.filter((addition, idx) => idx !== action.index)}  
      case 'ADD_RECIPE_ADDITION':
        return {...state, additions: [...state.additions, action.ingredient]};
      default:
        return state
    }
  }
  
  export default recipe;
  