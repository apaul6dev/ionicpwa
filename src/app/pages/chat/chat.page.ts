import { Storage } from '@ionic/storage';
import { UtilitariosService } from './../../services/utilitarios.service';
import { AuthHttpService } from './../../services/auth-http.service';
import { QueryModel } from './../../model/query.model';
import { EventosService } from './../../services/eventos.service';
import { ChatMessage } from './../../model/chat-message.model.';
import { IonInfiniteScroll, Platform, PopoverController } from '@ionic/angular';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { LoginModel } from './../../model/login.model';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  NgZone,
} from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { PopsubmenuComponent } from 'src/app/componentes/popsubmenu/popsubmenu.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {
  loginModel: LoginModel;

  //Variable que indica si tenemos más resultados
  hayMasResultados = true;
  //Numero de pagina de resultados a consultar
  pagina = 1;

  exito = false;
  fakeUsers: Array<any> = new Array(5);

  @ViewChild('content') content: any;
  @ViewChild('chat_input') messageInput: ElementRef;

  @ViewChild(IonInfiniteScroll) infiniteScrollA: IonInfiniteScroll;

  chao = false;

  msgList: ChatMessage[] = [];
  user;
  editorMsg = '';
  showEmojiPicker = false;

  emojis = [];

  cusuario = -1;
  nombres = '';

  suscriptor = null;

  suscriptorResume = null;

  suscriptorRefresh = null;

  intervaloUpdateClock = null;

  urlListaMensajes = '/mensajeria/mensajeschat/';
  urlEnviarMensaje = '/mensajeria/enviarmensaje/';

  inicializado = false;

  constructor(
    private eventos: EventosService,
    private authHttp: AuthHttpService,
    private zone: NgZone,
    private platform: Platform,
    private utilitarios: UtilitariosService,
    private storage: Storage,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.storage
      .get('mensajes')
      .then((a) => {
        console.log(a);
        this.exito = true;
        if (a && a.length > 0) {
          try {
            this.zone.run(() => {
              this.msgList = a;

              this.msgList.forEach((msg) => {
                msg.relativetime = this.utilitarios.dateTransformToRelativeTime(
                  msg.fcreacion
                );
              });

              console.log('force update the screen');
            });
          } catch (error) {
            console.error(error);
          }
        }
      })
      .finally(() => {
        console.log('Finally from db');

        this.getMensajes();
      });

    this.suscriptor = this.eventos.chatEvent.subscribe((msg) => {
      console.log('Tnego un nuevo mensaje');
      this.zone.run(() => {
        console.log('force update the screen mensaje nuevooooo');

        let obj = JSON.parse(msg);
        obj.estado = 'success';

        this.pushNewMsg(obj);
      });
    });

    this.suscriptorResume = this.platform.resume.subscribe((result) => {
      this.zone.run(() => {
        console.log('force update the screen refreshh');

        this.refrescarUltimosMensajes();
      });
    });

    this.suscriptorRefresh = this.eventos.refreshChat.subscribe((result) => {
      this.zone.run(() => {
        if (this.inicializado) {
          console.log('Refreshh..');

          this.refrescarUltimosMensajes();
        }
      });
    });

    this.intervaloUpdateClock = setInterval(() => {
      if (this.msgList) {
        this.msgList.forEach((a) => {
          a.avatar = Math.random().toString(36).substring(2);
          a.relativetime = this.utilitarios.dateTransformToRelativeTime(
            a.fcreacion
          );
        });
      }
      this.zone.run(() => {
        console.log('force update the screen');
      });
    }, 1000 * 60);
  }

  ionViewWillLeave() {
    // unsubscribe

    console.log('Willl leaveeeeeeeeeeeee');

    try {
      if (this.suscriptor) {
        this.suscriptor.unsubscribe();
      }
    } catch (error) {
      console.error(error);
    }

    try {
      if (this.suscriptorResume) {
        this.suscriptorResume.unsubscribe();
      }
    } catch (error) {
      console.error(error);
    }

    try {
      if (this.suscriptorRefresh) {
        this.suscriptorRefresh.unsubscribe();
      }
    } catch (error) {
      console.error(error);
    }

    try {
      clearInterval(this.intervaloUpdateClock);
    } catch (error) {
      console.error(error);
    }
  }

  ionViewDidEnter() {
    //get message list

    if (this.infiniteScrollA) {
      this.infiniteScrollA.disabled = true;
    }

    // Subscribe to received  new message events
  }

  /**
   * @name getMsg
   * @returns {Promise<ChatMessage[]>}
   */
  getMensajes() {
    const solicitud: QueryModel = {
      id: null,
      pagina: this.pagina,
    };

    this.authHttp.post(
      this.urlListaMensajes,
      solicitud,
      (respuesta) => {
        this.inicializado = true;
        this.exito = true;
        if (this.utilitarios.handleError(respuesta)) {
          return;
        }

        if (!respuesta.data) {
          return;
        }

        let datos = respuesta.data;

        datos.forEach((element) => {
          if (element.yo && element.cusuario) {
            this.nombres = element.nombres;
            this.cusuario = element.cusuario;
          }

          element.relativetime = this.utilitarios.dateTransformToRelativeTime(
            element.fcreacion
          );
        });

        if (this.pagina > 1) {
          datos.forEach((item) => {
            this.addMessageToList(item);
          });
          this.pagina += 1;
        } else {
          console.log('priemra pagina....');

          datos.forEach((item) => {
            this.addMessageToList(item);
          });
          this.pagina += 1;
          this.scrollToBottom();
          setTimeout(() => {
            if (this.chao) {
              return;
            }
            if (this.infiniteScrollA) {
              this.infiniteScrollA.disabled = false;
            }
          }, 1000);

          //  this.animarInicio()
        }
        let count = Object.keys(datos).length;
        if (count === 0) {
          this.hayMasResultados = false;
        } else {
          this.hayMasResultados = true;
        }

        this.utilitarios.ordernarLista(this.msgList, 'cmensaje', 'desc');

        if (this.msgList.length > 0) {
          this.utilitarios.guardarListaDatosEnStorage('mensajes', this.msgList);
        }

        this.zone.run(() => {
          console.log('force update the screen');
        });
      },
      (error) => {
        this.exito = true;
        console.log('Error:' + error);
      }
    );
  }

  refrescarUltimosMensajes() {
    const solicitud: QueryModel = {
      id: null,
      pagina: 1,
    };

    this.authHttp.post(
      this.urlListaMensajes,
      solicitud,
      (respuesta) => {
        if (this.utilitarios.handleError(respuesta)) {
          return;
        }

        if (!respuesta.data) {
          return;
        }

        let datos = respuesta.data;

        this.utilitarios.ordernarLista(datos, 'cmensaje', 'asc');

        datos.forEach((element) => {
          if (element.yo && element.cusuario) {
            this.nombres = element.nombres;
            this.cusuario = element.cusuario;
          }

          this.addMessageToList(element);
        });

        this.utilitarios.ordernarLista(this.msgList, 'cmensaje', 'desc');

        if (this.msgList.length > 0) {
          this.utilitarios.guardarListaDatosEnStorage('mensajes', this.msgList);
        }

        this.scrollToBottom();
        this.zone.run(() => {
          console.log('force update the screen');
        });
      },
      (error) => {
        console.log('Error:' + error);
      }
    );
  }

  /**
   * @name sendMsg
   */

  sendMsg() {
    if (!this.editorMsg.trim()) return;

    // Mock message
    let newMsg: ChatMessage = {
      nombres: this.nombres,
      avatar: '',
      fcreacion: Date.now(),
      texto: this.editorMsg.trim(),
      estado: 'pending',
      yo: true,
      tracker: Math.random().toString(36).substring(2),
    };

    this.editorMsg = '';

    this.pushNewMsg(newMsg);

    this.authHttp.post(
      this.urlEnviarMensaje,
      newMsg,
      (respuesta) => {
        if (this.utilitarios.handleError(respuesta)) {
          newMsg.estado = 'fail';
          return;
        }

        if (respuesta && respuesta.data) {
          this.pushNewMsg(respuesta.data);
        }
      },
      (error) => {
        newMsg.estado = 'fail';
      }
    );
  }

  /**
   * @name pushNewMsg
   * @param msg
   */

  addMessageToList(msg: ChatMessage) {
    if (!msg || !msg.cmensaje) {
      return;
    }

    if (this.msgList.filter((a) => a.cmensaje == msg.cmensaje).length == 0) {
      msg.estado = 'success';
      this.msgList.push(msg);
      msg.relativetime = this.utilitarios.dateTransformToRelativeTime(
        msg.fcreacion
      );
    }
  }

  pushNewMsg(msg: ChatMessage) {
    if (this.chao) {
      return;
    }

    console.log(msg);

    if (msg) {
      if (msg.cusuario && this.cusuario && this.cusuario == msg.cusuario) {
        msg.yo = true;
      }
      for (let index = 0; index < this.msgList.length; index++) {
        let element = this.msgList[index];
        if (element.tracker && msg.tracker && element.tracker == msg.tracker) {
          msg.estado = 'success';
          msg.relativetime = this.utilitarios.dateTransformToRelativeTime(
            msg.fcreacion
          );
          this.msgList[index] = msg;
          this.zone.run(() => {
            console.log('force update the screen');
          });

          this.utilitarios.guardarListaDatosEnStorage('mensajes', this.msgList);
          return;
        }
      }

      if (this.msgList.filter((a) => a.cmensaje == msg.cmensaje).length == 0) {
        msg.relativetime = this.utilitarios.dateTransformToRelativeTime(
          msg.fcreacion
        );
        this.msgList.unshift(msg);
      }

      this.utilitarios.guardarListaDatosEnStorage('mensajes', this.msgList);

      this.scrollToBottom();
      this.zone.run(() => {
        console.log('force update the screen');
      });
    }
  }

  ngOnDestroy() {
    this.chao = true;



    try {
      if (this.suscriptor) {
        this.suscriptor.unsubscribe();
      }
    } catch (error) {
      console.error(error);
    }

    try {
      if (this.suscriptorResume) {
        this.suscriptorResume.unsubscribe();
      }
    } catch (error) {
      console.error(error);
    }

    try {
      if (this.suscriptorRefresh) {
        this.suscriptorRefresh.unsubscribe();
      }
    } catch (error) {
      console.error(error);
    }

    try {
      clearInterval(this.intervaloUpdateClock);
    } catch (error) {
      console.error(error);
    }
  }

  scrollToBottom() {
    if (!this.content) {
      return;
    }
    window.dispatchEvent(new Event('resize'));
    setTimeout(() => {
      if (this.chao) {
        return;
      }
      if (this.content) {
        this.content.scrollToBottom(300);
      }
    }, 400);
  }

  scrollToMiddle() {
    if (!this.content) {
      return;
    }
    window.dispatchEvent(new Event('resize'));
    setTimeout(() => {
      if (this.chao) {
        return;
      }
      if (this.content) {
        this.content.scrollToPoint(0, 200, 500);
      }
    }, 1000);
  }

  doInfinite(event) {
    this.getMensajes();
    this.scrollToMiddle();
    setTimeout(() => {
      if (this.chao) {
        return;
      }
      event.target.complete();
      this.infiniteScrollA.disabled = !this.hayMasResultados;
    }, 1000);
  }

  doRefresh(refresher) {
    //  this.pagina = 1;
    this.hayMasResultados = true;
    if (this.infiniteScrollA) {
      this.infiniteScrollA.disabled = !this.hayMasResultados;
    }

    console.log('Ahi vamos...');

    this.refrescarUltimosMensajes();

    setTimeout(() => {
      refresher.target.complete();
    }, 1000);
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
