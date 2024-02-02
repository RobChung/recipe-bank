import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as AuthActions from "../store/auth.actions";
import { User } from "../user.model";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { of, throwError } from "rxjs";
import { Router } from "@angular/router";


export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean; // only exists in Login API
}

const handleAuthentication = (
    email: string,
    id: string,
    token: string,
    expiresIn: number
) => {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(
        email,
        id,
        token,
        expirationDate
    );
    // To allow persistence, convert JS object to a string
    localStorage.setItem('userData', JSON.stringify(user));
    // Either approach work depending on structure of Action --> which is ideal tho??
    // return AuthActions.authenticateSuccess({email: email, id: id, token: token, tokenExpirationDate: expirationDate})
    return AuthActions.authenticateSuccess({ user: user })
}

const handleError = (
    errorResp: HttpErrorResponse
) => {
    const error = errorResp.error.error;
    let errorMsg = 'An unknown error occurred';

    // Error is not in expected format
    if (!errorResp) {
        // Should return a non-error Observable so our stream doesn't die
        return of(AuthActions.authenticateFail({ errorMsg }))
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

    // Should return a non-error Observable so our stream doesn't die
    return of(AuthActions.authenticateFail({ errorMsg }))

}

@Injectable()
export class AuthEffects {

    authLogin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.loginStart),
            switchMap(action => {
                return this.http.post<AuthResponseData>(
                    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
                    {
                        email: action.email,
                        password: action.password,
                        returnSecureToken: true
                    })
                    .pipe(
                        map(resData => {
                            // console.log(resData)
                            return handleAuthentication(
                                resData.email,
                                resData.localId,
                                resData.idToken,
                                +resData.expiresIn
                            )
                        }),
                        // Unlike map(), catchError does not wrap what you return into an Observable
                        // use of() here, or in the handleError method, return those actions wrapped in of()
                        catchError(error => {
                            return handleError(error)
                        }),
                    )
            }),
        ),
        // Needed for now; effect by default always returns another action
        // { dispatch: false }
    )

    authSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.authenticateSuccess),
            tap(() => {
                this.router.navigate(['/']);
            })
        ), { dispatch: false }
    )

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router) { }
}