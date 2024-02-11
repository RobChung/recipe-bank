/**
 * To ensure certain data a route depends on is there before loading
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects"
import { Recipe } from "./recipe.model";
import { RecipeService } from "./service/recipe.service";
import * as fromApp from "../store/app.reducer";
import * as RecipeActions from "../recipes/store/recipe.actions";
import { take } from "rxjs";
// Convert to ResolveFn; other method deprecated
export const recipeResolver: ResolveFn<Recipe[]> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    // If we just return the DataService's fetchRecipes(), it will always override
    // the attempt to edit the values. So:
    // Check if we have recipes, fetch them if we don't
    const recipes = inject(RecipeService).getRecipes();
    const actions$ = inject(Actions);
    const store = inject(Store<fromApp.AppState>);
    console.log('recipes: ', recipes);
    if (recipes.length === 0) {
        // fetch if we don't have recipes to display
        // return inject(DataStorageService).fetchRecipes();

        // Cannot return the fetchRecipes action as it does not yield an observable
        store.dispatch(RecipeActions.fetchRecipes());
        // We want to wait for the effect that is triggered by this action to complete
        return actions$.pipe(
            // ofType(RecipeActions.setRecipes), // Why does this not work?
            ofType('[Recipe] Set Recipes'), // Passing Action Type works with the resolvers
            take(1)
        );
    } else {
        return recipes;
    }
    //   return inject(DataStorageService).fetchRecipes();
}