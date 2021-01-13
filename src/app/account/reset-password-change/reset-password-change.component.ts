import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoginService } from '../../client';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-reset-password-change',
  templateUrl: './reset-password-change.component.html',
  styleUrls: ['./reset-password-change.component.css']
})
export class AccountResetPasswordChangeComponent implements OnInit, OnDestroy {
  submitted = false;
  loading: boolean;
  error = '';
  changePasswordForm: FormGroup;
  success = false;

  tokenValid = false;
  tokenInvalid = false;

  token: string;

  private subscriptions = new Subscription();

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private login: LoginService) { }

  ngOnInit() {
    this.createForm();
    this.subscriptions.add(
      this.route.params.subscribe(routeParams => {
        const token = routeParams.id;
        this.login.canResetPasswordChange(token).subscribe(
          (data) => {
            this.tokenValid = true;
            this.token = token;
          },
          (error) => {
            this.tokenInvalid = true;
          }
        );
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  get f() { return this.changePasswordForm.controls; }

  onSubmit() {
    this.error = '';
    this.success = false;
    this.submitted = true;

    if (this.changePasswordForm.invalid) {
      return;
    }

    this.loading = true;

    this.subscriptions.add(
      this.login.resetPasswordChange(this.token, this.f.newPassword.value)
        .subscribe(
          data => {
            this.success = true;
            this.loading = false;
          },
          error => {
            if (error.status === 400) {
              this.error = 'Ошибка или ссылка уже была использована';
            } else {
              this.error = error.statusText;
            }

            this.loading = false;

          })
    );
  }

  createForm() {
    const newPassword = this.formBuilder.control('', [Validators.required, Validators.minLength(6)]);
    this.changePasswordForm = this.formBuilder.group({
      newPassword: newPassword,
      newPasswordConfirm: ['', [this.validatePasswordConfirm(newPassword)]],
    });

    this.subscriptions.add(
      newPassword.valueChanges.subscribe(() => {
        this.changePasswordForm.get('newPasswordConfirm').updateValueAndValidity({ emitEvent: false, onlySelf: true });
      })
    );
  }

  validatePasswordConfirm(passwordControl: FormControl) {
    return (passwordConfirmControl: FormControl) => {
      if (passwordConfirmControl.value !== passwordControl.value) {
        return {
          validatePasswordConfirm: {
            valid: false
          }
        };
      }
    };
  }

}
