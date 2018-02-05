import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { LoginFormPage } from '../pages/login-form/login-form';
import { ControllerPage } from '../pages/controller/controller';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Zeroconf} from '@ionic-native/zeroconf';

@NgModule({
  declarations: [
    MyApp,
    LoginFormPage,
    ControllerPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {mode: 'ios'}),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginFormPage,
    ControllerPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Zeroconf,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
