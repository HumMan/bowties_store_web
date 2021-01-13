import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../client/api/api';
import { Product, Group } from '../../client';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AdminProductEditComponent } from './edit-product/edit-product.component';
import { GroupService } from '../../client/api/group.service';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { ColorUtils } from '../../utils/colors';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {

  products: Product[];
  groups: Group[];
  modalRef: NgbModalRef;
  closeResult: string;
  selectedGroup: string = null;

  private subs: Subscription = new Subscription();

  constructor(
    private productsService: ProductService,
    private groupsService: GroupService,
    private dragulaService: DragulaService,
    private modalService: NgbModal) {
    dragulaService.createGroup('PRODUCTS', {
      moves: (el, container, handle) => {
        return handle.className === 'handle';
      }
    });

    this.subs.add(
      this.dragulaService.drop('PRODUCTS')
        .subscribe(({ name, el, target, source, sibling }) => {
          this.products.forEach((v, i) => {
            v.order = i;
          });
          this.productsService.updateOrder(
            this.products.reduce((map, obj) => {
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
    this.dragulaService.destroy('PRODUCTS');
  }

  GroupChange() {
    this.UpdateProductsList(this.selectedGroup);
  }

  private UpdateGroupsList() {
    return this.groupsService.getAll().subscribe(groups => {
      this.groups = groups;
      if (groups[0] != null) {
        this.selectedGroup = groups[0].id;
        this.UpdateProductsList(this.selectedGroup);
      }
    });
  }

  private UpdateProductsList(groupId: string) {
    this.productsService.getAll(groupId).subscribe(products => {
      this.products = products.products;
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

  DeleteProduct(id: string) {
    this.productsService.delete(id).subscribe(result => {
      this.products = this.products.filter((value) => value.id !== id);
    });
  }

  EditProduct(product?: Product) {
    this.modalRef = this.modalService.open(AdminProductEditComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.componentInstance.currentProduct = JSON.parse(JSON.stringify(product));

    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.UpdateProductsList(this.selectedGroup);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  CreateProduct() {
    this.productsService.getDefault(this.selectedGroup).subscribe(productTemplate => {
      this.EditProduct(productTemplate);
    });
  }

  availability(product: Product): string {
    if (product.variations.every(i => !i.canBeOrdered)) {
      return 'Нет';
    } else if (product.variations.every(i => i.canBeOrdered)) {
      return 'Да';
    } else {
      return 'Частично';
    }
  }

  availableCount(product: Product): string {
    const available = product.variations.filter(i => i.canBeOrdered);
    if (available.every(i => i.withoutCount)) {
      return 'Без';
    } else {
      const min = Math.min(...available.filter(i => !i.withoutCount).map(i => i.inventoryCount));
      const max = Math.max(...available.filter(i => !i.withoutCount).map(i => i.inventoryCount));
      let countRange = min + '-' + max;
      if (min === max) {
        countRange = min.toString();
      }
      if (available.every(i => !i.withoutCount)) {
        return '' + countRange;
      } else {
        return 'Без, ' + countRange;
      }
    }
  }

  availablePrice(product: Product): string {
    const available = product.variations.filter(i => i.canBeOrdered);
    if (available.length > 0) {
      const min = Math.min(...available.map(i => i.price));
      const max = Math.max(...available.map(i => i.price));
      let priceRange = min + '-' + max;
      if (min === max) {
        priceRange = min.toString();
      }
      return '' + priceRange;
    } else {
      return '';
    }
  }

}
