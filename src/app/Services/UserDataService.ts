import { Injectable, OnInit } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { ReqSchema } from './ReqSchema';
import { BehaviorSubject,Subject,Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { ClassField } from '@angular/compiler';
import { ToastController } from '@ionic/angular';
import { Inject } from '@angular/core';
export interface  UserData {
  userId: string;
  email: string;
  password: string;
  userRole: number;
  Requests: ReqSchema[];
  reqStats: ReqStats;
  pendingReq: ReqSchema[];
  closedReq: ReqSchema[];
  openReq: ReqSchema[];
  hId: number;
  reqOffset: number;
  viewReq: ReqSchema;
}
export interface ReqStats {
  All: number;
  Pending: number;
  Closed: number;
  Open: number;
}
@Injectable()
export class UserDataService {

  changedetectInRole = new BehaviorSubject(null);

  loginDetected = new BehaviorSubject(null);

  //url="http://localhost:3000/";

  url;
  // usersURL="http://localhost:5600/api/users";
  // usersURL2="http://localhost:5600/api/logs";
  httpOptions = {

    headers: new HttpHeaders({

      'Content-Type': 'application/json',

    })

  }
  constructor(private http: HttpClient, private router: Router,public toastController: ToastController,@Inject('AMBI_API_URL') private apiUrl:string) {
    this.url=apiUrl;
  }

  meType;
  userId = null;
  space = null;
  userRole = null;
  role_id: number;
  public filepath = [];
  public mainSub = new Subject<string>();
  public main = '';

  Data: UserData;
  ReqId=null;
  w_id=null;
  userRole1=0;
  isPending = false;
  resendTo=" ";
  public fetchedReqs: ReqSchema[];
  public fetchedReqsUpdated = new Subject<ReqSchema[]>();
  public reqStatsSubject = new Subject<ReqStats>();
  public desiredReqSub = new Subject<ReqSchema[]>();
  public toBeApproved = false;
  public message = '';
  public email = '';
  public password = '';
  public reqStats: ReqStats;
  public hId: number;
  public reqOffset: number;
  public reqStart: number;
  public viewReq: ReqSchema;
  public allRequests: ReqSchema[] = [];
  public pendingRequests: ReqSchema[] = [];
  public closedRequests: ReqSchema[] = [];
  public openRequests: ReqSchema[] = [];
  public underNegRequests: ReqSchema[] = [];
  public desiredRequests: ReqSchema[] = [];
  public Workflow = [];
  public menus=[];

  action_taken_by="";

  public reqTypeData: {
    'Pending': number,
    'Closed': number,
    'Open': number
  };
  public RoleMap = [
    'Building Head',
    'Location Head',
    'Cluster Head',
    'City Head',
    'State Head',
    'Country Head',
    'Geography Head'
  ];
  mainObservable(){
    return this.mainSub.asObservable();
  }
  fetchDesiredObservable() {
    return this.desiredReqSub.asObservable();
  }
  fetchObservable() {
    return this.fetchedReqsUpdated.asObservable();
  }
  fetchReqStat() {
    return this.reqStatsSubject.asObservable();
  }
  

  //--------------------------------user authenticatation------------------------------------------------

  authenticateUser1(userId: number, password: string) {
    console.log(userId);
    // this.email = email;
    // this.password  = password;
    this.http.post<{ result: string, space: string, user_id: string, role_id: number, admin_access_id: number, user_name: string }>
      (this.url+'login', { userId, password })
      .subscribe(async (ResData) => {
        
        console.log(ResData);
          

        if(ResData.result === "passed" )
        {
          

          const toast = await this.toastController.create({
            message: 'Login Successfully',
            duration: 2000
          });
          toast.present();  

          if (ResData.role_id !== null){
      
            localStorage.setItem('role_id', JSON.stringify(ResData.role_id));
            localStorage.setItem('userId', JSON.stringify(ResData.user_id));
            localStorage.setItem('space', JSON.stringify(ResData.space));
            localStorage.setItem('admin_access_id', JSON.stringify(ResData.admin_access_id));
            localStorage.setItem('user_name', JSON.stringify(ResData.user_name));

            
            this.getUsers_dash(userId).subscribe(data=>{
              this.menus=JSON.parse(JSON.stringify(data));
              localStorage.setItem('role_name',JSON.parse(JSON.stringify(data))[0]["name"]);
              localStorage.setItem('designation',JSON.parse(JSON.stringify(data))[0]["roledesc"])
            })

            this.loginDetected.next({role:ResData.role_id,space:ResData.space,id:ResData.admin_access_id,uname:ResData.user_name,rname:localStorage.getItem('role_name')})

            this.router.navigateByUrl('/dashboard');

          }
          
        }

        else{
          const toast = await this.toastController.create({
            message: 'Userid or Password wrong!',
            duration: 2000
          });
          toast.present(); 
        }


      });
  }

  // ResendUpdate(reqId){
  //   this.action_taken_by=this.RoleMap[this.userRole-1];
  //   this.http.post('http://localhost:5600/addResendReqLog', {req_id: reqId , userRole: this.userRole,action_taken_by:this.action_taken_by})
  //   .subscribe((ResData) => {
  //     console.log("In Approved Method",ResData);
  //   });
  //   console.log("this.viewReq.req_initiator_id",this.viewReq.req_initiator_id)
  //   if(this.resendTo=="Initiator" && this.viewReq.req_initiator_id==1){this.userRole=1;}
  //   if(this.resendTo=="Initiator" && this.viewReq.req_initiator_id==8){
  //     this.userRole=this.viewReq.req_initiator_id ;}
  //   if(this.resendTo=="Location Head"){this.userRole=2;}
  //   if(this.resendTo=="Cluster Head"){this.userRole=3;}
  //   if(this.resendTo=="City Head"){this.userRole=4;}
  //   if(this.resendTo=="State Head"){this.userRole=5;}
  //   if(this.resendTo=="Country Head"){this.userRole=6;}
  //   if(this.resendTo=="Geography Head"){this.userRole=7;}
  //   console.log("in resendUpdate",this.resendTo,"",this.userRole); 
  //   this.http.post('http://localhost:5600/resendReq', {req_id: reqId , userRole: this.userRole})
  //   .subscribe((ResData) => {
  //     console.log("In Resend Method",ResData);
  //  });
  
  // }
  
  // getWorkFlow(reqId: number) {
  //   this.http.post('http://localhost:3000/workflow', {req_id: reqId})
  //   .subscribe((ResData) => {
  //     console.log(ResData);
  //     this.Workflow = ResData[0].w_flow.split(',');
  //     console.log("Workflow",this.Workflow);
  //     this.decideApprove();
  //     });
  // }
  // getLastApprove(reqId:number)
  // {
  //   this.RoleMap[this.viewReq.req_level-1];
  //   console.log("Last Approved",this.RoleMap[this.viewReq.req_level-1]);
  //   return this.RoleMap[this.viewReq.req_level-1];
  // }
  // getFlow(reqId:number){
  //   if(this.viewReq.w_id==1){
  //     for(let i=1;i<this.RoleMap.length;i++)
  //     {console.log("flow",this.RoleMap[i]);
  //       this.Workflow.push(this.RoleMap[i])  
  //   }
    
  //   }
  //   if(this.viewReq.w_id==2){
  //     for(let i=2;i<this.RoleMap.length;i++)
  //     {console.log("flow",this.RoleMap[i]);
  //       this.Workflow.push(this.RoleMap[i])  
  //   }
  // }
  // if(this.viewReq.w_id==3){
  //   for(let i=3;i<this.RoleMap.length;i++)
  //   {console.log("flow",this.RoleMap[i]);
  //     this.Workflow.push(this.RoleMap[i])  
  // }}
  // if(this.viewReq.w_id==4){
  //   for(let i=4;i<this.RoleMap.length;i++)
  //   {console.log("flow",this.RoleMap[i]);
  //     this.Workflow.push(this.RoleMap[i])  
  // }}
  // return this.Workflow;
  // }

  // decideApprove() {

  //   console.log("User Role:",this.userRole.toString());
  //     console.log("w1",this.Workflow.indexOf( this.userRole.toString()));
  //     console.log("w2",this.viewReq.req_level);
  //     console.log("user_r",this.userRole>=1);
  //     this.userRole1=this.Workflow.indexOf( this.userRole.toString());
  //     this.userRole1=this.Workflow[this.userRole1+1];
  //     console.log("next user Role",this.userRole1);
  //     if (this.Workflow.indexOf( this.userRole.toString())==0 || (this.Workflow.indexOf( this.userRole.toString()))) {
  //       this.toBeApproved = true;
  //       console.log(this.toBeApproved);
  //       localStorage.setItem('toBeApproved', JSON.stringify(this.toBeApproved));
  //       console.log(JSON.parse(localStorage.getItem('toBeApproved')));
  //       this.message = '';
  //       this.viewReq.req_level = this.userRole;
  //     }
  //     if ( this.viewReq.req_level + 1 === this.userRole || this.userRole === 1 ) {
  //       this.message = '';
  //     } else if (this.viewReq.req_level >= this.userRole) {
  //       this.message = 'You have already acted on this request';
  //     } else if (this.viewReq.req_level < this.userRole) {
  //       this.message = 'This request is still in the Open queue of previous aprrovers ';
  //     }
  //     localStorage.setItem('toBeApproved', JSON.stringify(this.toBeApproved));
  //     localStorage.setItem('message', JSON.stringify(this.message));

  // }

  // Approved(reqId: number) {

  //   console.log("req id.....",reqId);
  //     console.log("Next User Role.....:",this.userRole1);
  //     this.http.post('http://localhost:3000/approve', {req_id: reqId , userRole: this.userRole1})
  //     .subscribe((ResData) => {
  //       console.log("In Approved Method",ResData);
  //     });

  //     if ( this.Workflow.indexOf(this.userRole.toString()) === this.Workflow.length - 1 ) {
  //       this.http.post('http://localhost:3000/closeReq', {req_id: reqId })
  //     .subscribe((ResData) => {
  //       console.log(ResData);
  //     });
  //     }
  //     this.toBeApproved = false;
  //     console.log("in approvelog",reqId,"and userRole is",this.userRole);
  //    this.action_taken_by=this.RoleMap[this.userRole-1];
  //     console.log("this.action_taken_by",this.action_taken_by);
  //     console.log("user ....Role",this.userRole,this.ReqId);
  //     this.http.post('http://localhost:5600/addLog', {req_id: reqId , userRole: this.userRole,action_taken_by:this.action_taken_by})
  //     .subscribe((ResData) => {
  //       console.log("In add log",ResData);
  //     });
  // }

  

  addRequest(newReq: ReqSchema, space, user_name, filepath,accessID) {
    console.log(newReq.req_type,"type");
    this.http.post(this.url+'newReq', { request: newReq, space,accessID}).subscribe(async (data:any) => {
      this.addToLog(JSON.parse(JSON.stringify(data)).id, user_name, filepath);
      this.router.navigateByUrl('/dashboard');

      const toast = await this.toastController.create({
        message: 'Request created with Request Number: ' + data.reqNumber,
        duration: 2000
      });
      toast.present();

    });
  }

  addToLog(newReqId, user_name, filepath) {
    for (let i = 0; i < filepath.length; i++) {
      filepath[i] = filepath[i];
      this.http.post(this.url+'fileUpload', { req_id: newReqId, filepath: filepath[i] })
        .subscribe((ResData) => {
        });
    }
    this.http.post(this.url+'addLogNewReq', { req_id: newReqId, user_name: user_name})
      .subscribe((ResData) => {
      });
  }

  addBOQDDetails(reqId, role, boqDescription, boqEstimatedCost, boqEstimatedTime, filepath,accessID,role_name) {
    this.http.post(this.url+'BOQRequests', { reqId, role, boqDescription, boqEstimatedCost, boqEstimatedTime,accessID,role_name }).subscribe(async (data: ReqSchema) => {
      this.addBOQfile(reqId, filepath);
      this.navigateToOpenRequest();
      const toast = await this.toastController.create({
        message: 'Your BOQ Form have been submitted.',
        duration: 2000
      });
      toast.present();
    });
  }
  addBOQfile(reqId, filepath) {
    for (let i = 0; i < filepath.length; i++) {
      filepath[i] = filepath[i];
      this.http.post(this.url+'fileBoqUpload', { req_id: reqId, filepath: filepath[i] })
        .subscribe((ResData) => {
        });
    }
  }

  addPncByInitiator(allocatedDays, allocationStartDate, actualCost, req_id, VendorPk, filepath,pncfile,accessID,role_name) {
    //console.log(filepath1)
    console.log(pncfile);
    if(pncfile!=null){
      console.log(pncfile); 
    }
    
    this.http.post<any>(this.url+'addPnc', { allocatedDays, allocationStartDate, actualCost, req_id, VendorPk,accessID,role_name }).subscribe((data) => {
      if(pncfile!=null){
        this.addPncfile(req_id, pncfile);}
        this.addPncSupportingDoc(req_id, filepath);
        this.navigateToOpenRequest();
    });
  }

  addPncByInitiator1(allocatedDays, allocationStartDate, actualCost, req_id, VendorPk, filepath,accessID,role_name) {
    this.http.post<any>(this.url+'addPnc', { allocatedDays, allocationStartDate, actualCost, req_id, VendorPk,accessID,role_name}).subscribe((data) => {
      this.addPncSupportingDoc(req_id, filepath);
      this.navigateToOpenRequest();
    });
  }

  addPncfile(reqId, filepath) {
    console.log(filepath,"ll");
    this.http.post(this.url+'pncfileUpload', { req_id: reqId, filepath: filepath })
    .subscribe((ResData) => {
    });
  }

  addPncSupportingDoc(reqId, filepath) {
    for (let i = 0; i < filepath.length; i++) {
      filepath[i] = filepath[i];
      this.http.post(this.url+'pncSupportingDoc', { req_id: reqId, filepath: filepath[i] })
        .subscribe((ResData) => {
        });
    }
  }

  navigateToOpenRequest(){
    this.router.navigate(['open-req']);
  }

  getRequestDetail(req_id) {
    return this.http.post<any>(this.url+'requestDetail', { req_id });
  }

  check_read(req_id) {
    return this.http.post(this.url+'check_asRead', { req_id: req_id })
    .subscribe((ResData)=>{

    });
  }

  check_unread(req_id) {
    return this.http.post<any>(this.url+'check_asUnRead', { req_id: req_id })
    .subscribe((ResData)=>{

    });
  }

  getViewRequestStatus(req_id) {
    console.log("s---");
    return this.http.post<any>(this.url+'viewStatus', { req_id });
  }

  getVendorDetails(vendCategoryId) {
    return this.http.post<any>(this.url+'vendorDetail', { vendCategoryId });
  }

  addVendors(vendorList, req_id, reqComment, accessID, role_name) {
    return this.http.post<any>(this.url+'addVendors', { vendorList, req_id, reqComment, accessID, role_name });
  }

  approveRequest(reqComment, req_id, userId, accessID, role_name) {
    let meType = this.meType;
    return this.http.post<any>(this.url+'approveRequest', { reqComment, req_id, userId, accessID, role_name, meType });
  }

  // getUsers(req_id) {
  //   return this.http.get(this.usersURL + `/${req_id}`);
  // }

  getUsers_dash(id) {
    return this.http.get(this.url+`roles?userid=${id}`);
  }

  resendRequest(reqComment, req_id, resendToId, accessID, role_name,pnc) {
    return this.http.post<any>(this.url+'resendRequest', { reqComment, req_id, resendToId, accessID, role_name,pnc });
  }

  addCompleteRequest(req_id, accessID, role_name) {
    return this.http.post<any>(this.url+'addCompeteRequest', { req_id, accessID, role_name });
  }

  getRequestDetails(reqId) {
    return this.http.post(this.url+'requestDetails', { reqId });
  }

  getSpocDetails(req_id) {
    return this.http.post<any>(this.url+'getSpocs', { req_id });
  }

  getRequestFile(req_id){
    return this.http.post(this.url+'getfiles', { req_id});
  }

  getImage(user_id): any{
    return this.http.post(this.url+'get_image', { user_id}, {observe: 'response' , responseType: 'blob' });
  }

  getFiles(x: string): Observable<any> {
    const param = new HttpParams().set('filename', x);
    const options = {
      params: param
    };
    return this.http.get(this.url+'RequestFle', { ...options, responseType: 'blob' });
  }

  downloadFile(x: string): Observable<any> {
    const param = new HttpParams().set('filename', x);
    const options = {
      params: param
    };
    return this.http.get(this.url+'download', { ...options, responseType: 'blob' });
  }

  getHomComment(req_id){
    return this.http.post<any>(this.url+'getComment', { req_id });
  }

  getVendor(req_id){
    return this.http.post<any>(this.url+'getVendor', { req_id });
  }

  updateRequest(is_pnc,request: ReqSchema,accessID, req_id,role_name,filepath){
    this.http.post<any>(this.url+'updateRequests', {is_pnc, request:request,accessID, req_id,role_name}).subscribe((async res=>{

      if(res.result == "Updated"){
        this.addToLog(req_id, role_name, filepath);
        

        const toast = await this.toastController.create({
          message: 'Your request have been Updated.',
          duration: 2000
        });
        toast.present();

        this.navigateToOpenRequest();

      }
    }));
     
   }

   addUpdateRequest(RequestData, reqId: number) {
    this.http.post(this.url+'updateRequest', { RequestData, reqId }).subscribe((resData) => {
    });
  }


  // getusers(req_id){
  //   return this.http.get(this.usersURL + `/${req_id}`);
  // }

  getRoles(req_id,role_id,space,accessId) {
    return this.http.post(this.url+'users1', { req_id,role_id,space,accessId});
    //return this.http.get(this.usersURL + `/${req_id},accessId`);
  }

  getpdfTableData(req_id){
    return this.http.post(this.url+'pdfTableData', { req_id });
  }

  // getlogs(req_id){
  //   return this.http.get(this.usersURL2 + `/${req_id}`);
  // }
  
  // Addaction(reqId: Number) {
  //   this.http.post('http://localhost:3000/getRole', {req_id: reqId }).subscribe((ResData)=>{
  //   // .subscribe((ResData) => {
  //     console.log(ResData);
  //     // return this.http.get(reqId);
     
  //   });
  // }
  // addAction(reqId: number) {
  //   this.http.post('http://localhost:3000/getflow', {req_id: reqId})
  //   .subscribe((ResData) => {
  //     console.log(ResData);
  //   });

  // }

}
