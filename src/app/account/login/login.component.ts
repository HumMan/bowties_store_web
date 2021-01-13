import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoginService, CartService } from '../../client';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ReCaptchaDirective } from '../../directives/recaptcha';
import { AuthenticationService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { CurrentCartShare } from '../../services/data.service';

@Component({
  selector: 'app-account-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class AccountLoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  submitted = false;
  loading: boolean;
  returnUrl: string;
  error = '';

  @ViewChild(ReCaptchaDirective)
  captchaDir: ReCaptchaDirective;

  private subscriptions = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private cartShared: CurrentCartShare,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.createForm();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      captcha: new FormControl('', [Validators.required]),
      rememberMe: [false],
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    // TODO если возникает ошибка Unathorized - то можно отправить еще запрос без ввода капчи
    this.loading = true;
    this.subscriptions.add(
      this.authenticationService.login(this.f.captcha.value, this.f.email.value, this.f.password.value, this.f.rememberMe.value)
        .pipe(first())
        .subscribe(
          data => {
            this.cartShared.getDataWithRefresh().subscribe(() => {
              if (this.returnUrl) {
                this.router.navigate([this.returnUrl]);
              }
            });
          },
          error => {
            if (error.status === 401) {
              this.error = 'Неверный пароль';
            } else {
              this.error = error.statusText;
            }
            this.captchaDir.reset();
            this.loading = false;
          })
    );
  }
}
