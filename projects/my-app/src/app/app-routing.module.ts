import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReadyLeaseForBidComponent } from './ready-lease-for-bid/ready-lease-for-bid.component';


const routes: Routes = [
  {
    path: "arada/am-et/MY-Task/service/:formcode",
    component: ReadyLeaseForBidComponent,
    pathMatch: "prefix",
  },
  {
    path: "arada/am-et/MY-Task/service/:id/:SDP_ID/:tskID/:formcode",
    component: ReadyLeaseForBidComponent,
  },
  {
    path: "arada/am-et/MY-Task/service/:formcode/:AppNo/:tskID/:DocId/:todoid/:TaskStatus",
    component: ReadyLeaseForBidComponent,
    pathMatch: "prefix",
  },
  {
    path: "services/:id/:AppNo/:tskTyp/:tskID/:docid/:todoID/:formcode",
    component: ReadyLeaseForBidComponent,
    pathMatch: "prefix",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
