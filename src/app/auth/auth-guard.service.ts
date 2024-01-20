import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, take, tap } from "rxjs";
import { AuthService } from "./auth.service";

export const authGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Observable<boolean | UrlTree> 
    | Promise<boolean | UrlTree> 
    | boolean
    | UrlTree => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.user$.pipe(
        take(1), // Ensure we don't have an ongoing subscription
        map((user) => {
            // user -> object, obviously
            // !user -> if it is an object, return false
            // !!user -> inverse the above
                // so if user is not null/does exist, return true
            const isAuth = !!user;
            if (isAuth) {
                return true;
            } else {
                return router.createUrlTree(['/auth']);
            }
        }),
        // A better approach is using UrlTree
        // map returns true or false, so we can tap() this value
        // tap((isAuth) => {
        //   if (!isAuth) {
        //     return router.navigate(['/auth']);
        //   }
        // //   return true; Not needed
        // })
    )

}

export const canActivateChildAuthGuard: CanActivateChildFn = (
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
) => authGuard(route, state); 