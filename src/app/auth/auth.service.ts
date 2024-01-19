import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, catchError, tap, throwError } from "rxjs";
import { User } from "./user.model";

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
    user$ = new BehaviorSubject<User>(null);


    apiKey = 'AIzaSyC31kM-fmuTPIQvrAFyeycA43kuudif4Yg'

    constructor(private http: HttpClient) { }

    signUp(email: string, password: string) {
        // The request body must include three properties as specified by the API:
        // email, password, returnSecureToken
        return this.http.post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            catchError(this.handleError), // See catchError in login for other syntax/approach
            tap((resData) => {
                this.handleAuthentication(
                    resData.email, 
                    resData.localId, 
                    resData.idToken, 
                    +resData.expiresIn
                );
            })
        );
    }

    login(email: string, password: string) {

        return this.http.post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            catchError(((error) => {
                console.log(error)
              return this.handleError(error)
            })),
            tap((resData) => {
                this.handleAuthentication(
                    resData.email, 
                    resData.localId, 
                    resData.idToken, 
                    +resData.expiresIn
                );
            })
        );
    }

    private handleAuthentication(
        email: string, 
        id: string, 
        token: string, 
        expiresIn: number) {
        // the expiration date is not part of the resp, so we will create it, and it 
        // also needs to be based on the Firebase response we receive
        // this should be the number of seconds for which it will expire, as a string
        // get the current date, call getTime() to get current timestamp in milliseconds
        // then add the response's expiresIn payload in milliseconds
        // don't forget to convert the string to a number before adding
        // then back to a Date object for a concrete timestamp, so wrap it all in new Date()
        const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
        const user = new User(
            email,
            id,
            token,
            expirationDate
        );
        // emit the currently logged in User
        this.user$.next(user);
    }

    // Function to handle error responses received from Http Requests
    private handleError(errorResp: HttpErrorResponse) {
        const error = errorResp.error.error;
        let errorMsg = 'An unknown error occurred';

        // Error is not in expected format
        if (!errorResp) {
            // throw new Error(errorMsg);
            return throwError(() => errorMsg)
        }

        // Firebase lists common errors with the sign up email/password API
        switch (error.message) {
            case 'EMAIL_EXISTS':
                errorMsg = 'This email already exists.'
                break;

            case 'INVALID_LOGIN_CREDENTIALS':
                errorMsg = 'Credentials are invalid, please ensure they are correct and try again.'
                break;
                
            // Two cases below have now been collapsed into one, see case above
            case 'EMAIL_NOT_FOUND':
                errorMsg = 'This email does not exist.'
                break;
            
            case 'INVALID_PASSWORD':
                errorMsg = 'Password entered was invalid.'
                break;

            default:
                errorMsg = `An unexpected error occurred: ${error.message}`
                break;
        }
        // more correct?
        // throw new Error(errorMsg)
        return throwError(() => errorMsg);
    }

}