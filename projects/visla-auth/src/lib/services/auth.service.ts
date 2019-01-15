import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { IToken } from '../models/Token';
import { IUser } from '../models/User';
import { BehaviorSubject, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string;
  private userIsAuthSubject$ = new BehaviorSubject<boolean>(this.isLoggedIn);
  public userIsAuth$ = this.userIsAuthSubject$.asObservable().pipe(distinctUntilChanged());

  constructor(private http: HttpClient,
              private router: Router,
              private userService: UserService,
              private config: ConfigService) {
    this.baseUrl = config.baseUrl;
  }

  private generateUrl(endpoint): string {
    if (!this.baseUrl) {
      console.warn('Pass the base URL to the module config');
    }
    if (!endpoint) {
      console.warn('Url parameter missing in Module import config');
    }
    return this.baseUrl + endpoint;
  }


  register(data) {
    const url = this.generateUrl(this.config.apiEndpoints.register);
    return this.http.post(url, data);
  }

  changePassword(data) {
    const url = this.generateUrl(this.config.apiEndpoints.changePassword);
    return this.http.post(url, data);
  }

  recoveryPassword(data) {
    const url = this.generateUrl(this.config.apiEndpoints.recoveryPassword);
    return this.http.post(url, data);
  }

  resetPassword(data) {
    const url = this.generateUrl(this.config.apiEndpoints.resetPassword);
    return this.http.post(url, data);
  }

  login(credentials) {
    const url = this.generateUrl(this.config.apiEndpoints.login);
    return this.http.post(url, credentials)
      .pipe(
        tap(
          (tokenData: IToken) => {
            this.setTokenData(tokenData);
          }
        ),
        map(response => {
          return {
            loggedIn: true
          };
        })
      );
  }



  logout(navigateHome: boolean = true, sendToApi: boolean = true): void {
    const endpoint = this.config.apiEndpoints.logout;
    if (sendToApi && endpoint && this.baseUrl) {
      const url = this.baseUrl + endpoint;
      this.http.post(url, {}).subscribe((response) => {});
    }

    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');

    this.userService.setMe(null);
    if (navigateHome && this.config.appRoutes.login) {
      this.router.navigate([this.config.appRoutes.login]);
    }
    this.userIsAuthSubject$.next(false);
  }


  private setTokenData(tokenData: IToken): void {
    const token_type = tokenData.token_type;
    const access_token = tokenData.access_token;
    const refresh_token = tokenData.refresh_token || null;

    if (!access_token) {
      console.warn('Make sure your API response have "access_token" and "token_type" properties.');
      return;
    }

    localStorage.setItem('token', token_type + ' ' + access_token);
    if (refresh_token) {
      localStorage.setItem('refresh_token', token_type + ' ' + refresh_token);
    }
    this.userIsAuthSubject$.next(true);
  }


  // token
  get isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    return true;
  }

  refreshToken() {
    if (!this.baseUrl) {
      console.warn('Pass the base URL to the module config');
      return of(null);
    }
    const endpoint = this.config.apiEndpoints.refreshToken;
    if (!endpoint) {
      console.warn('Url parameter missing in Module import config');
    }
    const url = this.baseUrl + endpoint;
    return this.http.post(url, {})
      .pipe(
        tap(
          (data: IToken) => {
            this.setTokenData(data);
            return data;
          }
        )
      );
  }

  getMe() {
    if (!this.baseUrl) {
      console.warn('Pass the base URL to the module config');
      return of(null);
    }
    const endpoint = this.config.apiEndpoints.getMe;
    if (!endpoint) {
      console.warn('Url parameter missing in Module import config');
    }
    const url = this.baseUrl + endpoint;
    return this.http.get(url).pipe(
      tap((meData: IUser) => {
        this.userService.setMe(meData);
        return meData;
      }, (error) => {
        this.logout(false);
        return error;
      })
    );
  }
}


