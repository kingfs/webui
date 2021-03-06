import { ApplicationRef, Component, Injector, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

import { DynamicFormControlModel, DynamicFormService, DynamicCheckboxModel, DynamicInputModel, DynamicSelectModel, DynamicRadioGroupModel, DynamicFormGroupModel, DynamicFormArrayModel, DynamicFormArrayGroupModel } from '@ng2-dynamic-forms/core';
import { GlobalState } from '../../../../../global.state';
import { RestService, WebSocketService, IscsiService } from '../../../../../services/';

import { EntityAddComponent } from '../../../../common/entity/entity-add/';

@Component({
	selector: 'app-iscsi-portal-add',
	template: `<entity-add [conf]="this"></entity-add>`,
  providers: [IscsiService],
})
export class PortalAddComponent {

	protected resource_name: string = 'services/iscsi/portal';
  protected route_success: string[] = ['sharing', 'iscsi'];
  protected portal_ip_count: number = 1;
  public entityAdd: EntityAddComponent;
  protected arrayControl: FormArray;
  protected arrayModel: DynamicFormArrayModel;
  private ip: DynamicSelectModel<string>;
  protected ipChoice: any;

  protected formModel: DynamicFormControlModel[] = [
    new DynamicInputModel({
      id: 'iscsi_target_portal_comment',
      label: 'Comment',
      validators: {
        required: null,
      },
    }),
    new DynamicSelectModel({
      id: 'iscsi_target_portal_discoveryauthmethod',
      label: 'Discovery Auth Method',
      options: [
        {
          label: 'NONE',
          value: 'None',
        },
        {
          label: 'CHAP',
          value: 'Chap',
        },
        {
          label: 'Mutual CHAP',
          value: 'mutual_chap',
        }
      ]
    }),
    new DynamicSelectModel({
      id: 'iscsi_target_portal_discoveryauthgroup',
      label: 'Discovery Auth Group',
      options: [
        {
          label: 'NONE',
          value: '',
        }
      ]
    }),
    new DynamicFormArrayModel({
      id: "iscsi_target_portal_ips",
      initialCount: 1,
      createGroup: () => {
        return [
          new DynamicSelectModel({
              id: "ip",
              label: "IP Address",
              value: '0.0.0.0',
          }),
          new DynamicInputModel({
              id: "port",
              label: "Port",
              value: '2306',
          })
        ];
      }
    })
  ];

  protected custActions: Array<any> = [
    {
      id: 'add_extra_portal_ip',
      name: 'Add Extra Portal IP',
      function: () => {
        this.portal_ip_count += 1;
        this.formService.insertFormArrayGroup(this.portal_ip_count, this.arrayControl ,this.arrayModel)
        this.setIpFormArray(this.arrayModel.groups[this.portal_ip_count-1]);
      }
    },
    {
      id: 'remove_extra_portal_ip',
      name: 'Remove Extra Portal IP',
      function: () => {
        this.portal_ip_count -= 1;
        this.formService.removeFormArrayGroup(this.portal_ip_count, this.arrayControl ,this.arrayModel)
      }
    },
  ];

  constructor(protected router: Router, protected rest: RestService, protected ws: WebSocketService, protected formService: DynamicFormService, protected _injector: Injector, protected _appRef: ApplicationRef, protected _state: GlobalState, protected iscsiService: IscsiService) {

  }

  isCustActionVisible(actionId: string) {
    if (actionId == 'remove_extra_portal_ip' && this.portal_ip_count <= 1) {
      return false;
    }
    return true;
  }

  setIpFormArray(groupModel: DynamicFormArrayGroupModel) {
    this.ip = <DynamicSelectModel<string>>groupModel.group[0];
    this.ip.add({ label: '0.0.0.0', value: '0.0.0.0' });
    this.ipChoice.forEach((item) => {
      this.ip.add({ label: item[1], value: item[0] });
    });
  }

  afterInit(entityAdd: EntityAddComponent) {
    this.arrayControl = <FormArray> entityAdd.formGroup.get("iscsi_target_portal_ips");
    this.arrayModel = <DynamicFormArrayModel> this.formService.findById("iscsi_target_portal_ips", this.formModel);
    this.iscsiService.getIpChoices().subscribe((res) => {
      this.ipChoice = res;
      for(let i in this.arrayModel.groups) {
        this.setIpFormArray(this.arrayModel.groups[i]);
      }
    });
  }
}
