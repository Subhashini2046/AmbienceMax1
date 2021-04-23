import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { Console } from 'console';
import { UserDataService } from '../Services/UserDataService';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  userId : number;
  password = '';

  menus=[];

  name = "";

  constructor(private router: Router, 
    private UserDataService: UserDataService,
    private nav: NavController,
    private menu: MenuController ) {

      // this.menu.enable(false);

  }
  
  ngOnInit(){

    

  }


  onLogin(){
    console.log(this.userId);
    // this.UserDataService.authenticateUser(this.email, this.password);
    this.UserDataService.authenticateUser1(this.userId, this.password);



    // this.UserDataService.getUsers_dash(localStorage.getItem('userId')).subscribe(data=>{
    //   console.log(data);
    //   this.menus=JSON.parse(JSON.stringify(data));
    // });

    // console.log("menu",this.menus);

    //localStorage.setItem('role_name',JSON.stringify(name));

    this.userId = null;
    this.password = "";
    

  }

  onPageDidEnter(){
    this.menu.enable(false);
  }

  onPageDidLeave(){
    this.menu.enable(true);
  }

}
