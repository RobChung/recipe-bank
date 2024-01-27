import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './service/shopping-list.service';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
// import { selectShoppingList } from './store/shopping-list.selectors';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  // ingredients: Ingredient[];
  // same data type as our store
  ingredients$: Observable<{ ingredients: Ingredient[] }>;

  // private subscription: Subscription;
  
  constructor(
    private shoppingListService: ShoppingListService,
    // shoppingList is the key we defined in appModule
    // ingredient is the key we defined in the reducer
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>
    ) { }

  ngOnInit() {
    // this.ingredients = this.shoppingListService.getIngredients();
    // Subscribe to our custom event to notify us if the list has updated
      // Now that we are using Subject, need to unsubscribe
    // this.subscription = this.shoppingListService.ingredientsChanged
    //   .subscribe((ingredients: Ingredient[]) => {
    //     this.ingredients = ingredients;
    //   })

    this.ingredients$ = this.store.select('shoppingList');
  }

  // ngOnDestroy(): void {
  //   this.subscription.unsubscribe();
  // }
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
