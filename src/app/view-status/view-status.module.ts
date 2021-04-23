import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewStatusPageRoutingModule } from './view-status-routing.module';

import { ViewStatusPage } from './view-status.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewStatusPageRoutingModule
  ],
  declarations: [ViewStatusPage]
})
export class ViewStatusPageModule {}
