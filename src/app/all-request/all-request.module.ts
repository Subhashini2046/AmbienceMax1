import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AllRequestPageRoutingModule } from './all-request-routing.module';

import { AllRequestPage } from './all-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2SearchPipeModule,
    AllRequestPageRoutingModule
  ],
  declarations: [AllRequestPage]
})
export class AllRequestPageModule {}
