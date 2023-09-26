import { AuthHttpService } from './services/auth-http.service';
import { EventosService } from './services/eventos.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

import { Component, OnInit, OnDestroy } from '@angular/core';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

import { NativeAudio } from '@capacitor-community/native-audio';

import { Storage } from '@ionic/storage';
import { Capacitor } from '@capacitor/core';



const isPushNotificationsAvailable =
  Capacitor.isPluginAvailable('PushNotifications');

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    public router: Router,
    private storage: Storage,
    private authService: AuthService,
    private authHttp: AuthHttpService,
    public eventos: EventosService
  ) {}
  ngOnDestroy(): void {
    NativeAudio.unload({
      assetId: 'modosmart',
    });
  }

  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    await this.storage.create();

    if (isPushNotificationsAvailable) {
      this.iniciarPushNotifications();
    }

    await this.authService.recargarUsuario();

    await await this.storage.get('loginModel').then((loginModel) => {
      console.log('Data recuperada..');
    });

    console.log('aaaaaaaaaaaaaaaaa');

    setTimeout(() => {
      this.cargarSonidosEnMemoria();
    }, 500);
  }

  cargarSonidosEnMemoria() {
    console.log('Loading notifications');

    try {
      NativeAudio.preload({
        assetId: 'notificacion',
        assetPath: 'public/assets/modosmart.mp3',
        audioChannelNum: 1,
        isUrl: false,
      });

      NativeAudio.preload({
        assetId: 'chat',
        assetPath: 'public/assets/chat.mp3',
        audioChannelNum: 2,
        isUrl: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  iniciarPushNotifications() {
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    PushNotifications.createChannel({
      description: 'Notificaciones Modosmart',
      id: 'fcm_default_channel',
      importance: 5,
      lights: true,
      name: 'ModosmartChannel',
      sound: 'modosmart.mp3',
      vibration: true,
      visibility: 1,
    })
      .then(() => {
        console.log('push channel fcm created: ok');
      })
      .catch((error) => {
        console.log(error);
      });

    PushNotifications.createChannel({
      description: 'Notificaciones Modosmart',
      id: 'channelapp',
      importance: 5,
      lights: true,
      name: 'channelapp',
      sound: 'modosmart.mp3',
      vibration: true,
      visibility: 1,
    })
      .then(() => {
        console.log('push channel channelapp created: ok');
      })
      .catch((error) => {
        console.log(error);
      });

    let a = 1;
    PushNotifications.addListener('registration', (token: Token) => {
      a++;
      console.log(a + ') Push registration success');
      console.log('Firebase: ' + token.value);

      this.storage.set('firebase', token.value);
      this.authService.firebaseToken = token.value;
      setTimeout(() => {
        this.enviarFirebaseToken();
      }, 2000);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Push Error on registration.');
    });
    const that = this;

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));

        let contenido = null;
        try {
          if (notification.data && notification.data.contenido) {
            contenido = JSON.parse(notification.data.contenido);
          }
        } catch (error) {
          console.log(error);
        }

        if (contenido && contenido.type == 'event') {
          this.playSoundNotification();
          this.eventos.listaEventos.next('update');
          console.log('Eventos actualizando.. emitiendo');
        } else {
          console.log('No se emite actualizacion');
        }

        if (contenido && contenido.type == 'msg') {
          this.playSoundChat();
          this.eventos.chatEvent.next(notification.data.contenido);
          console.log('evento chat');
        }
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification));

        let contenido = null;
        try {
          if (
            notification.notification.data &&
            notification.notification.data.contenido
          ) {
            contenido = JSON.parse(notification.notification.data.contenido);
          }
        } catch (error) {
          console.log(error);
        }

        if (contenido && contenido.type == 'event') {
          this.eventos.listaEventos.next('update');
          console.log('Eventos actualizando');
          this.playSoundNotification();
        } else {
          console.log('No se emite actualizacion');
        }

        if (contenido && contenido.type == 'msg') {
          setTimeout(() => {
            console.log('bbb');
            this.router.navigateByUrl('/tabs/chat');
            setTimeout(() => {
              this.eventos.chatEvent.next(
                notification.notification.data.contenido
              );
              this.eventos.refreshChat.next('chat');
            }, 200);
          }, 1000);
        }

        if (contenido && contenido.type == 'event') {
          setTimeout(() => {
            console.log('ccc');
            this.router.navigateByUrl('/tabs/notificaciones');

            setTimeout(() => {
              this.eventos.chatEvent.next(
                notification.notification.data.contenido
              );
              this.eventos.listaEventos.next('update');
            }, 200);
          }, 1000);
        }
      }
    );
  }

  playSoundNotification() {
    try {
      NativeAudio.play({
        assetId: 'notificacion',
        time: 0,
      });
    } catch (error) {
      console.log(error);
    }
  }

  playSoundChat() {
    try {
      NativeAudio.play({
        assetId: 'chat',
        time: 0,
      });
    } catch (error) {
      console.log(error);
    }
  }

  enviarFirebaseToken() {
    try {
      if (this.authService.loginModel && this.authService.firebaseToken) {
        const solicitud: any = {};
        solicitud.query = new Date().getTime() + '';
        solicitud.device = this.authService.firebaseToken;
        solicitud.uuid = 'UP';

        const defaultParamURL = '/app/dragonfire';

        this.authHttp.post(
          defaultParamURL,
          solicitud,
          (datos) => {},
          (error) => {}
        );
      } else {
        console.log('Nada para enviar');
      }
    } catch (error) {
      console.error(error);
    }
  }
}
