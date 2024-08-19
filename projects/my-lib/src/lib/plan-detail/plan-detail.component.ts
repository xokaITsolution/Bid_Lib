import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyLibService } from '../my-lib.service';
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'lib-plan-detail',
  templateUrl: './plan-detail.component.html',
  styleUrls: ['./plan-detail.component.css']
})
export class PlanDetailComponent implements OnInit {
  yearlyBidPlanForm: FormGroup;
  @Output() generateApplication= new EventEmitter()
  planDetail: PlanDetail[]=[]
  
  @Input() data: any;
  @Output() next= new EventEmitter()
  @Output() Prev= new EventEmitter()
  isEdit: boolean;
  highlighted:any
  isDone: boolean;
  public Plan_ID: any;
  Bid_License_Service: Bid_License_Service = {
    licence_Service_ID: null,
    customerID: null,
    bid_No: null,
    plan_ID: null,
    doc_id: null,
    todo_id: null
  };
  userName: string;
  subcity: string;
  formcode: any;
  taskid: any;
  service_id: any;
  SDP_ID: string;
  DocID: any;
  todoID: any;
  passedData: { docid: any; fomcode: any; appno: any; SDP_ID: string; service_id: any; taskid: any; todo_id: any; };
  constructor(private fb: FormBuilder,private activatedRoute: ActivatedRoute,  private apiService:MyLibService,private notificationsService: NotificationsService) {}

