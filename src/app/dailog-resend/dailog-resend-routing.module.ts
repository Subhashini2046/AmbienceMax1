import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailogResendPage } from './dailog-resend.page';

const routes: Routes = [
  {
    path: '',
    component: DailogResendPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailogResendPageRoutingModule {}
