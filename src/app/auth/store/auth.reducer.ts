import { createReducer, on } from "@ngrx/store";
import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface State {
    user: User;
    authError: string;
    loading: boolean;
}

const initialState: State = {
    user: null,
    authError: null,
    loading: false
}

export const authReducer = createReducer(
    initialState,

    // Both login and signup will be utilizing similar logic
    // after making the http request
    on(
        AuthActions.loginStart,
        AuthActions.signup,
        (state) => ({
            ...state,
            // user: new User(email, userId, token, expirationDate)
            // user: user,
            authError: null,
            // While the response is awaiting for success/failure, should display loading icon
            loading: true
        })
    ),

    on(
        AuthActions.logout, (state) => ({
            ...state,
            user: null
        })
    ),

    // on(
    //     AuthActions.authenticateSuccess, (state, {email, id, token, tokenExpirationDate}) => ({
    //         ...state,
    //         user: new User(
    //             email,
    //             id,
    //             token,
    //             tokenExpirationDate
    //         ),
    //         authError: null
    //     })
    // )

    on(
        AuthActions.authenticateSuccess, (state, {user}) => ({
            ...state,
            user: user,
            authError: null,
            loading: false
        })
    ),

    on(
        AuthActions.authenticateFail, (state, {errorMsg}) => ({
            ...state,
            user: null,
            authError: errorMsg,
            loading: false
        })
    )
)