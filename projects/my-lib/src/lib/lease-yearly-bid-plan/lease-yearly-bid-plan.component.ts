import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MyLibService } from '../my-lib.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute, Params } from '@angular/router';

interface YearlyBidPlan {
  plan_ID: number;
  year: number;
  land_use: string;
  bid_Type: string;
  building_Use: string;
  plot_Qty: number;
  total_Sizeof_plot: number;
  bid_Opning_Date: string;
  bid_Start_Date: string;
  bid_Enddate: string;
  prepared_by: string;
  approved_by: string;
  is_published: boolean;
  min_bid_Plot: number;
}

@Component({
  selector: 'lib-lease-yearly-bid-plan',
  templateUrl: './lease-yearly-bid-plan.component.html',
  styleUrls: ['./lease-yearly-bid-plan.component.css']
})
export class LeaseYearlyBidPlanComponent {
  displayDeed:boolean
  BidTypeLookup: any[] = [];
  userName: any;
  @Input()  customerId: any;
  
  @Output() completed= new EventEmitter()
  @Output() completed1= new EventEmitter()
  @Output() generateApplication= new EventEmitter()
  highlighted;
  yearlyBidPlanForm: FormGroup;
  yearlyBidPlan: YearlyBidPlan = {
    plan_ID: null,
    year: 0,
    land_use: '',
    bid_Type: '',
    building_Use: '',
    plot_Qty: 0,
    total_Sizeof_plot: 0,
    bid_Opning_Date: '',
    bid_Start_Date: '',
    bid_Enddate: '',
    prepared_by: '',
    approved_by: '',
    is_published: false,
    min_bid_Plot: 0
  };
  BuildingUseLookup: any;
  LandUseLookup: any;
  tab1;
  tab2;
  selectedTab = 0;
  data: any;
  DocID: any;
  todoID: any;
  taskList: any;
  start_TimeEn:any
  opening_TimeEn:any
  end_Time:any
  usernamefromser: any;
  subcity: any;
  service_id: any;
  taskid: any;
  formcode: any;
  SDP_ID: string;
  passedData: { docid: any; fomcode: any; appno: any; SDP_ID: string; service_id: any; taskid: any;todo_id:any };
  plan_id: any;
  datafromchild: any;
  License: string;
  approve: boolean;
  constructor(
    private sanitizer: DomSanitizer,  private activatedRoute: ActivatedRoute,
  private apiService:MyLibService,private notificationsService: NotificationsService,) { }
  yearlyBidPlans: YearlyBidPlan[] = [];
  isEdit: boolean;
  Bid_License_Service: Bid_License_Service = {
    licence_Service_ID: null,
    customerID: null,
    bid_No: null,
    plan_ID: null,
    doc_id: null,
    todo_id: null
  };
  isDone: boolean;
  ngOnInit() { 
    this.userName  = this.apiService.getUsername();
    this.subcity=this.apiService.getSubcity();
    this.License=this.apiService.getLicense();
    if(this.License!=null || this.License!=undefined){
      this.approve=true
      this.apiService.getPlan_DetailById(this.License).subscribe((res:any)=>{
        this.plan_id=res.procPlan_Details[0].plan_Detail_ID
        this.getView_Yearly_Bid_Plan(this.plan_id)
      })
    }else{
      this.approve=false
    }
    console.log('userNameuserName',this.usernamefromser,this.userName,this.subcity,this.License);
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
    
    this.yearlyBidPlanForm = new FormGroup({
      plan_ID:new FormControl('',Validators.required),
      plan_Detail_Id:new FormControl('',Validators.required),
      plan_No: new FormControl('', Validators.required),
      bid_Type: new FormControl('', Validators.required),
      land_use: new FormControl('', Validators.required),
      buling_Use: new FormControl('', Validators.required),
      plot_Qty: new FormControl('', Validators.required),
      total_Sizeof_plot: new FormControl('', Validators.required),
      bid_Opning_Date: new FormControl('', Validators.required),
      bid_Start_Date: new FormControl('', Validators.required),
      bid_Enddate: new FormControl('', Validators.required),
      min_bid_Plot: new FormControl('', Validators.required),
      is_publiched: new FormControl(false),
      start_TimeEn:new FormControl(),
      opening_TimeEn:new FormControl(),
      end_Time:new FormControl()
    });
    this.markFormControlsTouched(this.yearlyBidPlanForm);
    this.getBid_type() 
    this.getView_propertyUse()
    this.getPlotLandUseLookUP()
    // this.yearlyBidPlan.bid_Type = '9de9b9ab-34c3-4daf-a1a6-82d32c8b94ae';
    // this.yearlyBidPlan.bid_Type = String(this.yearlyBidPlan.bid_Type);
    // this.BidTypeLookup = this.BidTypeLookup.map(b => ({ ...b, bid_Type_Id: String(b.bid_Type_Id) }));
    // console.log('Initialized bid_Type:', this.yearlyBidPlan.bid_Type);
    // console.log('BidTypeLookup:', this.BidTypeLookup);
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('changesssss',changes,this.userName)

  }
  isControlInvalid(controlName: string): boolean {
    const control = this.yearlyBidPlanForm.get(controlName);
    return control && control.invalid && control.touched;
  }

