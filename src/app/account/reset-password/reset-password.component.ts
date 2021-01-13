import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { ReCaptchaDirective } from '../../directives/recaptcha';
import { LoginService } from '../../client';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class AccountResetPasswordComponent implements OnInit {

  submitted = false;
  loading: boolean;
  error = '';
  resetPasswordForm: FormGroup;
  success = false;

  private subscriptions = new Subscription();

  @ViewChild(ReCaptchaDirective)
  captchaDir: ReCaptchaDirective;

  constructor(private formBuilder: FormBuilder,
    private authenticationService: LoginService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      captcha: new FormControl('', [Validators.required]),
    });
  }
  get f() { return this.resetPasswordForm.controls; }

  onSubmit() {
    this.success = false;
    this.error = '';
    this.submitted = true;
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.resetPassword(this.f.email.value, this.f.captcha.value)
      .subscribe(
        data => {
          this.success = true;
          this.loading = false;
        },
        error => {
          this.error = error.statusText;
          this.captchaDir.reset();
          this.loading = false;
        });
  }
}
