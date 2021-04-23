import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard-popover',
  templateUrl: './dashboard-popover.component.html',
  styleUrls: ['./dashboard-popover.component.scss'],
})
export class DashboardPopoverComponent implements OnInit {

  constructor(public popoverController: PopoverController) { }

  ngOnInit() {}

  close(){

    this.popoverController.dismiss();

  }

}
