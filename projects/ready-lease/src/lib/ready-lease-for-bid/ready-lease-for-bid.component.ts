import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ReadyLeaseService } from '../ready-lease.service';
import { NotificationsService } from 'angular2-notifications';
@Component({
  selector: 'lib-ready-lease-for-bid',
  templateUrl: './ready-lease-for-bid.component.html',
  styleUrls: ['./ready-lease-for-bid.component.css']
})
export class ReadyLeaseForBidComponent implements OnInit {
  isEdit: boolean;
  @Output() completed=new EventEmitter()
  isDone: boolean;
  highlighted
  displayDeed:boolean
  displayplan:boolean
  yearlyBidPlans: any;
  plan_id: any;
  suspended: any;
  constructor(
    private sanitizer: DomSanitizer,
  private apiService:ReadyLeaseService,private notificationsService: NotificationsService,) { }
  leaseReadyForBid: LeaseReadyForBid = {
    rbidid: null,
    plan_ID: null,
    title_Deed_No: '',
    certificate_ID: 0,
    is_Active: false,
    created_By: '',
    date: '',
    updated_By: '',
    updated_Date: '',
    no_Bid_Floated: 0
  };

  leaseReadyForBids: LeaseReadyForBid[] = [];
  ngOnInit(): void {
   this.getView_Yearly_Bid_Plan()
   this.getDeptSusp()
   this.getReadyLease()
  }
  submitForm() {
    this.leaseReadyForBids.push({ ...this.leaseReadyForBid });
    this.resetForm();
    this.isDone=true
  }
  getReadyLease(){
    this.apiService.getView_Lease_Ready_For_Bid().subscribe((Ready_Lease:any)=>{
      this.leaseReadyForBids=Ready_Lease
    })
  }
  resetForm() {
    this.leaseReadyForBid = {
      rbidid: null,
      plan_ID: null,
      title_Deed_No: '',
      certificate_ID: null,
      is_Active: false,
      created_By: '',
      date: '',
      updated_By: '',
      updated_Date: '',
      no_Bid_Floated: 0
    };
  }
  getView_Yearly_Bid_Plan(){
    this.apiService.getView_Yearly_Bid_Plan().subscribe((View_Yearly_Bid_Plan:any)=>{
      this.yearlyBidPlans=View_Yearly_Bid_Plan
    })
  }
  selectApplication(app){
    this.displayDeed=false
this.leaseReadyForBid.title_Deed_No=app.title_Deed_No
this.leaseReadyForBid.certificate_ID=app.certificate_Version_No
  }
  fetchData(){
    // this.apiService.getView_Lease_Ready_For_Bid().subscribe(res)
  }
  getDeptSusp(){
    this.apiService.getDeptSuspension().subscribe((suspended:any)=>{
      this.suspended=suspended
      console.log('this.suspended',this.suspended);
      
    })
  }
  selectPlan(plan){
    this.displayplan=false
    this.plan_id=plan.year
    this.leaseReadyForBid.plan_ID=plan.plan_ID
  }
  update(){
    this.apiService.updateLease_Ready_forBid(this.leaseReadyForBid).subscribe((res:any)=>{
      const toast =
      this.notificationsService.success("Sucess updated");
    },
    (error) => {
      console.log(error);

      const toast = this.notificationsService.error(
        "Error",
        error.error
      );
    })
    this.isDone=true
  }
  onRowSelect(plan){
    this.leaseReadyForBid=plan
    console.log(plan);
    this.leaseReadyForBid.date=this.formatDate(plan.date)
    this.plan_id=plan.year
    this.isEdit=true 
  }
  done(){
    this.completed.emit()
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  addNew(){
    this.resetForm()
    this.isEdit=false
    this.plan_id=''
    this.highlighted=''
  }
}
interface LeaseReadyForBid {
  rbidid: number;
  plan_ID: number;
  title_Deed_No: string;
  certificate_ID: number;
  is_Active: boolean;
  created_By: string;
  date: string;
  updated_By: string;
  updated_Date: string;
  no_Bid_Floated: number;
}
function generateGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}