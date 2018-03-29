import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { App } from 'ionic-angular/components/app/app';
import { IonicApp } from 'ionic-angular/components/app/app-root';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';

import { Zeroconf, ZeroconfResult } from '@ionic-native/zeroconf';
import { Network } from '@ionic-native/network';

import { LoginFormPage } from '../pages/login-form/login-form';
import { LoginManagerProvider } from '../providers/login-manager/login-manager';
import { PageApiProvider } from '../providers/page-api/page-api';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { ControllerPage } from '../pages/controller/controller';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  loginServerList: Array<string> = [];

  constructor(
      public app: App,
      public ionicApp: IonicApp,
      public platform: Platform,
      public statusBar: StatusBar,
      public splashScreen: SplashScreen,
      public androidFullScreen: AndroidFullScreen,
      public toastCtrl: ToastController,
      public zeroConf: Zeroconf,
      public network: Network,
      public loginManager: LoginManagerProvider,
      public pageAPI: PageApiProvider) {

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.loginManager.loadFromStorage().then(() => {
        this.nav.push(LoginFormPage);
        this.statusBar.hide();
        this.splashScreen.hide();
        this.androidFullScreen.immersiveMode();
      });

      this.zeroConf.watch('_maxwall._tcp.', 'local.').subscribe( (result : ZeroconfResult) => {
        if (result.action == 'resolved') {
          console.log('service resolved', result.service);
          this.loginManager.addLoginServerByDiscovery(result.service.ipv4Addresses[0]||result.service.ipv6Addresses[0], result.service.port, result.service.name);
        } else if(result.action == 'removed') {
          console.log('service removed', result.service);
          this.loginManager.removeLoginServerByDiscovery(result.service.ipv4Addresses[0]||result.service.ipv6Addresses[0]);
        }
      });

      this.platform.registerBackButtonAction(() => {
        try {
          this.getActivePortal().dismiss(null, "canceled by user");
        } catch (error) {
          if ( this.nav.canGoBack() ) {
            this.nav.pop();
          } else {
            if (this.backButtonPressed) {
              this.platform.exitApp();
            } else {
              this.toastCtrl.create({
                message: 'press again to exit',
                duration: 2000,
                position: 'top',
                dismissOnPageChange: true,
                cssClass: "mw-toast center",
              }).present();
              this.backButtonPressed = true;
              setTimeout(() => { this.backButtonPressed = false }, 2000);
            }
          }
        }
      }, 1);

      this.network.onDisconnect().subscribe( () => {
        console.info('network was disconnected :-(');
      } );

      window.onmessage = ( event: MessageEvent) : any => {
        try {
          var ret = this.pageAPI[event.data.method].apply(this.pageAPI, event.data.params);
          var response = {
              uid: event.data.uid,
              method: event.data.method,
              result: ret
          };
          event.source.postMessage(response, event.source.location.origin);
        } catch(e) {
            event.source.postMessage(e, event.source.location.origin);
        }
      }
    });
  }

  getActivePortal() : ViewController {
    let topmost: ViewController = null;
    let maxZIndex: number = -9999999;

    [
      this.ionicApp._loadingPortal.getActive(),
      this.ionicApp._modalPortal.getActive(),
      this.ionicApp._overlayPortal.getActive()
    ].forEach((v, i, a) => {
      if ( v &&  maxZIndex < v.getZIndex()  ) {
        maxZIndex = v.getZIndex();
        topmost = v;
      }
    });

    return topmost;
  }

  private backButtonPressed : boolean = false;
}
