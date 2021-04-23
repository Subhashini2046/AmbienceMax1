import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddReqPageRoutingModule } from './add-req-routing.module';

import { AddReqPage } from './add-req.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddReqPageRoutingModule
  ],
  declarations: [AddReqPage]
})
export class AddReqPageModule {}
