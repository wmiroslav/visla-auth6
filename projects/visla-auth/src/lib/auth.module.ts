import { IConfig } from './models/Config';
import { ConfigService } from './services/config.service';
import { AuthenticatedRequiredGuard } from './guards/authenticated-required.guard';
import { InterceptorHandle401Service } from './interceptors/interceptor-handle-401';
import { InterceptorAddTokenService } from './interceptors/interceptor-add-token';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotAuthenticatedOnlyGuard } from './guards/not-authentificated-only.guard';
import { RoleGuard } from './guards/role.guard';
import { PermissionDirective } from './directives/permission.directive';

@NgModule({
  declarations: [
    PermissionDirective
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    PermissionDirective
  ],
  providers: [
    ConfigService,
    AuthenticatedRequiredGuard,
    NotAuthenticatedOnlyGuard,
    RoleGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorAddTokenService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorHandle401Service,
      multi: true
    }
  ],
})
export class AuthVislaModule {
  static forRoot(config: IConfig = { baseUrl: null, apiEndpoints: {}, appRoutes: {} }) {
    return {
      ngModule: AuthVislaModule,
      providers: [ConfigService, {provide: 'config', useValue: config}]
    };
  }
}



