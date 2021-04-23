import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpenReqPage } from './open-req.page';

const routes: Routes = [
  {
    path: '',
    component: OpenReqPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpenReqPageRoutingModule {}
