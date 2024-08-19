import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MyLibService } from '../my-lib.service';
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute, Params } from '@angular/router';

interface BidResult {
  bid_ID: string,
  title_Deed_No: string,
  certificate_ID: string,
  customer_ID: string,
  rank: string,
  created_date: any,
  is_Approved: any,
  status: string,
  app_Code: string,
  remark: string,
  is_CPO_Returned:any
}
interface Update_to_do_List {
  application_code: any,
  
}
class BidGrouping {
  // Function to group bids by title_Deed_No and merge duplicates
  groupBidsByTitleDeedNo(bidDetails: BidResult[]): any[] {
    const groupedMap: Map<string, BidResult> = new Map();

    // Group and merge records by title_Deed_No
    for (const bid of bidDetails) {
      const titleDeedNo = bid.title_Deed_No;

      if (!groupedMap.has(titleDeedNo)) {
        groupedMap.set(titleDeedNo, bid);
      } else {
        // If already exists, merge records or handle as needed
        // This will replace the previous record with the current one
        // Adjust this logic if you want to merge data differently
        groupedMap.set(titleDeedNo, { ...groupedMap.get(titleDeedNo)!, ...bid });
      }
    }

    // Convert Map to array
    return Array.from(groupedMap.values());
  }
}
@Component({
  selector: 'lib-bid-result',
  templateUrl: './bid-result.component.html',
  styleUrls: ['./bid-result.component.css']
})
export class BidResultComponent  {
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
  Form=false
  bidResult: BidResult = {
    bid_ID: null,
  title_Deed_No: null,
  certificate_ID: null,
  customer_ID: null,
  rank: null,
  created_date: null,
  is_Approved: null,
  status: null,
  app_Code: null,
  remark: null,
  is_CPO_Returned:null
  };
  update_to_do_List:Update_to_do_List= {
    application_code: null
  }
  leaseReadyForBids: any;
  License: string;
  approve: boolean;
  plan_id: any;
  Plot_Limit: any;
  totalSize: any;
  Bid_No:any
  statusLookUp: any;
  taskCompletedSuccessfully: boolean=false;
  proc_View_Bid_Result: any;
  Title_Deed_No: any;
  formcode: any;
  taskid: any;
  service_id: any;
  onAproved: boolean;
  bidType: string;
  bidFloated: number;
  isFunctional: boolean;
  note: string;
  constructor(private notificationsService: NotificationsService,private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
  private apiService:MyLibService) { }
  bidDetails: BidResult[] = [];
  bidResults: BidResult[] = [];
  plan_Document: any;
  isDone: boolean;
  isEdit: boolean;
  Public_bid_No: any;
  ngOnInit() {
    this.getStatusLookUP()
    // this.getproc_View_Bid_Result('f715f09d-96c5-4e39-8150-34fea8a4595c','Bid_For Zare','AR129105029253045312')
    this.License=
    // 'FA98043D-D4EC-40C9-B8FF-9AC45BE0D22C'
    this.apiService.getLicense();
    if(this.License!=null || this.License!=undefined){
      this.approve=true
      this.apiService.getPlan_DetailById(this.License).subscribe((res:any)=>{
        this.plan_id=res.procPlan_Details[0].plan_Detail_ID
        this.fetchData(this.plan_id)
         this.activatedRoute.params.subscribe((params: Params) => {
      console.log('paramsss',params);
      this.formcode=params.formcode
      this.taskid=params.tskID
      this.service_id=params.SDP_ID
      if (this.taskid=='9F1FBC1E-57E4-46F5-A61F-C82172DA6F73'){
      this.onAproved=false
    }else if(this.taskid=='ffdc6912-2461-41f7-96cf-cfb785ae4921'){
    this.onAproved=true
    }}
    )
      })
    }else{
      this.approve=false
    } 
  } 
  getStatusLookUP() {
    this.apiService.getBidResStatusLookUP().subscribe(
      (response: any) => {
        console.log('API Response:', response);
        this.statusLookUp = response;
        console.log('Processed BidTypeLookup:', this.statusLookUp);
      },
      (error) => {
        console.error('Error fetching bid types:', error);
      }
    );
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('changes',changes);
    
    // this.fetchData()
 
}
  submitForm() {
    this.bidResult.bid_ID=generateGuid()
 

   this.apiService.insertBid_Result(this.bidResult).subscribe((res:any)=>{
    console.log(res);
    
    // this.resetForm();
    this.isDone=true
  const toast =
  this.notificationsService.success("Sucess Ready Lease Saved");
  this.Form=false
  // this.fetchDataa(this.bidResult.bid_ID)
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
    this.bidResult.title_Deed_No=bid.title_Deed_No
    this.bidResult.certificate_ID=bid.cerficate_ID
    // this.bidResult.total_Min_Bid_Price=bid.current_Lease_Price
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
    // this.bidResult.bid_No=this.Public_bid_No
    this.fetchData(event.bid_No)
  }
  fetchData(plan_id){
    this.apiService.getView_Bid_ResultByPlan(plan_id).subscribe((Bid_detail:any)=>{
      // = Bid_detail;
      console.log('this.bidDetails',this.bidDetails);
      const bidGrouping = new BidGrouping();
      this.bidDetails  = bidGrouping.groupBidsByTitleDeedNo(Bid_detail);
console.log('Grouped Bids:',this.bidDetails);
     })
  }
  fetchDataa(bid_no: string, title_Deed_No: string): void {
    this.apiService.getView_Bid_Result(bid_no, title_Deed_No).subscribe(
      (data: BidResult[]) => {
        // Sort data by Rank before assigning it to bidResults
        this.bidResults = data.sort((a, b) => a.rank.localeCompare(b.rank));
        const minBidders = this.bidFloated === 0 ? 3 : this.bidFloated === 1 ? 2 : this.bidFloated === 2 ? 1 : 0;
        const notes = {
          0: 'this bid result has not been released because it needs at least three bidders, as this is the first bid of the plot.',
          1: 'this bid result has not been released because it needs at least two bidders, as this is the second bid of the plot.',
          2: 'this bid result has not been released because it needs at least one bidder.'
        };
        
        if (this.bidType === '9de9b9ab-34c3-4daf-a1a6-82d32c8b94ae' && this.bidResults.length < minBidders) {
          this.isFunctional = true;
          this.note = notes[this.bidFloated] || '';
        } else if(this.bidType === '517ad0a5-15ca-4f63-a331-af2d2c4ba63e') {
          this.bidResults = data.sort((a, b) => a.rank.localeCompare(b.rank));
        }
        
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  update(){
console.log('is_Approved',this.bidResult);

this.apiService.updateBid_Result(this.bidResult).subscribe((res:any)=>{

  this.isDone=true
  const toast =
  this.notificationsService.success("Sucess Ready Lease Updated");
  this.fetchDataa(this.Bid_No,this.bidResult.title_Deed_No)
  this.Form=false
},
(error) => {
  console.log(error);

  const toast = this.notificationsService.error(
    "Error",
    error.error
  );

})
  }
  onRowSelects(bid){
    
    this.bidResult=bid
    console.log('this.bidResult',this.bidResult);
    this.isEdit=true 
  }
  onRowSelect(plan){
    console.log(plan);
    this.Bid_No=plan.bid_No
    this.Title_Deed_No=plan.title_Deed_No
   this.bidType=plan.bid_Type
   this.bidFloated=plan.no_Bid_Floated
    this.selectedTab = 1
    this.fetchDataa(plan.bid_No,plan.title_Deed_No)
    // this.bidResult=plan
   
  }
  done() {
    // Emit the event
    try {
      this.completed.emit();
      this.taskCompletedSuccessfully = true; // Set a flag or handle based on your logic
    } catch (error) {
      console.error('Error emitting event:', error);
      this.taskCompletedSuccessfully = false;
    }
    
    // Perform additional tasks only if the event was considered "successful"
    if (this.taskCompletedSuccessfully) {
      this.getproc_View_Bid_Result(this.plan_id,this.Bid_No,this.Title_Deed_No)
    }
  }
  getproc_View_Bid_Result(plan_id,bid_no,title_deed_no){
    
    this.apiService.getproc_View_Bid_Result(plan_id,bid_no,title_deed_no).subscribe((res:any)=>{
      this.proc_View_Bid_Result=res.proc_View_Bid_Results
      this.proc_View_Bid_Result=this.proc_View_Bid_Result.filter((value)=>value.status=='06d6bfd7-a988-4558-8670-8ff9f7f72da7' && value.ranks==1)
      console.log('proc_View_Bid_Result',this.proc_View_Bid_Result[0].app_Code,res.proc_View_Bid_Results);
      this.update_to_do_List.application_code=this.proc_View_Bid_Result[0].app_Code
      this.apiService.updateTodoList(this.update_to_do_List).subscribe((res:any)=>{

        this.isDone=true
  const toast =
  this.notificationsService.success("Result Realeased");
  // this.fetchDataa(this.bidResult.bid_ID)
},
(error) => {
  console.log(error);

  const toast = this.notificationsService.error(
    "Error",
    error.error
  );

})
      
    })
  }
  acceptLatLong(event){
    console.log('event',event);
    this.ismodaEnable=false
    // this.bidResult.location='https://www.google.com/maps?q='+event.lat+','+event.lng
  }
  openGoogleMaps(value): void {
    // const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(value, '_blank');
  }
  resetForm() {
    console.log('reseted');
    
    this.bidResult = {
      bid_ID: null,
      title_Deed_No: null,
      certificate_ID: null,
      customer_ID: null,
      rank: null,
      created_date: null,
      is_Approved: null,
      status: null,
      app_Code: null,
      remark: null,
      is_CPO_Returned:null
    };
    // this.bidResult.bid_No=this.Public_bid_No
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