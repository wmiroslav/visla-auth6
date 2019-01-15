import { ConfigService } from './../services/config.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private config: ConfigService, private router: Router, private user: UserService) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {

        const userRole: string = this.user.role;
        let acceptedRoles: string[] = route.data.acceptedRoles;
        acceptedRoles = acceptedRoles.map((el) => {
            return el.toLowerCase();
        });

        if (acceptedRoles.indexOf(userRole) !== -1) {
            return true;
        }
        const url = this.config.appRoutes.redirectUrlWithNoPermission;
        if (url) {
            this.router.navigate([url]);
        }
        return false;

    }
}
