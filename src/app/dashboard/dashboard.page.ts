import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController, NavController, PopoverController } from '@ionic/angular';
import { DashboardPopoverComponent } from '../dashboard-popover/dashboard-popover.component';
import { UserDataService } from '../Services/UserDataService';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';
import { RequestService } from '../Services/RequestService';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit,OnDestroy {

  main = this.UsrDataService.main;

  private reqSub: Subscription;
  public Open = this.UsrDataService.openRequests.length;
  public UnderNeg = this.UsrDataService.underNegRequests.length;
  public All;
  public Pending;
  public Closed;
  public Complete;
  public role_id;
  private space;
  public switchrole_key=0;
  ChartType = 'bar';

  currentRoleSubscribtion: Subscription;

  menus=[];
  selectvalue=[];

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };

  barChartLabels: Label[] = [ 'Pending' , 'Open', 'Closed' , 'Completed'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[] = [];



  doughnutChartLabels: Label[] = [ 'Pending', 'Open' , 'Closed', 'Completed'];
  doughnutChartData: MultiDataSet = [];

  doughnutChartType: ChartType = 'doughnut';



  constructor(
    private menu: MenuController, 
    public popoverController: PopoverController, 
    public UsrDataService: UserDataService,
    public requestService: RequestService,
    public navCtrl: NavController,
    private router: Router) {

   }


  ngOnInit() {
    
    this.currentRoleSubscribtion = this.UsrDataService.changedetectInRole.subscribe(data=>{
      // this.ngOnInit();
      // this.ionViewWillEnter();
    

    console.log('ngOnint Dashboard!');
    this.UsrDataService.mainObservable().subscribe( e => {
      this.main = e;
    });


    
    this.UsrDataService.getUsers_dash(localStorage.getItem('userId')).subscribe(data=>{
      console.log(data);
      this.menus=JSON.parse(JSON.stringify(data));
    });

      this.role_id = JSON.parse(localStorage.getItem('role_id'));
      console.log('role_id',this.role_id);
      this.space = JSON.parse(localStorage.getItem('space'));
      console.log('space',this.space);

      if (this.role_id != null && this.space != null) {
        
        let response:any=  this.requestService.getRequest(this.role_id,this.space).subscribe((response:any)=>{
        this.Pending = response.req_stats.Pending;
        this.All = response.req_stats.All;
        this.Open = response.req_stats.Open;
        this.Closed = response.req_stats.Closed;
        this.Complete = response.req_stats.Completed;

        this.barChartData = [
          {
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(0,128,0,0.2)'],
            borderColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(0,128,0)'],
            borderWidth: 1,
            barPercentage: 0.5,
            barThickness: 70,
            maxBarThickness: 80,
            minBarLength: 5,
            data: [this.Pending, this.Open, this.Closed, this.Complete],
            label: 'No Of Requests'
          }
        ];

        this.doughnutChartData = [
          
          this.Pending, this.Open, this.Closed, this.Complete
        ]


       
      });

    }

  })

  }


  ngOnDestroy(){
    this.currentRoleSubscribtion.unsubscribe();
  }

  ionViewWillEnter(){

    console.log('ngOnint Dashboard!');
    this.UsrDataService.mainObservable().subscribe( e => {
      this.main = e;
    });
    
    this.UsrDataService.getUsers_dash(localStorage.getItem('userId')).subscribe(data=>{
      console.log(data);
      this.menus=JSON.parse(JSON.stringify(data));
    });

      this.role_id = JSON.parse(localStorage.getItem('role_id'));
      console.log('role_id',this.role_id);
      this.space = JSON.parse(localStorage.getItem('space'));
      console.log('space',this.space);

      if (this.role_id != null && this.space != null) {
        
        let response:any=  this.requestService.getRequest(this.role_id,this.space).subscribe((response:any)=>{
        this.Pending = response.req_stats.Pending;
        this.All = response.req_stats.All;
        this.Open = response.req_stats.Open;
        this.Closed = response.req_stats.Closed;
        this.Complete = response.req_stats.Completed;

        this.barChartData = [
          {
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(0,128,0,0.2)'],
            borderColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(0,128,0)'],
            borderWidth: 1,
            barPercentage: 0.5,
            barThickness: 70,
            maxBarThickness: 80,
            minBarLength: 5,
            data: [this.Pending, this.Open, this.Closed, this.Complete],
            label: 'No Of Requests'
          }
        ];

        this.doughnutChartData = [
          
          this.Pending, this.Open, this.Closed, this.Complete
        ]


       
      });

    }

  }

  topending(){
    this.router.navigate(['/pending-req']);
  }

  toopen(){
    this.router.navigate(['/open-req']);
  }

  toclose(){
    this.router.navigate(['/closed-req']);
  }

  tocomplete(){
    this.router.navigate(['/completed-req']);
  }

  // navigateToDashboard(role,space,id,name,desc){
  //   this.switchrole_key = 0;
  //   console.log(id,"id");
  //   console.log(role,"role");
  //   console.log(space,"space");
  //   localStorage.setItem('role_id', JSON.stringify(role));
  //   localStorage.setItem('space', JSON.stringify(space));
  //   localStorage.setItem('admin_access_id', JSON.stringify(id));
  //   localStorage.setItem('role_name',JSON.stringify(name));
  //   localStorage.setItem('designation',JSON.stringify(desc));
  //   this.ngOnInit();
    
  //  // this.router.navigate(['/dashboard']);
  //   this.UsrDataService.changedetectInRole.next({role:role,space:space,id:id})
  // }
  

  // onChange(role,space,id){
  //   console.log(id,"id");
  //   localStorage.setItem('role_id', JSON.stringify(role));
  //   localStorage.setItem('space', JSON.stringify(space));
  //   localStorage.setItem('admin_access_id', JSON.stringify(id));
  //   this.router.navigate(['/dashboard']);
  //   this.UsrDataService.changedetectInRole.next({role:role,space:space,id:id})
  // }

  getRoleName(name,roledesc){
    return roledesc+" | "+name
  }

  public chartColors: Array<any> = [
    { // all colors in order
      backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(255, 159, 64, 0.5)', 'rgba(54, 162, 235, 0.5)' , 'rgba(0,128,0,0.5)']
    }
]



  // openFirst() {
  //   this.menu.enable(true, 'first');
  //   this.menu.open('first');
  // }

  // openEnd() {
  //   this.menu.open('end');
  // }

  // openCustom() {
  //   this.menu.enable(true, 'custom');
  //   this.menu.open('custom');
  // }

  async presentPopup(event){
    const popover = await this.popoverController.create({
      component: DashboardPopoverComponent,
      event
    });
    return await popover.present();
  }

}
