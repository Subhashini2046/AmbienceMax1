import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import {FormBuilder,FormGroup,FormControl,Validators} from '@angular/forms';
import {Router,ActivatedRoute, NavigationExtras} from '@angular/router';

import { ReqSchema } from '../Services/ReqSchema';

@Component({
  selector: 'app-dailog-resend',
  templateUrl: './dailog-resend.page.html',
  styleUrls: ['./dailog-resend.page.scss'],
})
export class DailogResendPage implements OnInit {

  form: FormGroup;

  accessId;
  // allocateForm: FormGroup;
  req_id;
  is_pnc;
  
  users: any = [];
  users1: any = [];

  role_id;
  space;
  initiatorId;
  selectedUser: any = "";

  // private fb1: FormBuilder
  constructor( private router: Router,private actrouter: ActivatedRoute,public userDataService: UserDataService) 
  { 
    // this.allocateForm = this.fb1.group({
    //   request_actionnnn: ['', Validators.required]

    // });
  }

  // onChangeCountry($event) {
  //   console.log("select user........");
  //   this.selectedRole = $event.target.options[$event.target.options.selectedIndex].text;
  //   console.log("Selected userrole",this.selectedRole);
  //   this.userDataService.resendTo=this.selectedRole;
  
  // }

  

  navigateBack(){
    this.router.navigate(['/add-req']);
  }


  ngOnInit() {

    this.actrouter.queryParams.subscribe(params => {

      console.log('params:',params);

      if(this.router.getCurrentNavigation().extras.state){
        this.req_id = this.router.getCurrentNavigation().extras.state.req_id;
        this.is_pnc = this.router.getCurrentNavigation().extras.state.pnc;
        
        console.log('req_id',this.req_id);
        console.log('pnc',this.is_pnc);
        
      }

    });

    this.accessId = JSON.parse(localStorage.getItem('admin_access_id'));
    this.role_id = JSON.parse(localStorage.getItem('role_id'));
    this.space = JSON.parse(localStorage.getItem('space'));

    // get user role like initiator,location head etc.
    this.userDataService.getRoles(this.req_id, this.role_id, this.space,this.accessId ).subscribe((data) => {
      this.users = data;
       console.log(data);
       for(let i=0;i<this.users.length;i++){
         if(this.users[i]['pickRUMPRoleDescription'].includes('Initiator')){
           this.initiatorId=this.users[i]['accessId'];
           this.users[i]['pickRUMPRoleDescription']='Initiator(Request)';
         break;}
       }
       if (this.role_id < 6) {
         this.users1.push(this.users[0])
      for(let i=1;i<this.users.length;i++){
        this.users1.push(this.users[i])
      }
       }
       if (this.role_id >= 6) {
         this.users1.push(this.users[0])
         this.users1.push({ accessId: this.initiatorId, roleId: 0, pickRUMPRoleDescription: "Initiator(PNC)", pnc: 1 });
      for(let i=1;i<this.users.length;i++){
        this.users1.push(this.users[i])
      }
       }

       console.log(this.users1);

     });

     

    // this.userDataService.getusers(this.req_id).subscribe((data) => {
    //   this.users = data;
    // })
    
  }

  navigateTo() {
    console.log('Clicked');

    if (JSON.parse(this.selectedUser)["pnc"]==1) { this.is_pnc = 1 }
    else
      this.is_pnc = 0;

      console.log(JSON.parse(this.selectedUser));


      console.log("accesid",JSON.parse(this.selectedUser)["accessId"]);
      console.log("pnc: ",this.is_pnc);

    let navigationExtras : NavigationExtras = {
      
      state:{
        accessId: JSON.parse(this.selectedUser)["accessId"],
        req_id: this.req_id,
        pnc: this.is_pnc
      }

    }


    this.router.navigate(['/resend-request'],navigationExtras);
  }
  

}
