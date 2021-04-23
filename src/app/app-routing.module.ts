import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'add-req',
    loadChildren: () => import('./add-req/add-req.module').then( m => m.AddReqPageModule)
  },
  {
    path: 'all-request',
    loadChildren: () => import('./all-request/all-request.module').then( m => m.AllRequestPageModule)
  },
  {
    path: 'pending-req',
    loadChildren: () => import('./pending-req/pending-req.module').then( m => m.PendingReqPageModule)
  },
  {
    path: 'closed-req',
    loadChildren: () => import('./closed-req/closed-req.module').then( m => m.ClosedReqPageModule)
  },
  {
    path: 'open-req',
    loadChildren: () => import('./open-req/open-req.module').then( m => m.OpenReqPageModule)
  },
  // {
  //   path: 'view-request',
  //   loadChildren: () => import('./view-request/view-request.module').then( m => m.ViewRequestPageModule)
  // },
  // {
  //   path: 'view-status',
  //   loadChildren: () => import('./view-status/view-status.module').then( m => m.ViewStatusPageModule)
  // },
  {
    path: 'open-view-request',
    loadChildren: () => import('./open-view-request/open-view-request.module').then( m => m.OpenViewRequestPageModule)
  },
  {
    path: 'view-status-requests',
    loadChildren: () => import('./view-status-requests/view-status-requests.module').then( m => m.ViewStatusRequestsPageModule)
  },
  {
    path: 'dailog-resend',
    loadChildren: () => import('./dailog-resend/dailog-resend.module').then( m => m.DailogResendPageModule)
  },
  {
    path: 'resend-request',
    loadChildren: () => import('./resend-request/resend-request.module').then( m => m.ResendRequestPageModule)
  },
  {
    path: 'completed-req',
    loadChildren: () => import('./completed-req/completed-req.module').then( m => m.CompletedReqPageModule)
  },
  {
    path: 'approve-request',
    loadChildren: () => import('./approve-request/approve-request.module').then( m => m.ApproveRequestPageModule)
  },
  // {
  //   path: 'view-logs',
  //   loadChildren: () => import('./view-logs/view-logs.module').then( m => m.ViewLogsPageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
