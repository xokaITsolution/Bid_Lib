import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MyLibService } from '../my-lib.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'lib-lease-ready-for-bid',
  templateUrl: './lease-ready-for-bid.component.html',
  styleUrls: ['./lease-ready-for-bid.component.css']
})
export class LeaseReadyForBidComponent implements OnInit {
  isEdit: boolean;
  @Output() completed=new EventEmitter()
  @Input()  license_service: any;
  isDone: boolean;
  highlighted
  displayDeed:boolean
  displayplan:boolean
  yearlyBidPlans: any;
  plan_id: any;
  suspended: any;
  License: string;
  approve: boolean;
  Plan_No: any;
  constructor(
    private sanitizer: DomSanitizer,
  private apiService:MyLibService,private notificationsService: NotificationsService,) { }
  leaseReadyForBid: LeaseReadyForBid = {
    rbidid: null,
    plan_ID: null,
    title_Deed_No: '',
    cerficate_ID: 0,
    is_Active: false,
    created_By: '',
    date: '',
    updated_By: '',
    updated_Date: '',
    no_Bid_Floated: 0
  };

  leaseReadyForBids: LeaseReadyForBid[] = [];
  ngOnInit(): void {
    this.getDeptSusp()
    this.apiService.getUserName().subscribe((res:any)=>{
      console.log('logUser',res);
    })
    //  this.getLicenseService(this.license_service)
    this.License=this.apiService.getLicense();
    console.log(' this.License', this.License);
    
    if(this.License!=null || this.License!=undefined){
      this.approve=true
      this.apiService.getPlan_DetailById(this.License).subscribe((res:any)=>{
        this.plan_id=res.procPlan_Details[0].plan_Detail_ID
        this.getView_Yearly_Bid_Plan(this.plan_id)     
        this.getReadyLease(this.plan_id)
      })
   }else{
     this.approve=false
   }
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('changes',changes)
  }
  getLicenseService(license_service){
    this.apiService.getBid_License_Service(license_service).subscribe((res:any)=>{
      console.log('ressssss',res);
      this.plan_id=res.procBid_License_Services[0].plan_ID
      this.leaseReadyForBid.plan_ID=res.procBid_License_Services[0].plan_ID
})
  }
  submitForm() {
    this.leaseReadyForBid.rbidid=generateGuid()
    this.apiService.insertLease_Ready_forBid(this.leaseReadyForBid).subscribe((res:any)=>{
      const toast =
      this.notificationsService.success("Sucess Ready Lease Saved");
      this.getReadyLease(this.plan_id)
    },
    (error) => {
      console.log(error);

      const toast = this.notificationsService.error(
        "Error",
        error.error
      );
    
    })
    this.resetForm();
    this.isDone=true
  }
  getReadyLease(plan_id){

    this.apiService.getView_Lease_Ready_For_BidPlanDetail(plan_id).subscribe((Ready_Lease:any)=>{
      this.leaseReadyForBids=Ready_Lease
      console.log(' this.leaseReadyForBids', this.leaseReadyForBids);
      
    })
  }
  resetForm() {
    this.leaseReadyForBid = {
      rbidid: null,
      plan_ID: null,
      title_Deed_No: '',
      cerficate_ID: null,
      is_Active: false,
      created_By: '',
      date: '',
      updated_By: '',
      updated_Date: '',
      no_Bid_Floated: 0
    };
  }
  getView_Yearly_Bid_Plan(plan_id){
    this.apiService.getView_Yearly_Bid_PlanById(plan_id).subscribe((View_Yearly_Bid_Plan:any)=>{
      this.yearlyBidPlans=View_Yearly_Bid_Plan
    })
  }
  selectApplication(app){
    this.displayDeed=false
this.leaseReadyForBid.title_Deed_No=app.title_Deed_No
this.leaseReadyForBid.cerficate_ID=app.certificate_Version_No
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
    this.Plan_No=plan.plan_No
    // this.plan_id=plan.year
    this.leaseReadyForBid.plan_ID=plan.plan_ID
  }
  update(){
    this.apiService.updateLease_Ready_forBid(this.leaseReadyForBid).subscribe((res:any)=>{
      const toast =
      this.notificationsService.success("Sucess updated");
      this.getReadyLease(this.plan_id)
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
    // this.plan_id=plan.year
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
    // this.plan_id=''
    this.highlighted=''
  }
}
interface LeaseReadyForBid {
  rbidid: any;
  plan_ID: number;
  title_Deed_No: string;
  cerficate_ID: number;
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
