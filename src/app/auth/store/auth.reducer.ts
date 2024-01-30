import { createReducer, on } from "@ngrx/store";
import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface State {
    user: User;
}

const initialState: State = {
    user: null
}

export const authReducer = createReducer(
    initialState,

    // Both login and signup will be utilizing similar logic
    // after making the http request
    on(
        AuthActions.login,
        // AuthActions.signup,
        (state, { user }) => ({
            ...state,
            // user: new User(email, userId, token, expirationDate)
            user: user
        })
    ),

    on(
        AuthActions.logout, (state) => ({
            ...state,
            user: null
        })
    )
)