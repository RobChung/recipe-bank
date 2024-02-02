import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import * as AuthActions from "./store/auth.actions";
import * as fromApp from "../store/app.reducer";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {

    isLoginMode = true;
    isLoading = false;
    error: string = null;
    // form: FormGroup;
    storeSubscription: Subscription;

    form = this.fb.group({
        email: [null, [Validators.required, Validators.email]],
        // Using Firebase's ReST API for auth requires at least 6 chars
        password: [null, [Validators.required, Validators.minLength(6)]]
    })

    constructor(
        private fb: FormBuilder,
        private store: Store<fromApp.AppState>) { }

    ngOnInit() {
        this.storeSubscription = this.store.select('auth').subscribe(
            authState => {
                console.log(authState)
                this.isLoading = authState.loading;
                this.error = authState.authError;
            }
        )
    }

    switchMode() {
        this.isLoginMode = !this.isLoginMode
    }

    onSubmit() {
        // Extra check; if user enables button through devtools
        if (!this.form.valid) {
            return;
        }

        const email = this.form.value.email;
        const password = this.form.value.password;

        if (this.isLoginMode) {
            this.store.dispatch(
                AuthActions.loginStart({ email: email, password: password })
            );

        } else {
            this.store.dispatch(
                AuthActions.signup({ email, password })
            )
        }

        this.form.reset();
    }

    onCloseAlert() {
        // this.error = null;
        this.store.dispatch(AuthActions.clearError());
    }

    ngOnDestroy() {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe()
        }
    }
}