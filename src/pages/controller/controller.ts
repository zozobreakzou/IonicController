import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController, Loading } from 'ionic-angular';

import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { PageApiProvider } from '../../providers/page-api/page-api';

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
      private pageAPI: PageApiProvider) {

    this.loadURL = navParams.data.controller_url;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ControllerPage');

    this.controllerURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.loadURL);

    this.loading = this.loadingCtrl.create({cssClass: "loading-spinner"});
    this.loading.present();

    this.loading.onDidDismiss((data: any, role: string) => {
      if ( role == "canceled by user" ) {
        this.navCtrl.pop();
      }
      this.loading = null;
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
  }
  ionViewDidLeave() {
    console.log('ionViewDidLeave ControllerPage');
    this.pageAPI.setViewport(1.0);
  }

  onFrameLoad($event) {
    console.log("onFrameLoad ControllerPage");

    if ( this.controllerURL ) {
      if ( this.loading ) {
        this.loading.dismiss();
        this.loading = null;
      }
    }
  }

  setupSwipeGesture() {
    let Hammer = (<any>window).Hammer;
    let hm = new Hammer.Manager(document.body, {
      recognizers: [
        [Hammer.Pan, { event:"panright", direction:Hammer.DIRECTION_RIGHT, pointers: 2, threshold: 200 }]
      ]
    });

    hm.on("panright", ()=>{
      console.log("two pointer pan right.");
      hm.destroy();
      if ( this.loading ) {
        let f = <HTMLIFrameElement>document.getElementById("present_frame");
        if ( f && f.contentWindow ) {
          f.contentWindow.stop();
        }

        this.loading.dismiss(null, "canceled by user");
      } else {
        this.navCtrl.pop();
      }
    });
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

  setupFrameEvent() {
    try {
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
        this.relayEventListener = this.relayEvent.bind(this, document.body);
        for (let  e of event_types ) {
          f.contentWindow.addEventListener(e, this.relayEventListener);
        }
      }
    } catch (error) {
      console.log("setup iframe input event error.");
      console.log(error);
    }
  }

  public hideNavbar(hide: boolean) {
    this._hideNavbar = hide;
  }

  private controllerURL: SafeResourceUrl;
  private relayEventListener;
  private loading: Loading;
  private loadURL: string;
  
  private _hideNavbar: boolean = false;
}
