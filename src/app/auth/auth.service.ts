import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, catchError, tap, throwError } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment.development";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";
import { Store } from "@ngrx/store";

// Response payload as described by Firebase API 
export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean; // only exists in Login API
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    // when we have a user, we will emit (next) it, etc
    // user$ = new Subject<User>()
    // we want an on-demand fetching of a user data, 
    // as Subject is good for reactively updating the UI
    // BehaviorSubject holds a value, when subscribed to, emits it immediately
    // user$ = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    apiKey = environment.firebaseAPIKey;

    constructor(
        private http: HttpClient,
        private router: Router,
        private store: Store<fromApp.AppState>) { }


    logout() {
        // this.user$.next(null);
        this.store.dispatch(AuthActions.logout())
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        // Ensure the expiration timer doesn't persist upon logging out
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogin() {
        // Convert to JS object
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );
        
        if (loadedUser.token) {
            // emit this user
            // this.user$.next(loadedUser);
            // this.store.dispatch(AuthActions.login({user: loadedUser}));
            // Calculate the remaining time
            const remainingTime = 
                new Date(userData._tokenExpirationDate).getTime() 
                - new Date().getTime()
            this.autoLogout(remainingTime);
            console.log(remainingTime);
        }
    }

    // Set and manage a timer to log user out
    // Should be called whenever we emit a User to our app (use of the Subject)
    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
          this.logout();
        }, expirationDuration)
    }

}