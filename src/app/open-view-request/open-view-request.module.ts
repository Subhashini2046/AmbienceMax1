import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpenViewRequestPageRoutingModule } from './open-view-request-routing.module';

import { OpenViewRequestPage } from './open-view-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpenViewRequestPageRoutingModule
  ],
  declarations: [OpenViewRequestPage]
})
export class OpenViewRequestPageModule {}
