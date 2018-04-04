import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { LoginManagerPage } from "../login-manager/login-manager";
import { ServerTreePage } from "../server-tree/server-tree";

import { LoginManagerProvider, LoginServerInfo } from "../../providers/login-manager/login-manager";
import { MwConnectionProvider } from "../../providers/mw-connection/mw-connection";
import { PageApiProvider } from '../../providers/page-api/page-api';

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
    public mwConnection: MwConnectionProvider,
    public pageAPI: PageApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginFormPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter LoginFormPage');
    if ( this.loginManager.currentLoginServer && this.loginManager.currentLoginServer.username) {
      this.username = this.loginManager.currentLoginServer.username;
    }
    if ( this.loginManager.currentLoginServer && this.loginManager.currentLoginServer.password ) {
      this.password = this.loginManager.currentLoginServer.password;
    }
  }

  doLogin() {
    let loading = this.loadingCtrl.create({cssClass: "loading-spinner"});
    loading.present().then(() => {
      this.pageAPI.setupCancelLoading(loading);
    });

    loading.onDidDismiss((data: any, role: string) => {
      if ( role == "canceled by user" ) {
        this.mwConnection.logout(3001, "canceled by user");
      }
    });

    this.mwConnection
    .login("ws://"+this.loginManager.currentLoginServer.address+":"+this.loginManager.currentLoginServer.port, this.username, this.password)
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
      this.mwConnection.logout(3011, "server internal error");
      loading.dismiss();

      let subTitle: string;
      if ( e instanceof CloseEvent ) {
        subTitle = e.reason;
      } else if ( e instanceof Event ) {
        subTitle = e.type;
      } else if ( e instanceof Error ) {
        subTitle = e.message;
      } else {
        subTitle = e.toString();
      }

      if ( subTitle == "canceled by user" ) {
        return;
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
