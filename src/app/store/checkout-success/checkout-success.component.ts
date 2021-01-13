import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../../client/api/order.service';
import { CartService } from '../../client/api/cart.service';
import { Cart, Order, ProductService, OrderStatus } from '../../client';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.css']
})
export class StoreCheckoutSuccessComponent implements OnInit, OnDestroy {

  order: Order;
  orderNotFound = false;
  error = '';
  loading = true;

  private subs: Subscription = new Subscription();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private products: ProductService,
    private cartService: CartService,
    private orders: OrderService) { }

  ngOnInit() {
    this.subs.add(
      this.route.params.subscribe(routeParams => {
        this.orders.find(routeParams.id).subscribe(result => {
          this.loading = false;
          this.GetItemProducts(result);

          if (result.status === OrderStatus.WaitingPayment) {
            setTimeout(() => {
              this.orders.find(routeParams.id).subscribe(maybeUpdatedOrder => {
                if (maybeUpdatedOrder.status !== result.status) {
                  this.GetItemProducts(maybeUpdatedOrder);
                }
              });
            }, 4000);
          }
        }, error => {
          this.loading = false;
          if (error.status === 404) {
            this.orderNotFound = true;
          } else {
            this.error = error.message;
          }
        });
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private GetItemProducts(order: Order) {
    const ids = order.items.map((i) => i.productId);
    this.products.getMultiple(ids).subscribe((list) => {
      order.items.forEach(item => {
        item.product = list.products.find((i) => i.id === item.productId);
      });
      this.order = order;
    });
  }

}
