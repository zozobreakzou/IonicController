import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { assert } from 'ionic-angular/util/util';

export class LoginServerInfo {
  public  address:         string;
  public  port:            number;
  public  name:            string;
  public  autoDiscovered:  boolean = false;
  public  filledByUser:    boolean = false;

  public  username:        string;
  public  password:        string;
}
/*
  Generated class for the LoginManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginManagerProvider {

  constructor(
      private storage: Storage) {
    console.log('Hello LoginManagerProvider Provider');
  }

  public loadFromStorage() : Promise<any> {
    return new Promise<any>( (resolve) => {
      this.storage.get("login_manager")
      .then((login_manager) => {
        if (login_manager) {
          this.loginServerList = login_manager.loginServerList;
          this.setCurrentLoginServer(login_manager.currentLoginServer);
        }
        resolve();
      } ).catch( () => {
        console.log("loadFromStorage exception.");
      } );
    });
  }

  public saveToStorage() : void {
    let serverListByFilled = {};
    for ( let k in this.loginServerList ) {
      if ( this.loginServerList[k].filledByUser ) {
        serverListByFilled[k] = this.loginServerList[k];
      }
    }

    this.storage.set("login_manager", {
      loginServerList: serverListByFilled,
      currentLoginServer: this.currentLoginServer ? this.currentLoginServer.address : null
    });
  }

  public addLoginServerByDiscovery(address: string, port: number, name: string) : void {
    if ( this.loginServerList.hasOwnProperty(address) ) {
      let existingLoginServer = this.loginServerList[address];
      existingLoginServer.port = port;
      existingLoginServer.name = name;
      existingLoginServer.autoDiscovered = true;
    } else {
      this.loginServerList[address] = {
        address:        address,
        port:           port,
        name:           name,
        autoDiscovered: true,
        filledByUser:   false,
        username:       undefined,
        password:       undefined
      }
    }
  }

  public addLoginServerByFilled(address: string, port: number, name: string) : void {
    if ( this.loginServerList.hasOwnProperty(address) ) {
      let existingLoginServer = this.loginServerList[address];
      if ( !existingLoginServer.autoDiscovered ) {
        existingLoginServer.port = port;
        existingLoginServer.name = name;
      }
      existingLoginServer.filledByUser = true;
    } else {
      this.loginServerList[address] = {
        address:        address,
        port:           port,
        name:           name,
        autoDiscovered: false,
        filledByUser:   true,
        username:       undefined,
        password:       undefined
      }
    }
    this.saveToStorage();
  }

  public removeLoginServerByDiscovery(address : string) {
    if ( this.loginServerList.hasOwnProperty(address) ) {
      this.loginServerList[address].autoDiscovered = false;
      if(!this.loginServerList[address].filledByUser) {
        delete this.loginServerList[address];
      }
    }
  }

  public removeLoginServerByFilled(address : string) {
    if ( this.loginServerList.hasOwnProperty(address) ) {
      this.loginServerList[address].filledByUser = false;
      if(!this.loginServerList[address].autoDiscovered) {
        delete this.loginServerList[address];
      }
    }
  }

  public editLoginServer(address: string, port: number, name: string) : boolean {
    if ( !this.loginServerList.hasOwnProperty(address) )
      return false;

    let existingLoginServer = this.loginServerList[address];
    if ( existingLoginServer.autoDiscovered || !existingLoginServer.filledByUser ) {
      return false;
    }

    existingLoginServer.port = port;
    existingLoginServer.name = name;
    return true;
  }

  public setCurrentLoginServer(address : string) : void {
    if ( this.loginServerList.hasOwnProperty(address) ) {
      this.currentLoginServer = this.loginServerList[address];
    }
  }

  public setLogingAccount(username: string, password: string) : void {
    if ( this.currentLoginServer ) {
      this.currentLoginServer.username = username;
      this.currentLoginServer.password = password;
    }
  }

  public loginServerList = { };   // keyed by address
  public currentLoginServer : LoginServerInfo;
}