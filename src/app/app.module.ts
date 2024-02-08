import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { StoreRouterConnectingModule } from "@ngrx/router-store";
import { AuthEffects } from './auth/store/auth.effects';
import * as fromApp from './store/app.reducer';
import { environment } from 'src/environments/environment.development';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
    // Since this app has a wildcard route, this must be imported last
    // This is because route arrays from other routing modules are concatenated
    // in order with regards to how their related routing modules are imported
    AppRoutingModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects]),
    StoreDevtoolsModule.instrument({logOnly: environment.production}),
    StoreRouterConnectingModule.forRoot()
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
