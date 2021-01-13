import { Product } from '../client';

export class ProductHelper {
  withoutVariations(product: Product): boolean {
    return product.variations.length === 1 &&
      (product.variations[0].variationIds === null ||
        product.variations[0].variationIds.length === 0);
  }

  oneVariation(product: Product): boolean {
    return product.variations.filter((i) => i.canBeOrdered && !i.isArchived).length === 1;
  }

  primaryColorUsed(product: Product): boolean {
    return product.properties.color != null;
  }
  secondaryColorUsed(product: Product): boolean {
    return product.properties.secondaryColor != null;
  }
}
