import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { RecipesModule } from './recipes/recipe.modules';
import { ShoppingListModule } from './shopping-list/shopping-list.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    // FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RecipesModule,
    ShoppingListModule,
    // Since this app has a wildcard route, this must be imported last
    // This is because route arrays from other routing modules are concatenated
    // in order with regards to how their related routing modules are imported
    AppRoutingModule,
    SharedModule
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
