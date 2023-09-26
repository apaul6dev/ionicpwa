import { GlobalModule } from '../../global/global.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DispositivosPageRoutingModule } from './dispositivos-routing.module';

import { DispositivosPage } from './dispositivos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DispositivosPageRoutingModule,
    GlobalModule,
  ],
  declarations: [DispositivosPage],
})
export class DispositivosPageModule {}
