/**
 * Using this service class to handle Http requests. Currently our 'fetch data'
 * and 'save data' buttons reside in the HeaderComponent. We can add click listeners
 * to these buttons, then inject the HttpService into this component.
 * Disadvantage of this is we have our buttons here but the data is managed in the RecipeService.
 * Therefore a better place to make the request is in the RecipeService
 * However, we will handle it here just to easily focus on requests in this file.
 */

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/service/recipe.service";
import { map, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DataStorageService {

    dbUrl: string = 'https://ng-recipe-bank-default-rtdb.firebaseio.com/recipes'
    suffixUrl: string = '.json'

    constructor(
        private http: HttpClient,
        private recipesService: RecipeService) { }

    // storeRecipes(recipes: Recipe[]) {
    storeRecipes() {
        const recipes = this.recipesService.getRecipes();
        this.http.put(
            this.dbUrl + this.suffixUrl,
            recipes    
        )
        // for now, we are not interested in the response in our component
        .subscribe((resp) => {
          console.log(resp);
        })
    }

    // Not implemented
    fetchRecipe(id: number) {
        return this.http
            .get<Recipe>(
                `${this.dbUrl}/${id}${this.suffixUrl}`,
            )
            .pipe(
                map((recipe) => {
                    console.log('fetchRecipe resp: ', recipe)
                    // this.recipesService.getRecipe(id)
                })
            )
            // .subscribe((resp) => {
            //     this.recipesService.getRecipe(id)
            //   console.log(this.recipesService.getRecipe(id));
            //   console.log('fetching a single recipe: ', resp)
            // })
    }

    // Not implemented
    // No point in Save Button if we do it this way...
    updateRecipe(id: number, newRecipe: Recipe) {
        // const recipe = this.recipesService.getRecipe(id);
        // this.recipesService.updateRecipe(id, newRecipe);
        this.http.put(
            // can use String Interpolation
            // 'https://ng-recipe-bank-default-rtdb.firebaseio.com/recipes/' + id + '.json',
            `https://ng-recipe-bank-default-rtdb.firebaseio.com/recipes/${id}.json`,
            newRecipe
        )
        .subscribe((resp) => {
          // to update 
          this.recipesService.updateRecipe(id, newRecipe);
          console.log('updated recipe, response: ', resp)
        })
    }

    // Where do we subscribe --> where are we interested in the response? We aren't interested in the HeaderComponent
    // We will subscribe to it here, and use the RecipeService we injected to set the recipes.
    fetchRecipes() {
        return this.http
            .get<Recipe[]>(this.dbUrl + this.suffixUrl)
            // Right now, we can add a recipe without ingredients. This means in Firebase, the ingredients property on
            // a Recipe does not exist, which can potentially give us nasty bugs. To resolve
            // this, we can always ensure this property exist, even if it is an empty array.
            // So, we will pipe() then use map() to transform the data
            .pipe(
                map((recipes) => {
                    // this map() is JS array method
                    // map() allows us to transform the elements in an array (in this casse, ingredients)
                    // for every recipe, we return the transformed recipe
                    return recipes.map((recipe) => {
                        return {
                            // copy all the properties of recipe (all the existing data)
                            ...recipe,
                            // check if ingredients exist, if true set it to the ingredients, otherwise an empty array 
                            ingredients: recipe.ingredients ? recipe.ingredients : []
                        }
                    })
                }),
                tap((recipes) => {
                    this.recipesService.setRecipes(recipes);
                })
            
            )
            // .subscribe((recipes) => {
            //     // console.log(recipes);
            //     // this.recipesService.setRecipes(recipes);
            // })
    }

}