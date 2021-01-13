import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/auth.service';
import { User } from '../../client';

@Component({
  selector: 'admin-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {

  constructor(public router: Router,
    private authenticationService: AuthenticationService) { }

  isAdmin: boolean = false;

  ngOnInit() {
    const user = this.authenticationService.currentUser();
    if (user)
      this.isAdmin = (user.role == User.RoleEnum.Admin);
  }

}
