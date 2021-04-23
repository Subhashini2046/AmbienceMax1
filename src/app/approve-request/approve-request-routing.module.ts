import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApproveRequestPage } from './approve-request.page';

const routes: Routes = [
  {
    path: '',
    component: ApproveRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApproveRequestPageRoutingModule {}
