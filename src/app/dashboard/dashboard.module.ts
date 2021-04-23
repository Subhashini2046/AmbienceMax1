import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { DashboardPopoverComponent } from '../dashboard-popover/dashboard-popover.component';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    ChartsModule
  ],
  entryComponents:[DashboardPopoverComponent],
  declarations: [DashboardPage, DashboardPopoverComponent]
})
export class DashboardPageModule {}
