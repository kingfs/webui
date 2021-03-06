import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable, Subject, Subscription } from 'rxjs/Rx';
import { EntityUtils } from '../pages/common/entity/utils'
import { RestService, WebSocketService } from '../services/';


@Injectable()
export class VmService {
    protected volume_resource_name: string = 'storage/volume'

    constructor(protected rest: RestService){
    };

    getStorageVolumes() {
        return this.rest.get(this.volume_resource_name , {});
    }
}
