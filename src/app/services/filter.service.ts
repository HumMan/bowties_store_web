import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from '../client';

@Injectable({ providedIn: 'root' })
export class FilterService {

    // фильтр задаёт выбранный цвет
    private colorChangeSource = new Subject<string>();
    public colorChange$ = this.colorChangeSource.asObservable();

    // список продуктов меняют те кто отображает товары
    private initProductsSource = new Subject<Product[]>();
    public initProducts$ = this.initProductsSource.asObservable();

    private initColorSource = new Subject<string>();
    public initColor$ = this.initColorSource.asObservable();

    private initVisibilitySource = new Subject<boolean>();
    public initVisibility$ = this.initVisibilitySource.asObservable();

    constructor() { }

    public setColor(color: string) {
        this.colorChangeSource.next(color);
    }

    public initProducts(products: Product[]): void {
        this.initProductsSource.next(products);
    }

    public initColor(color: string) {
        this.initColorSource.next(color);
    }
    public initVisibility(visible: boolean) {
        this.initVisibilitySource.next(visible);
    }
}
