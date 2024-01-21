import { NgModule } from "@angular/core";
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ShoppingListRoutingModule } from "./shopping-list-routing.module";

@NgModule({
    declarations: [
        ShoppingListComponent,
        ShoppingEditComponent
    ],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        ShoppingListRoutingModule
    ]
})
export class ShoppingListModule { }