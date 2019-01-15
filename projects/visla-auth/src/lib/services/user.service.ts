import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { IUser } from '../models/User';


@Injectable({
  providedIn: 'root'
})
export class UserService {


  private userRoleSubject$ = new BehaviorSubject<string>(this.role);
  public userRole$ = this.userRoleSubject$.asObservable().pipe(distinctUntilChanged());

  constructor(private config: ConfigService) {}

  get role(): string {
    const me = this.me;
    if (!me) {
      return '';
    }

    const role = me.role;

    if (!role) {
      console.warn(`Make sure your API response for getMe/user have "role" property.`);
      return '';
    }

    return role.toLowerCase();
  }


  get me(): IUser {
    const me = localStorage.getItem('me');
    if (!me) {
      return null;
    }
    return JSON.parse(me);
  }


  public setMe(me: IUser = null): void {
    if (!me) {
      this.removeMe();
      return;
    }
    localStorage.setItem('me', JSON.stringify(me));
    this.userRoleSubject$.next(this.role);
  }

  private removeMe(): void {
    localStorage.removeItem('me');
    this.userRoleSubject$.next('');
  }

}
