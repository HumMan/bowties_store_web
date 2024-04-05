import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product, ProductService, VariationParameter, ProductVariation, VariationId } from '../../client';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PhotoSwipeService, PhotoSwipeImage } from '../../services/photo-swipe.service';
import { CurrentCartShare, AllProductsShare, AllGroupsDescShare } from '../../services/data.service';
import { ProductHelper } from '../../utils/product';
import { Subscriber, Subscription } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.css']
})
export class StoreProductInfoComponent extends ProductHelper implements OnInit, OnDestroy {

  private subs: Subscription = new Subscription();

  currentVariationIds: Array<string>;

  currentProduct: Product;

  selectedImgId: string;
  selectedImgIndex: number;

  selectedVariation: ProductVariation;

  productNotFound = false;
  error = '';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private meta: Meta,
    private products: ProductService,
    private cartShare: CurrentCartShare,
    private titleService: Title,
    public viewer: PhotoSwipeService) {
    super();
  }

  ngOnInit() {
    // TODO зачем загружать продукт, если у нас уже загружен массив всех продуктов - исправить
    this.subs.add(
      this.route.paramMap.pipe(
        switchMap((params: ParamMap) => {
          const id = params.get('id');
          // TODO при открытии главной, загружать одним запросом, продукты, группы и groupDesc. Тут нужны группы для продукта
          // и вопрос что делать с кол-вом в наличии - может и не надо здесь кэшировать
          // if (this.productsShare.isCached())
          // {
          //   var product = this.productsShare.getCachedData().find(i => i.id === id);
          //   if(product.group==null){
          //     this.groupsShare.getData().
          //   }
          //   return of(product);
          // }
          // else
          return this.products.get(id);
        })

      ).subscribe((product: Product) => {
        this.loading = false;
        this.currentProduct = product;

        this.meta.updateTag({ name: 'title', content: product.title });
        this.meta.updateTag({ property: 'og:title', content: product.title });
        this.meta.updateTag({ property: 'og:image', content: 'https://cdn.jameskot.ru/thumbs/200/{{product.images[0]}}.jpg' });
        this.meta.updateTag({ property: 'og:image:width', content: '200' });
        this.meta.updateTag({ property: 'og:image:height', content: '200' });

        // TODO пока отключено - т.к. не ясно что с индексацией
        // this.titleService.setTitle(product.title);
        this.removenusedGroups(product);
        this.currentVariationIds = new Array<string>();
        if (this.currentProduct.variations.length > 0) {
          this.currentProduct.variations[0].variationIds.forEach((v) => {
            this.currentVariationIds.push(v.parameterValueId);
          });
          this.updateSelectedVariation();
        }
        this.selectImage(0);
      }, error => {
        this.loading = false;
        if (error.status === 404) {
          this.productNotFound = true;
        } else {
          this.error = error.message;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.viewer.close();
    this.subs.unsubscribe();
  }

  addToCart(productId: string, variationId: string) {
    this.cartShare.Inc(productId, variationId);
  }

  variationParamSelChange(i: number, param: VariationParameter, value: string) {
    this.updateSelectedVariation();
  }

  isEqualIds(left: string[], right: VariationId[]) {
    if (left.length !== right.length) {
      return false;
    } else {
      for (let i = 0; i < left.length; i++) {
        if (left[i] !== right[i].parameterValueId) {
          return false;
        }
      }
    }
    return true;
  }

  updateSelectedVariation() {
    this.selectedVariation = this.currentProduct.variations.find((i) => this.isEqualIds(this.currentVariationIds, i.variationIds));
  }

  removenusedGroups(product: Product) {
    product.group.variationParameters.forEach(parameter => {
      parameter.values = parameter.values.filter((value) =>
        product.variations.filter((i) =>
          i.variationIds.filter((k) => k.parameterValueId === value.id).length > 0).length > 0
      );
    });
    product.group.variationParameters = product.group.variationParameters.filter((i) => i.values.length > 0);
  }

  selectImage(i: number) {
    this.selectedImgIndex = i;
    this.selectedImgId = this.currentProduct.images[i].thumbIds[400];
  }

  openGallery() {
    const images = this.currentProduct.images.map(i => {
      const image = new PhotoSwipeImage;
      image.Src = 'api/image?id=' + i.thumbIds[800];
      image.Height = 800;
      image.Width = 800;
      return image;
    });
    this.viewer.OpenGallery(images, this.selectedImgIndex);
  }

}
