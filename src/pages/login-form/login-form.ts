import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { LoginManagerPage } from "../login-manager/login-manager";
import { ServerTreePage } from "../server-tree/server-tree";

import { LoginManagerProvider } from "../../providers/login-manager/login-manager";
import { MwConnectionProvider } from "../../providers/mw-connection/mw-connection";

/**
 * Generated class for the LoginFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login-form',
  templateUrl: 'login-form.html',
})
export class LoginFormPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public loginManager: LoginManagerProvider,
    public mwConnection: MwConnectionProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginFormPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter LoginFormPage');
    this.username = this.loginManager.currentLoginServer ? this.loginManager.currentLoginServer.username : "";
    this.password = this.loginManager.currentLoginServer ? this.loginManager.currentLoginServer.password : "";
  }

  doLogin() {
    this.mwConnection
    .login("wss://"+this.loginManager.currentLoginServer.address+":"+this.loginManager.currentLoginServer.port, this.username, this.password)
    .then((response) => {
      console.log("login success.");

      this.loginManager.setLogingAccount(this.username, this.password);
      return this.mwConnection.getServerTree();
    })
    .then((response) => {
      console.log("getServerTree success.");
      this.mwConnection.logout();

      let serverTree = {
        info: {
          name: this.loginManager.currentLoginServer.name,
          ip:   this.loginManager.currentLoginServer.address,
          port: this.loginManager.currentLoginServer.port,
          username: this.username,
          password: this.password
        },
        child_array: response.body.cascade_server_tree.child_array
      }
      this.navCtrl.push(ServerTreePage, {
        severTree: serverTree
      });
    })
    .catch((e) => {
      console.log(e);
      this.mwConnection.logout();

      let subTitle: string;
      if ( e instanceof(Event) ) {
        subTitle = e.type;
      } else if ( e instanceof Error ) {
        subTitle = e.message;
      } else {
        subTitle = e.toString();
      }

      let alert = this.alertCtrl.create({
        title: 'Login Error',
        subTitle: subTitle,
        buttons: ['Ok']
      });
      alert.present();
    });
  }

  onLoginManager() {
    this.navCtrl.push(LoginManagerPage);
  }

  onClearUsername() {
    this.username = "";
  }

  onClearPassword() {
    this.password = "";
  }

  shouldShowClearUsernameBtn() : boolean {
    return this.username && this.username.length>0;
  }

  shouldShowClearPasswordBtn() : boolean {
    return this.password && this.password.length>0;
  }

  private username: string  = "";
  private password: string  = "";
}
