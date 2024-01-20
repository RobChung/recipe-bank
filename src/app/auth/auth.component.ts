import { Component, ComponentFactoryResolver, OnDestroy, ViewChild, ViewContainerRef, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthResponseData, AuthService } from "./auth.service";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {

    isLoginMode = true;
    isLoading = false;
    error: string = null;
    // form: FormGroup;
    @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
    private subscription: Subscription;

    form = this.fb.group({
        email: [null, [Validators.required, Validators.email]],
        // Using Firebase's ReST API for auth requires at least 6 chars
        password: [null, [Validators.required, Validators.minLength(6)]]
    })
    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        // deprecated
        private componentFactoryResolver: ComponentFactoryResolver) { }

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
                // this.error = errorMsg;
                this.showErrorAlert(errorMsg);
                this.isLoading = false;
            }
        })

        this.form.reset();
    }

    onCloseAlert() {
        this.error = null;
    }

    private showErrorAlert(errorMsg: string) {
        // const alertCmp = new AlertComponent();
        // deprecated
        // const alertCmpFactory = this.componentFactoryResolver
        //     .resolveComponentFactory(AlertComponent);

        

        const hostViewContainerRef = this.alertHost.viewContainerRef;
        // clear everything before we create something new
        hostViewContainerRef.clear();
        const componentRef = hostViewContainerRef.createComponent<AlertComponent>(AlertComponent);
        // Should have a msg and close property
        componentRef.instance.message = errorMsg;
        this.subscription = componentRef.instance.closeAlert.subscribe(() => {
          this.subscription.unsubscribe();
          hostViewContainerRef.clear();
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe()
        }
    }

}