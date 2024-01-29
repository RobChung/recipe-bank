import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
// import * as fromShoppingList from './store/shopping-list.reducer'
import * as fromApp from '../store/app.reducer';

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
    private store: Store<fromApp.AppState>
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

  // To get this to the EDIT component, we will create a Subject
  // in the Service so that we can listen in the EDIT component
  onEditItem(index: number) {
    // this.shoppingListService.startedEditing.next(index);
    this.store.dispatch(ShoppingListActions.startEdit({ index: index }));
  }

}
