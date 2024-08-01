import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import this module

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyLibModule } from 'projects/my-lib/src/public-api';
import {ReadyLeaseModule} from 'projects/ready-lease/src/public-api'
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ReadyLeaseForBidComponent } from './ready-lease-for-bid/ready-lease-for-bid.component';

@NgModule({
  declarations: [
    AppComponent,
    ReadyLeaseForBidComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    MyLibModule,ReadyLeaseModule,
    DialogModule,
    BrowserAnimationsModule, SimpleNotificationsModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
