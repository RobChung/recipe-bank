// import { Injectable } from "@angular/core";
// import { Actions, createEffect, ofType } from "@ngrx/effects";
// import { Store } from "@ngrx/store";
// import * as fromApp from "../../store/app.reducer";
// import * as AuthActions from "../store/auth.actions";
// import { User } from "../user.model";


// export interface AuthResponseData {
//     idToken: string;
//     email: string;
//     refreshToken: string;
//     expiresIn: string;
//     localId: string;
//     registered?: boolean; // only exists in Login API
// }

// const handleAuthentication = (
//     email: string,
//     id: string,
//     token: string,
//     expiresIn: number
// ) => {
//     const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
//     const user = new User(
//         email,
//         id,
//         token,
//         expirationDate
//     );
//     // To allow persistence, convert JS object to a string
//     localStorage.setItem('userData', JSON.stringify(user));
//     // 
// }

// @Injectable({
//     providedIn: 'root'
// })
// export class AuthEffects {

//     login = createEffect(() => this.actions$
//         .pipe(
//             ofType(AuthActions.login)
//         )
//     )


//     constructor(
//         private actions$: Actions,
//         // private store: Store<{fromApp.AppState}>
//     ) { }
// }