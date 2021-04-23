import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResendRequestPageRoutingModule } from './resend-request-routing.module';

import { ResendRequestPage } from './resend-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResendRequestPageRoutingModule
  ],
  declarations: [ResendRequestPage]
})
export class ResendRequestPageModule {}
