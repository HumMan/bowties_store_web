import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Product, ProductService, ImageService, ProductVariation, ImageDesc } from '../../../client';
import { HttpEventType } from '@angular/common/http';
import { forEach } from '@angular/router/src/utils/collection';
import { UploadImageService } from '../../../services/image-upload.service';
import { from, Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { ProductHelper } from '../../../utils/product';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class AdminProductEditComponent extends ProductHelper implements OnInit, OnDestroy {

  @Input() currentProduct: Product;

  availableColors: string[];

  isNewProduct: boolean;

  usePrimaryColor: boolean;
  useSecondaryColor: boolean;

  originalObjectSerialized: string;

  canvas: any;

  uploading: boolean;

  private subs: Subscription = new Subscription();

  constructor(
    public activeModal: NgbActiveModal,
    private productsService: ProductService,
    private dragulaService: DragulaService,
    private imagesService: ImageService) {
    super();

  }

  SaveProduct() {

    if (!this.usePrimaryColor) {
      this.currentProduct.properties.color = null;
    } else if (this.currentProduct.properties.color === null) {
      this.currentProduct.properties.color = '#000000';
    }

    if (!this.useSecondaryColor) {
      this.currentProduct.properties.secondaryColor = null;
    } else if (this.currentProduct.properties.secondaryColor === null) {
      this.currentProduct.properties.secondaryColor = '#000000';
    }

    if (this.isNewProduct) {
      this.productsService.create(this.currentProduct).subscribe(products => {
        this.activeModal.close('save click');
      });
    } else {
      if (JSON.stringify(this.currentProduct) !== this.originalObjectSerialized) {
        this.productsService.update(this.currentProduct).subscribe(products => {
          this.activeModal.close('save click');
        });
      } else {
        this.activeModal.dismiss('Cancel click');
      }

    }
  }

  filterArchived(variation: ProductVariation): boolean {
    return !variation.isArchived;
  }

  ngOnInit() {
    if (this.currentProduct.id == null) {
      this.isNewProduct = true;
    } else {
      this.isNewProduct = false;
      this.originalObjectSerialized = JSON.stringify(this.currentProduct);
    }

    this.usePrimaryColor = this.primaryColorUsed(this.currentProduct);
    this.useSecondaryColor = this.secondaryColorUsed(this.currentProduct);

    this.dragulaService.createGroup('PRODUCT_IMAGES', {
      moves: (el, container, handle) => {
        return handle.className === 'handle';
      }
    });

    this.subs.add(
      this.productsService.getAllColors().subscribe(result => {
        this.availableColors = result;
      })
    );
  }


  ngOnDestroy() {
    this.dragulaService.destroy('PRODUCT_IMAGES');
  }

  imageClick($event) {
  }

  deleteImage(index: number) {
    this.currentProduct.images.splice(index, 1);
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
      if (this.currentProduct.images == null) {
        this.currentProduct.images = [];
      }
      this.currentProduct.images.push(result);
      toLoad--;
      if (toLoad === 0) {
        this.uploading = false;
      }
    }, (error) => {
      this.uploading = false;
    });

  }

}
