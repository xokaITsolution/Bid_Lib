import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MyLibService } from '../my-lib.service';
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'lib-lease-bid',
  templateUrl: './lease-bid.component.html',
  styleUrls: ['./lease-bid.component.css']
})
export class LeaseBidComponent implements OnInit {
  mimeType: any;
  fileupload: string;
  @Output() next = new EventEmitter();
  @Output() done = new EventEmitter();
  highlighted;
  @Input()  license_service: any;
  uploadedDocumnet: boolean;
  uploadcontract: boolean;
  uploaded: boolean;
  documentupload: any;
  leaseBids: any;
  displayplan:boolean
  yearlyBidPlans:any
  Form=false
  isEdit: boolean;
  isDone: boolean;
  opening_TimeEn: string;
  closing_TimeEn:any
  closing_TimeET:any
  opening_TimeET:any
  extracted: { date: any; time: any; };
  bidType: any;
  BidTypeLookup: any[] = [];
  plan_id: any;
  License: string;
  approve: boolean;
  Plan_No: any;
  isValidGrade: boolean=false;
  paymenteGrade = 40;
  priceGrade = 60;
  formcode: any;
  taskid: any;
  service_id: any;
  IsPosted: boolean;
  constructor(private notificationsService: NotificationsService,
    private sanitizer: DomSanitizer,private activatedRoute: ActivatedRoute,
  private apiService:MyLibService) { }
  formData = {
    bid_No: null,
    bid_Plan_ID: null,
    plan_Detail_ID: null,
    bid_Type: '',
    bid_Doc_Price: 0,
    bid_Document: '',
    adnace_Payment_grad: null,
    bid_prices_graid: null,
    published_Date: '',
    opening_Date: '',
    closeding_Date: '',
    opining_Date_ET: null,
    closeding_Date_ET: '',
    is_Posted:null
  };
  
