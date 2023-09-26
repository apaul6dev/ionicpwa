import { ChatPageModule } from './../pages/chat/chat.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    canActivate: [AuthGuard],
    component: TabsPage,
    children: [
      {
        path: 'inicio',
        loadChildren: () =>
          import('../pages/inicio/inicio.module').then(
            (m) => m.InicioPageModule
          ),
      },
      {
        path: 'dispositivos',
        loadChildren: () =>
          import('../pages/dispositivos/dispositivos.module').then(
            (m) => m.DispositivosPageModule
          ),
      },
      {
        path: 'notificaciones',
        loadChildren: () =>
          import('../notificaciones/notificaciones.module').then(
            (m) => m.NotificacionesPageModule
          ),
      },

      {
        path: 'chat',
        loadChildren: () =>
          import('../pages/chat/chat.module').then((m) => m.ChatPageModule),
      },
      {
        path: 'biometrico',
        loadChildren: () =>
          import('../pages/biometrico/biometrico.module').then(
            (m) => m.BiometricoPageModule
          ),
      },
      {
        path: 'comunidad',
        loadChildren: () =>
          import('../pages/vecinos/vecinos.module').then(
            (m) => m.VecinosPageModule
          ),
      },

      {
        path: 'cuenta',
        loadChildren: () =>
          import('../pages/cuenta/cuenta.module').then(
            (m) => m.CuentaPageModule
          ),
      },
      {
        path: 'ayuda',
        loadChildren: () =>
          import('../pages/ayuda/ayuda.module').then(
            (m) => m.AyudaPageModule
          ),
      },
      {
        path: 'actualizarpass',
        loadChildren: () =>
          import('../pages/actualizarpass/actualizarpass.module').then(
            (m) => m.ActualizarpassPageModule
          ),
      },
      {
        path: '',
        redirectTo: '/tabs/inicio',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/inicio',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
