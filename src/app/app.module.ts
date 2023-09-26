import { GlobalModule } from './global/global.module';
import { PipesModule } from './pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { UtilitariosService } from './services/utilitarios.service';
import { EventosService } from './services/eventos.service';
import { AuthService } from './services/auth.service';
import { AuthHttpService } from './services/auth-http.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage-angular';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppLauncher } from '@ionic-native/app-launcher/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HTTP } from '@ionic-native/http/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    GlobalModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthHttpService,
    HTTP,
    AuthService,
    EventosService,
    UtilitariosService,
    Geolocation,
    AppLauncher,
    UniqueDeviceID,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
