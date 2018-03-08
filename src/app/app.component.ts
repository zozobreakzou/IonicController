import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Zeroconf, ZeroconfResult } from '@ionic-native/zeroconf';
import { Network } from '@ionic-native/network';

import { LoginFormPage } from '../pages/login-form/login-form';
import { LoginManagerProvider } from '../providers/login-manager/login-manager';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  loginServerList: Array<string> = [];

  constructor(
      public platform: Platform,
      public statusBar: StatusBar,
      public splashScreen: SplashScreen,
      public zeroConf: Zeroconf,
      public network: Network,
      public loginManager: LoginManagerProvider) {

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.loginManager.loadFromStorage().then(() => {

        this.nav.push(LoginFormPage);
        this.statusBar.styleDefault();
        this.splashScreen.hide();

        this.zeroConf.watch('_http._tcp.', 'local.').subscribe( (result : ZeroconfResult) => {
          if (result.action == 'resolved') {
            console.log('service resolved', result.service);
            this.loginManager.addLoginServerByDiscovery(result.service.ipv4Addresses[0]||result.service.ipv6Addresses[0], result.service.port, result.service.name);
          } else if(result.action == 'removed') {
            console.log('service removed', result.service);
            this.loginManager.removeLoginServerByDiscovery(result.service.ipv4Addresses[0]||result.service.ipv6Addresses[0]);
          } });
      });

      this.network.onDisconnect().subscribe( () => {
        console.info('network was disconnected :-(');
      } );
    });
  }
}
