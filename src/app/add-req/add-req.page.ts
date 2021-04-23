import { Component, OnInit, ViewChild } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { ReqSchema } from '../Services/ReqSchema';
import { Router,ActivatedRoute, NavigationExtras } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { CustomFormsModule, CustomValidators } from 'ng2-validation'
import {FileUploader,FileSelectDirective} from 'ng2-file-upload';
import { FormControl } from '@angular/forms';
import * as FileSaver from 'file-saver';
const URL = 'http://localhost:5600/api';

@Component({
  selector: 'app-add-req',
  templateUrl: './add-req.page.html',
  styleUrls: ['./add-req.page.scss'],
})
export class AddReqPage implements OnInit {

  form: FormControl;

  public userId;
  public role_id;
  admin_access_id;
  req_id = 0;
  is_pnc = 0;
  remainingText = 250;
  remaining_description = 5000;
  description = "";
  subject = "";
  AllFileName: any[] = [];
  areCredentialsInvalid = false;
  areCredentialsInvalid_boq = false;
  public fieldValue = [];
  requestDetails: any[] = [];

  //For BOQ form
  boqDescription: "";
  boqEstimatedCost: number;
  boqEstimatedTime: "";
  public boqDescription1: "";
  public boqEstimatedCost1: number;
  boqEstimatedTime1: "";

  //For PNC form
  filepnc: any[] = [];
  allocatedDays;
  allocationStartDate: " ";
  actualCost;
  allocateStartDate;
  RequestAllocatedVendor;
  selectedElement: any[] = [];
  public selectedSpoc;
  public pncfilesName = '';

  reqComment;
  reqPnc;
  pncvendorSelection='';

  dataSource: any[] = [];


  user_name;

  public filepath=[];
    uploader:FileUploader;
    hasBaseDropZoneOver:boolean;
    hasAnotherDropZoneOver:boolean;
    response:string;

  title = 'fileUpload';
  images;
  multipleImages = [];

  attachmentList:any = [];

  filestage;
  fileName=[];
  BoqfileName=[];
  pncSupportingDoc = [];
  actualCost1;

  constructor(
    private http: HttpClient,
    public UserDataService: UserDataService, 
    private router: Router,
    private actrouter: ActivatedRoute,
    public toastController: ToastController) {

      this.form = new FormControl({
        inputbudget:new FormControl('',CustomValidators.min(1))
      });

      this.uploader = new FileUploader({
        url: URL,
        disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
        formatDataFunctionIsAsync: true,
        formatDataFunction: async (item) => {
          return new Promise( (resolve, reject) => {
            resolve({
              name: item._file.name,
              length: item._file.size,
              contentType: item._file.type,
              date: new Date()
            });
          });
        }
      });
    
      this.hasBaseDropZoneOver = false;
      this.hasAnotherDropZoneOver = false;
    
      this.response = '';
    
      this.uploader.response.subscribe( res => this.response = res );


     }

  Approvers = [];
  num = 1;

