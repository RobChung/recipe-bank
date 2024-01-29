import { Injectable } from "@angular/core";
import { Recipe } from "../recipe.model";
import { Ingredient } from "src/app/shared/ingredient.model";
import { Subject } from "rxjs";
import { Store } from "@ngrx/store";
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
// import * as fromShoppingList from '../../shopping-list/store/shopping-list.reducer';
import * as fromApp from '../../store/app.reducer';

@Injectable({providedIn: 'root'})
export class RecipeService {

    // To allow cross-component communication
        // Since we are using RouterLink to load our selected recipes now,
        // we do not need the EventEmitter below
    // recipeSelected = new EventEmitter<Recipe>();
    recipesChanged = new Subject<Recipe[]>();

    private recipes: Recipe[] = [
        // Using Firebase, we can comment dummy data below for the time being
        // new Recipe(
        //     'Beef Tacos', 
        //     'Yummy Tacos', 
        //     'https://i0.wp.com/www.onceuponachef.com/images/2023/08/Beef-Tacos.jpg?resize=760%2',
        //     [
        //         new Ingredient('Tortilla', 3),
        //         new Ingredient('Beef', 1),
        //         new Ingredient('Tomato', 1),
        //     ]
        // ),
        // new Recipe(
        //     'Also Beef Tacos but Spicy',
        //     'Moo', 
        //     'https://i0.wp.com/www.onceuponachef.com/images/2023/08/Beef-Tacos.jpg?resize=760%2',
        //     [
        //         new Ingredient('Tortilla', 3),
        //         new Ingredient('Beef', 1),
        //         new Ingredient('Tomato', 1),
        //         new Ingredient('Hot Peppers', 1)
        //     ]
        // )
    ];

    constructor(
        private store: Store<fromApp.AppState>
    ) { }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }

    // Method to retrieve our array of recipes
    getRecipes() {
        // Code below returns direct reference, and since in JS an array is a reference type,
        // then changing this array changes the array in this service
        // Can omit slice() if we are sure we don't accidentally edit it elsewhere 
        // return this.recipes;
        
        // This returns a copy of our array
        return this.recipes.slice();
    }

    // getRecipe(id: number) {
    //     const recipe = this.recipes.find(
    //         (r) => {
    //           return r.id === id;
    //         }
    //     );
    //     return recipe;
    // }

    getRecipe(index: number) {
        // this.recipesChanged.next(this.recipes.slice());
        return this.recipes[index];
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    // As of implementing DataService, update does not work
    // Prob due to using the resolver, which calls the fetch() to our DB
    // which does not contain the updated values.
    // Now fixed - see changes
    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
    // addIngredientsToRecipe(ingredients: Ingredient[]) {

    // }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        // Code below is not efficient as we will be emitting an event per ingredient
        // ingredients.forEach(ingredient => {
        //     this.shoppingListService.onAddToList(ingredient);
        // });

        // this.shoppingListService.addIngredients(ingredients);
        this.store.dispatch(ShoppingListActions.addIngredients({ ingredients: ingredients }))
    }

}