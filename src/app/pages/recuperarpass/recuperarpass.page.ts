import { ToastController } from '@ionic/angular';
import { Location } from '@angular/common';
import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthHttpService } from 'src/app/services/auth-http.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-recuperarpass',
  templateUrl: './recuperarpass.page.html',
  styleUrls: ['./recuperarpass.page.scss'],
})
export class RecuperarpassPage implements OnInit {
  correo = null;
  correoverif = null;

  constructor(
    public authService: AuthService,
    private authHttp: AuthHttpService,
    private zone: NgZone,
    private router: Router,
    private _location: Location,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  cancelar() {
    this._location.back();
  }

  actualizarDatos() {
    if (!this.correo) {
      this.mostrarToast('Error', 'Ingrese su correo', true);
      return;
    }

    this.correo = this.correo.trim();

    if (!this.correo) {
      this.mostrarToast('Error', 'Ingrese su correo', true);
      return;
    }

    if (!this.correoverif) {
      this.mostrarToast('Error', 'Repita su correo', true);
      return;
    }

    this.correoverif = this.correoverif.trim();

    if (this.correo != this.correoverif) {
      this.mostrarToast(
        'Error',
        'El corrreo ingresado y su repetición no coinciden',
        true
      );
      return;
    }

    let req = {
      correo: this.correo,
    };

    console.log(req);

    this.authHttp.post(
      '/userapp/recuperarpass/',
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

        this._location.back();

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
}
