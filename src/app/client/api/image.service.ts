import { Inject, Injectable, Optional } from '@angular/core';
import {
    HttpClient, HttpHeaders, HttpParams,
    HttpResponse, HttpEvent
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ImageDesc } from '../model/models';


@Injectable()
export class ImageService {

    public defaultHeaders = new HttpHeaders();

    constructor(protected httpClient: HttpClient) {
    }

    public apiImageGet(id?: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        return this.httpClient.get<any>('/api/Image',
            {
                params: { id: id },
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    public apiImagePost(observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        return this.httpClient.post<any>('/api/Image',
            null,
            {
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    public apiImageThumbPost(formData: FormData, reportProgress: boolean = false): Observable<ImageDesc> {

        return this.httpClient.post<ImageDesc>('/api/Image/thumb',
            formData,
            {
                observe: 'body',
                reportProgress: reportProgress
            }
        );
    }
}
