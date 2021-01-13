import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Order } from '../../../client';
import { Utils } from '../../../utils/order';

@Component({
  selector: 'app-store-common-order-info',
  templateUrl: './order-info.component.html'
})
export class StoreCommonOrderInfoComponent implements OnInit {
  @Input('order') order: Order;

  ngOnInit() {

  }

  toPaymentTypeReadable(type: number): string {
    return Utils.toPaymentTypeReadable(type);
  }

  toDeliveryTypeReadable(type: number): string {
    return Utils.toDeliveryTypeReadable(type);
  }

  toOrderStatusReadable(status: number): string {
    return Utils.toOrderStatusReadable(status);
  }

  empty(value: string): boolean {
    return value == null || value === '';
  }

}
