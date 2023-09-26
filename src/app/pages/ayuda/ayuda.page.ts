import { PopsubmenuComponent } from 'src/app/componentes/popsubmenu/popsubmenu.component';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UtilitariosService } from '../../services/utilitarios.service';
import { Storage } from '@ionic/storage';
import { AuthHttpService } from '../../services/auth-http.service';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.page.html',
  styleUrls: ['./ayuda.page.scss'],
})
export class AyudaPage implements OnInit {
  datosUsuario = null;
  datosAyuda = null;
  loadingayuda = true;
  constructor(
    public authService: AuthService,
    private authHttp: AuthHttpService,
    private zone: NgZone,
    private router: Router,
    private storage: Storage,
    private utilitarios: UtilitariosService,
    public popoverController: PopoverController,
    private modalController: ModalController,
    private location: Location
  ) { }

  ngOnInit() {
    this.obtenerDatos();
    setTimeout(() => {
      this.loadingayuda = false;
    }, 2000);
  }

  cerrarSession() {
    this.authService.logout();
  }

  obtenerDatos() {
    this.authHttp.post(
      '/userapp/recuperarInfoAyuda/',
      null,
      (datos) => {
        console.log(datos);

        if (datos) {
          this.datosAyuda = datos;

        }
        this.zone.run(() => {
          console.log('force update the screen');
        });
      },
      (error) => {
        console.log('Error' + error);
      }
    );
  }

  actualizarInfo() {
    this.router.navigateByUrl('actualizarinfo');
  }

  actualizarPassword() {
    this.router.navigateByUrl('/tabs/actualizarpass');
  }

  llamar(numero) {
    if (!numero) {
      return;
    }

    if (numero.trim().startsWith('09')) {
      numero = numero.trim().substring(1);

      window.open('tel:+593' + numero, '_system', 'location=yes');
    } else {
      window.open('tel:' + numero.trim(), '_system', 'location=yes');
    }
  }

  goBack() {
    this.modalController.dismiss();
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
