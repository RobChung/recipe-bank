import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';
import { RecipeService } from '../service/recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataStorageService } from 'src/app/shared/data-storage-service';
import * as fromApp from '../../store/app.reducer';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import * as RecipeActions from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  // no longer receiving an Input
  // @Input() recipe: Recipe;
  recipe: Recipe;
  id: number;

  // ingredients: Ingredient[];

  // constructor(private shoppingListService: ShoppingListService) {};
  constructor(private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataStorageService,
    private store: Store<fromApp.AppState>) { };

  ngOnInit() {

    this.route.params
      .pipe(
        map(params => {
          return +params['id'];
        }),
        switchMap(id => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map(recipeState => {
          // we want a single recipe for the given id
          return recipeState.recipes[this.id]
        })
      )
      .subscribe(recipe => {
        this.recipe = recipe
      })
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
    // go up to one level (/recipes), then append the id and 'edit'
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  addToShoppingList() {
    // this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.store.dispatch(ShoppingListActions.addIngredients({ ingredients: this.recipe.ingredients }));
    // console.log(this.recipe.ingredients)
  }

  onDeleteRecipe() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(RecipeActions.deleteRecipe({ index: this.id }))
    this.router.navigate(['/recipes']);
  }

}
