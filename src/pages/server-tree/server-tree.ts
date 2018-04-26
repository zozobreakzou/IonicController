import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { Refresher } from'ionic-angular';

import { Tree, TreeModel, TreeComponent, NodeEvent, Ng2TreeSettings, NodeMenuItemAction, MenuItemSelectedEvent, NodeMenuItem, NodeSelectedEvent, NodeCreatedEvent } from 'ng2-tree';

import { ControllerPage } from "../controller/controller"
import { MwConnectionProvider } from "../../providers/mw-connection/mw-connection";
import { LoginServerInfo } from "../../providers/login-manager/login-manager";
import { Platform } from 'ionic-angular/platform/platform';
import { PageApiProvider } from '../../providers/page-api/page-api';

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
      public platform: Platform,
      public navCtrl: NavController,
      public navParams: NavParams,
      private alertCtrl: AlertController,
      private loadingCtrl: LoadingController,
      private actionSheetCtrl: ActionSheetController,
      private mwConnection: MwConnectionProvider,
      private pageAPI: PageApiProvider) {

    this.loginServer = this.navParams.data.loginServer;

    let loginServerInfo = {
      info: {
        name:        this.loginServer.name,
        ip:          this.loginServer.address,
        no_ssl_port: this.loginServer.port,
        username:    this.loginServer.username,
        password:    this.loginServer.password
      }
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
      value: loginServerInfo.info.name,
      serverInfo: loginServerInfo,
      children: [
      ]
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServerTreePage');
    let loading = this.loadingCtrl.create({cssClass: "loading-spinner"});
    loading.present().then( () => {
      this.pageAPI.setupCancelLoading(loading);
    });

    loading.onDidDismiss((data: any, role: string) => {
      if ( role == "canceled by user" ) {
        this.mwConnection.logout(3001, "canceled by user");
      }
    });

    this.fetchChildTree()
    .then( () => {
      loading.dismiss();
      this.mwConnection.logout(1000, "normal close");
    })
    .catch( () => {
      loading.dismiss();
      this.mwConnection.logout(3011, "server internal error");
    });
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter ServerTreePage');
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
              let server_info = e.node.node.serverInfo.info;
              let target_url: string = "http://" + server_info.ip + ":38080/H5DsgFiles/DesignerWebsite/pageviewer.html"
                                     + "?maxwallip="+server_info.ip + "&maxwallport="+server_info.no_ssl_port + "&user="+server_info.username + "&pwd="+server_info.password
                                     + "&time="+Date.now();

              this.navCtrl.push(ControllerPage, {controller_url: target_url});
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

  private onRefresh(refresher: Refresher) {
    let unRegister = this.platform.registerBackButtonAction(() => {
      this.mwConnection.logout(3001, "canceled by user");
    }, 2);

    this.mwConnection
    .login("ws://"+this.loginServer.address+":"+this.loginServer.port, this.loginServer.username, this.loginServer.password)
    .then((response) => {
      console.log("login success.");
      return this.fetchChildTree();
    })
    .then(() => {
      refresher.complete();
      this.mwConnection.logout(1000, "normal close");

      unRegister();
    })
    .catch(() => {
      refresher.complete();
      this.mwConnection.logout(3011, "server internal error");

      unRegister();
    });
  }

  private fetchChildTree() : Promise<any> {
    return this.mwConnection.getServerTree()
    .then( (response) => {
      this.treeId = 2;
      let children = [];
      if ( response.errorCode == 0 && response.body && response.body.error_code == "CascadeServerError_OK" && response.body.cascade_server_tree ) {
        children = this.fillTreeModelChild(response.body.cascade_server_tree.child_array);
      }

      let rootController = this.treeServer.getControllerByNodeId(1);
      rootController.setChildren([]);
      for( let child of children ) {
        rootController.addChild(child);
      }
    })
    .catch( (v) => {
      this.alertCtrl.create({
        title: 'Error',
        subTitle: "get server tree error.",
        buttons: ['Ok']
      });
    });
  }

  private fillTreeModelChild(child_array) : TreeModel[] {
    let children : TreeModel[] = [];
    if ( !Array.isArray(child_array) || child_array.length == 0 ) {
      return children;
    }

    for ( let serverInfo of child_array ) {
      let childTreeModel : TreeModel = {
        id: this.treeId++,
        value: serverInfo.info.name,
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
