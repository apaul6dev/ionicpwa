import { ToastController, ModalController } from '@ionic/angular';
import { Location } from '@angular/common';
import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthHttpService } from 'src/app/services/auth-http.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-actualizarpass',
  templateUrl: './actualizarpass.page.html',
  styleUrls: ['./actualizarpass.page.scss'],
})
export class ActualizarpassPage implements OnInit {
  showPasswordAnt = false;
  showPasswordNew1 = false;

  showPasswordNew2 = false;

  passanterior = null;
  passnueva1 = null;
  passnueva2 = null;

  constructor(
    public authService: AuthService,
    private authHttp: AuthHttpService,
    private zone: NgZone,
    private router: Router,
    private _location: Location,
    private toastCtrl: ToastController,
    private location: Location,
    private modalController: ModalController
  ) { }

  ngOnInit() { }

  toggleShowPassword(who, val) {
    if (val == 1) {
      this.showPasswordAnt = !this.showPasswordAnt;
      who.type = this.showPasswordAnt ? 'text' : 'password';
    }

    if (val == 2) {
      this.showPasswordNew1 = !this.showPasswordNew1;
      who.type = this.showPasswordNew1 ? 'text' : 'password';
    }

    if (val == 3) {
      this.showPasswordNew2 = !this.showPasswordNew2;
      who.type = this.showPasswordNew2 ? 'text' : 'password';
    }
  }

  cancelar() {
    this.modalController.dismiss();
  }

  actualizarDatos() {
    if (!this.passanterior) {
      this.mostrarToast('Error', 'Ingrese la contraseña anterior', true);
      return;
    }

    this.passanterior = this.passanterior.trim();

    if (!this.passanterior) {
      this.mostrarToast('Error', 'Ingrese la contraseña anterior', true);
      return;
    }

    if (!this.passnueva1) {
      this.mostrarToast('Error', 'Ingrese la nueva contraseña', true);
      return;
    }

    this.passnueva1 = this.passnueva1.trim();

    if (this.passnueva1.length < 6) {
      this.mostrarToast(
        'Error',
        'La nueva contraseña debe contener al menos 6 caracteres',
        true
      );
      return;
    }

    if (!this.passnueva2) {
      this.mostrarToast('Error', 'Repita la nueva contraseña', true);
      return;
    }

    this.passnueva2 = this.passnueva2.trim();

    if (this.passnueva1 != this.passnueva2) {
      this.mostrarToast(
        'Error',
        'La nueva contraseña y su repetición no coinciden',
        true
      );
      return;
    }

    let req = {
      pwanterior: this.passanterior,
      pwnueva: this.passnueva1,
    };

    console.log(req);

    this.authHttp.post(
      '/userapp/actualizarpass/',
      req,
      (datos) => {
        console.log(datos);

        if (!datos || datos.estado != 'OK') {
          this.mostrarToast(
            datos.titulo || 'Error',
            datos.mensaje || 'Ocurrio un error, verifique su conexión',
            true
          );
          this.zone.run(() => {
            console.log('force update the screen');
          });
          return;
        }

        this.mostrarToast(
          datos.titulo || 'Correcto',
          datos.mensaje || 'Correcto',
          false
        );

        this.modalController.dismiss();

        this.zone.run(() => {
          console.log('force update the screen');
        });
      },
      (error) => {
        console.log('Error' + error);
        this.mostrarToast(
          'Error',
          'Ocurrio un error, verifique su conexión',
          true
        );
      }
    );
  }

  mostrarToast(titulo, mensaje, error) {
    this.toastCtrl
      .create({
        header: titulo,
        message: mensaje,
        duration: 3000,
        position: 'bottom',
        color: error ? 'danger' : 'secondary',
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            },
          },
        ],
      })
      .then((a) => a.present());
  }

  goBack() {
    this.modalController.dismiss();
  }
}
