import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LoginManagerProvider, LoginServerInfo } from '../../providers/login-manager/login-manager';
import { EditLoginServerPage } from '../edit-login-server/edit-login-server';
import { ItemSliding } from 'ionic-angular/components/item/item-sliding';

/**
 * Generated class for the LoginManagerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login-manager',
  templateUrl: 'login-manager.html',
})
export class LoginManagerPage {

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public loginManager: LoginManagerProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginManagerPage');
  }

  getLoginServerList() {
    let loginServerList = [];
    for ( let k in this.loginManager.loginServerList) {
      loginServerList.push(this.loginManager.loginServerList[k]);
    }
    return loginServerList;
  }

  onAddLoginServer() {
    this.navCtrl.push(EditLoginServerPage, {loginServer: null});
  }

  onEditLoginServer(event, loginServer: LoginServerInfo, slidingItem : ItemSliding) {
    console.log("editLoginServer");
    slidingItem.close();
    this.navCtrl.push(EditLoginServerPage, {loginServer: loginServer});
  }

  onDeleteLoginServer(event, loginServer: LoginServerInfo, slidingItem: ItemSliding) {
    console.log("deleteLoginServer");
    slidingItem.close();
    this.loginManager.removeLoginServerByFilled(loginServer.address);
  }
}
