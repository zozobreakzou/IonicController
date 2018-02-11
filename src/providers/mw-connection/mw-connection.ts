import { Injectable } from '@angular/core';
import { assert } from 'ionic-angular/util/util';

/*
  Generated class for the MwConnectionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

class RequestInfo {
  uid:      number;
  type:     string;
  body:     object;
  resolve:  Function;
  reject:   Function;
  timeout:  number;
}

class MwConnection {
  constructor() {
  }

  open(address: string, onClose?) : Promise<any> {
    assert(!this.ws || this.ws.readyState==WebSocket.CLOSED, "ws should be null or closed");

    return new Promise((resolve, reject) => {
      this.uid = 0;
      this.ws = new WebSocket(address);
  
      /* 
      {
        "category" : 0,
        "errorCode" : 0,
        "errorStr" : "OK",
        "guid" : "M-0",
        "type" : "QUERYUSERLOGIN",
        "body": "body json string",
      }
      */
  
      this.ws.onmessage = (e: MessageEvent) => {
        let response = JSON.parse(e.data);

        let uid = parseInt(response.guid);
        if ( this.pendingRequests[uid] ) {
          clearTimeout(this.pendingRequests[uid].timeout);
          this.pendingRequests[uid].resolve(response);
  
          delete this.pendingRequests[uid];
        }
      }

      this.ws.onopen = (e: Event) => {
        console.log("ws opend.");
        resolve(e);
      };
  
      this.ws.onclose = (e: Event) => {
        console.log("ws closed.");

        this.pendingRequests.forEach((r: RequestInfo) => {
          clearTimeout(r.timeout);
          r.reject(e);
        })
        this.pendingRequests.clear();
        this.ws = undefined;
        if ( onClose ) {
          onClose(e);
        }
      };
  
      this.ws.onerror = (e: Event) => {
        console.log("ws error.");
        if ( this.ws.readyState == WebSocket.CLOSED || this.ws.readyState == WebSocket.CONNECTING ) {
          reject(e);
        }
        this.close();
      };
    });
  }

  close() {
    if (this.ws && (this.ws.readyState == WebSocket.OPEN || this.ws.readyState == WebSocket.CONNECTING)) {
      this.ws.close();
    }
    this.ws = undefined;
  }

  send(type: string, body: object, timeout?: number) : Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let request = {
        guid: this.uid.toString(),
        type: type,
        body: JSON.stringify(body)
      };

      try {
        this.ws.send(JSON.stringify(request));
      } catch(e) {
        reject(e);
        return;
      }

      let pendingRequest = <RequestInfo> {
        uid:      this.uid,
        type:     type,
        body:     body,
        resolve:  resolve,
        reject:   reject,
        timeout:  setTimeout(this.onRequestTimeout.bind(this, this.uid), timeout||this.timeout)
      };

      this.pendingRequests[pendingRequest.uid] = pendingRequest;
      this.uid++;
    });
  }

  private sendHeartbeat() {
    let request = {
      guid: "",
      type: "MASTERHEARTBEAT",
      body: ""
    };

    try {
      this.ws.send(JSON.stringify(request));
    } catch(e) {
    }
  }

  private onRequestTimeout(uid: number) : void {
    if ( this.pendingRequests[uid] ) {
      console.log("request timeout:| ");
      console.log(this.pendingRequests[uid]);

      this.pendingRequests[uid].reject(new Event("timeout"));
      delete this.pendingRequests[uid];
    }
  }

  private ws:       WebSocket;

  private uid:      number;
  private timeout:  number  = 10000; // 10 seconds
  private pendingRequests : Map<number, RequestInfo> = new Map<number, RequestInfo>();
}

@Injectable()
export class MwConnectionProvider {

  constructor() {
    console.log('Hello MwConnectionProvider Provider');
  }

  login(address: string, username: string, password: string) : Promise<any> {
    return this.connection
    .open(address, this.onClose.bind(this))
    .then((e) => {
      let request_body = {
        userName: username,
        userPassword: password
      };
      return this.connection.send("QUERYUSERLOGIN", request_body);
    })
    .then((response) => {
        if(response.body.loginSuccess) {
          return Promise.resolve(response);
        } else {
          return Promise.reject(new Error("login error:"+response.loginDescription ) );
        }
    });
  }

  logout() {
    this.connection.close();
  }

  getServerTree() : Promise<any> {
    let request_body = {
      path: ""
    };
    return this.connection.send("", request_body);
  }

  private onClose(e: Event) {

  }

  private connection: MwConnection = new MwConnection();
}