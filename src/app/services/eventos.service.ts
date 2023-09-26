import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventosService {
  public listaEventos = new Subject<string>();
  public chatEvent = new Subject<string>();
  public refreshChat = new Subject<string>();
  public ubicacion = new Subject<any>();

  constructor() {}
}
