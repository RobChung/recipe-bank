import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

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
    constructor(private fb: FormBuilder) { }

    switchMode() {
        this.isLoginMode = !this.isLoginMode
    }

    onSubmit() {
        console.log(this.form.value);
        this.form.reset();
    }
}