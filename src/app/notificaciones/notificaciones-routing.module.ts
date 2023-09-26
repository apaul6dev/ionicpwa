import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificacionesPage } from './notificaciones.page';

const routes: Routes = [
  {
    path: '',
    component: NotificacionesPage
  },
  {
    path: 'vernotificacion',
    loadChildren: () => import('./vernotificacion/vernotificacion.module').then( m => m.VernotificacionPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificacionesPageRoutingModule {}
