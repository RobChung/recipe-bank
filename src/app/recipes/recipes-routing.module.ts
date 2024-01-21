import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { authGuard } from "../auth/auth-guard.service";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { recipeResolver } from "./recipes-resolver.service";
import { RecipesComponent } from "./recipes.component";

const routes: Routes = [
    { 
        path: 'recipes', 
        component: RecipesComponent,
        canActivate: [authGuard],
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
        ]
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecipesRoutingModule { }