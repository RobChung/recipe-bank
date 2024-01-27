import { createReducer, on } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";
import { AddIngredient } from "./shopping-list.actions";

const initialState = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ]
};

// const initialState: Ingredient[] = [];

export const shoppingListReducer = createReducer(
    initialState,
    on(AddIngredient, (state, { ingredient }) => ({
        ...state,
        ingredients: [...state.ingredients, ingredient]
    }))
)