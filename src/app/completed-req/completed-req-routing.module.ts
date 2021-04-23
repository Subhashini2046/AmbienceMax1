import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompletedReqPage } from './completed-req.page';

const routes: Routes = [
  {
    path: '',
    component: CompletedReqPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompletedReqPageRoutingModule {}
