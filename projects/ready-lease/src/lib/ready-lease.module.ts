import { NgModule } from '@angular/core';
import { ReadyLeaseComponent } from './ready-lease.component';
import { ReadyLeaseForBidComponent } from './ready-lease-for-bid/ready-lease-for-bid.component';
import { BrowserModule } from '@angular/platform-browser';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { SimpleNotificationsModule } from 'angular2-notifications';



@NgModule({
  declarations: [ReadyLeaseComponent, ReadyLeaseForBidComponent],
  imports: [
    BrowserModule,TableModule,TabViewModule,CheckboxModule,
    FormsModule,DialogModule,BrowserAnimationsModule,FileUploadModule,HttpClientModule, SimpleNotificationsModule.forRoot(),
  ],
  exports: [ReadyLeaseComponent,ReadyLeaseForBidComponent]
})
export class ReadyLeaseModule { }
