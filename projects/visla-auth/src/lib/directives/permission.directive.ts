import { AuthService } from './../services/auth.service';
import { UserService } from './../services/user.service';
import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';


@Directive({
    selector: '[permission]'
})
export class PermissionDirective implements OnDestroy {
    private userRole: string;
    private permissionsRoles: string | Array<string>;
    private visible: boolean;
    private userSubscribtion: Subscription;
    private authSubscribtion: Subscription;
    private isAuth: boolean;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private userService: UserService,
        private authService: AuthService
    ) {
        this.userSubscribtion = this.userService.userRole$.subscribe((role: string) => {
            this.userRole = role;
            this.checkView();
        });
        this.authSubscribtion = this.authService.userIsAuth$.subscribe((isAuth: boolean) => {
            this.isAuth = isAuth;
            this.checkView();
        });
    }


    ngOnDestroy() {
        this.userSubscribtion.unsubscribe();
        this.authSubscribtion.unsubscribe();
    }

    @Input()
    set permission(val: string | Array<string>) {
        this.permissionsRoles = val;
        if (Array.isArray(this.permissionsRoles)) {
            this.permissionsRoles = this.permissionsRoles.map((el) => {
                return el.toLowerCase();
            });
        } else {
            this.permissionsRoles = this.permissionsRoles.toLowerCase();
        }
        this.checkView();
    }

    private checkView() {
        if (this.hasPermission()) {
            if (!this.visible) {
                this.visible = true;
                this.viewContainer.createEmbeddedView(this.templateRef);
            }
        } else {
            this.visible = false;
            this.viewContainer.clear();
        }
    }

    private hasPermission() {
        if (Array.isArray(this.permissionsRoles) && this.userRole) {
            if (this.permissionsRoles.indexOf(this.userRole) !== -1) {
                return true;
            }
            return false;
        }

        if (typeof this.permissionsRoles === 'string') {
            if (this.permissionsRoles === 'auth' && this.isAuth) {
                return true;
            }
            if (this.permissionsRoles === 'unauth' && !this.isAuth) {
                return true;
            }
        }
        return false;

    }
}
