# VislaAuth - Angular6+ Auth Module
This module is created to handle all authentication requirements in the Angular6.


# Features:
- interceptor to add token to header request...
- interceptor to handle 401 error response. Interceptor automatically refresh token, and repeat all failed requests...
- directive to easy hide/show specific HTML based on user's role...
- authentication guard to allow only logged in users to access...
- guard to allow only users with specific role to access...
- service for: login, logout, change password, registration...



# Requirements:
- Angular 6+
- RouterModule with at least one path
- for login endpoint: response object should have specific property names: "access_token" and "token_type" (and "refresh_token" if you want to use this token for refreshing expired token)
- for handling the roles in HTML and route guard, getMe endpoint response should have object with a "role" property
- your typescript version should be at least 2.9.2
<br>

```javascript
"typescript": "~2.9.2" // package.json
```

<br>

# Installation:

```javascript
npm install --save visla-auth
```

<br/>
In app.module.ts:
<br/>

```javascript
import { AuthVislaModule } from 'visla-auth';
import { IConfig } from 'visla-auth';

export const config: IConfig = {
  baseUrl: 'https://www.example.com',
  apiEndpoints: {
    register: 'auth/register', 
    login: 'auth/login', 
    logout: 'auth/logout', 
    changePassword: 'user/change_password', 
    recoveryPassword: 'auth/recovery_password', 
    resetPassword: 'auth/reset_password', 
    refreshToken: 'auth/refresh_token',
    getMe: 'auth/user'
  },
  appRoutes: {
    loginPage: 'login-page',
    baseRootForAuthUsers: '',
    redirectUrlWithNoPermission: 'login-page'
  }
};

@NgModule({
  declarations: [
    ...
  ],
  imports: [
    RouterModule.forRoot( // router is required
      [
        { path: 'welcome-page', component: WelcomepageComponent}
      ]
    ),
    BrowserModule,
    AuthVislaModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

<br/>

# Configuration object:
Configuration object have this interface:
<br/>

```javascript
export interface IConfig {
    baseUrl: string;
    apiEndpoints: {
        register?: string; // used for: this.auth.register(data).subscribe((response) => {});
        changePassword?: string;  // used for: this.auth.changePassword(data).subscribe((response) => {});
        recoveryPassword?: string; // used for: this.auth.recoveryPassword(data).subscribe((response) => {});
        resetPassword?: string; // used for: this.auth.resetPassword(data).subscribe((response) => {});
        login?: string;  // used for: this.auth.login(data).subscribe((response) => {});
        logout?: string;  // used for: this.auth.logout();
        refreshToken?:  string; // handled by interceptor
        getMe?: string; // used for: this.auth.getMe().subscribe(...);
      };
      appRoutes: {
        loginPage?: string; // redirect to this path if user is not authenticated
        baseRootForAuthUsers?: string; // redirect to this path loggedin users when user try to access some other page
        redirectUrlWithNoPermission?: string; // redirect to this path when user try to access to page with no permission
      };
}

```


<br/>


<hr>

# Usage:

<br/>


```html
    <!-- only authenticated users will see this -->
    <div *permission="'auth'">Welcome, you are logged in.</div>
    <!-- only unauthenticated users will see this -->
    <div *permission="'unauth'">Please, login.</div>
    <!-- only user with role admin will see this -->
    <div *permission="['admin']">You are the boss.</div>
    <!-- only user with role 'user' will see this -->
    <div *permission="['user']">See the products.</div>
    <!-- user and author will see this -->
    <div *permission="['user', 'author']">See this, click here.</div>
```


# Login response from API:
```javascript
    import { AuthService } from 'visla-auth';
    ...

    this.auth.login(credentials).subscribe((response) => {})
```

<br/>
Response object should have "access_token" and "token_type" properties:
<br>

```javascript
    {
        access_token: 123, // required
        refresh_token: 234, // it's NOT required. If your backend returns "refresh_token" property, "refresh_token" will be user for refreshing. Otherwise, "access_token" will be used also used for refreshing.
        token_type: 'Bearer', // required
        anything_else: 'it is no required'
    }
```

# Get user object (me object) response from API:
This part is required only if you want to use *permission directive (to show/hide some HTML based on user role) or Role guard (to allow navigate to specific page based on user role).
<br/>

```javascript
    import { AuthService } from 'visla-auth';
    ...
    // after login:
    this.auth.getMe().subscribe((response) => {})
```

<br/>
Response object should have "role" property with string value:
<br/>

```javascript
    {
        role: 'admin', // required
        anything_else: 'it is no required'
    }
