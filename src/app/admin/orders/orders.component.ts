import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../client/api/order.service';
import { Order, OrderStatus } from '../../client';
import { Utils, OrderStatusStates } from '../../utils/order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class AdminOrdersComponent implements OnInit {

  allOrders: Order[];
  constructor(private orderService: OrderService) {
  }

  ngOnInit() {
    this.orderService.getAll().subscribe((result) => {
      this.allOrders = result;
    });
  }

  getOrderTransitions(order: Order) {
    return OrderStatusStates.getTransitions(order.status, order.parameters.deliveryType, order.parameters.paymentType);
  }

  toStatusRedable(status: number) {
    return Utils.toOrderStatusReadable(status);
  }

  toTimeReadable(value: number) {
    return Utils.toTimeReadable(value);
  }

  changeState(i: number, orderId: string, fromStatus: OrderStatus, toStatus: OrderStatus) {
    this.orderService.changeStatus(orderId, fromStatus, toStatus).subscribe(result => {
      this.orderService.find(orderId).subscribe(updatedOrder => {
        this.allOrders[i] = updatedOrder;
      });
    });
  }
}
