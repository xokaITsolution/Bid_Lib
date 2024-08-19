import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MyLibService } from '../my-lib.service';
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute, Params } from '@angular/router';

interface BidDetail {
  bid_Detail_Id: any;
  bid_No: number;
  title_Deed_No: any;
  certificate_No: string;
  total_Min_Bid_Price: number;
  location: string;
  size: number;
  bidder_Capacity_In_Birr:number
}

@Component({
  selector: 'lib-bid-detail',
  templateUrl: './bid-detail.component.html',
  styleUrls: ['./bid-detail.component.css']
})
export class BidDetailComponent {
  highlighted;
  maxWidth: string = "1400px";
  maxheight: string;
  selectedTab = 0;
  @Input()  license_service: any;
  @Output() completed=new EventEmitter()
  tab1;
  displayReadyLease:any
  ismodaEnable:boolean;
  tab2;
  bidDetail: BidDetail = {
    bid_Detail_Id:null,
    bid_No: 0,
    title_Deed_No: '',
    certificate_No: '',
    total_Min_Bid_Price: 0,
    location: '',
    size: 0,
    bidder_Capacity_In_Birr:0
  };
  leaseReadyForBids: any;
  License: string;
  approve: boolean;
  plan_id: any;
  Plot_Limit: any;
  totalSize: any;
  formcode: any;
  taskid: any;
  service_id: any;
  IsPosted: boolean;
  constructor(private notificationsService: NotificationsService,
    private sanitizer: DomSanitizer,private activatedRoute: ActivatedRoute,
  private apiService:MyLibService) { }
  bidDetails: BidDetail[] = [];
  plan_Document: any;
  isDone: boolean;
  isEdit: boolean;
  Public_bid_No: any;
  ngOnInit() {
    this.License=this.apiService.getLicense();
    if(this.License!=null || this.License!=undefined){
      this.approve=true
      this.apiService.getPlan_DetailById(this.License).subscribe((res:any)=>{
        this.plan_id=res.procPlan_Details[0].plan_Detail_ID
        this.getReadyLease(this.plan_id)
        this.activatedRoute.params.subscribe((params: Params) => {
          console.log('paramsss',params);
          this.formcode=params.formcode
          this.taskid=params.tskID
          this.service_id=params.SDP_ID
          if (this.taskid=='7590b7c4-54cd-43d7-b887-9f0c520ad17a'){
          this.IsPosted=false
        }else if(this.taskid=='08d1e87b-e2a5-4cee-9d47-b1106590418b'){
        this.IsPosted=true
        }}
        )
      })
    }else{
      this.approve=false
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('changes',changes);
    
    // this.fetchData()
 
}
  submitForm() {
    this.bidDetail.bid_Detail_Id=generateGuid()
    this.totalSize = (this.bidDetails.reduce((sum, item) => sum + item.size, 0)) + this.bidDetail.size;

    
    if (this.totalSize > this.Plot_Limit) {
      console.log('Total size exceeds plot limit');
      const toast = this.notificationsService.error("Error", "Total size exceeds plot size of the Plan");
      return; // Exit the function if the condition is not met
    }
    console.log('this.totalSize', this.totalSize);

   this.apiService.insertBid_Detail(this.bidDetail).subscribe((res:any)=>{
    console.log(res);
    
    // this.resetForm();
    this.isDone=true
  const toast =
  this.notificationsService.success("Sucess Ready Lease Saved");
  this.fetchData(this.bidDetail.bid_No)
},
(error) => {
  console.log(error);

  const toast = this.notificationsService.error(
    "Error",
    error.error
  );

})
  }
  onSelectReadyLease(bid){
    this.bidDetail.title_Deed_No=bid.title_Deed_No
    this.bidDetail.certificate_No=bid.cerficate_ID
    this.bidDetail.size=bid.plot_Size_M2
    this.bidDetail.total_Min_Bid_Price=bid.current_Lease_Price
    this.displayReadyLease=false
  }
  getReadyLease(plan_id){
    this.apiService.getView_Lease_Ready_For_BidPlanDetail(plan_id).subscribe((Ready_Lease:any)=>{
      this.leaseReadyForBids=Ready_Lease
    })
  }
  tabChanged(e) { 
    console.log(e.index);
    if (e.index == 0) {
      this.tab1 = true;
      this.tab2 = false;
    } else if (e.index == 1) {
      this.tab1 = false;
      this.tab2 = true;
    }
  }
  Next(event){
 
    this.selectedTab = 1
    this.Public_bid_No=event.bid_No
    this.Plot_Limit=event.total_Sizeof_plot
    this.bidDetail.bid_No=this.Public_bid_No
    this.fetchData(event.bid_No)
  }
  fetchData(bid_no){
    this.apiService.getBid_DetailById(bid_no).subscribe((Bid_detail:any)=>{
      this.bidDetails = Bid_detail.procBid_Details;
      
      const titleDeedNosInData = this.bidDetails.map((d: BidDetail) => String(d.title_Deed_No)); 
      console.log('this.leaseReadyForBids1',this.leaseReadyForBids,titleDeedNosInData);
      this.leaseReadyForBids = this.leaseReadyForBids.filter(b => !titleDeedNosInData.includes(String(b.title_Deed_No)));
    })
  }
  update(){
    this.totalSize = (this.bidDetails.reduce((sum, item) => sum + item.size, 0)) + this.bidDetail.size;

    
    if (this.totalSize > this.Plot_Limit) {
      console.log('Total size exceeds plot limit');
      const toast = this.notificationsService.error("Error", "Total size exceeds plot size of the Plan");
      return; // Exit the function if the condition is not met
    }
this.apiService.updateBid_Detail(this.bidDetail).subscribe((res:any)=>{

  this.isDone=true
  const toast =
  this.notificationsService.success("Sucess Ready Lease Updated");
  this.fetchData(this.bidDetail.bid_No)
},
(error) => {
  console.log(error);

  const toast = this.notificationsService.error(
    "Error",
    error.error
  );

})
  }
  onRowSelect(plan){
    this.bidDetail=plan
    this.isEdit=true 
   
  }
  done(){
    this.completed.emit()
  }
  acceptLatLong(event){
    console.log('event',event);
    this.ismodaEnable=false
    this.bidDetail.location='https://www.google.com/maps?q='+event.lat+','+event.lng
  }
  openGoogleMaps(value): void {
    // const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(value, '_blank');
  }
  resetForm() {
    console.log('reseted');
    
    this.bidDetail = {
      bid_Detail_Id:null,
      bid_No: 0,
      title_Deed_No: '',
      certificate_No: '',
      total_Min_Bid_Price: 0,
      location: '',
      size: 0,
      bidder_Capacity_In_Birr:0
    };
    this.bidDetail.bid_No=this.Public_bid_No
    this.isEdit=false
  }
}
function generateGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}