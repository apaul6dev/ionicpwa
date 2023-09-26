import { EventosService } from 'src/app/services/eventos.service';
import { AuthService } from './../../services/auth.service';
import { UtilitariosService } from './../../services/utilitarios.service';
import { AuthHttpService } from '../../services/auth-http.service';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { IonRouterOutlet, Platform, PopoverController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';

import {
  AppLauncher,
  AppLauncherOptions,
} from '@ionic-native/app-launcher/ngx';
import { PopsubmenuComponent } from 'src/app/componentes/popsubmenu/popsubmenu.component';
import { Router } from '@angular/router';

import { Plugins } from '@capacitor/core';
const { App } = Plugins;
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit, OnDestroy {
  dispositivo: any = { encender1: 0, encender2: 0, encender3: 0 };
  coordenadas = { latitud: null, longitud: null };

  public loadProgress = 0;
  isloading = false;

  timer;


  eventosListener = null;

  loginListener = null;



  sosoff = "../../../assets/iconos/sosoff.png";
  soson = "../../../assets/iconos/soson.png";
  sosofftoon = "../../../assets/iconos/sos.gif";
  sosofftooff = "../../../assets/iconos/sosoff.gif";
  sosiconoactual = "../../../assets/iconos/sosoff.png";


  robooff = "../../../assets/iconos/robooff.png";
  roboon = "../../../assets/iconos/roboon.png";
  roboofftoon = "../../../assets/iconos/robo.gif";
  roboofftooff = "../../../assets/iconos/robooff.gif";
  roboiconoactual = "../../../assets/iconos/robooff.png";


  fuegooff = "../../../assets/iconos/fuegooff.png";
  fuegoon = "../../../assets/iconos/fuegoon.png";
  fuegoofftoon = "../../../assets/iconos/fuego.gif";
  fuegoofftooff = "../../../assets/iconos/fuegooff.gif";
  fuegoiconoactual = "../../../assets/iconos/fuegooff.png";


  config = {
    tienecamaras: true,
    tienelogo: true,
    urllogo: '../../../assets/iconos/baner.png',
    tienealarmas: false,
    mostrarenergia: true,
    mostrardispositivos: true,
    tienedispositivos: true
  };


  backButtonBack = null;

  configLoaded = false;

  constructor(
    private authHttp: AuthHttpService,
    public authService: AuthService,
    private utilitarios: UtilitariosService,
    public platform: Platform,
    private routerOutlet: IonRouterOutlet,
    private geolocation: Geolocation,
    private appLauncher: AppLauncher,
    private events: EventosService,
    private storage: Storage,
    private zone: NgZone,
    private router: Router,
    public popoverController: PopoverController
  ) { }

  ngOnInit() {






    console.log('Inicio creado');
    this.eventosListener = this.events.listaEventos.subscribe((a) => {
      if (a && a == 'update') {
        console.log('El evento update  en inicio..', a);
        this.obtenerDatos();
      }


    });
  }





  ngOnDestroy() {
    console.log('Inicio destruido');

    if (this.eventosListener) {
      this.eventosListener.unsubscribe();
    }



    if (this.backButtonBack) {
      this.backButtonBack.unsubscribe();
    }
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
    this.getConfigAppStart();
  }




  getConfigAppStart() {

    this.configLoaded = true;

    this.obtenerDatos();

    this.storage
      .get('config')
      .then((a) => {


        if (a) {
          this.config = a;
        }

      })
      .finally(() => {
        console.log('Finally');

        this.obtenerConfiguracion();
      });

    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        this.coordenadas.latitud = resp.coords.latitude;
        this.coordenadas.longitud = resp.coords.longitude;
        console.log(resp);
      })
      .catch((error) => {
        console.log('Error getting location', error);
      });

  }






  encender1(val) {
    this.dispositivo.encendido1 = val;
    this.dispositivo.accion = 'encendido1';
    this.cambiarEstado();
  }

  encender2(val) {
    this.dispositivo.encendido2 = val;
    this.dispositivo.accion = 'encendido2';
    this.cambiarEstado();
  }

  encender3(val) {
    this.dispositivo.encendido3 = val;
    this.dispositivo.accion = 'encendido3';
    this.cambiarEstado();
  }

  obtenerConfiguracion() {


    this.authHttp.post(
      '/userapp/getConfigApp/',
      null,
      (datos) => {
        console.log(datos);

        if (datos) {
          this.config = datos;
          this.storage.set('config', this.config);
        }
        this.zone.run(() => {
          console.log('force update the screen');
        });
      },
      (error) => {
        console.log('Error' + error);
        this.utilitarios.mostrarToast(
          'No se pudo conectar',
          'Verifique su conexión al servidor',
          false
        );
      }
    );
  }

  obtenerDatos() {
    console.log('Cargando info...');

    this.authHttp.post(
      '/controlDispositivos/recuperarEstadoAlarmaComunitaria/',
      null,
      (datos) => {
        console.log(datos);

        if (this.utilitarios.handleError(datos)) {
          console.log('Error');
          return;
        }

        if (datos.alarma) {
          this.zone.run(() => {
            this.dispositivo = datos.alarma;

            this.sosiconoactual = this.dispositivo.encendido3 ? this.soson : this.sosoff;

            this.roboiconoactual = this.dispositivo.encendido1 ? this.roboon : this.robooff;

            this.fuegoiconoactual = this.dispositivo.encendido2 ? this.fuegoon : this.fuegooff;

            console.log('update on estado...');
          });
        }
      },
      (error) => {
        console.log('Error' + error);
        if (this.utilitarios.handleError(null)) {
          console.log('Error');
          return;
        }
      }
    );
  }

  cambiarEstado() {
    this.dispositivo.latitud = this.coordenadas.latitud;
    this.dispositivo.longitud = this.coordenadas.longitud;
    this.authHttp.post(
      '/controlDispositivos/smartboxactionalarma/',

      this.dispositivo,
      (datos) => {
        if (this.utilitarios.handleError(datos)) {
          console.log('Error');
          return;
        }

        this.utilitarios.mostrarToast(
          datos.titulo || 'Correcto',
          datos.mensaje || 'Dispositivo actualizado',
          false
        );

        console.log(datos);
      },
      (error) => {
        console.log('Error' + error);
        if (this.utilitarios.handleError(null)) {
          console.log('Error');
          return;
        }
      }
    );
  }

  abrirCamaras() {
    const options: AppLauncherOptions = {};
    let urlTienda = 'market://details?id=com.connect.enduser&hl=es_EC';
    if (this.platform.is('ios')) {
      options.uri =
        'itms-apps://apps.apple.com/ec/app/hik-connect/id1087803190';
      urlTienda = 'https://apps.apple.com/ec/app/hik-connect/id1087803190';
    } else {
      options.packageName = 'com.connect.enduser';
    }

    this.appLauncher
      .canLaunch(options)
      .then((canLaunch: boolean) => {
        console.log('App is available');
        if (canLaunch) {
          this.appLauncher.launch(options);
        } else {
          window.open(urlTienda, '_system');
        }
      })
      .catch((error: any) => {
        console.error(error);
        window.open(urlTienda, '_system');
      });
  }

  presionar(accionboton: string) {
    if (!accionboton) {
      return;
    }
    if (this.isloading) {
      return;
    }

    this.dispositivo.presionado = accionboton;

    this.startupload(accionboton);
  }

  soltar(accionboton) {
    if (!accionboton) {
      return;
    }

    if (!accionboton) {
      return;
    }

    if (accionboton == 'medica') {
      this.sosiconoactual = this.dispositivo.encendido3 ? this.soson : this.sosoff;
    }

    if (accionboton == 'robo') {
      this.roboiconoactual = this.dispositivo.encendido1 ? this.roboon : this.robooff;
    }

    if (accionboton == 'incendio') {
      this.fuegoiconoactual = this.dispositivo.encendido2 ? this.fuegoon : this.fuegooff;
    }

    this.isloading = false;
    this.loadProgress = 0;
    this.dispositivo.presionado = null;

    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  startupload(accionboton: string) {
    if (this.isloading) {
      return;
    }

    if (accionboton == 'medica') {
      this.sosiconoactual = this.dispositivo.encendido3 ? this.sosofftooff : this.sosofftoon;
    }

    if (accionboton == 'robo') {
      this.roboiconoactual = this.dispositivo.encendido1 ? this.roboofftooff : this.roboofftoon;
    }

    if (accionboton == 'incendio') {
      this.fuegoiconoactual = this.dispositivo.encendido2 ? this.fuegoofftooff : this.fuegoofftoon;
    }


    if (this.timer) {
      clearInterval(this.timer);
    }
    this.isloading = true;
    this.loadProgress = 0;
    console.log('Iniciando contador');
    this.timer = setInterval(() => {
      const enviar = accionboton;
      if (!this.isloading) {
        clearInterval(this.timer);
        this.loadProgress = 0;
        this.dispositivo.presionado = null;
        return;
      }
      if (this.loadProgress < 1.30) {
        this.loadProgress += 0.01;
      }
      if (this.loadProgress >= 1.30) {


        clearInterval(this.timer);
        this.isloading = false;
        this.dispositivo.presionado = null;
        if (accionboton == 'robo') {
          this.encender1(this.dispositivo.encendido1 == 1 ? 0 : 1);
        }

        if (accionboton == 'incendio') {
          this.encender2(this.dispositivo.encendido2 == 1 ? 0 : 1);
        }

        if (accionboton == 'medica') {
          this.encender3(this.dispositivo.encendido3 == 1 ? 0 : 1);
        }

        this.loadProgress = 0;
      }
    }, 20);
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopsubmenuComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
    });
    await popover.present();
  }


  abrirDispositivos() {
    this.router.navigateByUrl('/tabs/dispositivos');
  }
}
