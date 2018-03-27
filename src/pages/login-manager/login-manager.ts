import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { LoginManagerProvider, LoginServerInfo } from '../../providers/login-manager/login-manager';
import { EditLoginServerPage } from '../edit-login-server/edit-login-server';
import { ItemSliding } from 'ionic-angular/components/item/item-sliding';
import { Item } from 'ionic-angular/components/item/item';
import { pointerCoord } from 'ionic-angular/util/dom';
import { DomDebouncer, DomController } from 'ionic-angular/platform/dom-controller';

/**
 * Generated class for the LoginManagerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login-manager',
  templateUrl: 'login-manager.html',
})
export class LoginManagerPage {

  constructor(
      public platform: Platform,
      public navCtrl: NavController,
      public navParams: NavParams,
      public domCtrl: DomController,
      public loginManager: LoginManagerProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginManagerPage');
  }

  getLoginServerList() {
    let loginServerList = [];
    for ( let k in this.loginManager.loginServerList) {
      loginServerList.push(this.loginManager.loginServerList[k]);
    }
    return loginServerList.sort( (r1: LoginServerInfo, r2: LoginServerInfo) => {
      let w1 = (r1.autoDiscovered?2:0) + (r1.filledByUser?1:0);
      let w2 = (r2.autoDiscovered?2:0) + (r2.filledByUser?1:0);
      if ( w1 == w2 ) {
        return r1.address > r2.address ? 1 : -1;
      } else {
        return w2-w1;
      }
    } );
  }

  onAddLoginServer() {
    this.navCtrl.push(EditLoginServerPage, {loginServer: null});
  }

  onOpenSlideItem(event, ionList, slidingItem : ItemSliding, item : Item) {
    event.preventDefault();

    let touch_offsets: number[] = [0, 5, 15, 35, 80, 80];
    let touch_events  = [null, null, null, null, null, null];
    let ele = item._elementRef.nativeElement;

    if ( this.support_touchevent ) {
      try {
        let touches: Touch[] = [null, null, null, null, null, null];
        let touch_types: string[] = ["touchstart", "touchmove", "touchmove", "touchmove", "touchmove", "touchend"];

        touch_offsets.every((v, i, a) => {
          touches[i] = document.createTouch(window, ele, 1, event.pageX-v, event.pageY, event.screenX-v, event.screenY);
          return true;
        });

        if ( this.platform.is("ios") ) {
          touch_offsets.every((v, i, a) => {
            let touch_event = touch_events[i] = document.createEvent("TouchEvent") as any;
            touch_event.initTouchEvent(
              touch_types[i], true, true, ele, 1,
              event.screenX-v, event.screenY, event.clientX-v, event.clientY,
              false, false, false, false,
              document.createTouchList(touches[i]),
              document.createTouchList(touches[i]),
              document.createTouchList(touches[i]),
              1.0, 0.0);
            return true;
          });
        } else {
          touch_offsets.every((v, i, a) => {
            touch_events[i] = new TouchEvent(touch_types[i], { bubbles:true, changedTouches: [touches[i]], touches: [touches[i]], targetTouches: [touches[i]]});
            return true;
          });
        }
      } catch (error) {
        console.log(error);
        this.support_touchevent = false;
      }
    }

    if ( !this.support_touchevent ) {
      let touch_types: string[] = ["mousedown", "mousemove", "mousemove", "mousemove", "mousemove", "mouseup"];
      touch_offsets.every((v, i, a) => {
        touch_events[i] = new MouseEvent(touch_types[i], { bubbles:true, clientX: event.clientX-v, clientY: event.clientY, screenX: event.screenX-v, screenY: event.screenY });
        return true;
      });
    }

    let differRun = (fn) : Promise<any> => {
      return new Promise( (resolve, reject) => {
        this.domCtrl.debouncer().write( (timestamp) => {
          resolve(fn());
        } );
      })
    }

    async function emulateSwipe() {
      for ( let i=0; i<touch_events.length; ++i ) {
        await differRun(ele.dispatchEvent.bind(ele, touch_events[i]));
      }
    }

    emulateSwipe();
  }

  onEditLoginServer(event, loginServer: LoginServerInfo, slidingItem : ItemSliding) {
    console.log("editLoginServer");
    slidingItem.close();
    this.navCtrl.push(EditLoginServerPage, {loginServer: loginServer});
  }

  onDeleteLoginServer(event, loginServer: LoginServerInfo, slidingItem: ItemSliding) {
    console.log("deleteLoginServer");
    slidingItem.close();
    this.loginManager.removeLoginServerByFilled(loginServer.address);
  }

  private support_touchevent : boolean = true;
}
