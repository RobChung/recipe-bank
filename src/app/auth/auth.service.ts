import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";

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

    apiKey = 'AIzaSyC31kM-fmuTPIQvrAFyeycA43kuudif4Yg'

    constructor(private http: HttpClient) { }

    // Consider an interface?
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
            catchError(this.handleError) // See catchError in login for another approach
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
            }))
            // catchError(this.handleError)
        );
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