/**
 * my api
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { CheckoutParameters } from './checkoutParameters';
import { OrderItem } from './orderItem';


export class Order {
    id?: string;
    orderId?: string;
    total?: number;
    deliveryPrice?: number;
    userId?: string;
    status?: OrderStatus;
    created?: number;
    reservedUntil?: number;
    items?: Array<OrderItem>;
    parameters?: CheckoutParameters;
}
export enum OrderStatus {
    /// <summary>
    /// Заказ создаётся, зависшие заказы очищаются, товар возвращается в Available
    /// </summary>
    Creating,
    /// <summary>
    /// Заказ ждёт оплаты или подтверждения, товар зарезервирован
    /// Через 1 час будет отменён
    /// </summary>
    WaitingPayment,
    /// <summary>
    /// Заказ ждёт подтверждения, товар зарезервирован
    /// Через 24 часа будет отменён
    /// </summary>
    WaitingApprove,
    /// <summary>
    /// Удалён не оплаченный или не подтвержденный заказ, товар возвращается в Available
    /// </summary>
    Deleted,
    /// <summary>
    /// Для почтового отправления - готовится к отправке
    /// </summary>
    Packing,
    /// <summary>
    /// Отправлен или ждёт самовывоза
    /// </summary>
    Shipping,
    /// <summary>
    /// Заказ доставлен, все зарезервированные товары очищаются чтобы не лежать мертвым грузом
    /// </summary>
    Shipped
}
