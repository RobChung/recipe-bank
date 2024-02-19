import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions";
import * as RecipeActions from "../recipes/store/recipe.actions";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

    // is this required if Header Component is always existing in app?
    private userSubscription: Subscription;
    isAuthenticated = false;
    collapsed = true

    constructor(private store: Store<fromApp.AppState>) { }

    ngOnInit() {
        this.userSubscription = this.store.select('auth').subscribe(
            (stateData) => {
                this.isAuthenticated = !!stateData.user;
            }
        );
    }

    onSaveData() {
        // this.dataService.storeRecipes();
        this.store.dispatch(RecipeActions.storeRecipes());
    }

    onFetchData() {
        // this.dataService.fetchRecipes().subscribe();
        this.store.dispatch(RecipeActions.fetchRecipes());
    }

    onLogout() {
        this.store.dispatch(AuthActions.logout());
    }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();
    }
}