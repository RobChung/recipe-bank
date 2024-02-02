import { Component, OnDestroy, OnInit } from "@angular/core";
import { DataStorageService } from "../shared/data-storage-service";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

    // is this required if Header Component is always existing in app?
    private userSubscription: Subscription;
    isAuthenticated = false;
    collapsed = true

    constructor(
        private dataService: DataStorageService,
        private authService: AuthService,
        private store: Store<fromApp.AppState>) { }

    ngOnInit() {
        this.userSubscription = this.store.select('auth').subscribe(
            (stateData) => {
                this.isAuthenticated = !!stateData.user;
            }
        );
    }

    onSaveData() {
        this.dataService.storeRecipes();
    }


    onFetchData() {
        this.dataService.fetchRecipes().subscribe();
    }

    onLogout() {
        this.store.dispatch(AuthActions.logout());
    }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();
    }
}