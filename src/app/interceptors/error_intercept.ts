import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private auth: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401 && !err.url.includes('/api/login')) {
                if (this.auth) {
                    const header = err.headers.get('WWW-Authenticate');
                    const user = this.auth.currentUser();
                    if (user && user.isTempSession && header && header.includes('The token is expired')) {
                        this.auth.initTempSession().subscribe((res) => {
                            location.reload(true);
                        });
                    } else {
                        this.auth.logout();
                        location.reload(true);
                    }
                }
            }

            return throwError(err);
        }));
    }
}
