import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewStatusRequestsPageRoutingModule } from './view-status-requests-routing.module';

import { ViewStatusRequestsPage } from './view-status-requests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewStatusRequestsPageRoutingModule
  ],
  declarations: [ViewStatusRequestsPage]
})
export class ViewStatusRequestsPageModule {}
