import { CuentaPage } from './../../pages/cuenta/cuenta.page';
import { AyudaPage } from './../../pages/ayuda/ayuda.page';
import { ModalController, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popsubmenu',
  templateUrl: './popsubmenu.component.html',
  styleUrls: ['./popsubmenu.component.scss'],
})
export class PopsubmenuComponent implements OnInit {
  constructor(
    private router: Router,
    public popoverController: PopoverController,
    public modalController: ModalController
  ) { }

  ngOnInit() { }



  async isACuenta() {
    this.popoverController.dismiss();
    const modal = await this.modalController.create({
      component: CuentaPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  async isAAyuda() {
    this.popoverController.dismiss();
    const modal = await this.modalController.create({
      component: AyudaPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
}
