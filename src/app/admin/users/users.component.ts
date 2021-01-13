import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../../client';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class AdminUsersComponent implements OnInit {

  users: User[];

  constructor(private userService: UserService) {
    userService.getAll().subscribe((result)=>{
      this.users = result;
    })
   }

  ngOnInit() {
  }

}
