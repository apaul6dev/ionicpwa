import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-puerta',
  templateUrl: './puerta.component.html',
  styleUrls: ['./puerta.component.scss'],
})
export class PuertaComponent implements OnInit {
  @Input('dispositivo') dispositivo: any = {};

  constructor() {}

  ngOnInit() {}
}
