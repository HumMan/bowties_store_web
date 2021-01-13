import { OrderStatus, DeliveryType, PaymentType, Product } from '../client';

export class ColorUtils {

    static getAvailableColors(products: Product[]): string[] {

        const availableColorsSet = new Set(
            products.map(i => i.properties.color)
                .filter(i => i));
        products.map(i => i.properties.secondaryColor)
            .filter(i => i)
            .forEach(i =>  availableColorsSet.add(i));

        const availableColors = Array.from(availableColorsSet)
            .sort((l, r) => {
                if (l > r) {
                    return 1;
                } else {
                    return -1;
                }
            });
        return availableColors;
    }
}
