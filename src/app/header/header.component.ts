import { Component, OnDestroy, OnInit } from "@angular/core";
import { DataStorageService } from "../shared/data-storage-service";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

    // is this required if Header Component is always existing in app?
    private userSubscription: Subscription;
    isAuthenticated = false;
    collapsed = true
    // @Output() featureSelected = new EventEmitter<string>();

    // onSelect(feature: string) {
    //     this.featureSelected.emit(feature)
    // }

    constructor(
        private dataService: DataStorageService,
        private authService: AuthService) { }

    ngOnInit() {
        // Setup a subscription to the AuthService's User
        // Our single source of truth for our User resides in that class (the Subject)
        this.userSubscription = this.authService.user$.subscribe((user) => {
            // this.isAuthenticated = !user ? false : true;
            // above can be written as
            this.isAuthenticated = !!user;
            // console.log(!user);
            // console.log(!!user);
        });

    }

    onSaveData() {
        this.dataService.storeRecipes();
    }


    onFetchData() {
        this.dataService.fetchRecipes().subscribe();
    }

    onLogout() {
        this.authService.logout();
        // Instead of redirecting here, this will be managed in the AuthService.
        // This is because the User may be logged out if token expires as well, so
        // it will not only occur upon clicking the button in the HeaderComponent
        // this.router.navigate(['/auth']);
    }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();
    }
}