import { Component, OnDestroy, SystemJsNgModuleLoader } from '@angular/core';
import { AlertController,ToastController } from '@ionic/angular';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserDataService } from './Services/UserDataService';
import { Button } from 'protractor';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Console } from 'console';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy {

  public user_name;
  public user_role;
  public user_id;
  public user_desc;
  public current_user;
  public image_url;

  
  selected_role=[];

  menus=[];
  selectvalue=[];
  public switchrole_key=0;


  constructor(
    private http: HttpClient,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public UsrDataService: UserDataService,
    public alertconrol: AlertController,
    public router: Router,
    public sanitizer: DomSanitizer,
    public toastcontroll: ToastController
  ) {
    this.initializeApp();
    // if (this.UsrDataService.userId === null || this.UsrDataService.userId === undefined){
    //   if(JSON.parse(localStorage.getItem('userData'))) {
    //     this.UsrDataService.userId = JSON.parse(localStorage.getItem('userData')).userId;
    //   }
    // }


   // this.user_id = this.UsrDataService.userId;

  }

  initializeApp() {
    this.platform.ready().then(() => {
     // this.statusBar.styleDefault();
      // this.splashScreen.hide();

      setTimeout(() => {
        this.splashScreen.hide();
      }, 1000);

    });
  }

  // ngOnInit(){

    

   

  //   this.user_id = localStorage.getItem('userId');
  //   this.user_name = localStorage.getItem('user_name');
  //   this.user_role = localStorage.getItem('role_name');
  //   this.user_desc = localStorage.getItem('designation');

  //   console.log("role",this.user_role);


  //   this.UsrDataService.getUsers_dash(localStorage.getItem('userId')).subscribe(data=>{
  //     console.log(data);
  //     this.menus=JSON.parse(JSON.stringify(data));
  //   });


  //   this.user_name = this.user_name.replace(/"/g,"");
  //   this.user_role = this.user_role.replace(/"/g,"");
  //   this.user_desc = this.user_desc.replace(/"/g,"");

  //   this.current_user = this.user_role + ' | ' + this.user_desc;


  //   let response:any = this.UsrDataService.getImage(this.user_id).subscribe((response:any) =>{
  //     console.log(response);

  //     this.createImageFromBlob(response.body);

  //     // console.log("img: ", this.image_url);

  //     // File.readAsDataURL(cordova.file.dataDirectory,this.image_url).then(imageBase64 => {
  //     //   self.urlToShow = imageBase64;
  //     //   });

  //   });
  // }

  navigationFun(){
    
    console.log("init at navigation open");

    this.user_id = localStorage.getItem('userId');
    this.user_name = localStorage.getItem('user_name');
    this.user_role = localStorage.getItem('role_name');
    this.user_desc = localStorage.getItem('designation');


    this.UsrDataService.getUsers_dash(localStorage.getItem('userId')).subscribe(data=>{
      console.log(data);
      this.menus=JSON.parse(JSON.stringify(data));
    });


    this.user_name = this.user_name.replace(/"/g,"");
    this.user_role = this.user_role.replace(/"/g,"");
    this.user_desc = this.user_desc.replace(/"/g,"");

    this.current_user = this.user_role + ' | ' + this.user_desc;


    let response:any = this.UsrDataService.getImage(this.user_id).subscribe((response:any) =>{
      console.log(response);

      this.createImageFromBlob(response.body);
   //   this.image_url = response.admPhotoURL.replace(/^.*[\\\/]/, '');

      // console.log("img: ", this.image_url);

    });
  }

  ngOnDestroy(){
   
  }

  public makealert(){

    this.presentAlert(this.user_name);

  }

  async presentAlert(user_id: any){
    const alert = await this.alertconrol.create({

      message: '<div class="center"> <img class="card-alert" [src]="image_url"/></div> <div class="center"><p>{{this.username}}</p></div>',
      buttons: ['Ok']

    });

    await alert.present();

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

  navigateToDashboard(selected_role){
    this.switchrole_key = 0;
    console.log(selected_role.id,"id");
    console.log(selected_role.role,"role");
    console.log(selected_role.space,"space");
    localStorage.setItem('role_id', JSON.stringify(selected_role.role));
    localStorage.setItem('space', JSON.stringify(selected_role.space));
    localStorage.setItem('admin_access_id', JSON.stringify(selected_role.sid));
    localStorage.setItem('role_name',JSON.stringify(selected_role.name));
    localStorage.setItem('designation',JSON.stringify(selected_role.roledesc));
    this.navigationFun();
    
   // this.router.navigate(['/dashboard']);
    this.UsrDataService.changedetectInRole.next({role:selected_role.role,space:selected_role.space,id:selected_role.sid})
  }

  getRoleName(name,roledesc){
    return roledesc+" | "+name
  }

  async logout(){
    localStorage.clear();
    // this.UsrDataService.fetchedReqsUpdated.next(this.UsrDataService.fetchedReqs);
    this.UsrDataService.main = '';
    this.router.navigateByUrl('');
    return false;
  }

  returnBlob(res): Blob {
    console.log('file downloaded');
    return new Blob([res], { type: 'image' });
  }

  createImageFromBlob(image: Blob){

    const reader = new FileReader();

    reader.onloadend = (evt) => {
      this.image_url = reader.result;
    //  this.image_url.replace(/^.*[\\\/]/, '');
    };

    reader.readAsDataURL(image);

  }
  

}
