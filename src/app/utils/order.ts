import { OrderStatus, DeliveryType, PaymentType } from '../client';

export class Utils {
  static toTimeReadable(timestamp: number): string {
    const result = new Date(timestamp / 10000 - 11644473600000);
    return result.toLocaleString('ru-RU');
  }

  static toOrderStatusReadable(status: number): string {
    const names = new Map<number, string>([
      [0, 'Резервируется'],
      [1, 'Ожидает оплаты'],
      [2, 'Ожидает подтверждения'],
      [3, 'Отменён'],
      [4, 'Готовится к отправке'],
      [5, 'Отправлен/ждёт самовывоза'],
      [6, 'Доставлен'],
    ]);
    return names.get(status);
  }

  static toDeliveryTypeReadable(type: number): string {
    const names = new Map<number, string>([
      [0, 'Почта России'],
      [1, 'Самовывоз (г. Дубна/г. Кимры)'],
    ]);
    return names.get(type);
  }

  static toPaymentTypeReadable(type: number): string {
    const names = new Map<number, string>([
      [0, 'Через Яндекс.Кошелёк'],
      [1, 'Банковской картой'],
      [2, 'Наличными при получении'],
    ]);
    return names.get(type);
  }
}

export class OrderTransition {
  constructor(public title: string, public toStatus: OrderStatus) { }
}

export class OrderStatusStates {
  static getTransitions(state: OrderStatus, deliveryType: DeliveryType, paymentType: PaymentType) {
    const result = new Array<OrderTransition>();
    switch (state) {
      case OrderStatus.Creating:
        break;
      case OrderStatus.WaitingPayment:
        result.push(new OrderTransition('Отменить', OrderStatus.Deleted));
        if (deliveryType === DeliveryType.Mail) {
          result.push(new OrderTransition('Оплачен', OrderStatus.Packing));
        } else {
          result.push(new OrderTransition('Оплачен', OrderStatus.Shipping));
        }
        break;
      case OrderStatus.WaitingApprove:
        result.push(new OrderTransition('Отменить', OrderStatus.Deleted));
        result.push(new OrderTransition('Подтвердить', OrderStatus.Shipping));
        break;
      case OrderStatus.Deleted:
        break;
      case OrderStatus.Packing:
        result.push(new OrderTransition('Отменить', OrderStatus.Deleted));
        result.push(new OrderTransition('Доставляется', OrderStatus.Shipping));
        break;
      case OrderStatus.Shipping:
        result.push(new OrderTransition('Отменить', OrderStatus.Deleted));
        result.push(new OrderTransition('Доставлено', OrderStatus.Shipped));
        break;
      case OrderStatus.Shipped:
        break;
      default:
        break;
    }
    return result;
  }
}
