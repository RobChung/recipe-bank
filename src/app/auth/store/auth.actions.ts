import { createAction, props } from "@ngrx/store";
import { User } from "../user.model";

// export const login = createAction(
//     '[Auth] Login',
//     props<{ 
//         // there isn't a password prop associated with a user
//         // user: User
//         email: string;
//         password: string;
//     }>()
// )

export const login = createAction(
    '[Auth] Login',
    props<{ 
        // there isn't a password prop associated with a user
        user: User
        // email: string;
        // userId: string;
        // token: string;
        // expirationDate: Date;
    }>()
)

export const signup = createAction(
    '[Auth] Signup',
    props<{ 
        // user: User
        email: string;
        password: string;
    }>()
)

export const logout = createAction(
    '[Auth] Logout'
)

export const authenticateSuccess = createAction(
    '[Auth] Auth Success',
    // Need the props of our User object
    props<{
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: Date;
    }>()
)