import { EventEmitter, Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "src/app/shared/ingredient.model";

@Injectable({providedIn: 'root'})
export class ShoppingListService {
    
    // ingredientsChanged = new EventEmitter<Ingredient[]>();
    ingredientsChanged = new Subject<Ingredient[]>();
    // startedEditing = new Subject<Ingredient>();
    // We need to track which index we are editing, therefore number 
    startedEditing = new Subject<number>();
    
    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ];

    getIngredients() {
        // Get a copy of our ingredients
        // Can omit slice() if we are sure we don't accidentally edit it elsewhere
        // Instead, we will create an Event and emit it for usage
        return this.ingredients.slice();
    }

    getIngredient(index: number) {
        return this.ingredients[index];
    }

    editIngredient(ingredient: Ingredient, index: number) {
        // console.log(ingredient);
        // console.log(index);
        this.ingredients[index] = ingredient;
        this.ingredientsChanged.next(this.ingredients.slice());

    }

    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        // this.ingredientsChanged.emit(this.ingredients.slice());
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredients(ingredients: Ingredient[]) {
        // Code below is not efficient as we will be emitting an event per ingredient
        // ingredients.forEach(ingredient => {
        //     this.addIngredient(ingredient);
        // });

        // Turn an array of elements to a list of elements
        // push can handle array but will push this array as a single object to the other array
        // spread (...) fixes this issue
        this.ingredients.push(...ingredients);
        // this.ingredientsChanged.emit(this.ingredients.slice());
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    deleteIngredient(index: number) {
        // splice(starting pos, number of elements)
        this.ingredients.splice(index, 1);
        this.ingredientsChanged.next(this.ingredients);
    }

    clearShoppingList() {
        this.ingredients = [];
        this.ingredientsChanged.next(this.ingredients);
    }
}