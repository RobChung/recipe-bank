import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, exhaustMap, take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

    constructor (private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // To prevent an ongoing subscription, use take() operator
        // pass 1 to indicate we want to take 1 value from the observable, then unsubscribe
        // Since we are working with two observables that need to be returned, will use exhaustMap()
        return this.authService.user$
            .pipe(
                take(1),
                // get data from previous observable (user)
                exhaustMap((user) => {

                    // since this intercepts all requests, our login/signup will be affected
                    if(!user) {
                        return next.handle(req);
                    }

                    // return a new observable that replaces previous in this whole chain
                    const addTokenToRequest = req.clone(
                        {
                            // Firebase's Real-time DB requires the token as a queryParam
                            params: new HttpParams().set('auth', user.token)
                        }
                    );
                    return next.handle(addTokenToRequest);
                })
            )


        // return next.handle(addTokenToRequest);
    }
    
}