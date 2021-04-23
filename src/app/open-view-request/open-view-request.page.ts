import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { ReqSchema } from '../Services/ReqSchema';
import {Router,ActivatedRoute, NavigationExtras} from '@angular/router';
import { RequestService } from '../Services/RequestService';

@Component({
  selector: 'app-open-view-request',
  templateUrl: './open-view-request.page.html',
  styleUrls: ['./open-view-request.page.scss'],
})
export class OpenViewRequestPage implements OnInit {

  
  public req_id;
  public is_pnc;
  // public req_title;
  // public req_type;
  // public req_budget;
  // public req_date;
  // public req_description;
  // public req_initiator_id;
  // public req_status;
  // public last_approve;

  constructor(public RequestService: RequestService,  private router: Router,
    private actrouter: ActivatedRoute, public userDataService: UserDataService ) {

      
    // this.view = RequestService.viewReq;
   }

  ngOnInit() {

    this.actrouter.queryParams.subscribe(params => {

      console.log('params:',params);

      if(this.router.getCurrentNavigation().extras.state){
        this.req_id = this.router.getCurrentNavigation().extras.state.req_id;
        this.is_pnc = this.router.getCurrentNavigation().extras.state.pnc;
        console.log('req_id',this.req_id);

        if (this.is_pnc == 1) {
          this.is_pnc = 1;
        }
        else
          this.is_pnc = 0


        console.log('pnc',this.is_pnc);
        
      }

    });


    // this.RequestService.getViewRequestData(this.RequestService.ReqId).subscribe((response:any) => {
    //   this.req_id = response.req_data[0]['req_id'];
    //   this.req_title=response.req_data[0]['req_title'];
    //   this.req_type=response.req_data[0]['req_type'];
    //   this.req_initiator_id=response.req_data[0]['req_initiator_id'];
    //   this.req_date=response.req_data[0]['req_date'];
    //   this.req_budget=response.req_data[0]['req_budget'];
    //   this.req_description=response.req_data[0]['req_description'];
    //   this.req_status=response.req_data[0]['req_status'];
    //   this.last_approve=response.role_name[0]['role_name'];
    // });
    // console.log(this.view);
  }

  goToUpgrade() {

    this.router.navigate(['/dailog-resend']);
    console.log(this.userDataService.ReqId, 'In resend button');
  
  }

  view(req_id, pnc) {

    let navigationExtras : NavigationExtras = {
      
      state:{
        req_id: req_id,
        pnc: pnc
      }

    }


    this.router.navigate(['/add-req'], navigationExtras);
  }

}
