/**
 * To ensure certain data a route depends on is there before loading
 */

import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";
import { DataStorageService } from "../shared/data-storage-service";
import { RecipeService } from "./service/recipe.service";

// @Injectable({
//     providedIn: 'root'
// })
// export class RecipesResolverService implements Resolve<Recipe[]> {

//     constructor(private dataService: DataStorageService) { }

//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//         // not subscribing as resolve() does this
//         return this.dataService.fetchRecipes();
//     }
// }




// Convert to ResolveFn; other method deprecated
export const recipeResolver: ResolveFn<Recipe[]> = (
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
) => {
    // If we just return the DataService's fetchRecipes(), it will always override
    // the attempt to edit the values. So:
    // Check if we have recipes, fetch them if we don't
    const recipes = inject(RecipeService).getRecipes();
    console.log('recipes: ', recipes);
    if (recipes.length === 0) {
        // fetch if we don't have recipes to display
        return inject(DataStorageService).fetchRecipes();
    } else {
        return recipes;
    }
//   return inject(DataStorageService).fetchRecipes();
}