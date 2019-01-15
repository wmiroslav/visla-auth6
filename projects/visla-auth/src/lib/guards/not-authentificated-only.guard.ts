import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigService } from '../services/config.service';


@Injectable()
export class NotAuthenticatedOnlyGuard implements CanActivate {
    constructor(private router: Router, private auth: AuthService, private config: ConfigService) {
    }
    canActivate(): boolean | Observable<boolean> | Promise<boolean>  {
        if (this.auth.isLoggedIn) {
            const url = this.config.appRoutes.baseRootForAuthUsers;
            if (url) {
                this.router.navigate([url]);
            }
            return false;
        }
        return true;
    }
}
