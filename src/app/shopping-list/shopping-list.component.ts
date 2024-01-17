import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './service/shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Ingredient[];
  private subscription: Subscription;
  
  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngredients();
    // Subscribe to our custom event to notify us if the list has updated
      // Now that we are using Subject, need to unsubscribe
    this.subscription = this.shoppingListService.ingredientsChanged
      .subscribe((ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  // Doing this in our Service
  // onAddToList(ingredient: Ingredient) {
  //   this.ingredients.push(ingredient)
  // }

  // To get this to the EDIT component, we will create a Subject
  // in the Service so that we can listen in the EDIT component
  onEditItem(index: number) {
    this.shoppingListService.startedEditing.next(index);
  }

}
