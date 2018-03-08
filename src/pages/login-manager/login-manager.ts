import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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

    let down, move1, move2, move3, move4, up;
    let ele = item._elementRef.nativeElement;

    if ( this.support_touchevent ) {
      try {
        let touchStart : Touch = document.createTouch(window, ele, 1, event.pageX,    event.pageY, event.screenX,     event.screenY);
        let touchMove1 : Touch = document.createTouch(window, ele, 1, event.pageX-5,  event.pageY, event.screenX-5,   event.screenY);
        let touchMove2 : Touch = document.createTouch(window, ele, 1, event.pageX-15, event.pageY, event.screenX-15,  event.screenY);
        let touchMove3 : Touch = document.createTouch(window, ele, 1, event.pageX-35, event.pageY, event.screenX-35,  event.screenY);
        let touchMove4 : Touch = document.createTouch(window, ele, 1, event.pageX-80, event.pageY, event.screenX-80,  event.screenY);
        let touchEnd   : Touch = document.createTouch(window, ele, 1, event.pageX-80, event.pageY, event.screenX-80,  event.screenY);

        down  = new TouchEvent("touchstart", { bubbles:true, changedTouches: [touchStart], touches: [touchStart], targetTouches: [touchStart]});
        move1 = new TouchEvent("touchmove",  { bubbles:true, changedTouches: [touchMove1], touches: [touchMove1], targetTouches: [touchMove1]});
        move2 = new TouchEvent("touchmove",  { bubbles:true, changedTouches: [touchMove2], touches: [touchMove2], targetTouches: [touchMove2]});
        move3 = new TouchEvent("touchmove",  { bubbles:true, changedTouches: [touchMove3], touches: [touchMove3], targetTouches: [touchMove3]});
        move4 = new TouchEvent("touchmove",  { bubbles:true, changedTouches: [touchMove4], touches: [touchMove4], targetTouches: [touchMove4]});
        up    = new TouchEvent("touchend",   { bubbles:true, changedTouches: [touchEnd],   touches: [touchEnd],   targetTouches: [touchEnd]});
      } catch (error) {
        console.log(error);
        this.support_touchevent = false;
      }
    }

    if ( !this.support_touchevent ) {
      down  = new MouseEvent("mousedown", { bubbles:true, clientX: event.clientX,    clientY: event.clientY, screenX: event.screenX,    screenY: event.screenY });
      move1 = new MouseEvent("mousemove", { bubbles:true, clientX: event.clientX-5,  clientY: event.clientY, screenX: event.screenX-5,  screenY: event.screenY });
      move2 = new MouseEvent("mousemove", { bubbles:true, clientX: event.clientX-15, clientY: event.clientY, screenX: event.screenX-15, screenY: event.screenY });
      move3 = new MouseEvent("mousemove", { bubbles:true, clientX: event.clientX-35, clientY: event.clientY, screenX: event.screenX-35, screenY: event.screenY });
      move4 = new MouseEvent("mousemove", { bubbles:true, clientX: event.clientX-80, clientY: event.clientY, screenX: event.screenX-80, screenY: event.screenY });
      up    = new MouseEvent("mouseup",   { bubbles:true, clientX: event.clientX-80, clientY: event.clientY, screenX: event.screenX-80, screenY: event.screenY });
    }

    let differRun = (fn) : Promise<any> => {
      return new Promise( (resolve, reject) => {
        this.domCtrl.debouncer().write( (timestamp) => {
          resolve(fn());
        } );
      })
    }

    async function emulateSwipe() {
      await differRun( ele.dispatchEvent.bind(ele, down));
      await differRun( ele.dispatchEvent.bind(ele, move1));
      await differRun( ele.dispatchEvent.bind(ele, move2));
      await differRun( ele.dispatchEvent.bind(ele, move3));
      await differRun( ele.dispatchEvent.bind(ele, move4));
      await differRun( ele.dispatchEvent.bind(ele, up));
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
