import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginManagerProvider, LoginServerInfo } from '../../providers/login-manager/login-manager';

/**
 * Generated class for the EditLoginServerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-login-server',
  templateUrl: 'edit-login-server.html',
})
export class EditLoginServerPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loginManager: LoginManagerProvider) {

      this.loginServer = navParams.data.loginServer;
      if ( this.loginServer ) {
        this.serverAddress = this.loginServer.address;
        this.serverPort = this.loginServer.port.toString();
        this.serverName = this.loginServer.name;
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditLoginServerPage');
  }

  checkInput() : boolean {
    if (!this.serverName || this.serverName.length==0 || !this.serverAddress || this.serverAddress.length==0 || !this.serverPort || isNaN(parseInt(this.serverPort)))
      return false;

    if( parseInt(this.serverPort)<=0 || parseInt(this.serverPort)>65535 )
      return false;

    if ( !this.serverAddress.match(/^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?$/) && !this.serverAddress.match(/^((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3}$/) )
      return false;

    // todo: check serverAddress is valid.
    if (this.loginServer) { // edit
      for(let k in this.loginManager.loginServerList) {
        let iterLoginServer = this.loginManager.loginServerList[k];
        if ( iterLoginServer != this.loginServer && this.serverAddress == iterLoginServer.serverAddress )
          return false;
      }
      return true;
    } else { // add
      for(let k in this.loginManager.loginServerList) {
        let iterLoginServer = this.loginManager.loginServerList[k];
        if ( this.serverAddress == iterLoginServer.serverAddress )
          return false;
      }
      return true;
    }
  }

  onSave() : void {
    if ( !this.checkInput() )
      return;

    if ( this.loginServer ) {
      this.loginManager.editLoginServer(this.loginServer, this.serverAddress, parseInt(this.serverPort), this.serverName);
    } else {
      this.loginManager.addLoginServerByFilled(this.serverAddress, parseInt(this.serverPort), this.serverName);
    }

    this.navCtrl.pop();
  }

  private loginServer:    LoginServerInfo;
  private serverName:     string;
  private serverAddress:  string;
  private serverPort:     string = "7682";
}
