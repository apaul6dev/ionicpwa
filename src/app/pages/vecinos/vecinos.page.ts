import { PopoverController } from '@ionic/angular';
import { UtilitariosService } from './../../services/utilitarios.service';
import { Storage } from '@ionic/storage';
import { AuthHttpService } from './../../services/auth-http.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { PopsubmenuComponent } from 'src/app/componentes/popsubmenu/popsubmenu.component';

@Component({
  selector: 'app-vecinos',
  templateUrl: './vecinos.page.html',
  styleUrls: ['./vecinos.page.scss'],
})
export class VecinosPage implements OnInit {
  items: any[] = [];

  itemsBackup: any[] = [];

  searchQuery = '';

  constructor(
    private authHttp: AuthHttpService,
    private zone: NgZone,
    private storage: Storage,
    private utilitarios: UtilitariosService,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.storage
      .get('vecinos')
      .then((a) => {
        if (a && a.length > 0) {
          this.items = a;

          this.zone.run(() => {
            console.log('force update the screen');
          });
        }
        console.log(this.items);
      })
      .finally(() => {
        console.log('Finally');

        this.obtenerListaVecinos();
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VecinosPage');
  }

  mostrarDatos(item) {
    let anterior = item.mostrar;

    for (let index = 0; index < this.items.length; index++) {
      this.items[index].mostrar = false;
    }
    item.mostrar = !anterior;
  }

  obtenerListaVecinos() {
    this.authHttp.post(
      '/comunidad/listarVecinos/',
      null,
      (respuesta) => {
        if (this.utilitarios.handleError(respuesta)) {
          return;
        }

        if (respuesta.data) {
          this.items = [];

          let v911 = {
            nombres: 'ECU 911',
            apellidos: '',
            celular: '911',
            descripcion: 'Servicio Integrado de Seguridad ECU 911',
            sos: true,
            id: -1,
          };
          this.items.push(v911);

          respuesta.data.forEach((vecino) => {
            if (vecino) {
              if (vecino.celular) {
                vecino.celular = vecino.celular.trim();
                if (vecino.celular === '') {
                  vecino.celular = null;
                }
              }

              if (vecino.telefono) {
                vecino.telefono = vecino.telefono.trim();
                if (vecino.telefono === '') {
                  vecino.telefono = null;
                }
              }

              this.addElementToList(vecino);
            }
          });

          if (this.items && this.items.length > 0) {
            this.utilitarios.guardarListaDatosEnStorage('vecinos', this.items);
          }
        }
      },
      (error) => {}
    );
  }

  addElementToList(obj) {
    if (!obj || !obj.id) {
      return;
    }

    if (this.items.filter((a) => a.id == obj.id).length == 0) {
      this.items.push(obj);
      this.zone.run(() => {
        console.log('force update the screen');
      });
    } else {
      for (let index = 0; index < this.items.length; index++) {
        let element = this.items[index];
        if (element.id == obj.id) {
          this.items[index] = obj;
          this.zone.run(() => {
            console.log('force update the screen');
          });
          return;
        }
      }
    }
  }

  llamar(nombre, numero) {
    if (!numero) {
      return;
    }

    if (numero.trim().startsWith('09')) {
      numero = numero.trim().substring(1);

      window.open('tel:+593' + numero, '_system', 'location=yes');
    } else {
      window.open('tel:' + numero.trim(), '_system', 'location=yes');
    }

    /* let alert = this.alertCtrl.create({
      title: '¿Desea llamar a ' + nombre + '?',
      message: numero,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Llamar',
          handler: () => {
            this.doCall(numero.trim());
          }
        }
      ]
    });
    alert.present();*/
  }

  doCall(numero: any) {
    try {
      /* this.callNumber.callNumber(numero, true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => {
          alert('No se pudo generar la llamada');
          console.log('Error launching dialer', err)
        });*/
    } catch (err) {}
  }

  search(event) {
    console.log(event);

    console.log('Buscando...');
    console.log(this.searchQuery);

    if (this.itemsBackup.length == 0) {
      this.itemsBackup = [...this.items];
    }

    if (!this.searchQuery) {
      console.log('nadaaaaa');

      this.items = [...this.itemsBackup];
      return;
    }

    this.items = this.itemsBackup.filter(
      (a) =>
        (a.nombres &&
          a.nombres.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (a.apellidos &&
          a.apellidos.toLowerCase().includes(this.searchQuery.toLowerCase()))
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
