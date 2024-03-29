import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
// import { Ingredient } from 'src/app/shared/ingredient.model';
// import { ShoppingListService } from 'src/app/shopping-list/service/shopping-list.service';
import { RecipeService } from '../service/recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataStorageService } from 'src/app/shared/data-storage-service';

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
              private dataService: DataStorageService) { };

  ngOnInit() {

    // const id = +this.route.snapshot.params['id']
    // this.recipe = this.recipeService.getRecipe(id)

    this.route.params.subscribe(
      (params: Params) => {
        // this.recipe = this.recipeService.getRecipe(+params['id']);
        // console.log(params)
        this.id = +params['id'];
        // console.log('detailed recipe: ', this.recipeService.getRecipe(this.id));
        this.recipe = this.recipeService.getRecipe(this.id);

      }
    )
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route});
    // go up to one level (/recipes), then append the id and 'edit'
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  // Can use either RecipeService or ShoppingListService (but how to use latter??? ListUI in List Component not updating)
  // addToShoppingList() {
  //   this.recipe.ingredients.forEach(ingredient => {
  //     console.log(ingredient)
  //     this.shoppingListService.onAddToList(ingredient);
  //   });
  //   console.log(this.shoppingListService.getIngredients())
  // }

  addToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    // console.log(this.recipe.ingredients)
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    // this.router.navigate(['..']);
    this.router.navigate(['/recipes']);
  }

}
