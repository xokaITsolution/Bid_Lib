import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyLibComponent } from './my-lib.component';
import { LeaseYearlyBidPlanComponent } from './lease-yearly-bid-plan/lease-yearly-bid-plan.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import this module
import { HttpClient, HttpClientModule } from '@angular/common/http';  
import { DialogModule } from "primeng/dialog";
import { LeaseReadyForBidComponent } from './lease-ready-for-bid/lease-ready-for-bid.component';
import { BidDetailComponent } from './bid-detail/bid-detail.component';
import { LeaseBidComponent } from './lease-bid/lease-bid.component';
import { FileUploadModule } from "primeng/fileupload";
import { TableModule } from "primeng/table";
import {TabViewModule} from 'primeng/tabview';
import { CheckboxModule } from "primeng/checkbox";
import { GisMapComponent } from './gis-map/gis-map.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PlanDetailComponent } from './plan-detail/plan-detail.component';
@NgModule({
  declarations: [MyLibComponent, LeaseYearlyBidPlanComponent, LeaseReadyForBidComponent, BidDetailComponent, LeaseBidComponent, GisMapComponent, PlanDetailComponent],
  imports: [BrowserModule,TableModule,TabViewModule,CheckboxModule, BrowserModule,
    ReactiveFormsModule ,
    FormsModule,DialogModule,BrowserAnimationsModule,FileUploadModule,HttpClientModule, SimpleNotificationsModule.forRoot(),
  ],
  exports: [MyLibComponent,LeaseYearlyBidPlanComponent,LeaseReadyForBidComponent,LeaseBidComponent,
    BidDetailComponent,PlanDetailComponent
  ]
})
export class MyLibModule { }
