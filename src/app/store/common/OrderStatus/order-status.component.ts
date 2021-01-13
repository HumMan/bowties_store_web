import { Component, OnInit, OnDestroy, Input, ElementRef, ViewChild } from '@angular/core';
import { Order } from '../../../client';
import { Utils } from '../../../utils/order';


@Component({
  selector: 'app-store-common-order-status',
  templateUrl: './order-status.component.html'
})
export class StoreCommonOrderStatusComponent implements OnInit {

  @Input('order') order: Order;

  @ViewChild('yandexPaymentForm')
  yandexPaymentForm: ElementRef;

  ngOnInit() {

  }

  paymentRedirect() {
    this.yandexPaymentForm.nativeElement.submit();
  }

  toDateTimeReadable(date: number): string {
    return Utils.toTimeReadable(date);
  }

}
