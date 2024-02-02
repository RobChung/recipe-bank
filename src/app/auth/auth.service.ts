import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment.development";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private tokenExpirationTimer: any;

    apiKey = environment.firebaseAPIKey;

    constructor(
        private store: Store<fromApp.AppState>) { }

    // Set and manage a timer to log user out
    // Should be called whenever we emit a User to our app (use of the Subject)
    setLogoutTimer(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
          this.store.dispatch(AuthActions.logout());
        }, expirationDuration)
    }

    clearLogoutTimer() {
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }
}