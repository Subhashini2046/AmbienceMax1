import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { OpenReqPageRoutingModule } from './open-req-routing.module';

import { OpenReqPage } from './open-req.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2SearchPipeModule,
    OpenReqPageRoutingModule
  ],
  declarations: [OpenReqPage]
})
export class OpenReqPageModule {}
