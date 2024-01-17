import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

// Response payload as required by Firebase API 
interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
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
        );
    }

}