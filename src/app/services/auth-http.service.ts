import { ToastController } from '@ionic/angular';
import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { LoginModel } from '../model/login.model';
import { HttpHeaders } from '@angular/common/http';

import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { EventosService } from './eventos.service';

import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root',
})
export class AuthHttpService {
  constructor(
    private http: HttpClient,
    public eventos: EventosService,
    public storage: Storage,
    private toastController: ToastController
  ) {}

  get(url, data, callback, callbackerror, disableauth = false) {
    url = environment.apiUrl + url;
    if (!disableauth) {
      this.storage
        .get('loginModel')
        .then((loginModel) => {
          this.doGET(
            this.getToken(loginModel),
            url,
            data,
            callback,
            callbackerror
          );
        })
        .catch((error) => {
          this.doGET('', url, data, callback, callbackerror);
        });
    } else {
      this.doGET('', url, data, callback, callbackerror);
    }
  }

  private doGET(token, url, data, callback, callbackerror) {
    if (!data) {
      data = {};
    }
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: token,
      }),
      params: data,
    };

    this.http.get(url, httpOptions).subscribe(
      (data) => {
        // console.log(data);

        callback(data);
      },
      (error) => {
        console.log(error);

        callbackerror('');
      },
      () => {}
    );
  }

  post(url, data, callback, callbackerror, disableauth = false) {
    url = environment.apiUrl + url;
    if (!disableauth) {
      this.storage
        .get('loginModel')
        .then((loginModel) => {
          this.doPost(
            this.getToken(loginModel),
            url,
            data,
            callback,
            callbackerror
          );
        })
        .catch((error) => {
          this.doPost('', url, data, callback, callbackerror);
        });
    } else {
      this.doPost('', url, data, callback, callbackerror);
    }
  }

  private doPost(token, url, data, callback, callbackerror) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: token,
      }),
    };

    if (!data) {
      data = {};
    }

    this.http.post(url, data, httpOptions).subscribe(
      (data) => {
        // console.log(data);

        callback(data);
      },
      (error) => {
        console.log(error);

        if (error.status) {
          if (error.status + '' == '401') {
            console.log('sending logout');

            this.eventos.listaEventos.next('logout');

            const toast = this.toastController
              .create({
                message: 'Su sesión ha caducado',
                duration: 5000,
                position: 'bottom',
              })
              .then((toast) => toast.present());
          }
          callbackerror(error.status);
        } else {
          callbackerror('');
        }
      },
      () => {}
    );
  }

  postWithoutCheckResponse(url, data) {
    url = environment.apiUrl + url;
    this.storage
      .get('loginModel')
      .then((loginModel) => {
        this.doPostWithoutCheckResponse(this.getToken(loginModel), url, data);
      })
      .catch((error) => {
        this.doPostWithoutCheckResponse('', url, data);
      });
  }

  private doPostWithoutCheckResponse(token, url, data) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: token,
      }),
    };

    if (!data) {
      data = {};
    }

    this.http.post(url, data, httpOptions).subscribe(
      (data) => {
        // console.log(data);
      },
      (error) => {
        console.log(error);
      },
      () => {}
    );
  }

  postGzip(url, data, callback, callbackerror, disableauth = false) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: 'my-auth-token',
        'Content-Transfer-Encoding': 'gzip',
      }),
    };

    this.http.post(url, data, httpOptions).subscribe(
      (data) => {
        // console.log(data);

        callback(data);
      },
      (error) => {
        console.log(error);

        callbackerror('');
      },
      () => {}
    );
  }

  postGetSuscriber(url, data, options = {}) {
    url = environment.apiUrl + url;
    let cabeceras = null;
    if (!options) {
      cabeceras = {};
      cabeceras['Content-Type'] = 'application/json; charset=utf-8';
    } else {
      cabeceras = options;
    }

    let httpOptions = {
      headers: new HttpHeaders(cabeceras),
    };

    return this.http.post(url, data, httpOptions);
  }

  private getToken(loginModel): string {
    let token = '';
    try {
      if (!loginModel) {
        return '';
      }

      let usuario: LoginModel = JSON.parse(loginModel);
      if (usuario && usuario.token) {
        token = 'Bearer ' + usuario.token;
      }
    } catch (error) {}
    return token;
  }
}
