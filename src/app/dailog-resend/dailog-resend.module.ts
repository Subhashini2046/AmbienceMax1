import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DailogResendPageRoutingModule } from './dailog-resend-routing.module';

import { DailogResendPage } from './dailog-resend.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DailogResendPageRoutingModule
  ],
  declarations: [DailogResendPage]
})
export class DailogResendPageModule {}
