import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    HttpEvent,
    HttpRequest,
    HttpHandler,
    HttpInterceptor
} from '@angular/common/http';
import { ConfigService } from './../services/config.service';


@Injectable()
export class InterceptorAddTokenService implements HttpInterceptor {
    constructor(private config: ConfigService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // if we have token/ if we are logged in
        let token = localStorage.getItem('token');
        if (token) {

            // if this request is for refreshing token:
            const refresTokenUrl = this.config.baseUrl + this.config.apiEndpoints.refreshToken;
            if (request.url === refresTokenUrl) {
                // and we have refresh_token:
                const refresh_token = localStorage.getItem('refresh_token');
                if (refresh_token) {
                    token = refresh_token;
                }
            }

            request = request.clone({
                setHeaders: {
                    Authorization: token
                }
            });
        }

        return next.handle(request);
    }

}

