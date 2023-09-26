import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CercoComponent } from '../componentes/cerco/cerco.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuertaComponent } from '../componentes/puerta/puerta.component';
import { PipesModule } from '../pipes/pipes.module';
import { PopsubmenuComponent } from '../componentes/popsubmenu/popsubmenu.component';

@NgModule({
  declarations: [PuertaComponent, CercoComponent, PopsubmenuComponent],
  exports: [PuertaComponent, CercoComponent, PopsubmenuComponent],
  imports: [IonicModule, CommonModule, FormsModule, PipesModule, IonicModule],
})
export class GlobalModule {}
