import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LoginManagerProvider } from '../../providers/login-manager/login-manager';

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

  onEditLoginServer(event, loginServer, slidingItem) {
    console.log("editLoginServer");
  }

  onDeleteLoginServer(event, loginServer, slidingItem) {
    console.log("deleteLoginServer");
  }
}
