export const addRecipe = recipe => ({
    type: 'ADD_RECIPE',
    recipe
})

export const deleteRecipe = recipe => ({
  type: 'DELETE_RECIPE',
  recipe
})

export const setRecipes = recipes => ({
  type: 'SET_RECIPES',
  recipes
})

export const setRecipe = recipe => ({
  type: 'SET_RECIPE',
  recipe
})
