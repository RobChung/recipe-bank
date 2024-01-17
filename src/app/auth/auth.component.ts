import { Component } from "@angular/core";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {

    isLoginMode = true;

    switchMode() {
        this.isLoginMode = !this.isLoginMode
    }

}