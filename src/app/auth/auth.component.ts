import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthResponseData, AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {

    isLoginMode = true;
    isLoading = false;
    error: string = null;
    // form: FormGroup;

    form = this.fb.group({
        email: [null, [Validators.required, Validators.email]],
        // Using Firebase's ReST API for auth requires at least 6 chars
        password: [null, [Validators.required, Validators.minLength(6)]]
    })
    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router) { }

    switchMode() {
        this.isLoginMode = !this.isLoginMode
    }

    onSubmit() {
        // console.log(this.form.value);
        // Extra check; if user enables button through devtools
        if (!this.form.valid) {
            return;
        }

        const email = this.form.value.email;
        const password = this.form.value.password;

        let authObs: Observable<AuthResponseData>;
        
        this.isLoading = true;

        if (this.isLoginMode) {
            authObs = this.authService.login(email, password)
                
        } else {
            authObs = this.authService.signUp(email, password)
        }

        authObs.subscribe({
            next: (resp) => {
                console.log(resp);
                this.isLoading = false;
                this.router.navigate(['/recipes']);
            },
            error: (errorMsg) => {
                console.log(errorMsg)
                this.error = errorMsg;
                this.isLoading = false;

            }
        })

        this.form.reset();
    }
}