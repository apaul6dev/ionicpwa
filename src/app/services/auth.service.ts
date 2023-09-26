import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoginModel } from './../model/login.model';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { AuthHttpService } from './auth-http.service';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { EventosService } from './eventos.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  loginModel: LoginModel;
  firebaseToken;
  config: any = {};
  suscriptor = null;
  constructor(
    private authHttp: AuthHttpService,
    private storage: Storage,
    private router: Router,
    public eventos: EventosService,
    private uniqueDeviceID: UniqueDeviceID,
    public modalController: ModalController
  ) {
    this.storage.create().then((a) => {
      this.recargarUsuario();
    });

    this.uniqueDeviceID
      .get()
      .then((uuid: any) => console.log(uuid))
      .catch((error: any) => console.log(error));

    this.suscriptor = this.eventos.listaEventos.subscribe((msg) => {
      if (msg && msg == 'logout') {
        this.logout();
      }
    });
  }

  ngOnDestroy() {
    if (this.suscriptor) {
      this.suscriptor.unsubscribe();
    }
  }

  async login(credentials): Promise<Observable<any>> {
    this.firebaseToken = await this.storage.get('firebase');

    try {
      let uuid = await this.uniqueDeviceID.get();
      console.log('el di>' + uuid);
    } catch (error) {
      console.error(error);
    }

    console.log('El tokenn>' + this.firebaseToken);

    let body = {
      email: credentials.correo,
      password: credentials.password,
      firetoken: this.firebaseToken,
    };

    //  console.log('66666' + JSON.stringify(body));
    return this.authHttp.postGetSuscriber('/logincontroller/loginApp', body);
  }

  saveData(resp) {

    const loginModel = resp.data;
    const config = resp.config;
    this.storage.set('loginModel', JSON.stringify(loginModel));
    this.storage.set('loginModel', JSON.stringify(loginModel));
    this.storage.set('id_token', loginModel.token);
    if (config) {
      this.storage.set('config', config);
    }
    this.loginModel = loginModel;
    console.log('From login');

    this.recargarUsuario();
    this.verificarLogin();
  }

  logout() {
    console.log('Cerrando sesión..');

    try {
      this.modalController.dismiss();
      setTimeout(() => {
        this.modalController.dismiss();
      }, 100);
      setTimeout(() => {
        this.modalController.dismiss();
      }, 200);
    } catch (error) {

    }


    this.authHttp.postWithoutCheckResponse('/logincontroller/logout', null);

    this.loginModel = null;
    //
    setTimeout(() => {
      this.storage.remove('loginModel');
      this.storage.remove('config');
      this.storage.clear();
      this.router.navigateByUrl('/login', { replaceUrl: true });
      this.storage.set('firebase', this.firebaseToken);
      console.log('seteando>> ' + this.firebaseToken);
    }, 200);
  }

  async recargarUsuario() {
    if (!this.loginModel) {
      await this.storage.get('loginModel').then((loginModel) => {
        this.loginModel = JSON.parse(loginModel);
      });

      await this.storage.get('firebase').then((firebase) => {
        if (firebase) {
          this.firebaseToken = firebase;
        }
      });



    }

    await this.storage.get('config').then((config) => {

      if (config) {


        this.config = config;
      }
    });

  }


  async recargarConfig() {

    await this.storage.get('config').then((config) => {
      if (config) {

        this.config = config;
      }
    });

  }

  public verificarLogin(): boolean {
    if (this.loginModel && this.loginModel.token) {
      return true;
    } else {
      return false;
    }
  }
}
