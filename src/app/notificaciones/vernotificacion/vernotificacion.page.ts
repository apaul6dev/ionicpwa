import { Router } from '@angular/router';

import { Component, OnInit } from '@angular/core';

//import leaflet from 'leaflet';
import * as leaflet from 'leaflet';

import { Share } from '@capacitor/share';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-vernotificacion',
  templateUrl: './vernotificacion.page.html',
  styleUrls: ['./vernotificacion.page.scss'],
})
export class VernotificacionPage implements OnInit {
  item;

  latitud = -2.8987635;
  longitud = -79.006287;

  latitudCentro = -2.8987635;
  longitudCentro = -79.006287;
  direccionPosible = '';

  iconRetinaUrl = 'assets/icon/marker-icon-2x.png';
  iconUrl = 'assets/icon/marker-icon.png';
  shadowUrl = 'assets/icon/marker-shadow.png';
  constructor(private router: Router, public platform: Platform) {
    let navParams = this.router.getCurrentNavigation().extras.state;
    if (navParams) {
      this.item = navParams;
    }

    console.log(this.item);
  }

  ngOnInit() { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadmap();
    }, 500);
  }

  chao = false;
  markerCentro = null;

  map = null;
  loadmap() {
    console.log('AHI vamos 111');

    if (this.chao) {
      return;
    }

    if (!this.item || this.item.latitud == null || this.item.longitud == null) {
      return;
    }

    this.markerCentro = leaflet.marker(
      [this.item.latitud, this.item.longitud],
      {
        icon: leaflet.icon({
          iconSize: [25, 41],
          iconAnchor: [13, 41],
          iconUrl: this.iconUrl,
          shadowUrl: this.shadowUrl,
          iconRetinaUrl: this.iconRetinaUrl,
        }),
      }
    );

    let element = document.getElementById('mapaReferencia');
    this.map = leaflet
      .map(element)
      .setView([this.item.latitud, this.item.longitud], 14);
    leaflet
      .tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      })
      .addTo(this.map);

    console.log('AHI vamos 3333');

    this.map.addLayer(this.markerCentro);

    setTimeout(() => {
      if (this.chao) {
        return;
      }
      this.posicionarMapa();
    }, 100);
  }

  posicionarMapa() {
    if (!this.map) {
      return;
    }
    //

    /*  try {
      this.map.setView([this.latitud, this.longitud], 14);
    } catch (error) {
      console.log('Error getting location', error);
    }*/

    this.map.invalidateSize();
  }

  comoLlegar() {
    // android
    if (this.platform.is('android')) {
      window.open(
        'geo://' +
        this.item.latitud +
        ',' +
        this.item.longitud +
        '?q=' +
        this.item.latitud +
        ',' +
        this.item.longitud +
        '(' +
        this.item.mensaje +
        ')',
        '_system'
      );
    }

    if (this.platform.is('ios')) {
      window.open(
        'maps://?q=' +

        this.item.latitud +
        ',' +
        this.item.longitud,
        '_system'
      );
    }
  }


  compartir() {
    Share.share({
      title: 'Modo Smart',
      text: this.item.textocompartir ? this.item.textocompartir : this.item.mensaje,
      url: 'https://www.google.com/maps/search/?api=1&query=' + this.item.latitud + ',' + this.item.longitud,
      dialogTitle: 'Compatir',
    });
  }


}
