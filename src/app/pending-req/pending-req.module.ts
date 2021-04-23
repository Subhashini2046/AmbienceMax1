import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { PendingReqPageRoutingModule } from './pending-req-routing.module';

import { PendingReqPage } from './pending-req.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2SearchPipeModule,
    PendingReqPageRoutingModule
  ],
  declarations: [PendingReqPage]
})
export class PendingReqPageModule {}