  markFormControlsTouched(group: FormGroup) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.markFormControlsTouched(control);
      }
    });
  }
//   submitForm() {
//     this.apiService.inseetLease_Yearly_Bid_Plan(this.yearlyBidPlan).
//     subscribe((value:any)=>{
//       console.log(value);
      
//     })
//     // this.resetForm();
// this.isDone=true
//   }
getView_Yearly_Bid_Plan(plan_id){
  this.apiService.getView_Yearly_Bid_PlanById(plan_id).subscribe((View_Yearly_Bid_Plan:any)=>{
    this.yearlyBidPlans=View_Yearly_Bid_Plan
  })
}
generateApplication1(data){
this.generateApplication.emit(data)
this.datafromchild=data
}
  getBid_type() {  
    this.apiService.getBid_type().subscribe(
      (response: any) => {
        console.log('API Response:', response);
        this.BidTypeLookup = response;
        console.log('Processed BidTypeLookup:', this.BidTypeLookup);
      },
      (error) => {
        console.error('Error fetching bid types:', error);
      }
    );
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
  Next(plan_id){
    this.plan_id=plan_id
    this.selectedTab = 1
    this.yearlyBidPlanForm.patchValue({
      plan_Detail_Id:plan_id
    })
    // this.data=this.yearlyBidPlanForm.value
    // console.log('this.data',this.data);
    
  }
  submitForm() {
  
    const opening_Date= combineDate(this.yearlyBidPlanForm.get('bid_Opning_Date').value,
    this.yearlyBidPlanForm.get('opening_TimeEn').value)
    const start_date= combineDate(this.yearlyBidPlanForm.get('bid_Start_Date').value,
    this.yearlyBidPlanForm.get('start_TimeEn').value)
    const end_date= combineDate(this.yearlyBidPlanForm.get('bid_Enddate').value,
    this.yearlyBidPlanForm.get('end_Time').value)
    // this.extracted=extractDateTime(this.formData.opening_Date)
    this.yearlyBidPlanForm.patchValue({
      plan_ID:generateGuid(),
      plan_Detail_Id:this.plan_id,
      bid_Opning_Date:opening_Date,
      bid_Start_Date:start_date,
      bid_Enddate: end_date
    })
    console.log('this.yearlyBidPlanForm.',(this.yearlyBidPlanForm.value));
    
    console.log('ppppp',this.yearlyBidPlanForm.value,this.yearlyBidPlanForm.get('bid_Opning_Date').value,this.opening_TimeEn);
    
    // if (this.yearlyBidPlanForm.valid) {
    this.apiService.inseetLease_Yearly_Bid_Plan(this.yearlyBidPlanForm.value).
    subscribe((res:any)=>{
      const toast =
      this.notificationsService.success("Sucess Saved Yearly Plan");
      this.isDone=true
      this.getView_Yearly_Bid_Plan(this.plan_id)
      // this.passedData={
      //   docid:docid,
      //   fomcode:this.formcode,
      //   appno:appno,
      //   SDP_ID:this.SDP_ID,
      //   service_id:this.service_id,
      //   taskid:this.taskid,
      //   todo_id:todo_id
      // }
      // this.generateApplication.emit(this.passedData)
// this.submitPlanApplication(this.yearlyBidPlanForm.get('plan_ID').value)

    },
    (error) => {
      console.log(error);

      const toast = this.notificationsService.error(
        "Error",
        error.error
      );
    })
      console.log('formcontrol',this.yearlyBidPlanForm.value);
      // Handle form submission
    // }
  }
submitPlanApplication(){
  this.apiService
  .saveForm(
    '00000000-0000-0000-0000-000000000000',
    this.service_id,
    this.taskid,
    '6921d772-3a1c-4641-95a0-0ab320bac3e2',
    JSON.stringify({}),
    this.DocID ? this.DocID : '00000000-0000-0000-0000-000000000000',
    this.todoID ? this.todoID : '00000000-0000-0000-0000-000000000000',
    this.userName
  )
  .subscribe((res: any) => {
   
    this.Bid_License_Service.licence_Service_ID = res[0];
    this.Bid_License_Service.doc_id = res[1];
    this.Bid_License_Service.todo_id = res[2];
    this.Bid_License_Service.bid_No = null;
    this.Bid_License_Service.customerID = this.customerId;
    this.Bid_License_Service.plan_ID = this.yearlyBidPlanForm.get('plan_ID').value
    // this.yearlyBidPlanForm.patchValue({
    //   plan_ID:generateGuid()
    // })
    this.apiService
      .insertBid_License_Service(this.Bid_License_Service)
      .subscribe((res) => {
        if (res) {
          console.log('Bid_License_Service1', this.Bid_License_Service);

          // this.submitForm(this.Bid_License_Service.licence_Service_ID, this.Bid_License_Service.doc_id,this.taskList[0].id,this.Bid_License_Service.todo_id)
        
          // this.fetchData(this.Plan_Id);
          // this.getLicenceService();
        }
      });
  });
}
SubmitForDeedSelectTask( appno,docid) {
  this.apiService.getAll(appno).subscribe((res: any) => {
    this.apiService.getMytasks(this.userName).subscribe(
      (taskList: any) => {
        this.taskList = Object.assign([], taskList['Table1']);
        // this.myTaskLoading = false;
        if (this.taskList.length == 0) {
          // this.myTaskHasNoData = true;
        } else {
          // this.myTaskHasNoData = false;
        }

        this.taskList.sort((a, b) => {
          if (a.start_date < b.start_date) {
            return 1;
          } else if (a.start_date > b.start_date) {
            return -1;
          } else {
            return 0;
          }
        });

        let orderNo = 1;
        this.taskList = this.taskList.map((task) => {
          task['orderNo'] = orderNo;
          orderNo++;
          return task;
        });
        console.log(
          'taskresponse',
          this.taskList.filter(
            (value) => value.todo_comment == res.list[0].Application_No
          )
        );
        this.taskList= this.taskList.filter(
          (value) => value.todo_comment == res.list[0].Application_No
        )
        if (
          this.taskList[0].tasks_id ===
            '0EAF07C4-7D1D-4EDB-9C1C-B428B5CA0B49' &&
          this.taskList[0].status !== 'C'
        ) {
          this.yearlyBidPlanForm.patchValue({
            plan_ID:generateGuid()
          })
        // this.apiService
          //   .Submit(
          //     res.list[0].Licence_Service_ID,
          //     this.taskList[0].service_details_id,
          //     this.taskList[0].id,
          //     '00000000-0000-0000-0000-000000000000',this.userName
          //   )
          //   .subscribe((res1) => {
          //     console.log('res1', res1);
             
          //   });
        } else {
         
        }
      },
      (error) => {
        // this.myTaskLoading = false;
        console.log('error');
      }
    );
  });
}
  getView_propertyUse(){
    this.apiService.getView_propertyUse().subscribe((Building_Use:any)=>{
     
        console.log('API Response:', Building_Use);
        this.BuildingUseLookup = Building_Use;
        console.log('Processed BidTypeLookup:', this.BuildingUseLookup);
      },
      (error) => {
        console.error('Error fetching bid types:', error);
      
    })
  }
  getPlotLandUseLookUP() {
    this.apiService.getPlotLandUseLookUP().subscribe(
      (PlotLandUseLookUP) => {
        this.LandUseLookup = PlotLandUseLookUP;
        this.LandUseLookup = Object.assign([], this.LandUseLookup.list);
        console.log("PlotLandUseLookUP", PlotLandUseLookUP);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  dialog(){
    this.displayDeed=true
  }
  update(){
    const opening_Date= combineDate(this.yearlyBidPlanForm.get('bid_Opning_Date').value,
    this.yearlyBidPlanForm.get('opening_TimeEn').value)
    const start_date= combineDate(this.yearlyBidPlanForm.get('bid_Start_Date').value,
    this.yearlyBidPlanForm.get('start_TimeEn').value)
    const end_date= combineDate(this.yearlyBidPlanForm.get('bid_Enddate').value,
    this.yearlyBidPlanForm.get('end_Time').value)
    // this.extracted=extractDateTime(this.formData.opening_Date)
    this.yearlyBidPlanForm.patchValue({
      bid_Opning_Date:opening_Date,
      bid_Start_Date:start_date,
      bid_Enddate: end_date
    })

    this.apiService.updateLease_Yearly_Bid_Plan(this.yearlyBidPlanForm.value)
    .subscribe((res:any)=>{
      const toast =
      this.notificationsService.success("Sucess updated Yearly Plan");
      this.getView_Yearly_Bid_Plan(this.plan_id)
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
  selectPlan(plan) {
    this.yearlyBidPlan = plan;
   if( plan.bid_Enddate!=null ||  plan.bid_Enddate!=undefined){

      const extractedEndDate=extractDateTime(plan.bid_Enddate)
      this.yearlyBidPlanForm.patchValue({
        bid_Enddate: 
        formatDateToYYYYMMDD(extractedEndDate.date),
        end_Time: extractedEndDate.time
      })
    }
    if( plan.bid_Start_Date!=null ||  plan.bid_Start_Date!=undefined){
      
      const extractedOpening=extractDateTime(plan.bid_Start_Date)
      this.yearlyBidPlanForm.patchValue({
        bid_Start_Date:
        formatDateToYYYYMMDD(extractedOpening.date),
        start_TimeEn:
        extractedOpening.time
      })
    }
    if( plan.bid_Opning_Date!=null ||  plan.bid_Opning_Date!=undefined){

      const extractedClosingEt=extractDateTime(plan.bid_Opning_Date)
      this.yearlyBidPlanForm.patchValue({
        bid_Opning_Date: formatDateToYYYYMMDD(extractedClosingEt.date)
        ,
        opening_TimeEn:
        extractedClosingEt.time
      })
    }
    
    this.yearlyBidPlanForm.patchValue({
      plan_ID: plan.plan_ID,
      plan_Detail_Id:plan.plan_Detail_Id,
      plan_No: plan.plan_No,
      bid_Type: plan.bid_Type,
      land_use: plan.land_use,
      buling_Use: plan.buling_Use,
      plot_Qty: plan.plot_Qty,
      total_Sizeof_plot: plan.total_Sizeof_plot,
      min_bid_Plot: plan.min_bid_Plot,
      is_publiched: plan.is_publiched
    });
  
    console.log('  this.yearlyBidPlan.bid_Type', plan);
    this.isEdit = true;
  }
  

  done(){
    this.completed.emit(this.datafromchild)
  }
  done1(){
    this.completed1.emit()
  }
  addNew(){
    this.isEdit=false
    this.yearlyBidPlanForm.reset()
    this.yearlyBidPlan= {
      plan_ID: null,
      year: 0,
      land_use: '',
      bid_Type: '',
      building_Use: '',
      plot_Qty: 0,
      total_Sizeof_plot: 0,
      bid_Opning_Date: '',
      bid_Start_Date: '',
      bid_Enddate: '',
      prepared_by: '',
      approved_by: '',
      is_published: false,
      min_bid_Plot: 0
    }; 
  }
}
function generateGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}
function formatDateToYYYYMMDD(dateString: string): string {
  if (!dateString) return null;
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}
export class Bid_License_Service {
  public licence_Service_ID: any;
  public customerID: any;
  public bid_No: any;
  public plan_ID: any;
  public doc_id: any;
  public todo_id: any;
}
function extractDateTime(dateTime) {
  if (dateTime) {
    const Date={
      date:dateTime.substring(0, 10),
      time:dateTime.substring(11, 16)
    }
    return Date// Adjust length according to your time format
  }
}
function combineDate(date,time){
  if (date && time) {
    // Combine date and time
    console.log('datatata',date);
    
    const combinedDateTime = date + 'T' + time + ':00';
    console.log('Combined DateTime:', combinedDateTime);
    return combinedDateTime

   
  }
}