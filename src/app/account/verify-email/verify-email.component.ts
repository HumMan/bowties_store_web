import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../../client';

@Component({
  selector: 'app-account-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class AccountVerifyEmailComponent implements OnInit, OnDestroy {

  loading: boolean;

  tokenValid = false;
  tokenInvalid = false;

  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private login: LoginService) { }

  ngOnInit() {
    this.subscriptions.add(
      this.route.params.subscribe(routeParams => {
        const token = routeParams.id;
        this.login.validateEmail(token).subscribe(
          (data) => {
            this.tokenValid = true;
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

}
