import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BiometricoPage } from './biometrico.page';

const routes: Routes = [
  {
    path: '',
    component: BiometricoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BiometricoPageRoutingModule {}
