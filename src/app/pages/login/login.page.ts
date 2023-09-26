import { EventosService } from './../../services/eventos.service';
import { AuthHttpService } from './../../services/auth-http.service';
import { AuthService } from './../../services/auth.service';
import { LoadingControllerService } from './../../services/loading-controller.service';
import { Storage } from '@ionic/storage';
import { LoginModel } from './../../model/login.model';
import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { IonInput, MenuController, Platform, IonRouterOutlet } from '@ionic/angular';


import { Plugins } from '@capacitor/core';
const { App } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, AfterViewInit {
  usuario: LoginModel;

  showPassword = false;
  @ViewChild('inputPass') inputPass: IonInput;

  // loginModel: LoginModel;

  mensaje = '';
  imagenTbot = "../../../assets/iconos/tbotini.png";
  imagenTbotOriginal = "../../../assets/iconos/tbotini.png";
  imagenTbotSaludando = "../../../assets/iconos/tbotSaludando.gif";

  backButtonBack = null;

  constructor(
    public router: Router,
    public storage: Storage,
    public authService: AuthService,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
    private events: EventosService,
    public loadingCtrl: LoadingControllerService
  ) {
    this.usuario = new LoginModel();

    this.storage.get('firebase').then((firebase) => {
      this.usuario.firebase = firebase;
    });
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
    this.inputPass.type = this.showPassword ? 'text' : 'password';
  }

  clickTbot() {
    this.imagenTbot = this.imagenTbot === this.imagenTbotOriginal ? this.imagenTbotSaludando : this.imagenTbotOriginal;
  }

  ngOnInit() {
    /* setTimeout(() => {
      this.router.navigateByUrl('/home');
    }, 2500);*/
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.authService.verificarLogin()) {
        this.router.navigateByUrl('/tabs/inicio', { replaceUrl: true });
      }
    }, 200);
  }

  async login() {
    if (!this.usuario.correo) {
      this.mensaje = 'INGRESE SU CORREO';
      return;
    }

    if (!this.usuario.password) {
      this.mensaje = 'INGRESE SU CONTRASEÑA';
      return;
    }

    this.mensaje = '';
    let loading = await this.loadingCtrl.create({
      content: 'Loading ...',
    });

    await loading.present().then(() => {
      this.authService.login(this.usuario).then((b) =>
        b.subscribe(
          (loginModel) => {
            this.loadingCtrl.dismiss();
            //  alert( JSON.stringify(loginModel));
            // If the user credentials are valid, the current user is redirected to the home page.
            if (loginModel.estado == 'OK') {
              this.authService.saveData(loginModel);
              //  this.events.publish('login', null, Date.now())
              this.redirectToHome();
              setTimeout(() => {
                this.events.listaEventos.next('logincheck');
              }, 200);

            } else {
              // this.alertConnexionError(loginModel);
              if (loginModel.mensaje) {
                this.mensaje = loginModel.mensaje;
              } else {
                this.mensaje =
                  'No se pudo establecer una conexión con el servidor.';
              }
            }
          },
          (err) => {
            this.loadingCtrl.dismiss();
            this.mensaje =
              'No se pudo establecer una conexión con el servidor. Intente más tarde.';
          }
        )
      );
    });
  }

  redirectToHome() {
    this.router.navigateByUrl('/tabs/inicio', { replaceUrl: true });
  }

  recuperarClave() {
    this.router.navigateByUrl('/recuperarpass');
  }

  ionViewWillLeave() {
    this.killBackButtonSub();
  }

  killBackButtonSub() {
    try {
      if (this.backButtonBack) {
        this.backButtonBack.unsubscribe();
      }
    } catch (error) {

    }
  }

  ionViewWillEnter() {
    this.killBackButtonSub();
    this.backButtonBack = this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp();
      }
    });
  }
}
