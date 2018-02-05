import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Zeroconf, ZeroconfResult } from '@ionic-native/zeroconf';
import { Network } from '@ionic-native/network';

import { LoginFormPage } from '../pages/login-form/login-form';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginFormPage;

  loginServerList: Array<string> = [];

  constructor(
      public platform: Platform,
      public statusBar: StatusBar,
      public splashScreen: SplashScreen,
      public zeroConf: Zeroconf,
      public network: Network) {

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.zeroConf.watch('_http._tcp.', 'local.').subscribe( (result : ZeroconfResult) => {
        if (result.action == 'resolved') {
          console.log('service resolved', result.service);
          if(result.service.txtRecord.url) {
            this.loginServerList.push(result.service.txtRecord.url);
          }
        } else if(result.action == 'removed') {
          console.log('service removed', result.service);
        } });

      this.network.onDisconnect().subscribe( () => {
        console.info('network was disconnected :-(');
      } );
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
