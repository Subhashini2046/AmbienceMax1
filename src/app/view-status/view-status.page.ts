import { Component, OnInit } from '@angular/core';
import { RequestService } from '../Services/RequestService';
import { UserDataService } from '../Services/UserDataService';

@Component({
  selector: 'app-view-status',
  templateUrl: './view-status.page.html',
  styleUrls: ['./view-status.page.scss'],
})
export class ViewStatusPage implements OnInit {

  req_id;

  view_id = null;
  view_name = null;
  view_status = null;
  public viewStatus: views1;
  public viewStatus1: views1[] = [];

  dataSource: any[] = [];
  dataSource1: any[] = [];

  members;
  public userId;
  w_flow: any[] = [];
  role: any[] = [];
  req_level;
  reqStatus;
  initiator;
  is_pnc;

  constructor(public RequestService:RequestService, public UsrDataService: UserDataService) { 

    this.req_id = RequestService.ReqId;

  }

  ngOnInit() {

    this.UsrDataService.getViewRequestStatus(this.req_id).subscribe((res => {
      console.log("res:",res);
      this.dataSource = res.reqLog;
      this.w_flow = res.w_flow;
      this.req_level = res.requestLevel;
      this.initiator = res.intiator_id;
      this.reqStatus = res.reqStatus;
      this.is_pnc=res.ispnc;
      let j = 0;
      for (let i = 0; i < res.role.length; i++) {

        if ((res.role[i][0] == null)) {
          this.role[i] = null;
        }
        else {
          this.role[i] = res.role[i][0]["pickRUMPRoleDescription"];
        }
//this.role[i] = res.role[i][0]["pickRUMPRoleDescription"];
      }
      for (let i = 0; i < this.w_flow.length; i++) {
        if ((this.req_level.toString().trim() == this.w_flow[i]) &&
          (this.reqStatus.toString().trim() === 'Pending')) {

            if(!(this.initiator==this.req_level && this.is_pnc==0)){

              for (j; j < i; j++) {
                this.view_id = this.w_flow[j];
                this.view_name = this.role[j];
                this.view_status = "Approved";
                if (this.role[j] == null) { this.view_status = null }
                this.viewStatus = {
                  id: this.view_id,
                  name: this.view_name,
                  status: this.view_status
                };
                this.viewStatus1.push(this.viewStatus);
              }
            }
              for (j; j < this.w_flow.length; j++) {
                this.view_id = this.w_flow[j];
                this.view_name = this.role[j];
                this.view_status = "Pending";
                if (this.role[j] == null) { this.view_status = null }
                this.viewStatus = {
                  id: this.view_id,
                  name: this.view_name,
                  status: this.view_status
                };
                this.viewStatus1.push(this.viewStatus);
              }
            

        }
        if ((this.req_level == this.initiator) &&
          (this.reqStatus.toString().trim() === 'Closed')) {

          this.view_id = this.w_flow[i];
          this.view_name = this.role[i];
          this.view_status = "Approved";
          if (this.role[i] == null) { this.view_status = null }
          this.viewStatus = {
            id: this.view_id,
            name: this.view_name,
            status: this.view_status
          };
          this.viewStatus1.push(this.viewStatus);

        }

        if ((this.req_level == this.initiator) &&
          (this.reqStatus.toString().trim() === 'Completed')) {

          this.view_id = this.w_flow[i];
          this.view_name = this.role[i];
          this.view_status = "Approved";
          if (this.role[i] == null) { this.view_status = null }
          this.viewStatus = {
            id: this.view_id,
            name: this.view_name,
            status: this.view_status
          };
          this.viewStatus1.push(this.viewStatus);
          console.log( this.viewStatus1);
        }

      }
      console.log(this.viewStatus1);

      for(let i=0;i<this.viewStatus1.length;i++){
        if (this.viewStatus1[i]["name"] == null) {
          this.viewStatus1.splice(i, 1);
        }
      }

      this.dataSource1 = this.viewStatus1;
    }));

  }

}

export interface views1 {
  id: number;
  name: String;
  status: String;
}