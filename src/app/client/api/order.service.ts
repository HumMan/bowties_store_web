import { Inject, Injectable, Optional } from '@angular/core';
import {
    HttpClient, HttpHeaders, HttpParams,
    HttpResponse, HttpEvent
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { CreateOrderRequest } from '../model/createOrderRequest';
import { CreateOrderResult } from '../model/createOrderResult';
import { Order, OrderStatus } from '../model/order';
import { CheckoutParameters } from '../model/checkoutParameters';
import { ChangeStatusRequest } from '../model/changeStatusRequest';

@Injectable()
export class OrderService {


    constructor(protected httpClient: HttpClient) {
    }


    public CreateOrder(params: CreateOrderRequest): Observable<CreateOrderResult> {
        return this.httpClient.post<CreateOrderResult>('/api/order',
            params,
            {
                observe: 'body',
                reportProgress: false
            }
        );
    }

    public getAll(): Observable<Order[]> {
        return this.httpClient.get<Order[]>('/api/order',
            {
                observe: 'body',
                reportProgress: false,
            }
        );
    }

    public find(orderId: string): Observable<Order> {
        return this.httpClient.get<Order>('/api/order/find',
            {
                params: { orderId: orderId },
                observe: 'body',
                reportProgress: false,
            }
        );
    }

    public allUserOrders(): Observable<Order[]> {
        return this.httpClient.get<Order[]>('/api/order/findall',
            {
                observe: 'body',
                reportProgress: false,
            }
        );
    }

    public checkoutParams(): Observable<CheckoutParameters> {
        return this.httpClient.get<CheckoutParameters>('/api/order/checkoutparams',
            {
                observe: 'body',
                reportProgress: false,
            }
        );
    }

    public changeStatus(id: string, from: OrderStatus, to: OrderStatus): Observable<any> {
        const params = new ChangeStatusRequest();
        params.from = from;
        params.to = to;
        params.orderId = id;
        return this.httpClient.post<any>('/api/order/changestatus',
            params,
            {
                observe: 'body',
                reportProgress: false,
            }
        );
    }

}
