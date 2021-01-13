import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../client/api/order.service';
import { Order } from '../../client';
import { Utils } from '../../utils/order';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class AccountProfileComponent implements OnInit {

  orders: Order[];

  constructor(private ordersService: OrderService) { }

  ngOnInit() {
    this.ordersService.allUserOrders().subscribe(result => {
      this.orders = result.sort((a, b) => a.created > b.created ? -1 : 1);
    });
  }

  asReadable(timestamp: number): string {
    return Utils.toTimeReadable(timestamp);
  }

  toStatusReadable(status: number): string {
    return Utils.toOrderStatusReadable(status);
  }
}
