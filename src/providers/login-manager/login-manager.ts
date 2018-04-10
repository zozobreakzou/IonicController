import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

export class LoginServerInfo {
  public  address:         string;
  public  port:            number;
  public  name:            string;
  public  autoDiscovered:  boolean = false;
  public  filledByUser:    boolean = true;

  public  username:        string;
  public  password:        string;
}
/*
  Generated class for the LoginManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.

  storage structure: {
    currentLoginServer: "address",
    rememberAccount:    true,
    loginServerList:    {},
  }
*/
@Injectable()
export class LoginManagerProvider {

  constructor(
      private storage: Storage) {
    console.log('Hello LoginManagerProvider Provider');
  }

  public loadFromStorage() : Promise<any> {
    let currentLoginServer : string;
    return Promise.all([
      this.storage.get("rememberAccount")
      .then( (v) => {
        this._rememberAccount = (v === undefined ? true : v);

        console.log("storage get rememberAccount resolved.");
      })
      .catch( (v) => {
        console.log("storage get rememberAccount rejected.");
        this._rememberAccount = true;
      }),

      this.storage.get("currentLoginServer")
      .then( (v) => {
        currentLoginServer = v;

        console.log("storage get currentLoginServer resolved.");
      })
      .catch( (v) => { 
        console.log("storage get currentLoginServer rejected.");
      }),

      this.storage.get("loginServerList")
      .then( (v) => {
        this._loginServerList = v || {};

        console.log("storage get loginServerList resolved.");
      })
      .catch ( v => { 
        console.log("storage get loginServerList rejected.");
      })
    ])
    .then( (v) => {
      if ( currentLoginServer in this.loginServerList ) {
        this._currentLoginServer = this.loginServerList[currentLoginServer];
      }

      console.log("loadFromStorage LoginManagerProvider success.");
    })
    .catch( (v) => {
      console.log("loadFromStorage LoginManagerProvider failed.");
    });
  }

  private saveServerListToStorage() : void {
    let serverListByFilled = {};
    for ( let k in this.loginServerList ) {
      if ( this.loginServerList[k].filledByUser ) {
        serverListByFilled[k] = {
          address:  this.loginServerList[k].address,
          port:     this.loginServerList[k].port,
          name:     this.loginServerList[k].name,
          autoDiscovered: false,
          filledByUser:   true,

          username: this.rememberAccount ? this.loginServerList[k].username : undefined,
          password: this.rememberAccount ? this.loginServerList[k].password : undefined
        }
        this.loginServerList[k];
      }
    }

    this.storage.set("loginServerList", serverListByFilled);
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
    this.saveServerListToStorage();
  }

  public removeLoginServerByDiscovery(address : string) {
    if ( this.loginServerList.hasOwnProperty(address) ) {
      if ( !this.loginServerList[address].autoDiscovered ) {
        return;
      }

      this.loginServerList[address].autoDiscovered = false;
      if(!this.loginServerList[address].filledByUser) {
        delete this.loginServerList[address];
      }
    }
  }

  public removeLoginServerByFilled(address : string) {
    if ( this.loginServerList.hasOwnProperty(address) ) {
      if ( !this.loginServerList[address].filledByUser ) {
        return;
      }

      this.loginServerList[address].filledByUser = false;
      if(!this.loginServerList[address].autoDiscovered) {
        delete this.loginServerList[address];
      }
      this.saveServerListToStorage();
    }
  }

  public editLoginServer(loginServer: LoginServerInfo, address: string, port: number, name: string) : boolean {
    if ( loginServer.autoDiscovered || !loginServer.filledByUser ) {
      return false;
    }

    if ( loginServer.address == address ) {
      loginServer.name = name;
      loginServer.port = port;
    } else {
      if ( address in this.loginServerList ) {
        return false;
      }

      delete this.loginServerList[loginServer.address];

      loginServer.address = address;
      loginServer.port = port;
      loginServer.name = name;

      this.loginServerList[loginServer.address] = loginServer;
      this.saveServerListToStorage();
      return true;
    }
  }

  setLogingAccount(username: string, password: string) : void {
    if ( this.currentLoginServer ) {
      this.currentLoginServer.username = username;
      this.currentLoginServer.password = password;
    }
    this.saveServerListToStorage();
  }

  get loginServerList() {
    return this._loginServerList;
  }

  get currentLoginServer() : LoginServerInfo {
    return this._currentLoginServer;
  }
  set currentLoginServer(s: LoginServerInfo) {
    this._currentLoginServer = s;
    this.storage.set("currentLoginServer", this.currentLoginServer ? this.currentLoginServer.address : null);
  }

  get rememberAccount() : boolean {
    return this._rememberAccount;
  }
  set rememberAccount(v: boolean) {
    this._rememberAccount = v;
    this.storage.set("rememberAccount", this.rememberAccount);
    this.saveServerListToStorage();
  }

  private _loginServerList = { };   // keyed by address
  private _currentLoginServer : LoginServerInfo;
  private _rememberAccount : boolean = true;
}