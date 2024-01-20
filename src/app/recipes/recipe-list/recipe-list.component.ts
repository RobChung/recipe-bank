import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../service/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage-service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  // Custom events don't propogate up (can't listen to event of a child of a child)
    // With added service, we can now remove our custom event
  // @Output() recipeWasSelected = new EventEmitter<Recipe>();
  recipes: Recipe[];
  private subscription: Subscription;

  constructor(private recipeService: RecipeService,
              private router: Router,
              private route: ActivatedRoute,
              private dataService: DataStorageService) {}

  ngOnInit() {
    this.subscription = this.recipeService.recipesChanged
      .subscribe((recipes: Recipe[]) => {
        this.recipes = recipes;
    });
    // Using Firebase, this returns nothing as we removed the dummy data. 
    // Use the DataService to fetch dynamically; see code below (makes fetch button useless tho)
    this.recipes = this.recipeService.getRecipes();

    // don't forget to subscribe to receive the data
    // this.dataService.fetchRecipes().subscribe();
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  // Move to Service
  // recipes: Recipe[] = [
  //   new Recipe('Test', 'Hardcoded Test', 
  //   'https://i0.wp.com/www.onceuponachef.com/images/2023/08/Beef-Tacos.jpg?resize=760%2'),
  //   new Recipe('Recipe 2', 'Meow', 
  //   'https://i0.wp.com/www.onceuponachef.com/images/2023/08/Beef-Tacos.jpg?resize=760%2')
  // ];

  // Using a Service, we can remove this, and the event in the view
  // onRecipeSelected(recipe: Recipe) {
  //   this.recipeWasSelected.emit(recipe)
  // }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
