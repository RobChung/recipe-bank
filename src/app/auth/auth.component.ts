import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {

    isLoginMode = true;
    // form: FormGroup;

    form = this.fb.group({
        email: [null, [Validators.required, Validators.email]],
        // Using Firebase's ReST API for auth requires at least 6 chars
        password: [null, [Validators.required, Validators.minLength(6)]]
    })
    constructor(
        private fb: FormBuilder,
        private authService: AuthService) { }

    switchMode() {
        this.isLoginMode = !this.isLoginMode
    }

    onSubmit() {
        // console.log(this.form.value);
        // Extra check; if user enables button through devtools
        if (!this.form.valid) {
            return;
        }

        if (this.isLoginMode) {
            // To implement
        } else {
            const email = this.form.value.email;
            const password = this.form.value.password;
            this.authService.signUp(email, password)
            .subscribe({
                next: (resp) => {
                  console.log(resp)
                },
                error: (err) => {
                  console.log(err)
                }
            })
        }

        this.form.reset();
    }
}