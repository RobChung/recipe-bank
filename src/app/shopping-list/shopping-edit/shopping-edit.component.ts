import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
// import { Recipe } from 'src/app/recipes/recipe.model';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../service/shopping-list.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions'
// import { AddIngredient } from '../store/shopping-list.actions';

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
    private shoppingListService: ShoppingListService,
    private fb: FormBuilder,
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>) {}

  ngOnInit() {
    this.subscription = this.shoppingListService.startedEditing
      .subscribe((index: number) => {
        this.editedItemIndex = index;
        // console.log(this.editedItemIndex)
        this.editMode = true;
        this.editedItem = this.shoppingListService.getIngredient(index);

        // Now we want to setValue on the input fields
        this.shoppingListForm.setValue({
          ingredientName: this.editedItem.name,
          quantity: this.editedItem.quantity
        });
      });
  }

  // Not implemented
  onAddIngredient() {
    // const name = this.nameInputRef.nativeElement.value;
    // const qty = this.qtyInputRef.nativeElement.value;

    // console.log(this.shoppingListForm);
    // console.log(this.shoppingListForm.controls.ingredientName.value)
    const name = this.shoppingListForm.controls.ingredientName.value;
    const qty = this.shoppingListForm.controls.quantity.value;
    const newIngredient = new Ingredient(name, qty);
    this.shoppingListService.addIngredient(newIngredient);


    // No longer need to emit event with our new ingredient using Services
    // this.ingredientAdded.emit(newIngredient)
    }

    onSubmit() {
      const name = this.shoppingListForm.controls.ingredientName.value;
      const qty = this.shoppingListForm.controls.quantity.value;
      const newIngredient = new Ingredient(name, qty);

      if (this.editMode) {
        // const editIngredient = new Ingredient(name, qty);
        this.shoppingListService.editIngredient(newIngredient, this.editedItemIndex);

      } else {
        // this.shoppingListService.addIngredient(newIngredient);
        this.store.dispatch(ShoppingListActions.addIngredient({ingredient: newIngredient}))
      }

      // console.log(this.editedItemIndex);
      this.shoppingListForm.reset();
      this.editMode = false;

    }

    onDelete() {
      this.shoppingListService.deleteIngredient(this.editedItemIndex);
      // this.shoppingListForm.reset();
      // this.editMode = false;
      // Code above already used in onClear()
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
