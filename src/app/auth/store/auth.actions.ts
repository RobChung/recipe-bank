import { createAction, props } from "@ngrx/store";
import { User } from "../user.model";

// The point in where we want to start sending our request
export const loginStart = createAction(
    '[Auth] Login Start',
    props<{ 
        email: string;
        password: string;
    }>()
)

export const signup = createAction(
    '[Auth] Signup',
    props<{ 
        email: string;
        password: string;
    }>()
)

export const logout = createAction(
    '[Auth] Logout'
)

export const authenticateSuccess = createAction(
    '[Auth] Auth Success',
    props<{
        // email: string;
        // id: string;
        // token: string;
        // tokenExpirationDate: Date;
        
        user: User
    }>()
)

export const authenticateFail = createAction(
    '[Auth] Auth Fail',
    props<{ errorMsg: string }>()
)