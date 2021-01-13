import { Component, OnInit, Input } from '@angular/core';
import { Group, VariationParameter, VariationParameterValue, ImageService } from '../../../client';
import { GroupService } from '../../../client/api/group.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.css']
})
export class AdminGroupEditComponent implements OnInit {
  @Input() currentGroup: Group;
  isNewGroup: boolean;

  originalObjectSerialized: string;
  uploading: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private groupsService: GroupService,
    private imagesService: ImageService) { }

  SaveGroup() {
    if (this.isNewGroup) {
      this.groupsService.CreateGroup(this.currentGroup).subscribe(products => {
        this.activeModal.close('save click');
      });
    } else {
      if (JSON.stringify(this.currentGroup) !== this.originalObjectSerialized) {
        this.groupsService.update(this.currentGroup).subscribe(products => {
          this.activeModal.close('save click');
        });
      } else {
        this.activeModal.dismiss('Cancel click');
      }
    }
  }

  DeleteParameter(i: number) {
    this.currentGroup.variationParameters.splice(i, 1);
  }

  DeleteValue(parameter: VariationParameter, i: number) {
    parameter.values.splice(i, 1);
  }

  CreateParameter() {
    this.currentGroup.variationParameters.push(new VariationParameter());
  }

  CreateValue(parameter: VariationParameter) {
    parameter.values.push(new VariationParameterValue());
  }

  ngOnInit() {
    if (this.currentGroup == null) {
      this.currentGroup = new Group();
      this.isNewGroup = true;
    } else {
      this.isNewGroup = false;
      this.originalObjectSerialized = JSON.stringify(this.currentGroup);
    }
  }

  uploadImages(files: Array<any>) {

    this.uploading = true;

    let toLoad = files.length;

    from(files).pipe(
      concatMap((file) => {
        const formData = new FormData();
        formData.append(file.name, file);
        return (this.imagesService.apiImageThumbPost(formData));
      })
    ).subscribe(result => {
      this.currentGroup.image = result;
      toLoad--;
      if (toLoad === 0)
        this.uploading = false;
    }, (error) => {
      this.uploading = false;
    });

    //то же самое, но параллельно
    // this.upload.Upload(files).subscribe(result => {
    //   this.currentProduct.images = this.currentProduct.images.concat(result);
    // }, (error) => {
    //   this.uploading = false;
    // });

  }

}
