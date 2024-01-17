import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../../recipe.model';
// import { RecipeService } from '../../service/recipe.service';


@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit{

  // To project into our app
  // @Output() recipeSelected = new EventEmitter<void>();
  // We will retrieve a recipe item from our recipe-list component
  @Input() recipe: Recipe;
  @Input() index: number;

  constructor() {}

  ngOnInit() {
    
  }

  // onSelected() {
  //   // this.recipeSelected.emit();
  //   this.recipeService.recipeSelected.emit(this.recipe);
  // }
}