  ngOnInit(): void {
    this.userName  = this.apiService.getUsername();
    this.subcity=this.apiService.getSubcity();
    console.log('userNameuserName',this.userName,this.subcity);
    this.activatedRoute.params.subscribe((params: Params) => {
      console.log('paramsss',params);
      this.formcode=params.formcode
      this.taskid=params.tskID
      this.service_id=params.SDP_ID
    })
    if (this.subcity == "arada") {
      this.SDP_ID = "6921d772-3a1c-4641-95a0-0ab320bac3e2";
    } else if (this.subcity == "bole") {
      this.SDP_ID = "89eb1aec-c875-4a08-aaf6-2c36c0864979";
    } else if (this.subcity == "nifasS") {
      this.SDP_ID = "f8ea62db-05bc-4f1a-ab30-4e926d43e3fb";
    } else if (this.subcity == "gullele") {
      this.SDP_ID = "6a8c042f-a3e1-4375-9769-54d94c2312c6";
    } else if (this.subcity == "addisK") {
      this.SDP_ID = "7101d44d-97d5-41aa-957d-82f36d928c07";
    } else if (this.subcity == "lideta") {
      this.SDP_ID = "e4d8219e-51f9-40cb-9d53-883c6ca9aaa3";
    } else if (this.subcity == "lemiK") {
      this.SDP_ID = "f02e9467-1b7d-4350-bee7-9844d4f56da0";
    } else if (this.subcity == "yeka") {
      this.SDP_ID = "8222f028-5fe3-4047-9a50-b52bfa64c851";
    } else if (this.subcity == "akakyK") {
      this.SDP_ID = "08f9c927-6366-467a-ba99-c837c5add427";
    } else if (this.subcity == "kirkos") {
      this.SDP_ID = "aaa5094c-8899-4708-9f7b-d8ff634a3540";
    } else if (this.subcity == "kolfeK") {
      this.SDP_ID = "930d1c20-9e0e-4a50-9eb2-e542fafbad68";
    } else if (this.subcity == "central") {
      this.SDP_ID = "1EFB0336-26C6-4BF1-AEB8-8DA0D4F7DBBB";
    }
    console.log('subcitylog',this.SDP_ID);
    this.yearlyBidPlanForm = this.fb.group({
      plan_Detail_ID: ['', Validators.required],
      // plan_Id: ['', Validators.required],
      plan_Ids: ['', Validators.required],
      year: [0, [Validators.required, Validators.min(1900), Validators.max(2100)]],
      is_Active: [true, Validators.required],
      app_Code: ['', Validators.required]
    });
    
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('changes',changes);
  
    // this.yearlyBidPlanForm.patchValue({
    //   plan_Id:this.data.plan_ID,
    //   plan_Ids:this.data.plan_No
    // })
    // this.fetchData(this.data.plan_ID)
    
    // this.fetchData()
 
}
fetchData(plan_id){
  this.apiService.getPlan_DetailById(plan_id).subscribe((PlanDetail:any)=>{
    this.planDetail=PlanDetail.procPlan_Details
  })
}
submitForm(appno,docid,todo_id) {
   this.yearlyBidPlanForm.patchValue({
    app_Code:appno
   })
    
    this.apiService.insertPlan_Detail(this.yearlyBidPlanForm.value).subscribe((res:any)=>{
      const toast =
      this.notificationsService.success("Sucess Saved Plan Detail");
      this.fetchData(appno)
      this.isDone=true
      this.passedData={
        docid:docid,
        fomcode:this.formcode,
        appno:appno,
        SDP_ID:this.SDP_ID,
        service_id:this.service_id,
        taskid:this.taskid,
        todo_id:todo_id,
      }
      this.generateApplication.emit(this.passedData)
    },
    (error) => {
      console.log(error);

      const toast = this.notificationsService.error(
        "Error",
        error.error
      );
    })
    // } else {
    //   console.log('Form is invalid');
    // }
  }
  submitPlanApplication(){
    this.apiService
    .saveForm(
      '00000000-0000-0000-0000-000000000000',
      this.service_id,
      this.taskid,
      this.SDP_ID,
      JSON.stringify({}),
      this.DocID ? this.DocID : '00000000-0000-0000-0000-000000000000',
      this.todoID ? this.todoID : '00000000-0000-0000-0000-000000000000',
      this.userName
    )
    .subscribe((res: any) => {
      this.yearlyBidPlanForm.patchValue({
        plan_Detail_ID:generateGuid(),
        plan_Id:generateGuid()
      })
      this.submitForm(res[0], res[1],res[2])
      this.Bid_License_Service.licence_Service_ID = res[0];
      this.Bid_License_Service.doc_id = res[1];
      this.Bid_License_Service.todo_id = res[2];
      this.Bid_License_Service.plan_ID = this.yearlyBidPlanForm.get('plan_ID').value
      this.Bid_License_Service.bid_No = null;
      this.Bid_License_Service.customerID = null;
      console.log('Bid_License_Service1', this.Bid_License_Service);
      // this.yearlyBidPlanForm.patchValue({
      //   plan_ID:generateGuid()
      // })
      this.apiService
      .insertBid_License_Service(this.Bid_License_Service)
      .subscribe((res) => {
        if (res) {
  
          
            // this.fetchData(this.Plan_Id);
            // this.getLicenceService();
          }
        });
    });
  }
  Previous(){
    this.Prev.emit()
  }
  done(){
    this.next.emit(this.yearlyBidPlanForm.get('plan_Detail_ID').value)
  }
  update(){
    this.apiService.updatePlan_Detail(this.yearlyBidPlanForm.value).subscribe((res:any)=>{
      const toast =
      this.notificationsService.success("Sucess Update Plan Detail");
      this.fetchData(this.yearlyBidPlanForm.get('app_Code').value)
      this.isDone=true
    },
    (error) => {
      console.log(error);

      const toast = this.notificationsService.error(
        "Error",
        error.error
      );
    })
  }
  addNew(){
    this.yearlyBidPlanForm.reset()
    this.yearlyBidPlanForm.patchValue({
      plan_Id:this.data.plan_ID
    })
    this.isEdit=false
  }
  onRowSelect(bid){
    this.isEdit=true
    this.yearlyBidPlanForm.patchValue({
      plan_Detail_ID: bid.plan_Detail_ID,
      plan_Id: bid.plan_Id,
      year: bid.year,
      is_Active: bid.is_Active
    })
  }
}
export interface PlanDetail {
  plan_Detail_ID: string;
  plan_Id: string;
  year: number;
  is_Active: boolean;
}
function generateGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}
export class Bid_License_Service {
  public licence_Service_ID: any;
  public customerID: any;
  public bid_No: any;
  public plan_ID: any;
  public doc_id: any;
  public todo_id: any;
}