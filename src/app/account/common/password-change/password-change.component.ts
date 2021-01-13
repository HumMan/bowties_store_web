import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { LoginService } from '../../../client';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account-common-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class AccountCommonPasswordChangeComponent implements OnInit, OnDestroy {

  changePasswordForm: FormGroup;
  submitted = false;
  loading: boolean;
  error = '';
  success = false;

  private subscriptions = new Subscription();

  constructor(private formBuilder: FormBuilder,
    private login: LoginService) {

  }

  ngOnInit() {
    this.createForm();
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
      this.login.changePassword(this.f.oldPassword.value, this.f.newPassword.value)
        .subscribe(
          data => {
            this.success = true;
            this.loading = false;
            this.submitted = false;
            this.createForm();
          },
          error => {
            if (error.status === 401) {
              this.error = 'Неверный пароль';
            } else {
              this.error = error.statusText;
            }

            this.loading = false;
          }));
  }

  createForm() {
    // Create the password field separately so we can pass it to our custom validator.
    const oldPassword = this.formBuilder.control('', [Validators.required, Validators.minLength(6)]);
    const newPassword = this.formBuilder.control('', [Validators.required, Validators.minLength(6)]);
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: oldPassword,
      newPassword: newPassword,
      newPasswordConfirm: ['', [this.validatePasswordConfirm(newPassword)]],
    });

    this.subscriptions.add(newPassword.valueChanges.subscribe(() => {
      this.changePasswordForm.get('newPasswordConfirm').updateValueAndValidity({ emitEvent: false, onlySelf: true });
    }));
  }

  validatePasswordConfirm(passwordControl: FormControl) {
    return (passwordConfirmControl: FormControl) => {
      // If the 2 fields' values are not equal then we return an error.
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
