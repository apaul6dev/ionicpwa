import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VecinosPage } from './vecinos.page';

const routes: Routes = [
  {
    path: '',
    component: VecinosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VecinosPageRoutingModule {}
