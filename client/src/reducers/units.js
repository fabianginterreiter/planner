const units = (state = [], action) => {
    switch (action.type) {
      case 'SET_UNITS':
        return [ ...action.units];
      default:
        return state;
    }
  }
  
  export default units;
  