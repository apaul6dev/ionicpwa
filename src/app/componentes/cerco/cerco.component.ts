import { UtilitariosService } from './../../services/utilitarios.service';
import { Router } from '@angular/router';
import { AuthHttpService } from './../../services/auth-http.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, Input, NgZone } from '@angular/core';

@Component({
  selector: 'app-cerco',
  templateUrl: './cerco.component.html',
  styleUrls: ['./cerco.component.scss'],
})
export class CercoComponent implements OnInit {
  @Input() dispositivo: any = {};

  @Input() coordenadas: any = { latitud: null, longitud: null };



  listadeaudios = [];



  constructor(
    public authService: AuthService,
    private authHttp: AuthHttpService,
    private zone: NgZone,
    private router: Router,
    private utilitarios: UtilitariosService
  ) { }

  ngOnInit() {





    if (this.dispositivo.controlaudio) {


      for (let index = 1; index <= this.dispositivo.controlnumeroaudios; index++) {
        const element = {
          audioid: index, iconoff: `../../../assets/iconos/appbtnapagar${index}.png`,
          iconon: `../../../assets/iconos/appbtnencender${index}.png`,
          size: 5
        };

        this.listadeaudios.push(element);
      }
    }
    const perifoneoelm = {
      audioid: 10, iconoff: '../../../assets/iconos/perifoneooff.png',
      iconon: '../../../assets/iconos/perifoneoon.png',
      size: 8
    };

    if (this.dispositivo.controlperifoneo) {
      this.listadeaudios.push(perifoneoelm);


    }

  }

  encender() {
    this.dispositivo.energizado = 1;
    this.dispositivo.accion = 'energizado';
    this.cambiarEstado();
  }

  apagar() {
    this.dispositivo.energizado = 0;
    this.dispositivo.accion = 'energizado';
    this.cambiarEstado();
  }

  abrir() {
    this.dispositivo.abierto = 1;
    this.dispositivo.accion = 'abierto';
    this.cambiarEstado();
  }

  cerrar() {
    this.dispositivo.abierto = 0;
    this.dispositivo.accion = 'abierto';
    this.cambiarEstado();
  }

  audio(numero) {
    this.dispositivo.audio = numero;
    this.dispositivo.accion = 'audio';
    console.log(this.dispositivo);

    this.cambiarEstado();
  }

  cambiarEstado() {
    this.dispositivo.latitud = this.coordenadas.latitud;
    this.dispositivo.longitud = this.coordenadas.longitud;
    this.authHttp.post(
      '/controlDispositivos/smartboxaction/',
      this.dispositivo,
      (datos) => {
        if (this.utilitarios.handleError(datos)) {
          console.log('Error');
          return;
        }

        this.utilitarios.mostrarToast(
          datos.titulo || 'Correcto',
          datos.mensaje || 'Dispositivo actualizado',
          false
        );

        console.log(datos);
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

  encender1(val) {
    this.dispositivo.encendido1 = val;
    this.dispositivo.accion = 'encendido1';
    this.cambiarEstado();
  }

  encender2(val) {
    this.dispositivo.encendido2 = val;
    this.dispositivo.accion = 'encendido2';
    this.cambiarEstado();
  }

  encender3(val) {
    this.dispositivo.encendido3 = val;
    this.dispositivo.accion = 'encendido3';
    this.cambiarEstado();
  }

  armar(val) {
    this.dispositivo.armado = val;
    this.dispositivo.accion = 'armado';
    this.cambiarEstado();
  }


  setAuxiliar(val) {
    this.dispositivo.auxiliar = val;
    this.dispositivo.accion = 'auxiliar';
    this.cambiarEstado();
  }




}
