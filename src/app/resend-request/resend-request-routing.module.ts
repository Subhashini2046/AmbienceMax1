import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResendRequestPage } from './resend-request.page';

const routes: Routes = [
  {
    path: '',
    component: ResendRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResendRequestPageRoutingModule {}
