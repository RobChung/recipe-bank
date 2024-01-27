import { createAction, props } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";

// export const init 

export const AddIngredient = createAction(
    '[ShoppingList] Add Ingredient',
    props<{ ingredient: Ingredient }>() 
);