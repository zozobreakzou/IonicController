import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { LoadingController, Loading } from 'ionic-angular';

import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
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
      private screenOrientation: ScreenOrientation,
      private loadingCtrl: LoadingController,
      public toastCtrl: ToastController) {

    this.controller_url = this.sanitizer.bypassSecurityTrustResourceUrl(navParams.data.controller_url);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ControllerPage');

    this.loading = this.loadingCtrl.create({cssClass: "loading-spinner"});
    this.loading.present();

    this.loading.onDidDismiss((data: any, role: string) => {
      if ( role == "canceled by user" ) {
        this.navCtrl.pop();
      }
      this.loading = null;
    });

    let Hammer = (<any>window).Hammer;
    let container = document.getElementById("frame_container");
    let hm = new Hammer.Manager(container, {
      recognizers: [
        [Hammer.Pan, { event:"panright", direction:Hammer.DIRECTION_RIGHT, pointers: 2, threshold: 200 }]
      ]
    });

    hm.on("panright", ()=>{
      console.log("two pointer pan right.");
      hm.destroy();
      this.navCtrl.pop();
    });
  }
  ionViewWillUnload() {
    console.log('ionViewWillUnload ControllerPage');
  }
  ionViewWillEnter() {
    console.log('ionViewWillEnter ControllerPage');
  }
  ionViewDidEnter() {
    console.log('ionViewDidEnter ControllerPage');
    let f = <HTMLIFrameElement>document.getElementById("present_frame");
    if ( f && f.contentWindow ) {
      let event_types = [
        "click", "dblclick", "mousedown", "mouseup", "mousemove",
        "pointerdown", "pointerup", "pointermove",, "pointercancel",
        "touchstart", "touchend", "touchmove", "touchcancel"
      ];

      for (let  e of event_types ) {
        f.contentWindow.removeEventListener(e, this.relayEventListener);
      }
      this.relayEventListener = this.relayEvent.bind(this, document.getElementById("frame_container"));
      for (let  e of event_types ) {
        f.contentWindow.addEventListener(e, this.relayEventListener);
      }
    }

    this.toastCtrl.create({
      message: 'swipe right with two finger to go back',
      duration: 2000,
      position: 'top',
      dismissOnPageChange: true,
      cssClass: "mw-toast center",
    }).present();
  }
  ionViewDidLeave() {
    console.log('ionViewDidLeave ControllerPage');
    var viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, minimum-scale=0.1, maximum-scale=10.0, user-scalable=0');
  }

  onFrameLoad($event) {
    console.log("onFrameLoad ControllerPage");
    if ( this.loading ) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  relayEvent(target, event) {
    try {
      let newEvent = new event.constructor(event.type, event);

      if("view" in newEvent) {
        Object.defineProperty(newEvent, "view", { writable: true, value: window });
      }

      ["touches", "targetTouches", "changedTouches"].every( (touches_name, index, array) => {
        let touches = event[touches_name];
        if(touches) {
          let cloneTouchs = [];
          for ( let touch of touches ) {
            cloneTouchs.push(document.createTouch(window, target, touch.identifier, touch.pageX, touch.pageY, touch.screenX, touch.screenY));
          }
          let newTouchList = document.createTouchList.apply(document, cloneTouchs);
          Object.defineProperty(newEvent, touches_name, { writable: true, value: newTouchList});
        }
        return true;
      });
      target.dispatchEvent(newEvent);
    } catch(e) {
      console.log(e);
      let f = <HTMLIFrameElement>document.getElementById("present_frame");
      if ( f && f.contentWindow ) { 
        f.contentWindow.removeEventListener(event.type, this.relayEventListener);
      }
    }
  }
  private controller_url: SafeResourceUrl;
  private relayEventListener;
  private loading: Loading;
}
