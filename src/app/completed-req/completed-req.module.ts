import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { CompletedReqPageRoutingModule } from './completed-req-routing.module';

import { CompletedReqPage } from './completed-req.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2SearchPipeModule,
    CompletedReqPageRoutingModule
  ],
  declarations: [CompletedReqPage]
})
export class CompletedReqPageModule {}
