import { createReducer, on } from "@ngrx/store"
import { Recipe } from "../recipe.model"
import * as RecipeActions from "./recipe.actions";


export interface State {
    recipes: Recipe[],
    // editedRecipeIndex: number
}

const initialState: State = {
    recipes: [],
    // editedRecipeIndex: -1
}

export const recipeReducer = createReducer(

    initialState,

    on(
        RecipeActions.setRecipes, (state, { recipes }) => ({
            ...state,
            recipes: [...recipes]
        })
    ),

    on(
        RecipeActions.addRecipe, (state, { recipe }) => ({
            ...state,
            recipes: [...state.recipes, recipe]
        })
    ),

    on(
        RecipeActions.updateRecipe, (state, { index, recipe }) => ({
            ...state,
            recipes: state.recipes.map(
                (reci, i) => i === index ?
                    { ...recipe } : reci
            )
        })
    ),

    on(
        RecipeActions.deleteRecipe, (state, { index }) => ({
            ...state,
            recipes: state.recipes.filter(
                // If index matches, then we remove the element
                (_, i) => i !== index
            )
        })
    )

)