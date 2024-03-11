import { NgModule } from "@angular/core";
import { AlertComponent } from "./alert/alert.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { DropdownDirective } from "./dropdown.directive";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { LogoComponent } from './logo/logo.component';

@NgModule({
    declarations: [
        AlertComponent,
        LoadingSpinnerComponent,
        DropdownDirective,
        LogoComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    exports: [
        AlertComponent,
        LoadingSpinnerComponent,
        DropdownDirective,
        CommonModule,
        ReactiveFormsModule,
        LogoComponent
    ]
})
export class SharedModule { }