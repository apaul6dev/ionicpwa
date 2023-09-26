import { UtilitariosService } from './../../services/utilitarios.service';
import { ToastController, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthHttpService } from '../../services/auth-http.service';
import { AuthService } from '../../services/auth.service';
import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PopsubmenuComponent } from 'src/app/componentes/popsubmenu/popsubmenu.component';

@Component({
  selector: 'app-dispositivos',
  templateUrl: './dispositivos.page.html',
  styleUrls: ['./dispositivos.page.scss'],
})
export class DispositivosPage implements OnInit, OnDestroy {
  items = [];
  coordenadas = { latitud: null, longitud: null };
  intervalo = null;

  constructor(
    public authService: AuthService,
    private authHttp: AuthHttpService,
    private utilitarios: UtilitariosService,
    private geolocation: Geolocation,
    private zone: NgZone,
    private router: Router,
    private popoverController: PopoverController
  ) { }

  ionViewWillEnter() {
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

    console.log('Con inter');

    if (this.intervalo != null) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
    this.obtenerDatos();

    this.intervalo = setInterval(() => {
      this.obtenerDatos();
    }, 1000 * 60);
  }

  ionViewWillLeave() {
    if (this.intervalo != null) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  }

  ngOnInit() {
    /* this.items.push({ ctipodispositivo: 1, nombre: 'Cerco entrada', id: 4 });
    this.items.push({ ctipodispositivo: 2, nombre: 'Puerta entrada', id: 6 });
    this.items.push({
      ctipodispositivo: 3,
      nombre: 'Porton condominio',
      id: 6,
    });
    this.items.push({
      ctipodispositivo: 4,
      nombre: 'Asis',
      id: 3,
      audio: 2,
    });

    this.items.push({
      ctipodispositivo: 5,
      nombre: 'Alarma',
      id: 5,
      encender1: 0,
      encender2: 0,
      encender3: 0,
    });*/
  }

  ngOnDestroy(): void {
    if (this.intervalo != null) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  }

  obtenerDatos() {
    this.authHttp.post(
      '/controlDispositivos/listarDispositivosUsuario/',
      null,
      (datos) => {
        console.log(datos);

        if (this.utilitarios.handleError(datos)) {
          console.log('Error');
          return;
        }

        if (datos.lista) {
          this.items = datos.lista;
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

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopsubmenuComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
    });
    await popover.present();
  }
}
