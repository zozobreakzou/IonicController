import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { LoginManagerPage } from "../login-manager/login-manager";
import { ServerTreePage } from "../server-tree/server-tree";

import { LoginManagerProvider, LoginServerInfo } from "../../providers/login-manager/login-manager";
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
    private loadingCtrl: LoadingController,
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
    let loading = this.loadingCtrl.create({cssClass: "loading-spinner"});
    loading.present();

    this.mwConnection
    .login("wss://"+this.loginManager.currentLoginServer.address+":"+this.loginManager.currentLoginServer.port, this.username, this.password)
    .then((response) => {
      console.log("login success.");

      this.loginManager.setLogingAccount(this.username, this.password);

      loading.dismiss();

      this.navCtrl.push(ServerTreePage, {
        loginServer: this.loginManager.currentLoginServer
      });
    })
    .catch((e) => {
      console.log(e);
      this.mwConnection.logout();
      loading.dismiss();

      let subTitle: string;
      if ( e instanceof(Event) ) {
        subTitle = e.type;
      } else if ( e instanceof Error ) {
        subTitle = e.message;
      } else {
        subTitle = e.toString();
      }

      let alert = this.alertCtrl.create({
        title: 'Error',
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
