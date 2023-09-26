import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualizarpassPage } from './actualizarpass.page';

const routes: Routes = [
  {
    path: '',
    component: ActualizarpassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualizarpassPageRoutingModule {}
