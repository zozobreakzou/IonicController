import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

/**
 * Generated class for the ControllerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-controller',
  templateUrl: 'controller.html',
})
export class ControllerPage {

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private sanitizer: DomSanitizer,
      private screenOrientation: ScreenOrientation) {

    this.controller_url = this.sanitizer.bypassSecurityTrustResourceUrl(navParams.data.controller_url);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ControllerPage');
  }
  ionViewWillEnter() {
    console.log('ionViewWillEnter ControllerPage');
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
  }
  ionViewDidLeave() {
    console.log('ionViewWillLeave ControllerPage');
    this.screenOrientation.unlock();
  }

  private controller_url: SafeResourceUrl;
}
