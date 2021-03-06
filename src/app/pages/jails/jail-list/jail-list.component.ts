import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalState } from '../../../global.state';
import { RestService, WebSocketService } from '../../../services/';
import { Subscription } from 'rxjs';

import { EntityListComponent } from '../../common/entity/entity-list/';

@Component({
  selector: 'app-jail-list',
  template: `
  <entity-list [conf]="this"></entity-list>
  `
})
export class JailListComponent {

  protected resource_name: string = 'jails/jails';
  protected route_add: string[] = ['jails', 'add'];
  protected entityList: EntityListComponent;

  constructor(protected router: Router, protected rest: RestService, protected ws: WebSocketService) {}

  public columns:Array<any> = [
    {title: 'Jail', name: 'jail_host'},
    {title: 'IPv4 Address', name: 'jail_ipv4'},
    {title: 'Autostart', name: 'jail_autostart'},
    {title: 'Status', name: 'jail_status'},
  ];
  public config:any = {
    paging: true,
    sorting: {columns: this.columns},
  };

  afterInit(entityList: EntityListComponent) {
    this.entityList = entityList;
  }

  isActionVisible(actionId: string, row: any) {
    if (actionId == 'start' && row.jail_status == "Running") {
      return false;
    } else if (actionId == 'stop' && row.jail_status == "Stopped") {
      return false;
    } else if (actionId == 'restart' && row.jail_status == "Stopped") {
      return false;
    }
    return true;
  }

  getActions(row) {
    return [
      {
        id: "edit",
        label: "Edit",
        onClick: (row) => {
          this.router.navigate(new Array('/pages').concat(["jails", "edit", row.id]));
        }
      },
      {
        id: "start",
        label: "Start",
        onClick: (row) => {
          this.entityList.busy = this.rest.post(this.resource_name + '/' + row.id + '/start/', {
          }).subscribe((res) => {
            row.jail_status = 'Running';
          }, (res) => {
            console.log(res);
          });
        }
      },
      {
        id: "stop",
        label: "Stop",
        onClick: (row) => {
          this.entityList.busy = this.rest.post(this.resource_name + '/' + row.id + '/stop/', {
          }).subscribe((res) => {
            row.jail_status = 'Stopped';
          }, (res) => {
            console.log(res);
          });
        }
      },
      {
        id: "restart",
        label: "Restart",
        onClick: (row) => {
          this.entityList.busy = this.rest.post(this.resource_name + '/' + row.id + '/restart/', {
          }).subscribe((res) => {
            row.jail_status = 'Running';
          }, (res) => {
            console.log(res);
          });
        }
      },
      {
        id: "shell",
        label: "Shell",
        onClick: (row) => {
        }
      },
      {
        id: "delete",
        label: "Delete",
        onClick: (row) => {
          this.router.navigate(new Array('/pages').concat(["jails", "delete", row.id]));
        }
      }
    ]
  }
}
