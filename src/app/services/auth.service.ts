import { Injectable, EventEmitter, Output } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { LoginService, User } from '../client';

export class UserStorage {
    public role: User.RoleEnum;
    public token: string;
    public isTempSession: boolean;
    public name: string;
    // public validThrough: string;
}

class LocalStorage {

    public getStorageUser(name: string): UserStorage {
        const item: string = localStorage.getItem(name);
        if (item != null) {
            const parsed = JSON.parse(item) as UserStorage;
            return parsed;
        } else {
            return null;
        }
    }

    public setStorageUser(name: string, user: UserStorage) {
        localStorage.setItem(name, JSON.stringify(user));
    }

    public getCurrent(): UserStorage {
        return this.getStorageUser('currentUser');
    }

    public setCurrent(user: UserStorage) {
        this.setStorageUser('currentUser', user);
    }

    public getTemp(): UserStorage {
        return this.getStorageUser('tempSession');
    }

    public clearTemp() {
        localStorage.removeItem('tempSession');
    }

    public setTemp(user: UserStorage) {
        this.setStorageUser('tempSession', user);
    }

    public getUserRole(): User.RoleEnum {
        return this.getCurrent().role;
    }

    public getUserName(): string {
        const user = this.getCurrent();
        if (user) {
            return user.name;
        } else {
            return '';
        }
    }
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private userChangeSource = new Subject<UserStorage>();
    public userChange$ = this.userChangeSource.asObservable();

    private session = new LocalStorage();

    constructor(private loginService: LoginService) {
    }

    initTempSession(): Observable<any> {
        return this.loginService.tempSession()
            .pipe(map((res) => {
                if (res && res.token) {
                    this.updateUser('', res.token, true, res.role, res.validThrough);
                }
                return res;
            }));
    }

    currentUser(): UserStorage {
        return this.session.getCurrent();
    }

    login(captchaToken: string, email: string, password: string, rememberMe: boolean): Observable<any> {
        return this.loginService.login(captchaToken, email, password, rememberMe, this.session.getCurrent())
            .pipe(map((res: any) => {
                // login successful if there's a jwt token in the response
                if (res && res.token) {
                    this.updateUser(email, res.token, false, res.role, res.validThrough);
                }
            }));
    }

    updateUser(email: string, token: string, isTempSession: boolean, role: User.RoleEnum, validThrough: string) {
        const current = this.session.getCurrent();
        if (current && current.isTempSession) {
            this.session.setTemp(current);
        } else if (!isTempSession) {
            console.warn('no temp session in oldCurrentUser');
        }

        // TODO что делать если tempusertoken стал просроченым и возвращает unathorized например в корзине
        // и происходит зацикливание (если token signature is invalid)

        const newUser = new UserStorage();
        newUser.isTempSession = isTempSession;
        newUser.name = email;
        newUser.role = role;
        newUser.token = token;
        // newUser.validThrough = new Date(validThrough);
        this.session.setCurrent(newUser);

        this.userChangeSource.next(newUser);
    }

    logout() {
        const user = this.session.getCurrent();
        if (user && !user.isTempSession) {
            const old = this.session.getTemp();
            if (old) {
                if (old.isTempSession) {
                    this.session.setCurrent(old);
                    this.session.clearTemp();
                    this.userChangeSource.next(old);
                    return;
                } else {
                    console.warn('not temp session in tempSession');
                }
            } else {
                console.warn('tempSession is null while logout');
            }
        }
    }

    register(captchaToken: string, username: string, password: string, email: string, rememberMe: boolean): Observable<any> {
        return this.loginService.register(captchaToken, username, password, email, rememberMe)
            .pipe(map((res: any) => {
                if (res && res.token) {
                    this.updateUser(email, res.token, false, res.role, res.validThrough);
                }
            }));
    }
}
