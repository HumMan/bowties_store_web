import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './services/auth.service';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(
    private authService: AuthenticationService,
    private titleService: Title,
    private router: Router
  ) {

    // TODO пока отключено - т.к. не ясно что с индексацией
    // router.events.pipe(
    //   filter(event => event instanceof NavigationStart))
    //   .subscribe((event: NavigationStart) => {
    //     this.titleService.setTitle('JamesKot');
    //   });
  }

  ngOnInit() {
    if (!this.authService.currentUser()) {
      this.authService.initTempSession().subscribe((x) => { });
    }

  }
}
