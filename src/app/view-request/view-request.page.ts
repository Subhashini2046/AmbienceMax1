import { Component, OnInit } from '@angular/core';
import { ReqSchema } from '../Services/ReqSchema';
import { RequestService } from '../Services/RequestService';
import { UserDataService } from '../Services/UserDataService';
import * as FileSaver from 'file-saver';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Platform } from '@ionic/angular';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.page.html',
  styleUrls: ['./view-request.page.scss'],
})
export class ViewRequestPage implements OnInit {

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

  requestDetails: any[] = [];
tableData=[];
  req_no;
  description = "";
  subject = "";
  boqDescription: "";
  boqEstimatedCost: number;
  boqEstimatedTime: "";
  allocatedDays;
  allocationStartDate: " ";
  actualCost;
  RequestAllocatedVendor;
  requestComment;

  is_pnc = 0;

  req_id;

  filestage;
  fileName: any[] = [];
  BoqfileName: any[] = [];
  pncSupportingDoc: any[] = [];

  reqPnc;
  pncvendorSelection = '';

  dataSource: any[] = [];
  selectedElement: any[] = [];
  public selectedSpoc;
  pdfTableData: any[] = [];
  pdfObj = null;
  constructor(public RequestService: RequestService, public UserDataService: UserDataService, private file: File,
    private fileOpener: FileOpener, private plt: Platform) {
    // this.view = RequestService.viewReq;
    this.req_id = RequestService.ReqId;
  }

  ngOnInit() {

    this.UserDataService.getRequestDetail(this.req_id).subscribe((response: any) => {
      this.requestDetails = response;
      this.req_no = this.requestDetails[0]["RUMPRequestNumber"];
      this.currReq.budget_type = this.requestDetails[0]["BudgetType"];
      this.currReq.me_type = this.requestDetails[0]["METype"];
      this.currReq.available_budget = this.requestDetails[0]["RequestAvailableBudget"];
      this.currReq.balance_budget = this.requestDetails[0]["RequestBalanceBudget"];
      this.currReq.consumed_budget = this.requestDetails[0]["RequestConsumedBudget"];
      this.description = this.requestDetails[0]["RequestDescription"];
      this.currReq.req_swon = this.requestDetails[0]["RequestSWON"];
      this.subject = this.requestDetails[0]["RequestSubject"];
      this.currReq.req_type = this.requestDetails[0]["RequestType"];
      this.boqDescription = this.requestDetails[0]["BOQDescription"];
      this.boqEstimatedCost = this.requestDetails[0]["BOQEstimatedCost"];
      this.boqEstimatedTime = this.requestDetails[0]["BOQEstimatedTime"];
      this.allocatedDays = this.requestDetails[0]["AllocatedDays"];
      this.allocationStartDate = this.requestDetails[0]["AllocationStartDate"];
      this.actualCost = this.requestDetails[0]["ActualCost"];
      this.is_pnc = this.requestDetails[0]["ispnc"];
      this.currReq.req_initiator_id = this.requestDetails[0]["initiatorId"];
      this.currReq.req_level = this.requestDetails[0]["requestLevel"];
      this.currReq.req_status = this.requestDetails[0]["RequestStatus"];
      this.RequestAllocatedVendor = this.requestDetails[0]["RequestAllocatedVendor"];
      this.reqPnc = response[0]["PNCUrl"]
      if (this.reqPnc != null) {
        this.reqPnc = this.reqPnc.replace(/^.*[\\\/]/, '')
      };

      if (this.RequestAllocatedVendor != null) {
        this.UserDataService.getSpocDetails(this.req_id).subscribe((response: any) => {

          console.log("vendor : ", response.rumpvenVendorPK);

          //if(response.rumpvenVendorPK==this.RequestAllocatedVendor){
          this.dataSource = response;
          this.selectedElement = response;
          this.selectedSpoc = this.dataSource.length;


          console.log(response);
        });
      }

    });

    this.UserDataService.getHomComment(this.req_id).subscribe((res) => {
      this.requestComment = res[0].RUMPRequestComments;
    });

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

  }

  returnBlob(res): Blob {
    console.log('file downloaded');
    return new Blob([res], { type: 'pdf' });
  }

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

