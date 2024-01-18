import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";

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

    constructor (private http: HttpClient) { }

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
        ).pipe(catchError((errorResp) => {
            const error = errorResp.error.error;
            let errorMsg = 'An unknown error occurred';

            // Error is not in expected format
            if (!errorResp) {
                return throwError(() => errorMsg)
            }

            // Firebase lists common errors with the sign up email/password API
            switch (error.message) {
                case 'EMAIL_EXISTS':
                    errorMsg = 'This email already exists!'
                    break;
                
                default:
                    errorMsg = `An unexpected error occurred: ${error.message}`
                    break;
            }
            return throwError(() => errorMsg);
        }))
    }

    login(email: string, password: string) {
        
        return this.http.post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        );
    }

}