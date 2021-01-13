import { Injectable } from '@angular/core';
import { Product, ProductService, GroupDesc, Cart, CartService, AddRemoveProductResult } from '../client';
import { Observable, of, Subject } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { GroupService } from '../client/api/group.service';

@Injectable({ providedIn: 'root' })
export class AllProductsShare {

    private data: Product[];
    private observable: Observable<Product[]>;

    private refreshTimer: any;

    readonly refreshTimeoutSec: number = 3600;

    constructor(private products: ProductService) { }

    isCached(): boolean {
        return this.data != null;
    }

    getCachedData(): Product[] {
        return this.data;
    }

    getData(): Observable<Product[]> {
        if (this.data) {
            return of(this.data);
        } else if (this.observable) {
            return this.observable;
        } else {

            this.observable = this.products.getAvailable()
                .pipe(
                    map(response => {
                        this.observable = null;
                        this.data = response.products;

                        if (this.refreshTimer != null) {
                            clearTimeout(this.refreshTimer);
                        }
                        this.refreshTimer = setTimeout(() => {
                            this.data = null;
                            this.observable = null;
                        }, this.refreshTimeoutSec * 1000);

                        return this.data;
                    }),
                    share()
                );
            return this.observable;
        }
    }
}

@Injectable({ providedIn: 'root' })
export class AllGroupsDescShare {

    private data: GroupDesc[];
    private observable: Observable<GroupDesc[]>;

    private refreshTimer: any;

    readonly refreshTimeoutSec: number = 3600;

    private groupsChangeSource = new Subject<GroupDesc[]>();
    public groupsChange$ = this.groupsChangeSource.asObservable();

    constructor(private groups: GroupService) { }

    getData(): Observable<GroupDesc[]> {
        if (this.data) {
            return of(this.data);
        } else if (this.observable) {
            return this.observable;
        } else {

            this.observable = this.groups.getAllDesc()
                .pipe(
                    map(response => {
                        this.observable = null;
                        this.data = response;

                        this.groupsChangeSource.next(this.data);

                        if (this.refreshTimer != null) {
                            clearTimeout(this.refreshTimer);
                        }
                        this.refreshTimer = setTimeout(() => {
                            this.data = null;
                            this.observable = null;
                        }, this.refreshTimeoutSec * 1000);

                        return this.data;
                    }),
                    share()
                );
            return this.observable;
        }
    }
}

@Injectable({ providedIn: 'root' })
export class CurrentCartShare {

    private data: Cart;
    private observable: Observable<Cart>;

    private lastUpdate: number;

    public cartCountChange$ = new Subject<number>();

    constructor(private cart: CartService) { }

    getDataWithRefresh(): Observable<Cart> {
        if (!this.lastUpdate || (new Date().valueOf()) - this.lastUpdate > 1000) {
            this.data = null;
            this.observable = null;
        }
        return this.getData();
    }
    setData(cart: Cart) {
        this.data = cart;
        this.cartCountChange$.next(cart.items.length);
    }

    Inc(productId: string, variationId: string) {
        this.cart.Inc(productId, variationId).subscribe(result => {
            this.cartCountChange$.next(result.itemsCount);
        });
    }

    getData(): Observable<Cart> {
        if (this.data) {
            return of(this.data);
        } else if (this.observable) {
            return this.observable;
        } else {

            this.observable = this.cart.Current()
                .pipe(
                    map(response => {
                        this.observable = null;
                        this.data = response;
                        this.cartCountChange$.next(response.items.length);
                        return this.data;
                    }),
                    share()
                );
            this.lastUpdate = new Date().valueOf();
            return this.observable;
        }
    }
}