  submitForm() {
    // Handle form submission logic here
    this.formData.adnace_Payment_grad= this.paymenteGrade/100
    this.formData.bid_prices_graid= this.priceGrade/100
    this.formData.closeding_Date=combineDate(this.formData.closeding_Date,this.closing_TimeEn)
    this.formData.opening_Date=combineDate(this.formData.opening_Date,this.opening_TimeEn)
    this.formData.closeding_Date_ET=combineDate(this.formData.closeding_Date_ET,this.closing_TimeET)
    this.formData.opining_Date_ET=combineDate(this.formData.opining_Date_ET,this.opening_TimeET)

this.apiService.insertLease_Bid(this.formData).subscribe((res:any)=>{
  this.formData.bid_No=res[0].bid_No
  
  const toast =
  this.notificationsService.success("Sucess Ready Lease Saved");
  this.fetchData(this.plan_id)
  this.Form=false
  // this.addNew()
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
  
  ngOnInit() {
    this.getBid_type()
    // this.getLicenseService(this.license_service)
    this.License=this.apiService.getLicense();
    if(this.License!=null || this.License!=undefined){
      this.approve=true
      this.apiService.getPlan_DetailById(this.License).subscribe((res:any)=>{
        this.plan_id=res.procPlan_Details[0].plan_Detail_ID
        this.getView_Yearly_Bid_Plan(this.plan_id)
        this.fetchData(this.plan_id)
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
  getLicenseService(license_service){
    this.apiService.getBid_License_Service(license_service).subscribe((res:any)=>{
      console.log('ressssss',res);
      this.plan_id=res.procBid_License_Services[0].plan_ID
      // this.formData.bid_Plan_ID=this.plan_id
      
})
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
  getView_Yearly_Bid_Plan(plan_id){
    this.apiService.getView_Yearly_Bid_PlanMasterById(plan_id).subscribe((View_Yearly_Bid_Plan:any)=>{
      this.yearlyBidPlans=View_Yearly_Bid_Plan
      console.log('yearlyBidPlans',this.yearlyBidPlans);
      
    })
  }
  onGradeChange(grade){
    const graden=Number(grade)
    const priceGrade=Number(this.priceGrade)
        const sum = graden+priceGrade;
    console.log('summ',sum,);
    
    if(sum>100){
      this.isValidGrade =true;
    }else{
      this.isValidGrade=false
    }
  }
  onGradeChange1(grade){
const graden=Number(grade)
const paymenteGrade=Number(this.paymenteGrade)
    const sum = graden+paymenteGrade;
    console.log('summ',sum,);
        if(sum>100){
      this.isValidGrade =true;
    }else{
      this.isValidGrade=false
    }
  }
   isGradeValid(): boolean {
    const totalGrade = this.formData.bid_prices_graid + this.formData.adnace_Payment_grad;
    return totalGrade >= 1 && totalGrade <= 100;
  }
  selectPlan(plan){
    this.displayplan=false
    // this.plan_id=plan.year
    this.Plan_No=plan.plan_No
    this.paymenteGrade=plan.lease_Payment_Advance_Per*100
    this.priceGrade=100-this.paymenteGrade
    
    this.formData.bid_Plan_ID=plan.plan_ID
    this.formData.bid_Type=plan.bid_Type
    if( plan.bid_Enddate!=null ||  plan.bid_Enddate!=undefined){
 
      
      const extractedOpening=extractDateTime(plan.bid_Enddate)
      const [datePart, timePart] = plan.bid_Enddate.split('T');
      const dateParts= datePart.split('-');
      const timeParts = timePart.split(':');
      const year = dateParts[0];
      const month = dateParts[1];
      const day = dateParts[2];
      const hour=timeParts[0]
      const min=timeParts[1]
      const sec=timeParts[2]
      console.log('datePartss',dateParts,timeParts,);
      this.apiService.getGregorianToEthiopianDateE(year,month,day,hour,min,sec).subscribe((res:any)=>{
        const splitETime=res.NowTime.split(' ')
        const splitETimes=splitETime[0]
        const merged=res.NowDate+'T'+splitETimes
        console.log('plan.bid_Enddate',plan.bid_Enddate,res.NowDate+'T'+splitETimes);
        
       const extractOpenDateEt=extractDateTime(merged)
       this.formData.opining_Date_ET=extractOpenDateEt.date
       this.opening_TimeET=extractOpenDateEt.time
      })
      this.formData.opening_Date=extractedOpening.date
      this.opening_TimeEn=extractedOpening.time
    }
  }
  cDateConvert(){
console.log('this.formData.closeding_Date',this.formData.closeding_Date);

  }
  onDateTimeChange() {
    if (this.formData.closeding_Date && this.closing_TimeEn) {
      const combinedDateTime = `${this.formData.closeding_Date}T${this.closing_TimeEn}:00`;
      console.log('combinedDateTime',combinedDateTime);
      const [datePart, timePart] = combinedDateTime.split('T');
      const dateParts= datePart.split('-');
      const timeParts = timePart.split(':');
      const year = dateParts[0];
      const month = dateParts[1];
      const day = dateParts[2];
      const hour=timeParts[0]
      const min=timeParts[1]
      const sec=timeParts[2]
      console.log('datePartss',dateParts,timeParts,);
      this.apiService.getGregorianToEthiopianDateE(year,month,day,hour,min,sec).subscribe((res:any)=>{
        const splitETime=res.NowTime.split(' ')
        const splitETimes=splitETime[0]
        const merged=res.NowDate+'T'+splitETimes
        console.log('plan.bid_Enddate',res.NowDate+'T'+splitETimes);
        
       const extractOpenDateEt=extractDateTime(merged)
       this.formData.closeding_Date_ET=extractOpenDateEt.date
       this.closing_TimeET=extractOpenDateEt.time
      })
    }
  }
  onODateTimeChange() {
    if (this.formData.opening_Date && this.opening_TimeEn) {
      // const combinedDateTime = `${this.formData.opening_Date}T${this.opening_TimeEn}:00`;
      const openingDate = this.formData.opening_Date;
      const openingTime = this.opening_TimeEn;
    
      // Create a new Date object using the local time
      const dateParts1 = openingDate.split('-').map(Number); // [year, month, day]
      const timeParts1 = openingTime.split(':').map(Number); // [hours, minutes]
    
      // JavaScript months are 0-based, so subtract 1 from the month
      const localDateTime = new Date(dateParts1[0], dateParts1[1] - 1, dateParts1[2], timeParts1[0], timeParts1[1]);
    
      // Format the combined date and time as an ISO string
      const combinedDateTime = localDateTime.toISOString().slice(0, 19);
      console.log('combinedDateTime',combinedDateTime);
      const [datePart, timePart] = combinedDateTime.split('T');
      const dateParts= datePart.split('-');
      const timeParts = timePart.split(':');
      const year = dateParts[0];
      const month = dateParts[1];
      const day = dateParts[2];
      const hour=timeParts[0]
      const min=timeParts[1]
      const sec=timeParts[2]
      console.log('datePartss',dateParts,timeParts,);
      this.apiService.getGregorianToEthiopianDateE(year,month,day,hour,min,sec).subscribe((res:any)=>{
        const splitETime=res.NowTime.split(' ')
        const splitETimes=splitETime[0]
        const merged=res.NowDate+'T'+splitETimes
        console.log('plan.bid_Enddate',res.NowDate+'T'+splitETimes,combinedDateTime,res.NowTime);
        
       const extractOpenDateEt=extractDateTime(merged)
       this.formData.opining_Date_ET=extractOpenDateEt.date
       this.opening_TimeET=extractOpenDateEt.time
      })
    }
  }
  update(){
    this.formData.adnace_Payment_grad= this.paymenteGrade/100
    this.formData.bid_prices_graid= this.priceGrade/100
    this.formData.closeding_Date=combineDate(this.formData.closeding_Date,this.closing_TimeEn)
    
    this.formData.opening_Date=combineDate(this.formData.opening_Date,this.opening_TimeEn)
    this.formData.closeding_Date_ET=combineDate(this.formData.closeding_Date_ET,this.closing_TimeET)
    this.formData.opining_Date_ET=combineDate(this.formData.opining_Date_ET,this.opening_TimeET)
    
    this.apiService.updateLease_Bid(this.formData).subscribe((res:any)=>{
      const toast =
      this.notificationsService.success("Sucess Ready Lease Updated");
      this.fetchData(this.plan_id)
      this.Form=false
      // this.addNew()
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
  fetchData(plan_id){
    this.apiService.
    getView_Lease_BidByPlanDetial(plan_id)
    // getView_Lease_Bid()
    .subscribe((Lease_bid:any)=>{
      this.leaseBids=Lease_bid
      console.log('this.leaseBids',this.leaseBids,Lease_bid);
      
    })
  }
  onRowSelect(plan){
    this.isEdit=true 
    console.log('Plannnnnn',plan);
    this.Plan_No=plan.plan_No
    this.previewdocumnet('')
    this.formData=plan
    this.paymenteGrade=this.formData.adnace_Payment_grad*100
    this.priceGrade=this.formData.bid_prices_graid*100
    this.previewdocumnet(this.formData.bid_Document)
    if( this.formData.closeding_Date!=null ||  this.formData.closeding_Date!=undefined){

      const extractedClosing=extractDateTime(this.formData.closeding_Date)
      this.formData.closeding_Date=extractedClosing.date
      this.closing_TimeEn=extractedClosing.time
    }
    if( this.formData.opening_Date!=null ||  this.formData.opening_Date!=undefined){
      
      const extractedOpening=extractDateTime(this.formData.opening_Date)
      this.formData.opening_Date=extractedOpening.date
      this.opening_TimeEn=extractedOpening.time
    }
    if( this.formData.closeding_Date_ET!=null ||  this.formData.closeding_Date_ET!=undefined){

      const extractedClosingEt=extractDateTime(this.formData.closeding_Date_ET)
      this.formData.closeding_Date_ET=extractedClosingEt.date
      this.closing_TimeET=extractedClosingEt.time
    }
    if( this.formData.bid_Doc_Price!=null ||  this.formData.opining_Date_ET!=undefined){
      
      const extractedOeningEt=extractDateTime(this.formData.opining_Date_ET)
      this.formData.opining_Date_ET=extractedOeningEt.date
       this.opening_TimeET=extractedOeningEt.time
    }
  }
  Done(){
    this.done.emit()
  }
  Next(){
this.next.emit(this.formData)
  }
  checkTime() {
  this.formData.opening_Date= combineDate(this.formData.opening_Date,this.opening_TimeEn)
  this.extracted=extractDateTime(this.formData.opening_Date)
  console.log('Combined DateTime:',this.extracted, this.formData.opening_Date);

   
  
  }
  addNew(){
    this.isEdit=false
    this.formData = {
      bid_No: null,
      bid_Plan_ID: '',
      plan_Detail_ID: '',
      bid_Type: '',
      bid_Doc_Price: 0,
      bid_Document: '',
      adnace_Payment_grad: null,
      bid_prices_graid: null,
      published_Date: '',
      opening_Date: '',
      closeding_Date: '',
      opining_Date_ET: '',
      closeding_Date_ET: '',
      is_Posted:null
    };
    this.closing_TimeET=''
    this.opening_TimeET=''
    this.closing_TimeEn=''
    this.opening_TimeEn=''
    this.highlighted=''
  }
  upload(event:any) {
     
    if(event.files[0].size > 3000000){
       const toast = this.notificationsService.error('error', 'maximum file size is 3MB');
    }else{
      this.Uploader(event.files[0]);
      console.log('event', event);
      console.log('files', event.files); 
    }
  
  
  }
  Uploader(File: File) {
    console.log('File ', File);
    let base64file: string | ArrayBuffer | null;
    let fullbase64: string | null = null;
    const reader = new FileReader();
    reader.readAsDataURL(File);
  
    reader.addEventListener('loadend', (e) => {
      base64file = reader.result;
  
      if (typeof base64file === 'string') {
        fullbase64 = base64file;
        const re = /base64,/gi;
        base64file = base64file.replace(re, '');
        base64file = base64file.split(';')[1];
  
        let type = File.type !== '' ? File.type : this.extractExtensionFromFileName(File.name);
        let base64FileData = btoa(JSON.stringify({
          type,
          data: base64file
        }));
  console.log('base64FileData',base64FileData);
  this.uploaded=true
  
        // const toast = this.notificationsService.success('Success', 'Uploaded successfully');
        this.formData.bid_Document = base64FileData;
        this.documentupload = base64FileData;
        this.previewdocumnet(base64FileData)
      } else {
        console.error('File could not be read as a string.');
      }
    });
  }
  extractExtensionFromFileName(fileName:any) {
    if (fileName) {
      let fileNameSegment = (fileName as string).split('.');
      return `application/${fileNameSegment[fileNameSegment.length - 1]}`;
    }
    return '';
  }
  previewdocumnet(file:any){
  
    try {
     
     let fileData = JSON.parse(window.atob(file));
      let { type, data } = fileData;
      this.mimeType=type
      this.fileupload= "data:" + type + ";base64, " + data;
      this.uploadedDocumnet=true
      this.uploadcontract=false
     
      this.documentupload= this.sanitizer.bypassSecurityTrustResourceUrl(
               this.fileupload
             );
      console.log(this.documentupload);
  }
           catch (e) {
             console.error(e);
           }
  }



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
    const combinedDateTime = date + 'T' + time + ':00';
    return combinedDateTime
    console.log('Combined DateTime:', combinedDateTime);

   
  }
}