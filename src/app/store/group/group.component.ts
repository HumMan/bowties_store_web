import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { AllProductsShare, CurrentCartShare, AllGroupsDescShare } from '../../services/data.service';
import { Product, CartService } from '../../client';
import { ActivatedRoute, ParamMap, Router, NavigationEnd } from '@angular/router';
import { switchMap, filter } from 'rxjs/operators';
import { ProductHelper } from '../../utils/product';
import { Subscription } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { FilterService } from '../../services/filter.service';
import { GroupHelper } from '../../utils/group';

@Component({
  selector: 'app-store-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class StoreGroupComponent extends ProductHelper implements OnInit, OnDestroy {

  private subs: Subscription = new Subscription();

  groupTitle: string;

  loading = true;
  error = false;

  selectedProducts: Product[];
  private allProducts: Product[];
  private activeGroupId: string;

  static filterByGroupId(products: Product[], groupId: string): Product[] {
    if (groupId.indexOf(';') !== -1) {
      const ids: string[] = groupId.split(';');
      return products.filter(i => ids.filter(k => k === i.groupId).length > 0);
    } else {
      return products.filter(i => i.groupId === groupId);
    }
  }

  constructor(
    private meta: Meta,
    private titleService: Title,
    private productsShared: AllProductsShare,
    private groupDesc: AllGroupsDescShare,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private filterService: FilterService,
    private cartShare: CurrentCartShare) {
    super();
  }

  ngOnInit() {

    this.filterService.initVisibility(true);

    this.subs.add(
      this.activatedRoute.params.subscribe(routeParams => {
        this.productsShared.getData().subscribe(result => {
          this.loading = false;
          const id: string = routeParams.id;
          this.updateTitle(id);

          this.activeGroupId = id;
          this.selectedProducts = StoreGroupComponent.filterByGroupId(result, id);
          this.allProducts = this.selectedProducts;
          this.filterService.initProducts(this.selectedProducts);

          this.CreateObs();
        }, error => {
          this.loading = false;
          this.error = true;
        });
      })
    );

    this.subs.add(
      this.filterService.colorChange$.subscribe(color => {
        this.FilterByColor(color);
      })
    );
  }

  private CreateObs() {
    this.subs.add(
      this.activatedRoute.queryParamMap.subscribe(routeParams => {

        this.UpdateColorFromQuery();
      }, error => {
        this.loading = false;
        this.error = true;
      })

    );
  }


  private UpdateColorFromQuery() {
    const color = this.activatedRoute.snapshot.queryParamMap.get('color');
    this.FilterByColor(color);
    this.filterService.initColor(color);
  }

  private FilterByColor(color: string) {
    if (color) {
      this.selectedProducts = this.allProducts.filter(i => i.properties.color === color || i.properties.secondaryColor === color);
    } else {
      this.selectedProducts = this.allProducts;
    }
  }

  private updateTitle(groupId: string) {
    this.groupDesc.getData().subscribe(descResult => {

      const desc = GroupHelper.findById(descResult, groupId);

      if (desc) {
        this.groupTitle = desc.group.title + (desc.child ? (' ' + desc.child.title) : '');
        this.meta.updateTag({ name: 'title', content: this.groupTitle });
        this.meta.updateTag({ property: 'og:title', content: this.groupTitle });

        // TODO пока отключено - т.к. не ясно что с индексацией
        // this.titleService.setTitle(this.groupTitle);
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.filterService.initVisibility(false);
  }

  aggregatedPrice(product: Product): string {
    const variations = product.variations.filter((i) => i.canBeOrdered && !i.isArchived);
    if (variations.length === 1) {
      return variations[0].price.toString();
    } else {
      let min: number = variations[0].price;
      let max: number = variations[0].price;
      variations.forEach(i => {
        if (i.price > max) { max = i.price; }
        if (i.price < min) { min = i.price; }
      });
      if (min === max) {
        return min.toString();
      } else {
        return min.toString() + '-' + max.toString();
      }

    }
  }

  addToCart(productId: string, variationId: string) {
    this.cartShare.Inc(productId, variationId);
  }

}
