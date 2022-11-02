import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ListreportschedulerComponent } from './listreportscheduler/listreportscheduler.component';
import { EditreportschedulerComponent } from './editreportscheduler/editreportscheduler.component';
import { QuerybuilderComponent } from './querybuilder/querybuilder.component';
import {AuthGuardGuard} from '../auth-guard.guard';


const routes: Routes = [
  { path:'' , component: NavbarComponent ,  //NavsComponent
    children:[
      { path:'ReportScheduler', component: NavbarComponent, canActivate:[AuthGuardGuard] } ,
      { path:'ReportSchedulerList', component: ListreportschedulerComponent, canActivate:[AuthGuardGuard] } ,
      { path:'EditReportScheduler', component: EditreportschedulerComponent, canActivate:[AuthGuardGuard] } ,
      { path:'Querybuilder', component: QuerybuilderComponent, canActivate:[AuthGuardGuard] } ,
      //{ path:'/', component: QuerybuilderComponent }
  ]
},


];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavRoutingModule { }
