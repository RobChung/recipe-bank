import { createReducer, on } from "@ngrx/store"
import { Recipe } from "../recipe.model"
import * as RecipeActions from "./recipe.actions";


export interface State {
    recipes: Recipe[],
    editedRecipeIndex: number
}

const initialState: State = {
    recipes: [],
    editedRecipeIndex: -1
}

export const recipeReducer = createReducer(

    initialState,

    on(
        RecipeActions.setRecipes, (state, { recipes }) => ({
            ...state,
            recipes: recipes
        })
    )    

)