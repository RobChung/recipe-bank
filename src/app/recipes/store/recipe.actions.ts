import { createAction, props } from "@ngrx/store";
import { Recipe } from "../recipe.model";

export const setRecipes = createAction(
    '[Recipe] Set Recipes',
    props<{ recipes: Recipe[] }>()
)

export const addRecipe = createAction(
    '[Recipe] Add Recipe',
    props<{ recipe: Recipe }>()
)

export const updateRecipe = createAction(
    '[Recipe] Update Recipe',
    props<{ recipe: Recipe }>()
)

export const deleteRecipe = createAction(
    '[Recipe] Delete Recipe'
)

export const fetchRecipes = createAction(
    '[Recipe] Fetch Recipes'
)