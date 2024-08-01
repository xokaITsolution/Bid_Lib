import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ReadyLeaseService {
  private bpelApiUrl = 'http://197.156.93.110//XOKA.eoffice.bpel_land/api/'
  private apiUrl = 'http://197.156.93.110/Land_BID_Api/api/';
 private PlotLandUseLookUP = this.bpelApiUrl + "Plot_Type_Of_Use_Lookup";
       private Lease_Bid = this.apiUrl + 'Lease_Bid/procLease_Bid';
       private Bid_Result = this.apiUrl + 'Bid_Result/procBid_Result';
       private Bid_Detail = this.apiUrl + 'Bid_Detail/procBid_Detail';
       private Bid_Security = this.apiUrl + 'Bid_Security/procBid_Security';
       private Lease_Bid_Offers = this.apiUrl + 'Lease_Bid_Offers/procLease_Bid_Offers';
       private Lease_Ready_forBid = this.apiUrl + 'Lease_Ready_forBid/procLease_Ready_forBid';
       private Lease_bid_Award = this.apiUrl + 'Lease_bid_Award/procLease_bid_Award';
       private Lease_Yearly_Bid_Plan = this.apiUrl + 'Lease_Yearly_Bid_Plan/procLease_Yearly_Bid_Plan';
       private View_propertyUse = this.apiUrl + "view/View_propertyUse";
       private View_Bid_Type = this.apiUrl + "view/View_Bid_Type";
       private View_Yearly_Bid_Plan = this.apiUrl + "view/View_Yearly_Bid_Plan";
       private View_Lease_Bid = this.apiUrl + "view/View_Lease_Bid";
       private View_Lease_Ready_For_Bid = this.apiUrl + "view/View_Lease_Ready_For_Bid";
       private View_Debt_Suspenstion = this.apiUrl + "view/View_Debt_Suspenstion";
       private imagepath = '<button type="button" class="trigger">' +
           '<img src="http://job.xokait.com.et/datepicker/img/calendar.gif" alt="Popup"></button>';
   
 constructor(private http: HttpClient) {}
 
 getView_Lease_Bid(){
   return this.http.get(this.View_Lease_Bid)
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
getView_Lease_Ready_For_Bid(){
 return this.http.get(this.View_Lease_Ready_For_Bid)
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
