import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActualizarpassPageRoutingModule } from './actualizarpass-routing.module';

import { ActualizarpassPage } from './actualizarpass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActualizarpassPageRoutingModule
  ],
  declarations: [ActualizarpassPage]
})
export class ActualizarpassPageModule {}