  currReq: ReqSchema = {
    req_date: '',
    req_id: 0,
    req_initiator_id: 0,
    req_level: 1,
    req_status: 'Pending',
    req_number: '',
    req_type: '',
    w_id: 0,
    me_type: '',
    req_swon: '',
    budget_type: '',
    available_budget: 0,
    consumed_budget: 0,
    balance_budget: 0,
    req_subject: '',
    req_description: ''
  };

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }
  selectImage(event) {
    if (event.target.files.length > 0) {

      const file = event.target.files[0];
      this.images = file;
      
    }
  }

  selectMultipleImage(event){
    if (event.target.files.length > 0) {

        this.multipleImages = event.target.files;
    }
  }

  onMultipleSubmit(){
    this.areCredentialsInvalid = false;
  
    var filesize = 0;
    const formData = new FormData();
    console.log("nnnnn", this.multipleImages)
    for (let img of this.multipleImages) {
      formData.append('files', img);
      filesize += img['size'];
      console.log("/////", img);
      console.log("///", formData);
    }
    var fileInMB = 10485760;
    if (filesize > fileInMB) {
      console.log("lll", filesize > fileInMB);
      this.areCredentialsInvalid = true;
      return;
    }
    else{
      this.areCredentialsInvalid = false;
    }
    console.log("lll");


  }

  ngOnInit() {

    console.log('this.req_id ', this.req_id);
    this.userId = JSON.parse(localStorage.getItem('userId'));
    console.log('user_id', this.userId);
    this.currReq.req_initiator_id = this.userId;
    this.role_id = JSON.parse(localStorage.getItem('role_id'));
    this.user_name = JSON.parse(localStorage.getItem('user_name'));
    this.admin_access_id = JSON.parse(localStorage.getItem('admin_access_id'));

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

    if (this.role_id == 3 || this.role_id == 4) {
      return this.UserDataService.getRequestDetails(this.req_id).subscribe((response: any) => {
        console.log(response)
      });
    }


  }

  @ViewChild('attachments', { static: false }) attachment: any;

  fileList: File[] = [];
  listOfFiles: any[] = [];
  fileList_boq: File[] = [];
  listOfFiles_boq: any[] = [];

  onFileChanged(event: any) {

    this.areCredentialsInvalid = false;

    var filesize = 0;
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      this.fileList.push(selectedFile);
      filesize += this.fileList[i]['size'];
      this.listOfFiles.push(selectedFile.name);
    }
    var fileInMB = 10485760;
    if (filesize > fileInMB) {
      console.log("lll", filesize > fileInMB);
      this.areCredentialsInvalid = true;
      this.listOfFiles=[];
      this.fileList = [];
      return;
    }
    console.log("mmmm", this.fileList);
    this.attachment.nativeElement.value = '';
  }

  // when user click on delete then it will remove that file from the list
  removeSelectedFile(index) {
    this.listOfFiles.splice(index, 1);
    this.fileList.splice(index, 1);
  }

  //file for boq
  onFileChanged_boq(event: any) {

    this.areCredentialsInvalid_boq = false;

    var filesize = 0;
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      this.fileList_boq.push(selectedFile);
      filesize += this.fileList_boq[i]['size'];
      this.listOfFiles_boq.push(selectedFile.name);
    }
    var fileInMB = 10485760;
    if (filesize > fileInMB) {
      console.log("lll", filesize > fileInMB);
      this.areCredentialsInvalid_boq = true;
      this.listOfFiles_boq = [];
      this.fileList_boq = [];
      return;
    }
    console.log("mmmm", this.fileList_boq);
    this.attachment.nativeElement.value = '';
  }

  //remove boq files
  removeSelectedFile_boq(index) {
    this.listOfFiles_boq.splice(index, 1);
    this.fileList_boq.splice(index, 1);
  }

  //when request is raised(new request) then stores the request data into database
  onSubmit() {
    
    this.currReq.req_subject = this.subject;
    this.currReq.req_description = this.description;
    this.currReq.req_initiator_id = JSON.parse(localStorage.getItem('admin_access_id'));

    const formData = new FormData();
    for (let img of this.fileList) {
      formData.append('files', img);
    }

    let obj = { ...this.currReq };

    this.http.post<any>('http://localhost:5600/multipleFiles', formData).subscribe((res) => {
      for (let i = 0; i < res.files.length; i++) {
        this.filepath[i] = res.files[i]['filename'];
      }
      console.log(this.filepath, "this.filepath");
      this.UserDataService.addRequest(obj, JSON.parse(localStorage.getItem('space')), JSON.parse(localStorage.getItem('user_name')), this.filepath,this.admin_access_id);
    });   
    
  }

  //when boqform is submitted and store to database
  async onBOQSubmit() {

    let boqDis = this.boqDescription;
    let boqCost = this.boqEstimatedCost;
    let boqTime = this.boqEstimatedTime;

    const formData = new FormData();
    let id = '' + this.req_id;
    formData.append('id', id);
    for (let img of this.fileList_boq) {
      formData.append('files', img);
    }
    this.http.post<any>('http://localhost:5600/BoqFiles', formData).subscribe((res) => {
      for (let i = 0; i < res.files.length; i++) {
        this.filepath[i] = res.files[i]['filename'];
      }
      this.UserDataService.addBOQDDetails(this.req_id, this.role_id, boqDis, boqCost, boqTime, this.filepath, this.admin_access_id, this.user_name);
      
    });

  }

  fileList1: File[] = [];
  listOfFiles1: any[] = [];

  onPncFileChanged(event: any) {
    var filesize = 0;
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      this.fileList1.push(selectedFile);
      filesize += this.fileList1[i]['size'];
      this.listOfFiles1.push(selectedFile.name);
    }
    var fileInMB = 10485760;
    if (filesize > fileInMB) {
      console.log("lll", filesize > fileInMB);
      this.areCredentialsInvalid = true;
      return;
    }
    console.log("mmmm", this.fileList1);
    this.attachment.nativeElement.value = '';
  }
  

  pncfile = [];
  pncfileName = [];

  //add PNC document on list
  onPncFile(event) {
    if (event.target.files.length < 1) {
      return false;
    }
    else {
      this.pncfile[0] = event.target.files[0];
      this.pncfileName[0] = event.target.files[0].name;
    }
  }

  removeselectedpncFile(index) {
    this.pncfileName.splice(index, 1);
    this.pncfile.splice(index, 1);
  }

  removePncSelectedFile(index) {
    this.listOfFiles1.splice(index, 1);
    this.fileList1.splice(index, 1);
  }

  onPncChange() {
    if (this.reqPnc == null) {
      if (this.selectedElement.length > 0) {
        if (this.actualCost == null || this.allocatedDays == null || this.allocationStartDate == null || this.pncvendorSelection == '' || this.pncfile.length<1) {
          return true
        }
      }
      else {
        if (this.actualCost == null || this.pncfile.length<1) {
          return true
        }
      }
    }
    return false
  }

  async onPncSumbit() {
    let allocationStartDate = this.allocationStartDate;
    let cost = this.actualCost;
    let allocatedDay = this.allocatedDays;

    //supporting docs

    const formData = new FormData();
    let id = '' + this.req_id;
    formData.append('id', id);
    for (let img of this.fileList1) {
      formData.append('files', img);
    }

    // pnc doc
    const formData1 = new FormData();
    formData1.append('id', id);
    formData1.append('files', this.pncfile[0]);

    let VendorPk = this.pncvendorSelection["rumpvenVendorPK"];

    this.http.post<any>(this.UserDataService.url+'BoqFiles', formData).subscribe((res) => {
      for (let i = 0; i < res.files.length; i++) {
        this.filepnc[i] = res.files[i]['filename'];
      }
      this.http.post<any>(this.UserDataService.url+'pncFiles', formData1).subscribe((res) => {
        console.log(this.pncfile.length);
        if (this.pncfile.length > 0) {
          console.log(res.files[0]['filename'], "hh")
          this.pncfilesName = res.files[0]['filename'];
          this.UserDataService.addPncByInitiator(allocatedDay, allocationStartDate, cost, this.req_id, VendorPk, this.filepnc, this.pncfilesName, this.admin_access_id, this.user_name);
        } else {
          this.UserDataService.addPncByInitiator1(allocatedDay, allocationStartDate, cost, this.req_id, VendorPk, this.filepnc, this.admin_access_id, this.user_name);
        }
      });
      console.log(this.pncfilesName);
    });
    
    this.router.navigate(['open-req']);

    const toast = await this.toastController.create({
      message: 'Your PNC have been submitted.',
      duration: 2000
    });
    toast.present();

  }

  // update the reuqest data
  onSumbitForUpdate() {
    this.currReq.req_subject = this.subject;
    this.currReq.req_description = this.description;
    const formData = new FormData();
    for (let img of this.fileList) {
      formData.append('files', img);
    }
    let obj = { ...this.currReq };
    this.http.post<any>('http://localhost:5600/multipleFiles', formData).subscribe((res) => {
      for (let i = 0; i < res.files.length; i++) {
        this.filepath[i] = res.files[i]['filename'];
      }

      this.UserDataService.updateRequest(this.is_pnc, obj, this.admin_access_id, this.req_id, JSON.parse(localStorage.getItem('user_name')), this.filepath);
    });

  }




  ngAfterContentInit(){

    if (this.is_pnc == 1) {
      this.UserDataService.getSpocDetails(this.req_id).subscribe((response: any) => {
        this.dataSource = response;
        this.selectedElement = response;
        this.selectedSpoc = this.dataSource.length;
      });
    }

    if ((this.role_id == 0 && this.req_id) || this.role_id != 0) {

      this.UserDataService.getRequestFile(this.req_id).subscribe((response: any) => {
        for (let i = 0; i < response.length; i++) {
          if (response[i].RUMPRequestFilesStage == 1) {
            this.fileName.push(response[i].RUMPRequestFilesPath.replace(/^.*[\\\/]/, ''));
          }
          if (response[i].RUMPRequestFilesStage == 2) {
            this.BoqfileName.push(response[i].RUMPRequestFilesPath.replace(/^.*[\\\/]/, ''));
          }
          if (response[i].RUMPRequestFilesStage == 3) {
            this.pncSupportingDoc.push(response[i].RUMPRequestFilesPath.replace(/^.*[\\\/]/, ''));
          }
        }
      });
      

      //to get request details
      this.UserDataService.getRequestDetail(this.req_id).subscribe((response: any) => {
        this.requestDetails = response;
        this.currReq.budget_type = this.requestDetails[0]["BudgetType"];
        this.currReq.me_type = this.requestDetails[0]["METype"];
        this.currReq.available_budget = this.requestDetails[0]["RequestAvailableBudget"];
        this.currReq.balance_budget = this.requestDetails[0]["RequestBalanceBudget"];
        this.currReq.consumed_budget = this.requestDetails[0]["RequestConsumedBudget"];
        this.description = this.requestDetails[0]["RequestDescription"];
        this.currReq.req_swon = this.requestDetails[0]["RequestSWON"];
        this.subject = this.requestDetails[0]["RequestSubject"];
        this.currReq.req_type = this.requestDetails[0]["RequestType"];
        this.boqDescription1 = this.requestDetails[0]["BOQDescription"];
        this.boqDescription = this.requestDetails[0]["BOQDescription"];
        this.boqEstimatedCost = this.requestDetails[0]["BOQEstimatedCost"];
        this.boqEstimatedTime = this.requestDetails[0]["BOQEstimatedTime"];
        this.allocatedDays = this.requestDetails[0]["AllocatedDays"];
        this.allocationStartDate = this.requestDetails[0]["AllocationStartDate"];
        this.actualCost = this.requestDetails[0]["ActualCost"];
        this.actualCost1=this.actualCost;
        this.is_pnc = this.requestDetails[0]["ispnc"];
        this.currReq.req_initiator_id = this.requestDetails[0]["initiatorId"];
        this.currReq.req_level = this.requestDetails[0]["requestLevel"];
        this.currReq.req_status = this.requestDetails[0]["RequestStatus"];
        this.RequestAllocatedVendor = this.requestDetails[0]["RequestAllocatedVendor"];
        this.reqComment = this.requestDetails[0]["requestComments"];
        this.reqPnc = response[0]["PNCUrl"]
        if (this.reqPnc != null) {
          this.reqPnc = this.reqPnc.replace(/^.*[\\\/]/, '')
        };

        // if (this.RequestAllocatedVendor != null) {
        //   this.UserDataService.getSpocDetails(this.req_id).subscribe((response: any) => {
        //     this.dataSource = response;
        //     this.selectedElement = response;
        //     this.selectedSpoc = this.dataSource.length;
        //     console.log(response);
        //   });
        // }

      });

      
    }

    
  }


  //calculate how many charecter is left to subject
  valueChange(value) {
    this.remainingText = 250 - value.length;
  }

  //calculate how many charecter is left to description
  valueChangeDiscription(value) {
    this.remaining_description = 5000 - value.length;
  }

  //it will store the file selected by users when reuqest is raised
  


  onApprove() {
    this.UserDataService.meType = this.currReq.me_type;
    this.router.navigate(['/approve-request']);
  }

  onResend() {

    let navigationExtras : NavigationExtras = {
      
      state:{
        req_id: this.req_id,
        pnc: this.is_pnc
      }

    }

    this.router.navigate(['/dailog-resend'],navigationExtras);
  }

  async onCompelete(){
    this.UserDataService.addCompleteRequest(this.req_id,this.admin_access_id, this.user_name).subscribe((ResData) => {
      console.log(ResData);
    })
    this.router.navigate(['/completed-req']);

    const toast = await this.toastController.create({
      message: 'Your Request Completed successfully',
      duration: 2000
    });
    toast.present();


  }

  returnBlob(res): Blob {
    console.log('file downloaded');
    return new Blob([res], { type: 'pdf' });
  }

  // download request,BOQ and PNC supporting file
  download(downloadfile) {
    this.UserDataService.getFiles(downloadfile).subscribe((res) => {
      if (res) {
        const url = window.URL.createObjectURL(this.returnBlob(res));
        FileSaver.saveAs(res, downloadfile);
        // window.open(url);
      }
    });
    return false;
  }

  downloadFile(downloadfile) {
    this.UserDataService.downloadFile(downloadfile).subscribe((res) => {
      if (res) {
        const url = window.URL.createObjectURL(this.returnBlob(res));
        FileSaver.saveAs(res, downloadfile);
        // window.open(url);
      }
    });
    return false;
  }

  todashboard(){
    this.router.navigate(['/dashboard']);
  }


}
