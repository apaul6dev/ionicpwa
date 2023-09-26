/* eslint-disable eqeqeq */
import { Storage } from '@ionic/storage';
import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventosService } from 'src/app/services/eventos.service';
import {
  IonContent,
  IonInfiniteScroll,
  PopoverController,
} from '@ionic/angular';
import { AuthHttpService } from '../services/auth-http.service';
import { UtilitariosService } from '../services/utilitarios.service';
import { PopsubmenuComponent } from '../componentes/popsubmenu/popsubmenu.component';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit, OnDestroy {
  items: any[] = [];

  fakeUsers: Array<any> = new Array(5);

  exito = false;

  //variable para almacenar el scroll infinito y evitar que se siga mostrando

  //Variable que indica si tenemos más resultados
  hayMasResultados = true;
  //Numero de pagina de resultados a consultar
  pagina = 1;

  eventosListener = null;

  @ViewChild('content') content;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  chao = false;

  constructor(
    private router: Router,
    private authHttp: AuthHttpService,
    private events: EventosService,
    private zone: NgZone,
    private utilitarios: UtilitariosService,
    public storage: Storage,
    private popoverController: PopoverController
  ) { }

  firstload = false;
  ngOnInit() {
    this.storage
      .get('listaeventos')
      .then((a) => {
        if (a && a.length > 0) {
          // this.items = a;
          this.exito = true;

          this.zone.run(() => {
            console.log('force update the screen');
          });
        }
        console.log(this.items);
      })
      .finally(() => {
        console.log('Finally111');

        this.obtenerDatos();
      });

    this.eventosListener = this.events.listaEventos.subscribe((a) => {
      if (a && a == 'update') {
        console.log('El evento en notificacion,', a);
        this.pagina = 1;
        this.obtenerDatos();
      }
    });
  }

  ngOnDestroy() {
    this.chao = true;
    if (this.eventosListener) {
      this.eventosListener.unsubscribe();
    }
  }

  /**
   *Metodo utilizado para obtener datos del servidor independientemente de su categoria
   *Utilizamos el # de pagina para obtener rangos de resultados
   */
  obtenerDatos() {
    this.firstload = true;
    const solicitud: any = {};
    solicitud.pagina = this.pagina;

    this.authHttp.post(
      '/controlDispositivos/listarEventos/',
      solicitud,
      (resp) => {
        this.zone.run(() => {
          if (this.utilitarios.handleError(resp)) {
            console.log('Error');
            return;
          }

          console.log('Eventos listados...');

          this.firstload = false;

          this.exito = true;

          if (resp.lista) {
            resp.lista.forEach((element) => {
              if (element.iconoalerta && element.iconoalerta == 'hand') {
                element.iconoalerta = 'hand-left';
              }
              this.addElementToList(element);
            });
          }

          console.log(this.items);

          this.pagina += 1;
          const count = resp.lista ? Object.keys(resp.lista).length : 0;
          if (count === 0) {
            this.hayMasResultados = false;
          } else {
            this.hayMasResultados = true;
          }

          this.utilitarios.ordernarLista(this.items, 'id', 'desc');

          console.log('force update the screenxxxx');
        });
      },
      (error) => {
        console.log('Error' + error);
        this.exito = true;
        if (this.utilitarios.handleError(null)) {
          console.log('Error');
          return;
        }
      }
    );
  }

  ionViewWillEnter() {
    if (this.firstload) {
      this.pagina = 1;
      this.obtenerDatos();
    }
  }

  doRefresh(refresher) {
    this.pagina = 1;
    this.hayMasResultados = true;
    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = !this.hayMasResultados;
    }

    console.log('Ahi vamos...');

    this.obtenerDatos();
    setTimeout(() => {
      refresher.target.complete();
    }, 1000);
  }
  /**
   *Metodo utilizado para obtener más resultados con el Scroll Infinito
   */
  doInfinite(event) {
    this.obtenerDatos();
    if (this.items && this.items.length / 10 > this.pagina) {
      this.scrollToMiddle();
    }

    setTimeout(() => {
      event.target.complete();
      this.infiniteScroll.disabled = !this.hayMasResultados;
    }, 1000);
  }

  scrollToMiddle() {
    if (!this.content) {
      return;
    }
    window.dispatchEvent(new Event('resize'));
    setTimeout(() => {
      if (this.chao) {
        return;
      }
      if (this.content && this.items.length > 20) {
        //  console.log(this.content.attributes.values);

        /* let limit = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );*/

        let limit = 160 * this.items.length;

        limit = limit - 400;

        console.log(limit);

        if (limit) {
          this.content.scrollToPoint(0, limit, 500);
        }
      }
    }, 1000);
  }

  abrirAlerta(alerta: any) {
    console.log(alerta);

    this.router.navigateByUrl('/tabs/notificaciones/vernotificacion', {
      state: alerta,
    });
  }

  addElementToList(obj) {
    if (!obj || !obj.id) {
      return;
    }

    if (obj.usuario) {
      obj.usuario = obj.usuario.toUpperCase();
    }


    if (!obj.titulo) {
      obj.titulo = obj.dispositivo
        ? obj.dispositivo.toUpperCase()
        : 'DISPOSITIVO';
    }



    if (obj.mensaje) {

      console.log("Predefined mensaje");

    } else if (obj.accion) {
      const accion = obj.accion;
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!' + accion);

      if (accion == 'tiempoabiertoexcesivo') {
        obj.mensaje =
          'TIEMPO EXCESIVO ' + (obj.valor == 1 ? 'DETECTADO' : 'FINALIZADO');
      }

      if (accion == 'corriente') {
        obj.mensaje =
          'EL DISPOSITIVO  ' +
          (obj.valor == 1
            ? ' HA ENTRADO A TRABAJAR CON CORRIENTE'
            : ' HA DEJADO DE TRABAJAR CON CORRIENTE');
      }

      if (accion == 'bateria') {
        obj.mensaje =
          'EL DISPOSITIVO  ' +
          (obj.valor == 1
            ? ' HA ENTRADO A TRABAJAR CON BATERIA'
            : ' HA DEJADO DE TRABAJAR CON BATERIA');
      }

      if (accion == 'encendido') {
        obj.mensaje =
          'EL DISPOSITIVO  ' +
          (obj.valor == 1 ? ' HA SIDO ENCENDIDO' : ' HA SIDO APAGADO');

        if (obj.usuario) {
          obj.mensaje = obj.mensaje + ' POR ' + obj.usuario;
        }




      }

      if (accion == 'abierto') {
        obj.mensaje =
          'EL DISPOSITIVO  ' +
          (obj.valor == 1 ? ' HA SIDO ABIERTO' : ' HA SIDO CERRADO');

        if (obj.usuario) {
          obj.mensaje = obj.mensaje + ' POR ' + obj.usuario;
        }
      }

      if (accion == 'energizado') {
        obj.mensaje =
          'EL DISPOSITIVO  ' +
          (obj.valor == 1
            ? ' HA SIDO ENERGIZADO (ACTIVADO)'
            : ' HA DESENERGIZADO (DESACTIVADO)');

        if (obj.usuario) {
          obj.mensaje = obj.mensaje + ' POR ' + obj.usuario;
        }
      }

      if (accion == 'intrusion') {
        obj.mensaje =
          'INTRUSION ' +
          (obj.valor == 1 ? 'DETECTADA' : 'FINALIZADA') +
          ' EN EL DISPOSITIVO';
      }

      if (accion == 'forzado') {
        obj.mensaje =
          'FORZADO ' +
          (obj.valor == 1 ? 'DETECTADO' : 'FINALIZADO') +
          ' EN EL DISPOSITIVO ';
      }


      if (accion == 'audio' && obj.valor == 10) {

        obj.mensaje =
          'EL PERIFONEO ' +
          (obj.valor == 0
            ? 'HA SIDO DESACTIVADO'
            : ' HA SIDO ACTIVADO');

        if (obj.usuario) {
          obj.mensaje = obj.mensaje + ' POR ' + obj.usuario;
        }

      } else if (accion == 'audio') {
        obj.mensaje =
          'EL AUDIO ' +
          (obj.valor == 0
            ? 'HA SIDO APAGADO'
            : '#' + obj.valor + ' HA SIDO REPRODUCIDO') +
          ' EN EL DISPOSITIVO ';

        if (obj.usuario) {
          obj.mensaje = obj.mensaje + ' POR ' + obj.usuario;
        }
      }

      if (accion == 'encendido1') {
        obj.mensaje =
          'LA ALARMA DE ROBOS ' +
          (obj.valor == 1 ? ' HA SIDO ENCENDIDA' : ' HA SIDO APAGADA');

        if (obj.usuario) {
          obj.mensaje = obj.mensaje + ' POR ' + obj.usuario;
        }
      }

      if (accion == 'encendido2') {
        obj.mensaje =
          'LA ALARMA DE INCENDIO ' +
          (obj.valor == 1 ? ' HA SIDO ENCENDIDA' : ' HA SIDO APAGADA');

        if (obj.usuario) {
          obj.mensaje = obj.mensaje + ' POR ' + obj.usuario;
        }
      }

      if (accion == 'encendido3') {
        obj.mensaje =
          'LA ALARMA DE EMERGENCIA MEDICA ' +
          (obj.valor == 1 ? ' HA SIDO ENCENDIDA' : ' HA SIDO APAGADA');

        if (obj.usuario) {
          obj.mensaje = obj.mensaje + ' POR ' + obj.usuario;
        }
      }
    }

    obj.since = new Date();
    if (this.items.filter((a) => a.id == obj.id).length == 0) {
      this.items.push(obj);
      this.zone.run(() => {
        console.log('force update the screen');
      });
      console.log('oush');
      console.log(this.items.length);
    } else {
      for (let index = 0; index < this.items.length; index++) {
        let element = this.items[index];

        if (element.id == obj.id) {
          this.items[index] = obj;
          this.zone.run(() => {
            console.log('force update the screen');
          });
          console.log('rep');
          console.log(this.items.length);
          return;
        }
      }
    }
    console.log(this.items.length);
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
