import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApproveRequestPageRoutingModule } from './approve-request-routing.module';

import { ApproveRequestPage } from './approve-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApproveRequestPageRoutingModule
  ],
  declarations: [ApproveRequestPage]
})
export class ApproveRequestPageModule {}
