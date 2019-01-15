import { ConfigService } from './../services/config.service';
import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticatedRequiredGuard implements CanActivate {
    constructor(private router: Router,
        private config: ConfigService,
        private auth: AuthService) { }
    canActivate(): boolean | Observable<boolean> | Promise<boolean>  {
        if (!this.auth.isLoggedIn) {
            const url = this.config.appRoutes.loginPage;
            if (url) {
                this.router.navigate([url]);
            }
            return false;
        }
        return true;
    }
}
