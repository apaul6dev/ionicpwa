import { DatePipe } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilitariosService {
  constructor(
    private storage: Storage,
    private toastCtrl: ToastController,
    private zone: NgZone
  ) {}

  /***
   * Metodo que ordena una lista
   * lista, clave, orden (asc,  desc)
   */
  ordernarLista(lista, key, order = 'asc') {
    if (!lista || lista.length == 0) {
      return lista;
    }
    return lista.sort((a, b) => {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order === 'desc' ? comparison * -1 : comparison;
    });
  }

  guardarListaDatosEnStorage(
    nombreEnStorage: string,
    lista,
    claveObjeto = 'id'
  ) {
    if (!lista || !nombreEnStorage || !claveObjeto) {
      return;
    }
    let listaAux = [...lista];
    this.ordernarLista(listaAux, claveObjeto, 'desc');

    let salida = [];

    listaAux.forEach((obj) => {
      if (obj[claveObjeto]) {
        if (!obj.since) {
          obj.since = new Date();
        }

        if (!this.registroViejo(obj)) {
          //  console.log('pasa');
          salida.push(obj);
        } else {
          // console.log('No pasa.. Muy viejo');
        }
      }
    });

    this.storage.set(nombreEnStorage, salida);
  }

  private registroViejo(obj): boolean {
    let diff = Math.abs(new Date().getTime() - obj.since.getTime());
    let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    // console.log(obj);
    //  console.log('La diferencia de dias con la fecha actual es: ' + diffDays);

    return diffDays > 15;
  }

  handleError(datos): boolean {
    if (!datos) {
      this.mostrarToast(
        'Error',
        'Ocurrio un error, verifique su conexión',
        true
      );
      this.zone.run(() => {
        console.log('force update the screen');
      });
      return true;
    }

    if (datos.estado != 'OK') {
      this.mostrarToast(
        datos.titulo || 'Error',
        datos.mensaje || 'Ocurrio un error, verifique su conexión',
        true
      );
      this.zone.run(() => {
        console.log('force update the screen');
      });
      return true;
    }

    return false;
  }

  mostrarToast(titulo, mensaje, error) {
    this.toastCtrl
      .create({
        header: titulo,
        message: mensaje,
        duration: 2500,
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

  dateTransformToRelativeTime(value: number | string) {
    try {
      if (!value) return 'NO_TIME';
      return this.timeDifference(new Date(), new Date(value));
    } catch (error) {}

    return value + '';
  }

  /**
   * @param  {date} current
   * @param  {date} previous
   * @return {string}
   */
  timeDifference(current, previous): string {
    console.log(previous);

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;
    //console.log(current);
    //console.log(previous);

    if (elapsed < msPerMinute) {
      if (Math.round(elapsed / 1000) < 3) return 'Justo ahora';
      return 'Hace ' + Math.round(elapsed / 1000) + ' segundos';
    } else if (elapsed < msPerHour) {
      let tiempo = Math.round(elapsed / msPerMinute);
      if (tiempo == 1) {
        return 'Hace ' + tiempo + ' minuto';
      } else {
        return 'Hace ' + tiempo + ' minutos';
      }
    } else if (elapsed < msPerDay) {
      let tiempo = Math.round(elapsed / msPerHour);
      if (tiempo == 1) {
        return 'Hace ' + tiempo + ' hora';
      } else {
        return 'Hace ' + tiempo + ' horas';
      }
    } else if (elapsed < msPerMonth) {
      if (Math.round(elapsed / msPerDay) == 1)
        return (
          'Ayer a las ' + previous.getHours() + ':' + previous.getMinutes()
        );

      return 'Hace ' + Math.round(elapsed / msPerDay) + ' días';
    } else {
      /*  else if (elapsed < msPerYear) {
        return 'about ' + Math.round(elapsed/msPerMonth) + ' month ago';
      }*/
      return this.dateFormat(previous);
    }
  }

  dateFormat(value): string {
    var datePipe = new DatePipe('en-US');
    value = datePipe.transform(value, 'dd-MM-yyyy HH:mm');
    return value;
  }
}
