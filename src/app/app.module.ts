import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownDirective } from './shared/dropdown.directive';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './auth/auth.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AlertComponent } from './shared/alert/alert.component';
import { RecipesModule } from './recipes/recipe.modules';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ShoppingListComponent,
    ShoppingEditComponent,
    DropdownDirective,
    AuthComponent,
    LoadingSpinnerComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    // FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RecipesModule,
    // Since this app has a wildcard route, this must be imported last
    // This is because route arrays from other routing modules are concatenated
    // in order with regards to how their related routing modules are imported
    AppRoutingModule 
  ],
  providers: [
    // ShoppingListService -> added argument in Injectable()
    // If we leave it in the Recipes.Component file, we lose our data when we 
    // navigate to Shopping List Component. Can also do it similar ShoppingListService
    // In fact, maybe be recommended:
    // See SO: https://stackoverflow.com/questions/53251849/angular-service-providedin-vs-forroot
    // RecipeService
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
