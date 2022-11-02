import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgRendererComponent, ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Callbacks } from 'jquery';
import { CheckSavingDataService } from 'src/app/services/check-saving-data.service';
import { SchedulejobService } from 'src/app/services/schedulejob.service';
import { SharedataService } from 'src/app/services/sharedata.service';
//import { LoginService } from '../../services/login.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-actionsreportscheduler',
  templateUrl: './actionsreportscheduler.component.html',
  styleUrls: ['./actionsreportscheduler.component.css']
})
export class ActionsreportschedulerComponent implements OnInit , ICellRendererAngularComp, AgRendererComponent  {
  gridApi: any;
  params!: ICellRendererParams;
  data: any;
  schedulejob: any;
  t: any;
  deletePerm: boolean = false;

  createPerm: boolean = false;

  constructor(public checkSavingDataService: CheckSavingDataService, public loginService: AuthService, private dataApi :SchedulejobService , private router: Router , private sharedata :SharedataService ) { }
  refresh(params: ICellRendererParams): boolean {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    // this.createPerm = this.loginService.checkAuth('SRB.CREATE');
    this.createPerm = true;
    // this.deletePerm = this.loginService.checkAuth('SRB.DELETE');
    this.deletePerm = true;
  }
  // onGridReady = (params: { api: any; columnApi: any; }) => {
  //   this.gridApi = params.api;
  // //  this.gridColumnApi = params.columnApi;
  //   console.log('gridApiii Child--- : ');
  // //  console.log( this.gridColumnApi);
  // }
  agInit(params: ICellRendererParams): void {
    this.params = params;
  //console.log(params.node);
    this.data = params.node.data;
  // console.log("dataaaaa:");
   // console.log(this.data);
  }

  viewDetails(){
  }

  editDetails(data: any){
     this.sharedata.savedatarow(data);
    // console.log( btoa(this.data.id));
     this.router.navigate(["/EditReportScheduler"]);//, { queryParams: { id: btoa(this.data.id) } });
  }

  cloneAction(data: any){
    //console.log("Clone");
    //console.log(data);

    bootbox.prompt(
    {
      title: "<span style='color:black;font-weight: 500; font-size: 16px'>Schedule Name</span>",
      message: "<span style='color:red;font-weight: 500; font-size: 12px; margin-bottom: 10px'>Required</span>",
      required: true,
      closeButton: false,
      callback: (newName: any) => {
        data.sch_NAME = newName;
        data.last_END_TIME_RUN = null;
        data.last_RUN_TIME_STATUS = null;
        data.last_START_TIME_RUN = null;
        data.next_TIME_RUN = null;

        if(newName == "" || newName == null)
          return;

        this.dataApi.cloneScheduleJob(data).subscribe(
          response => {
           // console.log("clone response");
            //console.log(response);
            var t = bootbox.alert(
              {
                title: "<span style='color:#28a745;font-weight: 500; font-size: 16px'>" + "Success message" + "</span>",
                message: "<span style='color:black;font-weight: 500; font-size: 16px'> The Scheduled Report is cloned successfully </span>"
              }
            );

            response["active_FLAG"] = 0;
            this.sharedata.savedatarow(response);

            this.router.navigate(["/EditReportScheduler"], { queryParams: { id: response.id }});

          },
          (error) => {
            console.log(error);
            console.log(error.error.message);
            bootbox.alert("Error Clone");
          }
        );
      }
    });
  }

  deleteschedule(data: any){
    if(data.active_FLAG == 1 ){
      bootbox.alert({title: "<span style='color:#a33;font-weight: 500; font-size: 16px'>Error message</span>", message: "<span style='color:black;font-weight: 500; font-size: 16px'>Report is active, cannot be deleted</span>"});
    }
    else if(data.active_FLAG == 0 ){
   bootbox.confirm( "<h3 style='color:#a33;font-weight: 500; font-size: 16px'>Confirmation message</h3> <hr> <span style='color:black;font-weight: 500; font-size: 16px'>Are you sure you want to delete this report ? </span>",  (result: boolean) => {
      if (result == false) {
      return;
      }
       else {
       //console.log(result);
        this.dataApi.deleteScheduleJob(data).subscribe(
          (repsonse: any)=> {
            // console.log(data.id);
            //console.log(repsonse);
            bootbox.alert({title: "<span style='color:#28a745;font-weight: 500; font-size: 16px'>" + "Success message" + "</span>", message: "<span style='color:black;font-weight: 500; font-size: 16px'> Schedule report is deleted successfully </span>"}) ;
            //window.location.reload();
            this.checkSavingDataService.listOnInitFn();
            // this.reloadCurrentPage();
          }
        );

      }
  });

//   this.t.init(function(){
//      setTimeout(function(){
//       window.location.reload();
//      }, 3000);
// });

}



    //   bootbox.confirm({
    //     message: "Are Your Sure ?",
    //     buttons: {
    //         confirm: {
    //             label: 'Yes',
    //             className: 'btn-success'
    //         },
    //         cancel: {
    //             label: 'No',
    //             className: 'btn-danger'
    //         }
    //     }
    // } ,  (result: boolean) => {alert(result); } );






  }
  reloadCurrentPage() {
    window.location.reload();
  }


  onClickSubmit(_f: any){
    //console.log(_f);
  }


}

