import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { CartService } from './api/cart.service';
import { GroupService } from './api/group.service';
import { ImageService } from './api/image.service';
import { LoginService } from './api/login.service';
import { OrderService } from './api/order.service';
import { ProductService } from './api/product.service';
import { UserService } from './api/user.service';

@NgModule({
  imports:      [ CommonModule, HttpClientModule ],
  declarations: [],
  exports:      [],
  providers: [
    CartService,
    GroupService,
    ImageService,
    LoginService,
    OrderService,
    ProductService,
    UserService ]
})
export class ApiModule {

    constructor( @Optional() @SkipSelf() parentModule: ApiModule) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import your base AppModule only.');
        }
    }
}
