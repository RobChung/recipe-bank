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
import { map, of, switchMap, take } from "rxjs";
// Convert to ResolveFn; other method deprecated
export const recipeResolver: ResolveFn<Recipe[]> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const actions$ = inject(Actions);
    const store = inject(Store<fromApp.AppState>);

    return store.select('recipes').pipe(
        take(1),
        map((recipeState) => {
            // This will either have an array or none
            return recipeState.recipes
        }),
        switchMap((recipes) => {
            if (recipes.length === 0) {
                // Cannot return the fetchRecipes action as it does not yield an observable
                store.dispatch(RecipeActions.fetchRecipes());
                // We want to wait for the effect that is triggered by this action to complete
                return actions$.pipe(
                    // ofType(RecipeActions.setRecipes), // Why does this not work?
                    ofType('[Recipe] Set Recipes'), // Passing Action Type works with the resolvers
                    take(1)
                );
            } else {
                // Still need to return an observable
                return of({ recipes })
            }
        })
    )



    //   return inject(DataStorageService).fetchRecipes();
}