import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyLibService {
  private bpelApiUrl = 'http://197.156.93.110//XOKA.eoffice.bpel_land/api/'
   private apiUrl = 'http://197.156.93.110/Land_BID_Api/api/';
  private PlotLandUseLookUP = this.bpelApiUrl + "Plot_Type_Of_Use_Lookup";
        private Lease_Bid = this.apiUrl + 'Lease_Bid/procLease_Bid';
        private Bid_Result = this.apiUrl + 'Bid_Result/procBid_Result';
        private Bid_Detail = this.apiUrl + 'Bid_Detail/procBid_Detail';
        private SaveDataURL = this.bpelApiUrl + "BPEL/SaveData";
        private License_ServiceURL = this.bpelApiUrl + "License_Service";
        private GregorianToEthiopianDate = this.apiUrl + "GregorianToEthiopianDate";
        private MytasksUrl = this.bpelApiUrl + 'BPEL/GetlistofTodo'; 
        private Plan_Detail = this.apiUrl + 'Plan_Detail/procPlan_Detail';
        private Bid_License_Service = this.apiUrl+'Bid_License_Service/procBid_License_Service';
        private Bid_Security = this.apiUrl + 'Bid_Security/procBid_Security';
        private Lease_Bid_Offers = this.apiUrl + 'Lease_Bid_Offers/procLease_Bid_Offers';
        private Lease_Ready_forBid = this.apiUrl + 'Lease_Ready_forBid/procLease_Ready_forBid';
        private Lease_bid_Award = this.apiUrl + 'Lease_bid_Award/procLease_bid_Award';
        private Lease_Yearly_Bid_Plan = this.apiUrl + 'Lease_Yearly_Bid_Plan/procLease_Yearly_Bid_Plan';
        private View_propertyUse = this.apiUrl + "view/View_propertyUse";
        private View_Bid_Type = this.apiUrl + "view/View_Bid_Type";
        private View_Yearly_Bid_Plan = this.apiUrl + "view/View_Yearly_Bid_Plan";
        private View_Lease_Bid = this.apiUrl + "view/View_Lease_Bid";
        private nextTaskCompleteURL = this.bpelApiUrl + "BPEL/nextTaskComplete"; 
        private View_Lease_Ready_For_Bid = this.apiUrl + "view/View_Lease_Ready_For_Bid";
        private View_Debt_Suspenstion = this.apiUrl + "view/View_Debt_Suspenstion";
        private userName="@HttpContext.Current.User.Identity.Name"
        private imagepath = '<button type="button" class="trigger">' +
            '<img src="http://job.xokait.com.et/datepicker/img/calendar.gif" alt="Popup"></button>';
            private orgId = '275619F2-69C2-4FB7-A053-938F0B62B088';
            private Lang= "2C2EBBEA-3361-E111-95D5-00E04C05559B"
  constructor(private http: HttpClient) {}
  private _username: string;
  private _subcity: string;
  private _license: string;

  setUsername(username: string): void {
    this._username = username;
  }

  getUsername(): string {
    return this._username;
  }
  setSubcity(subcity: string): void {
    this._subcity= subcity;
  }
getGregorianToEthiopianDate(year,month,day){
  return this.http.get(this.GregorianToEthiopianDate+'/'+year+'/'+month+'/'+day)
}
getGregorianToEthiopianDateE(year,month,day,hour,min,sec){
  return this.http.get(this.GregorianToEthiopianDate+'/'+year+'/'+month+'/'+day+'/'+hour+'/'+min+'/'+sec)
}
  getSubcity(): string {
    return this._subcity;
  }
  setLicense(License: string): void {
    this._license= License;
  }
  saveFormm(ApplicationCode, serviceId, taskid, orgid, json, docid, todoID,username) {
    // taskid = "0095300b-ffa8-4b74-b6e4-e4b984b85a31";
    //serviceId = "4c45e330-40a1-46d3-83ee-443eace0faf6";
    //orgid="df9d76cd-c5fe-49f3-8984-88b97985ff03";
    return this.http.post(
      this.SaveDataURL +
        "?ApplicationCode=" +
        ApplicationCode +
        "&serviceId=" +
        serviceId +
        "&taskid=" +
        taskid +
        "&orgid=" +
        orgid +
        "&UserName=" +
        username +
        "&json=" +
        json +
        "&docid=" +
        docid +
        "&todoID=" +
        todoID,

      null
    );
  }
  getLicense(): string {
    return this._license;
  }
  getView_Lease_Bid(){
    return this.http.get(this.View_Lease_Bid)
  }
  getView_Lease_BidById(plan_Id){
    return this.http.get(this.View_Lease_Bid+'/Bid_Plan_ID/Bid_Plan_ID/'+plan_Id)
  }
  getView_Lease_BidByPlanDetial(plan_Id){
    return this.http.get(this.View_Lease_Bid+'/Plan_Detail_ID/'+plan_Id)
  }
  getUserName(){
    return this.http.get(this.userName)
  }
  getAll(AppNo) {
    return this.http.get<any[]>(
      this.License_ServiceURL +
        "?" +
        "sortOrder=test&currentFilter=" +
        AppNo +
        "&searchString&pageIndex&pageSize"
    );
  }
  Submit(AppCode:any, docID:any, todoID:any, ruleid:any,username) {
    return this.http.post(
      this.nextTaskCompleteURL +
        "?ApplicationNo=" +
        AppCode +
        "&docid=" +
        docID +
        "&todoid=" +
        todoID +
        "&userName=" +
        username +
        "&status=C&Taskruleid=" +
        ruleid +
        "&ispending=false",
      null
    );
  }
  getMytasks(username) {
    return this.http.get(this.MytasksUrl + '?username=' + username +
      '&orgid=' + this.orgId + '&lanid='
      + this.Lang + '&userroll' +
      '=00000000-0000-0000-0000-000000000000');
  }

  insertLease_Bid(data){
    return this.http.post(this.Lease_Bid,data)
  }
  updateLease_Bid(data){
    return this.http.put(this.Lease_Bid,data)
  }
  deleteLease_Bid(id){
    return this.http.delete(this.Lease_Bid+'/'+id)
  }
  getBid_type(){
     return this.http.get(this.View_Bid_Type)
  }
  getView_Yearly_Bid_Plan(){
    return this.http.get(this.View_Yearly_Bid_Plan)
  }
  getView_Yearly_Bid_PlanById(id){
    return this.http.get(this.View_Yearly_Bid_Plan+'/Plan_Detail_Id?Plan_Detail_Id='+id)
  }
getView_Lease_Ready_For_Bid(){
  return this.http.get(this.View_Lease_Ready_For_Bid)
}
getView_Lease_Ready_For_BidById(plan_id){
  return this.http.get(this.View_Lease_Ready_For_Bid+'/Plan_ID/'+plan_id)
}
getView_Lease_Ready_For_BidPlanDetail(plan_id){
  return this.http.get(this.View_Lease_Ready_For_Bid+'/Plan_Detail_ID?Plan_Detail_ID='+plan_id)
}
getBid_Detail(){
  return this.http.get(this.Bid_Detail)
}
getBid_DetailById(id){
  return this.http.get(this.Bid_Detail+'/'+id)
}
insertBid_Detail(data){
  return this.http.post(this.Bid_Detail,data)
}
getPlan_Detail(){
  return this.http.get(this.Plan_Detail)
}
getPlan_DetailById(id){
  return this.http.get(this.Plan_Detail+'/'+id)
}
saveForm(ApplicationCode: string, serviceId: string, taskid: string, orgid: string, json: string, docid: string, todoID: string, userName: any) {
  if (todoID) {
    return this.http.post(
      this.SaveDataURL +
        "?ApplicationCode=" +
        ApplicationCode +
        "&serviceId=" +
        serviceId +
        "&taskid=" +
        taskid +
        "&orgid=" +
        orgid +
        "&UserName=" +
        userName +
        "&json=" +
        json +
        "&docid=" +
        docid +
        "&todoID=" +
        todoID,
      null
    );
  } else {
    return this.http.post(
      this.SaveDataURL +
        "?ApplicationCode=" +
        ApplicationCode +
        "&serviceId=" +
        serviceId +
        "&taskid=" +
        taskid +
        "&orgid=" +
        orgid +
        "&UserName=" +
       userName +
        "&json=" +
        json +
        "&docid=" +
        docid +
        "&todoID=00000000-0000-0000-0000-000000000000",
      null
    );
  }
}
insertBid_License_Service(data): Observable<any> {
  return this.http.post<any>(this.Bid_License_Service,data);
}
getBid_License_Service(license_service){
   return this.http.get(this.Bid_License_Service+'/Licence_Service_ID'+license_service)
}
insertPlan_Detail(data){
  return this.http.post(this.Plan_Detail,data)
}
updatePlan_Detail(data){
  return this.http.put(this.Plan_Detail,data)
}
deletePlan_Detail(id){
  return this.http.delete(this.Plan_Detail+'/'+id)
}
updateBid_Detail(data){
  return this.http.put(this.Bid_Detail,data)
}
getDeptSuspension(){
  return this.http.get(this.View_Debt_Suspenstion)
}
getView_propertyUse(){
  return this.http.get(this.View_propertyUse)
}
getPlotLandUseLookUP() {
  return this.http.get(
    this.PlotLandUseLookUP +
      "?" +
      "sortOrder=test&currentFilter&searchString&pageIndex&pageSize=100"
  );
}
inseetLease_Yearly_Bid_Plan(data){
  return this.http.post(this.Lease_Yearly_Bid_Plan,data)
}
updateLease_Yearly_Bid_Plan(data){
  return this.http.put(this.Lease_Yearly_Bid_Plan,data)
}
deleteLease_Yearly_Bid_Plan(id){
  return this.http.delete(this.Lease_Yearly_Bid_Plan+'/'+id)
}
getLease_Ready_forBid(){
  return this.http.get(this.Lease_Ready_forBid)
}
getLease_Ready_forBidById(id){
  return this.http.get(this.Lease_Ready_forBid+'/'+id)

}
insertLease_Ready_forBid(data){
  return this.http.post(this.Lease_Ready_forBid,data)

}
updateLease_Ready_forBid(data){
  return this.http.put(this.Lease_Ready_forBid,data)
}
deleteLease_Ready_forBid(id){
  return this.http.delete(this.Lease_Ready_forBid+'/'+id)
}
}
