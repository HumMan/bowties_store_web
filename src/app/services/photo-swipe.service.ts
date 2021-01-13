import { Injectable } from '@angular/core';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';

export class PhotoSwipeImage {
  public Src: string;
  public Width: number;
  public Height: number;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoSwipeService {

  private gallery: PhotoSwipe;

  constructor() { }
  public OpenGallery(images: PhotoSwipeImage[], index: number) {
    const pswpElement = document.querySelectorAll('.pswp')[0];

    // build items array
    const items = [];

    images.forEach(element => {
      items.push({
        src: element.Src,
        w: element.Width,
        h: element.Height
      });
    });

    // define options (if needed)
    const options = {
      // history & focus options are disabled on CodePen
      history: false,
      focus: false,

      showAnimationDuration: 200,
      hideAnimationDuration: 200,

      index: index,
      loop: false

    };

    this.gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    this.gallery.init();
  }

  public close() {
    if (this.gallery != null) {
      this.gallery.close();
      this.gallery = null;
    }
  }
}
