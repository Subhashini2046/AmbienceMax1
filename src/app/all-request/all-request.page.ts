import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { RequestService } from '../Services/RequestService';
import { ReqSchema } from '../Services/ReqSchema';
import { Router } from '@angular/router';


@Component({
  selector: 'app-all-request',
  templateUrl: './all-request.page.html',
  styleUrls: ['./all-request.page.scss'],
})
export class AllRequestPage implements OnInit, OnDestroy {

  
 // public dataSource = this.UserDataService.allRequests;
  public dataSource;
  // public userId;
  public filterTerm: string;

  updatedData = [];

  constructor( public userDataService: UserDataService, 
    public RequestService: RequestService, 
    public router:Router) { }

  ngOnInit() { 

    console.log("all request part");

    let response:any = this.RequestService.fetchaallReq(JSON.parse(localStorage.getItem('role_id')), JSON.parse(localStorage.getItem('space')), JSON.parse(localStorage.getItem('admin_access_id'))).subscribe((response:any)=>{

      this.dataSource = response;

      console.log(this.dataSource);

    });
    

  }

  gotoViewReq(viewReq){

    this.RequestService.ReqId = viewReq.RUMPRequestPK;
    this.RequestService.viewReq = viewReq;
    this.RequestService.pnc = viewReq.ispnc;

  

    // this.userDataService.check_read(viewReq.RUMPRequestPK);

    this.router.navigate(['/view-status-requests']);

  }

  ngOnDestroy() {
  }

  ionViewWillEnter(){
    console.log("all request part");

    let response:any = this.RequestService.fetchaallReq(JSON.parse(localStorage.getItem('role_id')), JSON.parse(localStorage.getItem('space')), JSON.parse(localStorage.getItem('admin_access_id'))).subscribe((response:any)=>{

      this.dataSource = response;

      console.log(this.dataSource);

    });
  }

}
