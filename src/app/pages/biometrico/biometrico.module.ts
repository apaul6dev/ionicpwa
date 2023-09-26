import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BiometricoPageRoutingModule } from './biometrico-routing.module';

import { BiometricoPage } from './biometrico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BiometricoPageRoutingModule
  ],
  declarations: [BiometricoPage]
})
export class BiometricoPageModule {}
