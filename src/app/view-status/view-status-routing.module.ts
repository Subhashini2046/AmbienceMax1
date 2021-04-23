import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewStatusPage } from './view-status.page';

const routes: Routes = [
  {
    path: '',
    component: ViewStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewStatusPageRoutingModule {}
