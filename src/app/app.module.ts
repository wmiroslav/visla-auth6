import { PermissionDirective } from 'projects/visla-auth/src/lib/directives/permission.directive';
import { AuthVislaModule } from 'projects/visla-auth/src/lib/auth.module';


import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';

export const config = {
  baseUrl: 'https://www.baseurl.example/',
  apiEndpoints: {
    register: 'auth/register',
    changePassword: 'user/change_password',
    recoveryPassword: 'auth/recovery',
    resetPassword: 'auth/reset',
    login: 'auth/login',
    refreshToken: 'auth/refresh',
    getMe: 'auth/me'
  },
  appRoutes: {
    loginPage: 'login',
    baseRootForAuthUsers: '',
    redirectUrlWithNoPermission: 'login'
  }
};

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    PermissionDirective
  ],
  imports: [
    HttpClientModule,
    RouterModule.forRoot([{
      path: '',
      component: HomepageComponent
    }]),
    BrowserModule,
    AuthVislaModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
