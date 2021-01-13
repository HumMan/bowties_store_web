import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { GroupService } from '../../client/api/group.service';
import { Group, GroupDesc } from '../../client';
import { AllGroupsDescShare } from '../../services/data.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './all-groups.component.html',
  styleUrls: ['./all-groups.component.css']
})
export class StoreAllGroupsComponent implements OnInit, OnDestroy {

  constructor(public router: Router, private groupsService: GroupService,
    private allGroups: AllGroupsDescShare) { }

  groups: GroupDesc[];

  activeGroupId: string;

  subs = new Subscription();

  routeEq(url: string) {
    return decodeURIComponent(this.router.url.split('?')[0]) === url;
  }

  ngOnInit() {

    this.allGroups.getData().subscribe(result => {
      this.groups = result.filter(i => i.visible);
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
