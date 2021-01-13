import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Group } from '../../client';
import { GroupService } from '../../client/api/group.service';

@Component({
  templateUrl: './groups-blocks.component.html',
  styleUrls: ['./groups-blocks.component.css']
})
export class StoreGroupsBlocksComponent implements OnInit {

  groups: Group[] = new Array<Group>();

  loading = true;
  error = false;

  constructor(private groupService: GroupService) { }

  ngOnInit() {
    this.groupService.getAll().subscribe(result => {
      this.groups = result.filter(i => i.visible);
      this.loading = false;
    }, error => {
      this.loading = false;
      this.error = true;
    });
  }

}
