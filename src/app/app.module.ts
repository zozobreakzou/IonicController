import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { TreeModule } from 'ng2-tree';

import { MyApp } from './app.component';
import { LoginFormPage } from '../pages/login-form/login-form';
import { LoginManagerPage } from "../pages/login-manager/login-manager";
import { ControllerPage } from '../pages/controller/controller';
import { EditLoginServerPage } from '../pages/edit-login-server/edit-login-server';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Zeroconf} from '@ionic-native/zeroconf';
import { Network } from '@ionic-native/network';
import { IonicStorageModule } from '@ionic/storage';

import { LoginManagerProvider } from '../providers/login-manager/login-manager';

@NgModule({
  declarations: [
    MyApp,
    LoginFormPage,
    LoginManagerPage,
    ControllerPage,
    EditLoginServerPage,
  ],
  imports: [
    BrowserModule,
    TreeModule,
    IonicModule.forRoot(MyApp, {mode: 'ios'}),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginFormPage,
    LoginManagerPage,
    ControllerPage,
    EditLoginServerPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    Zeroconf,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginManagerProvider
  ]
})
export class AppModule {}