```

# Login example:

```javascript
    import { Component } from '@angular/core';
    import { AuthService } from 'visla-auth';

    @Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    })
    export class AppComponent {
    constructor(private auth: AuthService) {
        const credentials = { // object you pass to the API
            email: "myemail@example.com",
            password: "mypassword"
        };
        this.auth.login(credentials).subscribe((response) => {
                console.log('You are logged in, you have a token in localStorage, and interceptors will handle it.');
                // if your app has a roles, get it from api:
                this.auth.getMe().subscribe((response) => {
                    console.log('You have user/me object. Now, Module know user role.')
                }, (error) => {
                    alert('Error, try again');
                });
            }
            }, (error) => {
                alert('Login error, try again');
            });
        }
    }

```


# Routing guards:
To working with guards, first we need to know user role (see example before):
<br/>

```javascript
    import { AuthService } from 'visla-auth';
    ...

    this.auth.getMe().subscribe((response) => {
            console.log('You have user/me object. Now, Module know user role.')
        }, (error) => {
            alert('Error, try again');
        });
    }
```


Prevent some routes from unauthorized users. "acceptedRoles" property is required.
<br/>
only admin can visit this pages
<br/>

```javascript
    import { RoleGuard } from 'visla-auth';
    ....

    {
        path: 'admin-page',
        component: AdminComponent,
        data: {
            acceptedRoles: ['admin'] // in array of string we define roles that can access to this path
        },
        canActivate: [RoleGuard] // only admin can visit this pages
    }
```
<br/>
only admin, and author can visit this pages
<br/>

```javascript
    import { RoleGuard } from 'visla-auth';
    ....

    {
        path: 'admin-page',
        component: AdminComponent,
        data: {
            acceptedRoles: ['admin', 'author'] // in array of string we define roles that can access to this path
        },
        canActivate: [RoleGuard] // only admin, and author can visit this pages
    }
```

<br/>
any authenticated user can visit this 
<br/>

```javascript
    import { AuthenticatedRequiredGuard } from 'visla-auth';
    ....

    {
        {
        path: 'welcome-page',
        component: WelcomeComponent,
        canActivate: [AuthenticatedRequiredGuard] // any authenticated user can visit this page
    }
```

<br/>
any NOT authenticated user can visit this page. Auth users can NOT visit this page. It is usefull for login page, to prevent logged in users to access login page...
<br/>

```javascript
    import { NotAuthenticatedOnlyGuard } from 'visla-auth';
    ....

    {
        {
        path: 'login-page',
        component: LoginComponent,
        canActivate: [NotAuthenticatedOnlyGuard] // any NOT authenticated user can visit this page. Auth users can NOT visit this page
    }
```


# Auth Service:
List of functions you can use (if you pass endpoints in the config object):
<br/>

```javascript
    import { AuthService } from 'visla-auth';

    @Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    })
    export class AppComponent {
    constructor(private auth: AuthService) {

        // METHODS:
        this.auth.register(data).subscribe((response) => {})

        this.auth.login(data).subscribe((response) => {})

        this.auth.getMe().subscribe((response) => {})

        this.auth.changePassword(data).subscribe((response) => {})

        this.auth.recoveryPassword(data).subscribe((response) => {})

        this.auth.resetPassword(data).subscribe((response) => {})

        this.auth.logout();

        // PROPERTY
        console.log(this.auth.isLoggedIn); // boolean

        // SUBJECT
        // subscribe to the userIsAuth$ subject, and listen the login changes
        this.auth.userIsAuth$.subscribe((isAuth: boolean) => {
            console.log(`User updated auth to: ${isAuth}`);
        });

    }
```

<br/>
If you want to use this methods, it's required to define endpoints for them in config object (see above).


# Logout
```javascript
    import { AuthService } from 'visla-auth';
    ...

    this.auth.logout(); // logout 
    this.auth.logout(true); // logout and navigate to the login page (if you pass loginPage property in config object)
```

# User service
```javascript
    import { UserService } from 'visla-auth';
    ...

    // PROPERTIES:
    console.log(this.user.me); // user/me object
    console.log(this.user.role); // 'admin'

    // SUBJECT
    // subscribe to the userRole$ subject, and listen the role changes
    this.user.userRole$.subscribe((role: string) => {
      console.log(`Role is updated to: ${role}`);
    });
```

<br/>

<hr/>

# Build new npm package
- update npm package version in projects/visla-auth/package.json
- ng build VislaAuth
- navigate to ./dist/visla-auth
- npm login
- npm publish

<br/>
<br/>
todo, fix this:
<br/>
In dist folder, remove all absolute paths:
userRole$: import("../../../../../../../localUrl/visla-auth6/node_modules/rxjs/internal/Observable").Observable<string>;
<br> to: <br>
userRole$: import("node_modules/rxjs/internal/Observable").Observable<string>;
