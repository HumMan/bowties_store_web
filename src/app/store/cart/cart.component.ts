import { Component, OnInit, TrackByFunction, OnDestroy } from '@angular/core';
import { CartService, Cart, ProductService, CartItem } from '../../client';
import { Subject, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CurrentCartShare } from '../../services/data.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class StoreCartComponent implements OnInit, OnDestroy {

  cart: Cart = new Cart();

  loading = true;
  error = false;

  cartChange$ = new Subject<string>();

  private subscriptions = new Subscription();

  constructor(private cartService: CartService,
    private cartShare: CurrentCartShare,
    private productService: ProductService) { }

  ngOnInit() {
    this.refreshCart();
    this.updateObserv();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  cartChanged() {
    const cartJson = JSON.stringify(this.cart);
    this.cartChange$.next(cartJson);
  }

  itemCountChanged(item: CartItem) {
    if (item.count >= 1) {
      this.cartChanged();
    }
  }

  isCountValid(item: CartItem): boolean {
    if (item.withoutCount) {
      return true;
    } else {
      return item.count <= item.available;
    }
  }

  updateObserv() {
    this.subscriptions.add(this.cartChange$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(term => this.cartService.Update(JSON.parse(term)))
      )
      .subscribe((result) => {
        this.GetItemProducts(result);
        this.cartShare.setData(result);
      }, error => {

      }
      ));
  }

  private refreshCart() {
    this.loading = true;
    this.error = false;
    this.cartShare.getDataWithRefresh().subscribe((cart) => {
      this.loading = false;
      this.GetItemProducts(cart);
    }, error => {
      this.loading = false;
      this.error = true;
    }
    );
  }

  private GetItemProducts(cart: Cart) {
    const ids = cart.items.map((i) => i.productId);
    this.productService.getMultiple(ids).subscribe((list) => {
      cart.items.forEach(item => {
        item.product = list.products.find((i) => i.id === item.productId);
      });
      this.cart = cart;
    });
  }

  trackByFn(index, item: CartItem) {
    return item.variationId;
  }

  inc(item: CartItem) {
    item.count++;
    this.cartChanged();
  }
  dec(item: CartItem) {
    item.count--;
    this.cartChanged();
  }
  removeFromCart(item: CartItem, input: any) {
    item.count = 0;
    input.disabled = true;
    this.cartChanged();
  }

  isAvailable(item: CartItem): boolean {
    const variation = item.product.variations.find(i => i.id === item.variationId);
    return variation != null && variation.canBeOrdered && !variation.isArchived && !item.product.isArchived;
  }
}
