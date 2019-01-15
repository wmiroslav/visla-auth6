import { ConfigService } from './../services/config.service';
import { AuthService } from '../services/auth.service';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, empty, Subscription, Subject,  throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';


@Injectable()
export class InterceptorHandle401Service implements HttpInterceptor, OnDestroy {

    refreshInProgress = false;
    tokenRefreshedSubject = new Subject();
    tokenRefreshed$ = this.tokenRefreshedSubject.asObservable();
    refreshSub: Subscription;

    constructor(private authService: AuthService, private config: ConfigService) {
    }

    ngOnDestroy() {
        if (this.refreshSub) {
            this.refreshSub.unsubscribe();
        }
    }

    private refreshToken() {
        if (this.refreshInProgress) {
            return new Observable(observer => {
                this.refreshSub = this.tokenRefreshed$.subscribe(() => {
                    observer.next();
                    observer.complete();
                });
            });
        } else {
            this.refreshInProgress = true;
            return this.authService.refreshToken()
                .pipe(
                    tap(() => {
                        this.refreshInProgress = false;
                        this.tokenRefreshedSubject.next();
                    }, (error) => {
                        this.refreshInProgress = false;
                        this.tokenRefreshedSubject.complete();
                    })
                );
        }
    }
    // response interceptor
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return next.handle(request)
            .pipe(
                catchError(error => {

                    const refresTokenUrl = this.config.baseUrl + this.config.apiEndpoints.refreshToken;
                    if ((request.url === refresTokenUrl) && error.status === 401) {
                        // on INVALID refresh token
                        this.authService.logout(true, false);
                        return throwError(error);
                    }

                    if (error.status === 401) {
                        return this.refreshToken().pipe(
                            switchMap(() => {
                                // repeat failed requests
                                return next.handle(this.addTokenToHeaders(request));
                            }),
                            catchError(() => {
                                return empty();
                            })
                        );
                    } // end 401

                    return throwError(error);
                })
            );
    }

    private addTokenToHeaders(request) {
        const token = localStorage.getItem('token');
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: token
                }
            });
        }
        return request;
    }


}
