import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { App } from 'ionic-angular/components/app/app';
import { ControllerPage } from '../../pages/controller/controller';
import { Loading } from 'ionic-angular/components/loading/loading';

/*
  Generated class for the PageApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PageApiProvider {

  constructor(private app: App) {
    console.log('constructor PageApiProvider Provider');
  }

  hello() {
    console.log("received a hello message.");
  }

  setViewport(scale: number) {
    console.log("setViewport scale to "+scale);
    let viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute('content', 'width=device-width, minimum-scale=0.1, maximum-scale=10.0, user-scalable=0'+", initial-scale="+scale);
  }

  goBack() {
    let navs = this.app.getActiveNavs();
    if ( navs && navs.length>0 && navs[0].canGoBack() ) {
      navs[0].pop();
    }
  }

  hideNavbar(hide: boolean) {
    let navs = this.app.getActiveNavs();
    if ( navs && navs.length>0 ) {
      let activePage = navs[0].getActive().instance;
      if( activePage instanceof ControllerPage) {
        (<ControllerPage>activePage).hideNavbar(hide);
      }
    }
  }

  setupCancelLoading(loading: Loading) {
    let Hammer = (<any>window).Hammer;
    let hm = new Hammer.Manager(loading.pageRef().nativeElement, {
      recognizers: [
        [Hammer.Pan, { event:"panright", direction:Hammer.DIRECTION_RIGHT, pointers: 2, threshold: 200 }]
      ]
    });

    hm.on("panright", () => {
      console.log("two finger pan right, cancel loading.");
      loading.dismiss(null, "canceled by user");
    });
  }
}
