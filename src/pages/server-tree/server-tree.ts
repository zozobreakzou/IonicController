import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';

import { Tree, TreeModel, TreeComponent, NodeEvent, Ng2TreeSettings, NodeMenuItemAction, MenuItemSelectedEvent, NodeMenuItem, NodeSelectedEvent, NodeCreatedEvent } from 'ng2-tree';

import { ControllerPage } from "../controller/controller"
import { MwConnectionProvider } from "../../providers/mw-connection/mw-connection";
import { LoginServerInfo } from "../../providers/login-manager/login-manager";

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

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private alertCtrl: AlertController,
      private loadingCtrl: LoadingController,
      private actionSheetCtrl: ActionSheetController,
      private mwConnection: MwConnectionProvider) {

    this.loginServer = this.navParams.data.loginServer;

    let loginServerInfo = {
      name: this.loginServer.name,
      ip:   this.loginServer.address,
      port: this.loginServer.port,
      username: this.loginServer.username,
      password: this.loginServer.password
    };

    this.serverTreeModel = {
      settings: {
        leftMenu: false,
        rightMenu: false,
        menuItems: [
        ],
        cssClasses: {
          empty: 'node-leaf disabled'
        },
      },
      id: 1,
      value: loginServerInfo.name,
      serverInfo: loginServerInfo,
      children: [
      ]
    };

    this.fetchChildTree();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServerTreePage');
  }

  onItemSelected(e: NodeSelectedEvent) {
    let actionSheet = this.actionSheetCtrl.create({
      cssClass: "action-sheet-group-overflow-auto",
      buttons: [
        {
          text: 'goto',
          role: 'destructive',
          handler: () => {
            let navTransition = actionSheet.dismiss();
            navTransition.then(() => {
              this.navCtrl.push(ControllerPage, {controller_url: "http://10.3.70.6:8089/html/output/index.html"});
            });
            return false;
          }
        },
        {
          text: 'cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            return true;
          }
        }
      ]
    });
 
    actionSheet.present();
  }

  onMenuItemSelected(e: MenuItemSelectedEvent) {

  }

  private fetchChildTree() {
    let loading = this.loadingCtrl.create();
    loading.present();

    this.mwConnection.getServerTree()
    .then( (response) => {
      loading.dismiss();

      this.treeId = 2;
      let children = this.fillTreeModelChild(response.body.cascade_server_tree.child_array);
      let rootController = this.treeServer.getControllerByNodeId(1);
      rootController.setChildren([]);
      for( let child of children ) {
        rootController.addChild(child);
      }
    })
    .catch( (v) => {
      loading.dismiss();

      this.alertCtrl.create({
        title: 'Error',
        subTitle: "get server tree error.",
        buttons: ['Ok']
      });
    });
  }

  private fillTreeModelChild(child_array) : TreeModel[] {
    if ( !Array.isArray(child_array) || child_array.length == 0 ) {
      return;
    }

    let children : TreeModel[] = [];
    for ( let serverInfo of child_array ) {
      let childTreeModel : TreeModel = {
        id: this.treeId++,
        value: serverInfo.name,
        serverInfo: serverInfo,
      };
      children.push(childTreeModel);

      let subChildren = this.fillTreeModelChild(serverInfo.child_array);
      if( subChildren ) {
        childTreeModel.children = subChildren;
      }
    }

    return children;
  }


  private loginServer: LoginServerInfo;
  private serverTreeModel: TreeModel;
  private treeId: number;

  @ViewChild('treeServer') treeServer : TreeComponent;
}
