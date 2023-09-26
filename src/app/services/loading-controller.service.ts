import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingControllerService {
  constructor(public loadingCtrl: LoadingController) {}

  public create(data: any): Promise<HTMLIonLoadingElement> {
    if (!data) {
      return;
    }
    return this.loadingCtrl.create({
      message: data.message ? data.message : 'Cargando..',
    });
  }

  public dismiss() {
    console.log('1555555');

    for (let index = 0; index < 5; index++) {
      setTimeout(() => {
        this.loadingCtrl.dismiss();
      }, index * 50);
    }
  }
}
