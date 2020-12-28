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

export const setRecipeName = name => ({
  type: 'SET_RECIPE_NAME',
  name
})

export const setRecipeSource = source => ({
  type: 'SET_RECIPE_SOURCE',
  source
})

export const setRecipeStepDescription = (index, description) => ({
  type: 'SET_RECIPE_STEP_DESCRIPTION',
  index,
  description
})

export const addRecipeStep = () => ({
  type: 'ADD_RECIPE_STEP'
})

export const deleteRecipeStep = (index) => ({
  type: 'DELETE_RECIPE_STEP',
  index
})

export const setRecipePortions = (portions) => ({
  type: 'SET_RECIPE_PORTIONS',
  portions
})

export const setRecipeAdditionAmount = (index, amount) => ({
  type: 'SET_RECIPE_ADDITION_AMOUNT',
  index,
  amount
})

export const setRecipeAdditionUnit = (index, unit) => ({
  type: 'SET_RECIPE_ADDITION_UNIT',
  index,
  unit
})

export const setRecipeAdditionIngredient = (index, ingredient) => ({
  type: 'SET_RECIPE_ADDITION_INGREDIENT',
  index,
  ingredient,
})

export const deleteRecipeAddition = (index) => ({
  type: 'DELETE_RECIPE_ADDITION',
  index
})

export const addRecipeAddition = (ingredient) => ({
  type: 'ADD_RECIPE_ADDITION',
  ingredient
})

export const setUnits = (units) => ({
  type: 'SET_UNITS',
  units
})

export const setIngredients = (ingredients) => ({
  type: 'SET_INGREDIENTS',
  ingredients
})

export const setIngredient = (ingredient) => ({
  type: 'SET_INGREDIENT',
  ingredient
})