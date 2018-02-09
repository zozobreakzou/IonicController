import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Tree, TreeModel, TreeComponent, NodeEvent, Ng2TreeSettings, NodeMenuItemAction, MenuItemSelectedEvent, NodeMenuItem } from 'ng2-tree';

/**
 * Generated class for the ServerTreePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-server-tree',
  templateUrl: 'server-tree.html',
})
export class ServerTreePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServerTreePage');
  }

  public onMenuItemSelected(e: MenuItemSelectedEvent) {

  }

  public serverTreeModel: TreeModel = {
    settings: {
      leftMenu: true,
      rightMenu: false,
      menuItems: [
        { name: 'go',  action: NodeMenuItemAction.Custom, cssClass: 'fa fa-arrow-right' },
      ],
    },
    id: 0,
    value: 'Main Login Server',
    userdata: "zozo",
    children: [
      {
        value: '上海',
        id: 11,
        children: [
          {value: 'server1', id: 12, userdata: "zozo12"},
          {value: 'server2', id: 13},
          {value: 'server3', id: 14},
        ]
      },
      {
        value: '北京',
        id: 21,
        children: [
          {value: 'server1', id: 22},
          {value: 'server2', id: 23},
          {value: 'server3', id: 24},
        ]
      },
    ]
  };

  @ViewChild('treeServer') treeServer;
}
