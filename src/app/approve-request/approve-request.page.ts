import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { RequestService } from '../Services/RequestService';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';


export interface vendor {
  asvendorId: number;
  vendorName: string;
  taggedCount: number;
  alloccatedCount: number;
}

@Component({
  selector: 'app-approve-request',
  templateUrl: './approve-request.page.html',
  styleUrls: ['./approve-request.page.scss'],
})

export class ApproveRequestPage implements OnInit {

  public vendorCategory: any[] = [];
  vendCategoryId: number;
  requestComment = "";
  vendorList: any[] = [];
  req_id: number;
  role_id;
  user_id;
  admin_access_id;
  user_name;
  me_type;
  public dataSource;
 
  vendorID = []

  constructor(private route: Router, public userDataService: UserDataService, public RequestService:RequestService, private http: HttpClient, public toastController: ToastController ) { 
    this.req_id = RequestService.ReqId;
   }

   public selection = new SelectionModel<vendor>(true, []);


  ngOnInit() {

    this.role_id = JSON.parse(localStorage.getItem('role_id'));
    this.user_id = JSON.parse(localStorage.getItem('userId'));
    this.user_name = JSON.parse(localStorage.getItem('user_name'));
    this.admin_access_id = JSON.parse(localStorage.getItem('admin_access_id'));
    this.http.get<any>(this.userDataService.url+'vendorcategories').subscribe((res) => {
      this.vendorCategory = res;
      console.log("ddd", this.vendorCategory);

    });

  }

  ngAfterContentInit() {

    console.log(this.role_id)
    // this.userDataService.getHomComment(this.req_id).subscribe((res) => {
    //   this.requestComment = res[0].RUMPRequestComments;
    // });
    if(this.role_id==5){
    this.userDataService.getVendor(this.req_id).subscribe((res) => {
      for (let i = 0; i < res.vendorsId.length; i++) {
        this.vendorID.push(res.vendorsId[i].vendorId);
      }
      this.vendCategoryId = res.result[0].pickRumpVendorCategoriesPK;
      if (this.vendCategoryId != null) {
           console.log("//");
        this.userDataService.getVendorDetails(this.vendCategoryId).subscribe((res) => {
          this.dataSource.data = res;
          this.dataSource.data.forEach(data=>{
            this.vendorID.forEach(id=>{
              if(id==data['vendorId']){
                this.selection.toggle(data);
              }
            })
          })
        });
      }
    });}
    
  }

  onChanged(event: any) {
    console.log(event, this.vendCategoryId);
    this.selection.clear();
    this.userDataService.getVendorDetails(event).subscribe((res) => {
      console.log("ddd", res);
      this.dataSource = res;

      console.log("data",this.dataSource);
    });
  }

  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }


  // masterToggle() {
  //   this.isAllSelected() ?
  //     this.selection.clear() :
  //     this.selection.selected.length = 3;
  //   this.dataSource.data.forEach(row => this.selection.select(row));
  //   //console.log("mg",this.selection.selected.keys);
  // }

  // call() {
  //   console.log(this.selection.selected);
  // }

  async onSubmit() {

    // for (let i = 0; i < this.selection.selected.length; i++) {
    //   this.vendorList[i] = (this.selection.selected[i]["vendorId"]);
    // }
    // console.log("vendor lidst: ",this.vendorList);

    if (this.role_id == 5) {
      for (let i = 0; i < this.selection.selected.length; i++) {
        this.vendorList[i] = (this.selection.selected[i]["vendorId"]);
      }
      this.userDataService.addVendors(this.vendorList, this.req_id, this.requestComment, this.admin_access_id, this.user_name).subscribe(async (ResData) => {
        console.log(ResData);
        
        if(ResData.result=="passed"){
          this.userDataService.check_unread(this.req_id);

          this.route.navigate(['/open-req']);

          const toast = await this.toastController.create({
          message: 'Request Approved.',
          duration: 2000
          });
          toast.present();

        }

        
      })
      console.log("......", this.vendorList);
    } else
      this.userDataService.approveRequest(this.requestComment, this.req_id, this.user_id, this.admin_access_id, this.user_name).subscribe(async (ResData) => {
        console.log(ResData);

        if(ResData.result=="passed"){
          this.userDataService.check_unread(this.req_id);

          this.route.navigate(['/open-req']);

          const toast = await this.toastController.create({
          message: 'Request Approved.',
          duration: 2000
          });
          toast.present();

        }

      });

    

  }

}
