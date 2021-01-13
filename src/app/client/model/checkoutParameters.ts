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
import { ProfileAddress } from './profileAddress';


export class CheckoutParameters {
    deliveryType?: DeliveryType;
    otherInfo?: string;
    paymentType?: PaymentType;
    email?: string;
    name?: string;
    //vkAccount?: string;
    phone?: string;
    deliveryAddress?: ProfileAddress = new ProfileAddress();
}
export enum DeliveryType {
    Mail,
    SelfPickup
}

export enum PaymentType {
    YandexWallet,
    YandexCard,
    Cash
}
