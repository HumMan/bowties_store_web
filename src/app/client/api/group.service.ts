import { Inject, Injectable, Optional } from '@angular/core';
import {
    HttpClient, HttpHeaders, HttpParams,
    HttpResponse, HttpEvent
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Group } from '../model/group';
import { GroupDesc } from '../model/groupDesc';
import { DeleteGroupRequest } from '../model/deleteGroupRequest';
import { UpdateOrderRequest } from '../model/updateOrderRequest';

@Injectable()
export class GroupService {


    constructor(protected httpClient: HttpClient) {
    }


    public CreateGroup(group: Group): Observable<any> {
        return this.httpClient.post<any>('/api/group',
            group,
            {
                observe: 'body',
                reportProgress: false
            }
        );
    }
    public getAll(): Observable<Group[]> {

        return this.httpClient.get<Group[]>('/api/group/all',
            {
                observe: 'body',
                reportProgress: false
            }
        );
    }

    public getAllDesc(): Observable<GroupDesc[]> {

        return this.httpClient.get<GroupDesc[]>('/api/group/allDesc',
            {
                observe: 'body',
                reportProgress: false
            }
        );
    }

    public update(group?: Group): Observable<any> {

        return this.httpClient.post<any>('/api/group/update',
            group,
            {
                observe: 'body',
                reportProgress: false
            }
        );
    }

    public delete(groupId?: string): Observable<any> {
        let param = new DeleteGroupRequest();
        param.groupId = groupId;
        return this.httpClient.post<any>('/api/group/delete',
            param,
            {
                observe: 'body',
                reportProgress: false
            }
        );
    }

    public updateOrder(groups: any): Observable<any> {
        let params = new UpdateOrderRequest();
        params.orders = groups;
        return this.httpClient.post<any>('/api/group/updateorder',
            params,
            {
                observe: 'body',
                reportProgress: false
            }
        );
    }

}
