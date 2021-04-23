import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { RequestService } from '../Services/RequestService';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-closed-req',
  templateUrl: './closed-req.page.html',
  styleUrls: ['./closed-req.page.scss'],
})
export class ClosedReqPage implements OnInit {

  public dataSource;
  public userId;
  public filterTerm: string;

  role_id;
  accessId;

  constructor(public userDataService: UserDataService,
    private changeDetectorRefs: ChangeDetectorRef,
    public RequestService: RequestService,
    public router: Router) { }

  ngOnInit() {

    this.accessId = JSON.parse(localStorage.getItem('admin_access_id'));
    this.role_id = JSON.parse(localStorage.getItem('role_id'));

    let response:any = this.RequestService.fetchclosedReq(this.role_id, JSON.parse(localStorage.getItem('space')), JSON.parse(localStorage.getItem('admin_access_id'))).subscribe((response:any)=>{

      this.dataSource = response;

    });



  }

  ionViewWillEnter(){
    this.accessId = JSON.parse(localStorage.getItem('admin_access_id'));
    this.role_id = JSON.parse(localStorage.getItem('role_id'));

    let response:any = this.RequestService.fetchclosedReq(this.role_id, JSON.parse(localStorage.getItem('space')), JSON.parse(localStorage.getItem('admin_access_id'))).subscribe((response:any)=>{

      this.dataSource = response;

    });
  }

  gotoViewReq(viewReq){

    this.RequestService.ReqId = viewReq.RUMPRequestPK;
    this.RequestService.viewReq = viewReq;
    this.RequestService.pnc = viewReq.ispnc;

    console.log('view req',viewReq);

    console.log('req',viewReq.RUMPRequestPK);
    console.log('pnc',viewReq.ispnc);
    console.log('status',viewReq.RUMPRequestStatus);

    let navigationExtras : NavigationExtras = {
      
      state:{
        req_id: viewReq.RUMPRequestPK,
        pnc: viewReq.ispnc,
        status: viewReq.RUMPRequestStatus
      }

    }

    if(this.role_id==0){
      this.userDataService.check_read(viewReq.RUMPRequestPK);
    }



    this.router.navigate(['/view-status-requests'], navigationExtras);

  }

  ngOnDestroy() {
  }

}
