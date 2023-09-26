import { ActualizarpassPage } from './../actualizarpass/actualizarpass.page';
import { AyudaPage } from './../ayuda/ayuda.page';
import { PopsubmenuComponent } from 'src/app/componentes/popsubmenu/popsubmenu.component';
import { ModalController, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UtilitariosService } from './../../services/utilitarios.service';
import { Storage } from '@ionic/storage';
import { AuthHttpService } from './../../services/auth-http.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {
  datosUsuario = null;

  constructor(
    public authService: AuthService,
    private authHttp: AuthHttpService,
    private zone: NgZone,
    private router: Router,
    private storage: Storage,
    private utilitarios: UtilitariosService,
    public popoverController: PopoverController,
    private location: Location,
    public modalController: ModalController
  ) { }

  ngOnInit() {

  }

  cerrarSession() {
    this.authService.logout();
  }



  actualizarInfo() {
    this.router.navigateByUrl('actualizarinfo');
  }



  async actualizarPassword() {

    const modal = await this.modalController.create({
      component: ActualizarpassPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
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




  async isAAyuda() {

    const modal = await this.modalController.create({
      component: AyudaPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
}
