export class AlertaVecinoModel {
  id: number;
  usuarioid: number;
  nombres: string;
  avatar: string;
  fecha: number | string;
  mensaje: string;
  alertaid: number;
  nombrealerta: string;
  iconoalerta: string;
  latitud?: string;
  longitud?: string;
  encendida: boolean;
  titulo: string;
}
