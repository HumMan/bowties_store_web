import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { ImageService, ImageDesc } from '../client';

@Injectable({
    providedIn: 'root'
})
export class UploadImageService {

    constructor(private imagesService: ImageService) { }
    public Upload(files): Observable<ImageDesc[]> {

        const items = new Array<any>();

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();

            formData.append(file.name, file);

            items.push(this.imagesService.apiImageThumbPost(formData));
        }

        return forkJoin<ImageDesc>(items);
    }
}
