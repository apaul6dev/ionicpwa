import { Router } from '@angular/router';
import { Platform, IonRouterOutlet, NavController } from '@ionic/angular';
import { EventosService } from './../services/eventos.service';
import { AuthService } from './../services/auth.service';
import { Component, OnDestroy } from '@angular/core';

import { Plugins } from '@capacitor/core';
const { App } = Plugins;

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnDestroy {


  eventosListener = null;
  backButtonBack = null;
  constructor(public authService: AuthService,
    private events: EventosService,
    public platform: Platform,
    private routerOutlet: IonRouterOutlet,
    private navController: NavController,
    private router: Router) {


    setTimeout(() => {
      authService.recargarConfig();
    }, 2500);




    this.eventosListener = this.events.listaEventos.subscribe((a) => {


      if (a && a === 'logincheck') {

        console.log("checkkkkkkkkkkkkkkkkkkkkkkkk");

        authService.recargarConfig();

      }
    });
  }


  ionViewWillEnter() {

    this.authService.recargarConfig();

    this.killBackButtonSub();
    this.backButtonBack = this.platform.backButton.subscribeWithPriority(-1, () => {
      console.log('this.router.url.....', this.router.url);


      if (!this.routerOutlet.canGoBack() && this.router.url === '/tabs/inicio') {
        App.exitApp();
      } else {
        this.router.navigateByUrl('/tabs/inicio', { replaceUrl: true });
      }
    });





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



  ngOnDestroy() {
    console.log('Tabs destruido');

    if (this.eventosListener) {
      this.eventosListener.unsubscribe();
    }




  }


}
