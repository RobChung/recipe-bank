import { createReducer } from "@ngrx/store"
import { Recipe } from "../recipe.model"


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

    

)