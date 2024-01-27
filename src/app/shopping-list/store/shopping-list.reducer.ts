import { createReducer, on } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";
// import { AddIngredient } from "./shopping-list.actions";
import * as ShoppingListActions from '../store/shopping-list.actions'


const initialState = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ]
};

// const initialState: Ingredient[] = [];

export const shoppingListReducer = createReducer(
    initialState,
    on(ShoppingListActions.addIngredient, (state, { ingredient }) => ({
        ...state,
        ingredients: [...state.ingredients, ingredient]
    }))
)