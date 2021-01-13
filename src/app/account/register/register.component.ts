import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ReCaptchaDirective } from '../../directives/recaptcha';
import { AuthenticationService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class AccountRegisterComponent implements OnInit, OnDestroy {

  registrationForm: FormGroup;
  submitted = false;
  loading: boolean;
  error = '';

  @ViewChild(ReCaptchaDirective)
  captchaDir: ReCaptchaDirective;

  private subscriptions = new Subscription();

  constructor(private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  get f() { return this.registrationForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.registrationForm.invalid) {
      return;
    }

    this.loading = true;

    this.subscriptions.add(
      this.authenticationService.register(
        this.f.captcha.value, this.f.name.value,
        this.f.password.value, this.f.email.value, this.f.rememberMe.value)
        .pipe(first())
        .subscribe(
          data => {
            // TODO update cart
            this.router.navigate(['/']);
          },
          error => {
            this.error = error.statusText;
            this.captchaDir.reset();
            this.loading = false;
          }));
  }

  createForm() {
    // Create the password field separately so we can pass it to our custom validator.
    const passwordControl = this.formBuilder.control('', [Validators.required, Validators.minLength(6)]);
    this.registrationForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: passwordControl,
      // We pass the password field to compare with password confirm field.
      passwordConfirm: ['', [this.validatePasswordConfirm(passwordControl)]],
      captcha: new FormControl('', [Validators.required]),
      rememberMe: [false],
    });

    this.subscriptions.add(
      passwordControl.valueChanges.subscribe(() => {
        this.registrationForm.get('passwordConfirm').updateValueAndValidity({ emitEvent: false, onlySelf: true });
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
