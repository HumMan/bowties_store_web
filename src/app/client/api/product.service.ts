import { Inject, Injectable, Optional } from '@angular/core';
import {
    HttpClient, HttpHeaders, HttpParams,
    HttpResponse, HttpEvent
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { ProductsResult } from '../model/productsResult';
import { Product } from '../model/product';
import { UpdateOrderRequest } from '../model/models';

@Injectable()
export class ProductService {



    constructor(protected httpClient: HttpClient) {
    }

    public get(productId: string): Observable<Product> {
        return this.httpClient.get<Product>('/api/Product',
            {
                observe: 'body',
                reportProgress: false,
                params: new HttpParams().set('id', productId)
            }
        );
    }

    public getMultiple(productIds: string[]): Observable<ProductsResult> {
        return this.httpClient.post<ProductsResult>('/api/Product/multiple',
            { ids: productIds },
            {
                observe: 'body',
                reportProgress: false
            }
        );
    }

    public getAll(groupId: string = null): Observable<ProductsResult> {
        let params = null;
        if (groupId) {
            params = new HttpParams().set('groupId', groupId);
        }
        return this.httpClient.get<ProductsResult>('/api/Product/all',
            {
                observe: 'body',
                reportProgress: false,
                params
            }
        );
    }

    public getAllColors(): Observable<string[]> {
        return this.httpClient.get<string[]>('/api/Product/allcolors',
            {
                observe: 'body',
                reportProgress: false
            }
        );
    }

    public getAvailable(groupId: string = null): Observable<ProductsResult> {
        let params = null;
        if (groupId) {
            params = new HttpParams().set('groupId', groupId);
        }
        return this.httpClient.get<ProductsResult>('/api/Product/available',
            {
                observe: 'body',
                reportProgress: false,
                params
            }
        );
    }

    public delete(productId?: string): Observable<any> {
        return this.httpClient.post<any>('/api/Product/delete',
            {
                ProductId: productId
            },
            {
                observe: 'body',
                reportProgress: false
            }
        );
    }

    public getDefault(groupId: string): Observable<Product> {

        return this.httpClient.get<Product>('/api/product/default',
            {
                observe: 'body',
                reportProgress: false,
                params: new HttpParams().set('groupId', groupId)
            }
        );
    }

    public create(product?: Product): Observable<any> {

        return this.httpClient.post<any>('/api/Product',
            product,
            {
                observe: 'body',
                reportProgress: false
            }
        );
    }

    public update(product?: Product): Observable<any> {

        return this.httpClient.post<any>('/api/Product/update',
            product,
            {
                observe: 'body',
                reportProgress: false
            }
        );
    }

    public updateOrder(products: any): Observable<any> {

        const params = new UpdateOrderRequest();
        params.orders = products;
        return this.httpClient.post<any>('/api/product/updateorder',
            params,
            {
                observe: 'body',
                reportProgress: false
            }
        );
    }

}
