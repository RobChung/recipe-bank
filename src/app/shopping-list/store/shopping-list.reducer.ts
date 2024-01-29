import { createReducer, on } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";
// import { AddIngredient } from "./shopping-list.actions";
import * as ShoppingListActions from '../store/shopping-list.actions'

// How the state for this reducer looks like
export interface State {
    ingredients: Ingredient[];
    editedIngredientIndex: number;
}

const initialState: State = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ],
    editedIngredientIndex: -1
};

// const initialState: Ingredient[] = [];

export const shoppingListReducer = createReducer(

    initialState,

    on(ShoppingListActions.addIngredient, (state, { ingredient }) => (
        {
            ...state,
            // ingredients: [...state.ingredients, ingredient]
            ingredients: state.ingredients.concat(ingredient)
        }
    )),

    on(ShoppingListActions.addIngredients, (state, { ingredients }) => (
        {
            ...state,
            // ingredients: [...state.ingredients, ...ingredients]
            ingredients: state.ingredients.concat(...ingredients)
        }
    )),

    on(ShoppingListActions.updateIngredient, (state, { ingredient }) => (
        // console.log(state.editedIngredientIndex, ingredient),
        {
            // const ingredientToBeUpdated = state.ingredients[state.editedIngredientIndex];
            // const updatedIngredient = {
            //     ...ingredientToBeUpdated,
            //     ...ingredient
            // };
            // const updatedIngredients = [...state.ingredients];
            // // Now overwrite the copy, and then return it
            // updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

            // return {
            //     ...state,
            //     ingredients: updatedIngredients,
            //     editedIngredientIndex: -1
            // }
            
            // map() returns us a new array and transforms the elements
            // so, can use it as an UPDATE
            ...state,
            editedIngredientIndex: -1,
            ingredients: state.ingredients.map(
                (ingr, index) => index === state.editedIngredientIndex ?
                    { ...ingredient } : ingr
            )
        }
    )),

    on(ShoppingListActions.deleteIngredient, (state) => (
        {

        // filter will always return a new array, thus a copy
        // takes an array, run a function that we pass in on every element
        // if true, then that element will be part of the new array
        // in addition to the element, we can also get its index
        // return {
        //     ...state,
        //     ingredients: state.ingredients.filter((ig, index) => {
        //         return index !== state.editedIngredientIndex
        //     }),
        //     editedIngredient: null,
        //     editedIngredientIndex: -1
        // }
            ...state,
            editedIngredientIndex: -1,
            ingredients: state.ingredients.filter(
                (_, index) => index !== state.editedIngredientIndex
            )
        }
    )),

    on(ShoppingListActions.startEdit, (state, { index }) => (
        {
            ...state,
            editedIngredientIndex: index
        }
    )),

    on(ShoppingListActions.stopEdit, (state) => (
        {
            ...state,
            editedIngredientIndex: -1
        }

    ))
)