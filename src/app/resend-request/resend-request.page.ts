import { Component, OnInit } from '@angular/core';
import { ReqSchema } from '../Services/ReqSchema';
import { UserDataService } from '../Services/UserDataService';
import { RequestService } from '../Services/RequestService';
import { Router,ActivatedRoute} from '@angular/router';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-resend-request',
  templateUrl: './resend-request.page.html',
  styleUrls: ['./resend-request.page.scss'],
})
export class ResendRequestPage implements OnInit {

  title = 'ambiencemax';
  comment = '';
  userRole = '';
  Approvers = [];
  appExists = false;
  me_type;
  req_id;
  budget_type;
  available_budget;
  balance_budget;
  consumed_budget;
  req_description='';
  req_swon;
  req_subject;
  req_type;
  resendToId;
  accessID;
  user_name;
  req_status;
  req_number;
  is_pnc;

  constructor(private actrouter: ActivatedRoute,public userDataService: UserDataService, private router: Router,
    public toastController: ToastController) { }
  
  currReqApprovers = [];

  ngOnInit() {

    this.actrouter.queryParams.subscribe(params => {

      console.log('params:',params);

      if(this.router.getCurrentNavigation().extras.state){
        this.req_id = this.router.getCurrentNavigation().extras.state.req_id;
        this.resendToId = this.router.getCurrentNavigation().extras.state.accessId;
        this.is_pnc = this.router.getCurrentNavigation().extras.state.pnc;
        console.log('req_id',this.req_id);
        console.log('resendto',this.resendToId);
        console.log('pnc',this.is_pnc);
        
      }

    });

    this.user_name=JSON.parse(localStorage.getItem('user_name'));
    this.accessID=JSON.parse(localStorage.getItem('admin_access_id'));
    this.userDataService.getRequestDetail(this.req_id).subscribe((response: any) => {
      this.budget_type = response[0]["BudgetType"];
      this.me_type = response[0]["METype"];
      this.available_budget = response[0]["RequestAvailableBudget"];
      this.balance_budget = response[0]["RequestBalanceBudget"];
      this.consumed_budget = response[0]["RequestConsumedBudget"];
      this.req_description = response[0]["RequestDescription"];
      this.req_swon = response[0]["RequestSWON"];
      this.req_subject = response[0]["RequestSubject"];
      this.req_type = response[0]["RequestType"];
      this.req_status=response[0]["RequestStatus"];
      this.req_number=response[0]["RequestNumber"];
    });

  }

  goToRequestAction(req_id) {
    this.router.navigate(['/add-req', req_id]);
    console.log(req_id);
  }

  async onSubmit() {
    console.log("ggggg",this.comment);
    this.userDataService.resendRequest(this.comment,this.req_id,this.resendToId,this.accessID,this.user_name,this.is_pnc).subscribe(async (ResData) => {

      console.log(ResData);

      if(ResData.result=="passed"){
        

        const toast = await this.toastController.create({
        message: 'Your Request is Resended.',
        duration: 2000
        });
        toast.present();

        this.router.navigate(['/dashboard']);

      }

    });

    

  }

}
