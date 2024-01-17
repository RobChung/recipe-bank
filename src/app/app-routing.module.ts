import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RecipesComponent } from "./recipes/recipes.component";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";
import { RecipeStartComponent } from "./recipes/recipe-start/recipe-start.component";
// import { RecipeItemComponent } from "./recipes/recipe-list/recipe-item/recipe-item.component";
import { RecipeDetailComponent } from "./recipes/recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipes/recipe-edit/recipe-edit.component";
import { 
    // RecipesResolverService, 
    recipeResolver 
} from "./recipes/recipes-resolver.service";
import { AuthComponent } from "./auth/auth.component";


const appRoutes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    // { path: '', component: RecipeStartComponent },
    { 
        path: 'recipes', 
        component: RecipesComponent, 
        children: [
            { path: '', component: RecipeStartComponent },
            { path: 'new', component: RecipeEditComponent },
            { 
                path: ':id', 
                component: RecipeDetailComponent, 
                resolve: [recipeResolver] 
            },
            { 
                path: ':id/edit', 
                component: RecipeEditComponent, 
                resolve: [recipeResolver] 
            },
            // { path: ':id/delete', component: RecipeDetailComponent }
        ]
    },
    { path: 'shopping-list', component: ShoppingListComponent },
    { path: 'auth', component: AuthComponent },
    { path: '**', redirectTo: '/recipes'}
];


@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
    
}