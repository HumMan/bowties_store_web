import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService, User, GroupDesc, Cart } from '../client';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService, UserStorage } from '../services/auth.service';
import { AllGroupsDescShare, CurrentCartShare } from '../services/data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isNavbarCollapsed = true;

  userNameChangeRef: Subscription = null;

  groups: GroupDesc[];

  cartItemsCount?: number = null;

  username = '';
  isAdmin = false;
  isManager = false;
  isAnon = true;
  userRole: User.RoleEnum = User.RoleEnum.Anon;

  constructor(
    private authenticationService: AuthenticationService,
    private allGroups: AllGroupsDescShare,
    private cartShare: CurrentCartShare,
    private router: Router) {
    const user = this.authenticationService.currentUser();
    if (user != null) {
      this.changeUser(user);
    }
  }

  changeUser(user: UserStorage) {
    this.username = user.name;
    this.isAdmin = user.role >= User.RoleEnum.Admin;
    this.isManager = user.role >= User.RoleEnum.Manager;
    this.isAnon = user.role === User.RoleEnum.Anon;
    this.userRole = user.role;
  }

  routeStarts(url: string) {
    return this.router.url.startsWith(url);
  }

  routeEq(url: string) {
    return this.router.url === url;
  }

  ngOnInit() {
    this.userNameChangeRef = this.authenticationService.userChange$.subscribe((user) => {
      this.changeUser(user);
    });

    this.allGroups.groupsChange$.subscribe(result => {
      this.groups = result;
    });

    this.router.events
      .subscribe((event) => {
        this.isNavbarCollapsed = true;
      });

    if (this.authenticationService.currentUser()) {
      this.cartShare.getData().subscribe(result => {
        if (result.items.length > 0) {
          this.cartItemsCount = result.items.length;
        } else {
          this.cartItemsCount = null;
        }
      });
    }

    this.cartShare.cartCountChange$.subscribe(count => {
      if (count > 0) {
        this.cartItemsCount = count;
      } else {
        this.cartItemsCount = null;
      }
    });
  }

  ngOnDestroy() {
    this.userNameChangeRef.unsubscribe();
  }

  logout() {
    this.cartShare.setData(new Cart());
    this.authenticationService.logout();
  }
}
