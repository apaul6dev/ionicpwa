import { PipesModule } from './../../pipes/pipes.module';
import { RelativeTimePipe } from './../../pipes/relative-time.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VernotificacionPageRoutingModule } from './vernotificacion-routing.module';

import { VernotificacionPage } from './vernotificacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    VernotificacionPageRoutingModule,
  ],
  declarations: [VernotificacionPage],
})
export class VernotificacionPageModule {}
