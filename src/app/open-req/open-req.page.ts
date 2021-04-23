import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { RequestService } from '../Services/RequestService';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-open-req',
  templateUrl: './open-req.page.html',
  styleUrls: ['./open-req.page.scss'],
})
export class OpenReqPage implements OnInit {

  public dataSource;
  public filterTerm: string;

  constructor(public userDataService: UserDataService, public RequestService: RequestService,
    private router:Router) { }

  ngOnInit() {


    let response:any = this.RequestService.fetchopenReq(JSON.parse(localStorage.getItem('role_id')), JSON.parse(localStorage.getItem('space')), JSON.parse(localStorage.getItem('admin_access_id'))).subscribe((response:any)=>{

      this.dataSource = response;

      console.log(this.dataSource);

    });

  }

  ionViewWillEnter(){
    let response:any = this.RequestService.fetchopenReq(JSON.parse(localStorage.getItem('role_id')), JSON.parse(localStorage.getItem('space')), JSON.parse(localStorage.getItem('admin_access_id'))).subscribe((response:any)=>{

      this.dataSource = response;

    });
  }

  gotoOpen(viewReq){

    this.RequestService.viewReq = viewReq;
    this.RequestService.ReqId = viewReq.RUMPRequestPK;
    this.RequestService.pnc = viewReq.ispnc; 
    this.userDataService.viewReq = viewReq; 
    this.userDataService.ReqId=viewReq.RUMPRequestPK ;

    console.log('req',viewReq.RUMPRequestPK);
    console.log('pnc',viewReq.ispnc);

    let navigationExtras : NavigationExtras = {
      
      state:{
        req_id: viewReq.RUMPRequestPK,
        pnc: viewReq.ispnc
      }

    }

    this.userDataService.check_read(viewReq.RUMPRequestPK);


    this.router.navigate(['open-view-request'], navigationExtras);
  }

}
