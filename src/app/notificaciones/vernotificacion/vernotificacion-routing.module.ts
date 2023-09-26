import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VernotificacionPage } from './vernotificacion.page';

const routes: Routes = [
  {
    path: '',
    component: VernotificacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VernotificacionPageRoutingModule {}
