import { Component, OnInit } from '@angular/core';
import { CartService, Cart } from '../../client';
import { Utils } from '../../utils/order';

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.css']
})
export class AdminCartsComponent implements OnInit {

  allCarts: Cart[];

  constructor(cartService: CartService) {
    cartService.getAll().subscribe((result) => {
      this.allCarts = result;
    });
  }

  getTimestamp(cart: Cart){
    return Utils.toTimeReadable(cart.timestamp);
  }

  ngOnInit() {
  }

}
