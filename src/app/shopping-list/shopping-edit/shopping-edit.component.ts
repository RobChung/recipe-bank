import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Subscription } from 'rxjs';
import * as ShoppingListActions from '../store/shopping-list.actions'
import * as fromShoppingList from '../store/shopping-list.reducer'

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {

  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  shoppingListForm = this.fb.group({
      ingredientName: ['', Validators.required],
      quantity: [1, Validators.min(1)]
  });

  constructor(
    private fb: FormBuilder,
    private store: Store<fromShoppingList.AppState>) {}

  ngOnInit() {
    // this.subscription = this.shoppingListService.startedEditing
    //   .subscribe((index: number) => {
    //     this.editedItemIndex = index;
    //     // console.log(this.editedItemIndex)
    //     this.editMode = true;
    //     this.editedItem = this.shoppingListService.getIngredient(index);

    //     // Now we want to setValue on the input fields
    //     this.shoppingListForm.setValue({
    //       ingredientName: this.editedItem.name,
    //       quantity: this.editedItem.quantity
    //     });
    //   });
      this.subscription = this.store
        .select('shoppingList')
        .subscribe((stateData) => {
          const index = stateData.editedIngredientIndex;
          // We are only in editMode if the state's index is greater than -1
          if(index > -1) {
            this.editMode = true;
            this.editedItem = stateData.ingredients[index];
  
            this.shoppingListForm.setValue({
              ingredientName: this.editedItem.name,
              quantity: this.editedItem.quantity
            });        
          } else {
            this.editMode = false;
          }
          
      })

  }

  // Not implemented
  // onAddIngredient() {
  //   // const name = this.nameInputRef.nativeElement.value;
  //   // const qty = this.qtyInputRef.nativeElement.value;

  //   // console.log(this.shoppingListForm);
  //   // console.log(this.shoppingListForm.controls.ingredientName.value)
  //   const name = this.shoppingListForm.controls.ingredientName.value;
  //   const qty = this.shoppingListForm.controls.quantity.value;
  //   const newIngredient = new Ingredient(name, qty);
  //   this.shoppingListService.addIngredient(newIngredient);


  //   // No longer need to emit event with our new ingredient using Services
  //   // this.ingredientAdded.emit(newIngredient)
  //   }

    onSubmit() {
      const name = this.shoppingListForm.controls.ingredientName.value;
      const qty = this.shoppingListForm.controls.quantity.value;
      const newIngredient = new Ingredient(name, qty);

      if (this.editMode) {
        // const editIngredient = new Ingredient(name, qty);
        // this.shoppingListService.editIngredient(newIngredient, this.editedItemIndex);
        this.store.dispatch(ShoppingListActions.updateIngredient({ ingredient: newIngredient }))

      } else {
        // this.shoppingListService.addIngredient(newIngredient);
        this.store.dispatch(ShoppingListActions.addIngredient({ ingredient: newIngredient }))
      }

      // console.log(this.editedItemIndex);
      this.shoppingListForm.reset();
      this.editMode = false;

    }

    onDelete() {
      // this.shoppingListService.deleteIngredient(this.editedItemIndex);

      this.store.dispatch(ShoppingListActions.deleteIngredient());
      this.onClear();
    }

    onClear() {
      this.shoppingListForm.reset();
      this.editMode = false;
      // oops only meant to clear form??
      // this.shoppingListService.clearShoppingList();
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
}
