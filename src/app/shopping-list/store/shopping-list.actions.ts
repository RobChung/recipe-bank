import { createAction, props } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";

// export const init 

export const addIngredient = createAction(
    '[ShoppingList] Add Ingredient',
    props<{ ingredient: Ingredient }>() 
);