import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { RequestService } from '../Services/RequestService';
import { UserDataService } from '../Services/UserDataService';

@Component({
  selector: 'app-view-status-requests',
  templateUrl: './view-status-requests.page.html',
  styleUrls: ['./view-status-requests.page.scss'],
})
export class ViewStatusRequestsPage implements OnInit {


  public role_id; 
  public req_id;
  public is_pnc;
  public status;

  constructor(public RequestService: RequestService , 
    public UserDataService: UserDataService, 
    private actrouter: ActivatedRoute, 
    public router: Router) { }

  ngOnInit() {

    this.role_id = JSON.parse(localStorage.getItem('role_id'));

    this.actrouter.queryParams.subscribe(params => {

      console.log('params:',params);

      if(this.router.getCurrentNavigation().extras.state){
        this.req_id = this.router.getCurrentNavigation().extras.state.req_id;
        this.is_pnc = this.router.getCurrentNavigation().extras.state.pnc;
        this.status = this.router.getCurrentNavigation().extras.state.status;
        console.log('req_id',this.req_id);

        if (this.is_pnc == 1) {
          this.is_pnc = 1;
        }
        else
          this.is_pnc = 0


        console.log('pnc',this.is_pnc);
         console.log('status', this.status);
        
      }

    });

  }

  ngAfterViewWillEnter(){

  }

  view(req_id, pnc){

    let navigationExtras : NavigationExtras = {
      
      state:{
        req_id: req_id,
        pnc: pnc
      }

    }

    this.router.navigate(['/add-req'], navigationExtras);

  }



}
