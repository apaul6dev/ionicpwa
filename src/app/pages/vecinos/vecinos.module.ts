import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VecinosPageRoutingModule } from './vecinos-routing.module';

import { VecinosPage } from './vecinos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VecinosPageRoutingModule
  ],
  declarations: [VecinosPage]
})
export class VecinosPageModule {}
