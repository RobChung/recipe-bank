import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap } from "rxjs";
import { HttpClient } from "@angular/common/http";

import * as RecipeActions from "../store/recipe.actions";
import { Recipe } from "../recipe.model"; 

@Injectable()
export class RecipeEffects {

    dbUrl: string = 'https://ng-recipe-bank-default-rtdb.firebaseio.com/recipes';
    suffixUrl: string = '.json';  // Required for Firebase

    fetchRecipes$ = createEffect(() => 
      this.actions$.pipe(
        ofType(RecipeActions.fetchRecipes),
        // 
        switchMap(() => {
            return this.http
            .get<Recipe[]>(
                this.dbUrl + this.suffixUrl
            )
        }),
        // map((recipes) => recipes 
        //             // return the recipes array if exists
        //             ? recipes.map((recipe) => ({
        //                 // return {
        //                     // copy all the properties of recipe (all the existing data)
        //                     ...recipe,
        //                     // check if ingredients exist, if true set it to the ingredients, otherwise an empty array 
        //                     ingredients: recipe.ingredients ? recipe.ingredients : []
        //                 // }
        //             }))
        //             // return an empty recipes array if none found in db
        //             : []
        //         ),
        // map((recipes) => {
        //     return RecipeActions.setRecipes({ recipes })
        // })
                // Instead of using two map() operators, we can assign the fetched recipes into one const:
        map((fetchedRecipes) => {
            const recipes = fetchedRecipes.map((recipe) => {
                return {
                    ...recipe,
                    ingredients: recipe.ingredients ? recipe.ingredients : []
                }
            })
    
            return RecipeActions.setRecipes({ recipes }) 
            })
      ),
    //   { dispatch: false }
    )

    constructor(
        private actions$: Actions,
        private http: HttpClient) { }
}