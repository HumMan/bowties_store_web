import { Injectable } from '@angular/core';
import {
    HttpClient
} from '@angular/common/http';
import { UserStorage } from '../../services/auth.service';
import { TokenRequest, ChangePasswordRequest, ResetPasswordRequest } from '../model/models';
import { Observable } from 'rxjs';

@Injectable()
export class LoginService {

    constructor(protected http: HttpClient) {
    }

    login(captchaToken: string, email: string, password: string, rememberMe: boolean, user: UserStorage): Observable<any> {
        const param = new TokenRequest();
        param.captchaToken = captchaToken;
        param.email = email;
        param.password = password;
        param.rememberMe = rememberMe;
        param.tempSessionToken = user.isTempSession ? user.token : null;

        return this.http.post<any>('/api/login', param);
    }

    register(captchaToken: string, username: string, password: string, email: string, rememberMe: boolean): Observable<any> {
        return this.http.post<any>('/api/login/register',
            { captchaToken: captchaToken, username: username, password: password, email: email, rememberMe: rememberMe });
    }

    tempSession(): Observable<any> {
        return this.http.post<any>('/api/login/temp_session', {});
    }


    changePassword(oldPassword: string, newPassword: string): Observable<any> {
        const params = new ChangePasswordRequest();
        params.newPassword = newPassword;
        params.oldPassword = oldPassword;
        return this.http.post<any>('/api/login/changepass',
            params
        );
    }

    validateEmail(token: string): Observable<any> {
        return this.http.post<any>('/api/login/validate',
            {
                token
            }
        );
    }

    resetPassword(email: string, captchaToken: string): Observable<any> {
        const params = new ResetPasswordRequest();
        params.captchaToken = captchaToken;
        params.email = email;
        return this.http.post<any>('/api/login/createreset',
            params
        );
    }

    canResetPasswordChange(token: string): Observable<any> {

        return this.http.get<any>('/api/login/canreset',
            {
                params: { token }
            }
        );
    }

    resetPasswordChange(token: string, newPassword: string): Observable<any> {
        // TODO заменить параметры на классы из модели
        return this.http.post<any>('/api/login/reset',
            {
                token,
                newPassword
            }
        );
    }
}