  // formate the date
  dateFormate(date) {
    let sDate = date.toString();
    let newDate = sDate.slice(0, 10) + " " + sDate.slice(11, 21);
    return newDate;

  }
  // responsible for inserting the extra space between the text 
  space(name) {
    let space = " Signature:________________ Date: 2020-05-29 10:06:31.0                                      "
    let count = space.length - name.length;

    let NumberOfspace = " ";
    for (let i = 0; i < count; i++) {
      NumberOfspace += " ";
    }
    return NumberOfspace;
  }
  ExportPDF() {
    this.UserDataService.getpdfTableData(this.req_id).subscribe((res: any) => {
      for(let i=0;i<res.length;i++){
        if(res[i]!=null){
          this.pdfTableData.push(res[i]);
        }
      }
     // this.pdfTableData = res;
console.log(this.pdfTableData);
      // const doc = new jsPDF('p', 'pt', 'a4');
      let reqNum = this.req_no.indexOf('Form');
      console.log(reqNum, 'reqNum');
      const data2 = [];
      // const columns3 = [[""]];
      data2.push([this.req_no.slice(reqNum, reqNum + 5)]);
      data2.push(["Request No: " + this.req_no + "             " + "Date: " + this.dateFormate(this.pdfTableData[0].actionTiming)]);
      data2.push(["SWON / WON : " + this.currReq.req_swon + "             " + "Budget: " + this.currReq.budget_type]);
      data2.push(["Available(INR): " + this.currReq.available_budget + "             " + "Consumed(INR): " + this.currReq.consumed_budget + "             " + "Balance(INR): " + this.currReq.balance_budget]);
      data2.push(["Subject: " + this.subject]);
      data2.push(["Description: " + this.description]);
      for (let i = 0; i < this.pdfTableData.length; i++) {
        if (this.pdfTableData[i].action == 'Initiated Phase 1') {
          let adspace1 = this.space("Initiator: User Dept/ Admin" + "               " + "Name: " + this.pdfTableData[i].user);
          data2.push(["Initiator: User Dept/ Admin" + "               " + "Name: " + this.pdfTableData[i].user + adspace1
            + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[i].actionTiming)])
        }
        else if (this.pdfTableData[i].roleId == 1) {
          let lspace1 = this.space("Recommender: Local Administration." + "               " + "Name: " + this.pdfTableData[i].user);
          data2.push(["Recommender: Local Administration." + "               " + "Name: " + this.pdfTableData[i].user + lspace1
            + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[i].actionTiming)])
        }
        else if (this.pdfTableData[i].roleId == 2) {
          let cspace1 = this.space("From : Cluster Head" + "               " + "Name: " + this.pdfTableData[i].user);
          data2.push(["From : Cluster Head" + "               " + "Name: " + this.pdfTableData[i].user + cspace1
            + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[i].actionTiming)])
          data2.push([" "]);
        }
        else if (this.pdfTableData[i].roleId == 3 || this.pdfTableData[i].roleId == 4) {
          let espace1 = this.space("From : Engineer" + "               " + "Name: " + this.pdfTableData[i].user);

          data2.push(["From : Engineer" + "               " + "Name: " + this.pdfTableData[i].user + espace1
            + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[i].actionTiming)])
          data2.push(["Description: " + this.boqDescription])
          data2.push(["Estimated cost for the work(INR): " + this.boqEstimatedCost])
          data2.push(["Estimated time for the work: " + this.boqEstimatedTime])
          data2.push([" "]);
        }
        else if (this.pdfTableData[i].roleId == 5) {
          let hspace1 = this.space("From : Head of Maintenance" + "               " + "Name: " + this.pdfTableData[i].user);

          data2.push(["From : Head of Maintenance" + "               " + "Name: " + this.pdfTableData[i].user + hspace1
            + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[i].actionTiming)])
          data2.push([" "]);
        }
        else if (this.pdfTableData[i].action == 'Initiated Phase 2') {
          let ispace1 = this.space("From : Initiator" + "               " + "Name: " + this.pdfTableData[i].user);

          data2.push(["From : Initiator" + "               " + "Name: " + this.pdfTableData[i].user + ispace1
            + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[i].actionTiming)])

          data2.push(["Actual Cost(INR): " + this.actualCost]);
          data2.push([" "]);
        }
        else if (this.pdfTableData[i].roleId == 6) {
          let bspace1 = this.space("From: Branch PMO" + "               " + "Name: " + this.pdfTableData[i].user);

          data2.push(["From: Branch PMO" + "               " + "Name: " + this.pdfTableData[i].user + bspace1
            + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[i].actionTiming)])
        }
        else if (this.pdfTableData[i].roleId == 7) {
          let aspace1 = this.space("Approved by: Administration Head" + "               " + "Name: " + this.pdfTableData[i].user);

          data2.push(["Approved by: Administration Head" + "               " + "Name: " + this.pdfTableData[i].user + aspace1
            + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[i].actionTiming)])
        }
        else if (this.pdfTableData[i].roleId == 9) {
          let cespace1 = this.space("Approved by: Administration Head" + "               " + "Name: " + this.pdfTableData[i].user);

          data2.push(["Approved by: Centre Head" + "               " + "Name: " + this.pdfTableData[i].user + cespace1
            + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[i].actionTiming)])
        }
      }
      const data1 = [];
      if (this.pdfTableData.length > 0) {
        data1.push(['User', 'Role', 'Action', 'Action Timing', 'Comment'])
        for (let i = 0; i < this.pdfTableData.length; i++) {
          data1.push([this.pdfTableData[i].user, this.pdfTableData[i].role1, this.pdfTableData[i].action, this.dateFormate(this.pdfTableData[i].actionTiming), this.pdfTableData[i].comment])
        }
      }
      var dd = {
        pageOrientation: 'portrait', margin: [0, 0, 0, 10], defaultStyle: { pdfFonts: 'Times' },
        content: [{text:"Request Details",margin: [190, 0, 30, 15],fontSize:15},
          {
            styles:
            {
              margin: [0, 30, 30, 15],
            },

            headerRows: 1,
            table: {
              widths: ['auto'],
              fillColor: '#eeeeee',
              body: data2

            },
            layout: {
              hLineWidth: function (i, node) {
                return (i === 0 || i === node.table.body.length) ? 1 : 1;
              },
              fillColor: function (i,node) {
                if (i == 0) return '#48C9B0';
                if (node.table.body[i][0].text== " ") return '#48C9B0';
                // if (i == 9) return '#48C9B0';
                // if (i == 14) return '#48C9B0';
                // if (i == 16) return '#48C9B0';
                // if (i == 19) return '#48C9B0';
              },
              fontStyle: function (i) {
                if (i == 0) return 'bold';
              },
              vLineWidth: function (i, node) {
                return (i === 0 || i === node.table.widths.length) ? 1 : 1;
              },
              hLineColor: function (i, node) {
                return (i === 0 || i === node.table.body.length) ? 'gray' : 'gray';
              },
              vLineColor: function (i, node) {
                return (i === 0 || i === node.table.widths.length) ? 'gray' : 'gray';
              },
              paddingLeft: (i, node) => 2,
              paddingRight: (i, node) => 2,
              paddingTop: (i, node) => 3,
              paddingBottom: (i, node) => 3
            }
            , pageBreak: 'after',


          },{text:"Request Workflow",margin: [190, 5, 30, 15],fontSize:15},
          {
            style: 'tableExample',
            table: {
              body: data1
            },
            layout: {
              hLineWidth: function (i, node) {
                return (i === 0 || i === node.table.body.length) ? 1 : 1;
              },
              fillColor: function (i) {
                if (i == 0) return '#48C9B0';
              },
              fontStyle: function (i) {
                if (i == 0) return 'bold';
              },
              vLineWidth: function (i, node) {
                return (i === 0 || i === node.table.widths.length) ? 1 : 1;
              },
              hLineColor: function (i, node) {
                return (i === 0 || i === node.table.body.length) ? 'gray' : 'gray';
              },
              vLineColor: function (i, node) {
                return (i === 0 || i === node.table.widths.length) ? 'gray' : 'gray';
              },
              paddingLeft: (i, node) => 4,
              paddingRight: (i, node) => 4,
              paddingTop: (i, node) => 5,
              paddingBottom: (i, node) => 5
            }
          },
        ]
      }

      this.pdfObj = pdfMake.createPdf(dd);
      // this.pdfObj = pdfMake.createPdf(dd2);
      console.log(this.pdfObj);
      const fileName = 'AmbienceMax_Form_' + this.req_id + '.pdf';
      if (this.plt.is('cordova')) {
        this.pdfObj.getBuffer((buffer) => {
          var blob = new Blob([buffer], { type: 'application/pdf' });

          // Save the PDF to the data Directory of our App
          this.file.writeFile(this.file.dataDirectory, fileName, blob, { replace: true }).then(fileEntry => {
            console.log("this.file.dataDirectory",this.file.dataDirectory);
            // Open the PDf with the correct OS tools
            //this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf');
          })
        });
      } else {
        // On a browser simply use download!
        this.pdfObj.download();
      }
    })



    return false;
  }
  // download pdf of request form

}
