import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ControllerPage } from '../controller/controller';
import { LoginManagerPage } from "../login-manager/login-manager";

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginFormPage');
  }

  doLogin() {
    this.navCtrl.push(ControllerPage, {
      controller_url: "http://10.3.70.4:8089/html/output/index.html"
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
  private remberMe: boolean = true;

}
