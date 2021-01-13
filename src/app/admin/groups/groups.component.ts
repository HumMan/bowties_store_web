import { Component, OnInit, OnDestroy } from '@angular/core';
import { Group } from '../../client';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GroupService } from '../../client/api/group.service';
import { AdminGroupEditComponent } from './edit/edit-group.component';
import { Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class AdminGroupsComponent implements OnInit, OnDestroy {

  groups: Group[];
  modalRef: NgbModalRef;
  closeResult: string;

  private subs: Subscription = new Subscription();

  constructor(
    private groupsService: GroupService,
    private dragulaService: DragulaService,
    private modalService: NgbModal) {

    dragulaService.createGroup('GROUPS', {
      moves: (el, container, handle) => {
        return handle.className === 'handle';
      }
    });
    this.subs.add(
      this.dragulaService.drop('GROUPS')
        .subscribe(({ name, el, target, source, sibling }) => {
          this.groups.forEach((v, i) => {
            v.order = i;
          });
          this.groupsService.updateOrder(
            this.groups.reduce((map, obj) => {
              map[obj.id] = obj.order;
              return map;
            }, {})
          ).subscribe(r => {
          });
        })
    );
  }

  ngOnInit() {
    this.UpdateGroupsList();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    if (this.modalRef != null) { this.modalRef.close(); }
    this.dragulaService.destroy('GROUPS');
  }

  private UpdateGroupsList() {
    this.groupsService.getAll().subscribe(groups => {
      this.groups = groups;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  EditGroup(group?: Group) {
    this.modalRef = this.modalService.open(AdminGroupEditComponent, { size: 'lg', backdrop: 'static' });
    if (group != null) {
      this.modalRef.componentInstance.currentGroup = JSON.parse(JSON.stringify(group));
    }
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.UpdateGroupsList();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  CreateGroup() {
    this.EditGroup(null);
  }

  DeleteGroup(id: string) {
    this.groupsService.delete(id).subscribe(result => {
      this.UpdateGroupsList();
    });
  }
}
