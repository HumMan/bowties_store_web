import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Order, ProductService, OrderItem } from 'src/app/client';

@Component({
  selector: 'app-store-common-order-items-info',
  templateUrl: './order-items-info.component.html',
  styleUrls: ['./order-items-info.component.css']
})
export class StoreCommonOrderItemsInfoComponent implements OnInit {

  @Input('order') order: Order;

  constructor() {
  }

  ngOnInit() {
  }

  getItemTitle(item: OrderItem): string {
    const variation = item.product.variations.find(i => i.id === item.variationId);
    if (!variation || variation.variationIds.length === 0 ) {
      return item.product.title;
    } else {
      return item.product.title + ' (' + variation.title + ')';
    }
  }

}
