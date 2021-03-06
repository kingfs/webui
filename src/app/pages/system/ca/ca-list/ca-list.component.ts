import { ApplicationRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

import { DynamicFormControlModel, DynamicFormService, DynamicCheckboxModel, DynamicInputModel, DynamicSelectModel, DynamicRadioGroupModel } from '@ng2-dynamic-forms/core';
import { GlobalState } from '../../../../global.state';
import { RestService, WebSocketService } from '../../../../services/';
import { EntityConfigComponent } from '../../../common/entity/entity-config/';

@Component({
    selector: 'ca-list',
    template: `
    <entity-list [conf]="this"></entity-list>`
})

export class CertificateAuthorityListComponent {
  protected resource_name: string = 'system/certificateauthority';

  private busy: Subscription;
  private sub: Subscription;

  constructor(protected router: Router, protected aroute: ActivatedRoute, protected rest: RestService, protected ws: WebSocketService, protected formService: DynamicFormService, protected _injector: Injector, protected _appRef: ApplicationRef, protected _state: GlobalState) {

  }

  public columns:Array<any> = [
    {title: 'Name', name: 'cert_name'},
    {title: 'Internal', name: 'cert_internal'},
    {title: 'Issuer', name: 'cert_issuer'},
    {title: 'Lifetime', name: 'cert_lifetime'},
    {title: 'Common Name', name: 'cert_common'},
    {title: 'From', name: 'cert_from'},
    {title: 'Until', name: 'cert_from'},
  ];

  public config: any = {
      paging: true,
      sorting: {columns: this.columns},
  }

  getAddActions() {
    let actions = [];
    actions.push({
          label: "Import CA",
          onClick: () => {
              this.router.navigate(new Array('/pages').concat(["system", "ca", "import"]));
          }
        },
        {
          label: "Create Internal CA",
          onClick: () => {
              this.router.navigate(new Array('/pages').concat(["system", "ca", "internal"]));
          }
        },
        {
          label: "Create Intermediate CA",
          onClick: () => {
              this.router.navigate(new Array('/pages').concat(["system", "ca", "intermediate"]));
          }
        }
     );

    return actions;
  }

  getActions(row) {
    let actions = [];
    actions.push({
      label: "Delete",
      onClick: (row) => {
        this.router.navigate(new Array('/pages').concat(["system","ca", "delete", row.id]));  
      }
    });
    return actions;
  }
     
}