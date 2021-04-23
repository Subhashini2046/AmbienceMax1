import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClosedReqPage } from './closed-req.page';

const routes: Routes = [
  {
    path: '',
    component: ClosedReqPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClosedReqPageRoutingModule {}
