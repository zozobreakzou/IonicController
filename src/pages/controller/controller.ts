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
      this.relayEventListener = this.relayEvent.bind(this, document.getElementById("main_content"));
      for (let  e of event_types ) {
        f.contentWindow.addEventListener(e, this.relayEventListener);
      }
    }
  }
  ionViewDidLeave() {
    console.log('ionViewWillLeave ControllerPage');
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
  onTap(e){
    console.log("tap");
  }
  onSwipe(e) {
    console.log("swipe");
  }
  onExit() {
    this.navCtrl.pop();
  }
  private controller_url: SafeResourceUrl;
  private relayEventListener;
}
