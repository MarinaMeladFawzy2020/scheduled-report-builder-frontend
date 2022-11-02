import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SchedulejobService } from 'src/app/services/schedulejob.service';
import { ActionsreportschedulerComponent } from '../actionsreportscheduler/actionsreportscheduler.component';
import { DatePipe } from '@angular/common'
import { CheckSavingDataService } from 'src/app/services/check-saving-data.service';

@Component({
  selector: 'app-listreportscheduler',
  templateUrl: './listreportscheduler.component.html',
  styleUrls: ['./listreportscheduler.component.css']
})
export class ListreportschedulerComponent implements OnInit {

  [x: string]: any;
  gridApi: any;
  gridColumnApi: any;
  sortingOrder:any;
  searchValue:string="";

  @Input() projid:string="";

  getResponse($event: any) {
    this.message = $event;
    this.rowData = this.message;
  }

  params: any;
  agInit(params: any): void {
    this.params = params;
  }

  gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  }

  columnDefs = [
    {headerName: 'Actions' ,minWidth: 175,  cellRenderer: "actionsreportscheduler" },
    {headerName: 'Schedule Name', minWidth: 150, field: 'sch_NAME', sortable: true, filter: true },
    {headerName: 'Start Date',  minWidth: 150,  field: 'sch_START', sortable: true, filter: true },
    {headerName: 'Active Status',  minWidth: 150,  field: 'active_FLAG', sortable: true, filter: true ,
      cellStyle: (params: { value: any; }) => params.value ===  "Active" ? { background: 'lightgreen' }: { background: 'lightcoral' },
      valueGetter: (params: { data: { active_FLAG: any; }; }) => {

      if(params.data.active_FLAG == 1){
        return "Active";
      }
      if(params.data.active_FLAG == 0){
        return "Deactive";
      }
        return params.data.active_FLAG;
      },
    },
    {headerName: 'Report Category',  minWidth: 160,  field: 'report.rep_MODULE', sortable: true, filter: true },
    {headerName: 'Report Name',  minWidth: 150,  field: 'report.rep_NAME', sortable: true, filter: true },
    {headerName: 'Frequency',  minWidth: 150,  field: 'sch_FREQ', sortable: true, filter: true },
    {headerName: 'Frequency Time',  minWidth: 150,  field: 'sch_TIME', sortable: true, filter: true,
      valueGetter: (params: { data: { sch_FREQ: any, sch_TIME: any; }; }) => {
        if(params.data.sch_FREQ == 'Monthly')
          return "Day: " + params.data.sch_TIME.split(" ")[0] + " Time: " + params.data.sch_TIME.split(" ")[1];

        return params.data.sch_TIME;
      }
    },
    {headerName: 'Last Time Run',  minWidth: 150,  field: 'last_START_TIME_RUN', sortable: true, filter: true },
    {headerName: 'Last Time Run Status',  minWidth: 185,  field: 'last_RUN_TIME_STATUS', sortable: true, filter: true },
    //{headerName: 'Last End Time Run',  minWidth: 150,  field: 'last_END_TIME_RUN', sortable: true, filter: true },
    {headerName: 'Next Time Run',  minWidth: 150,  field: 'next_TIME_RUN', sortable: true, filter: true },
    //{headerName: 'Reporter',  minWidth: 150,  field: 'created_BY', sortable: true, filter: true },

    // {headerName: 'ID', minWidth: 100, field: 'id', sortable: true, filter: 'agTextColumnFilter' }, //, checkboxSelection: true
    // {headerName: 'sch_FREQ_UNIT',  minWidth: 150,  field: 'sch_FREQ_UNIT', sortable: true, filter: true },
    // {headerName: 'email_SUBJECT',  minWidth: 150,  field: 'email_SUBJECT', sortable: true, filter: true },
    // {headerName: 'email_BODY',  minWidth: 150,  field: 'email_BODY', sortable: true, filter: true },
    // {headerName: 'rep_ID',  minWidth: 150,  field: 'report.rep_ID', sortable: true, filter: true },
    // {headerName: 'rep_TYPE',  minWidth: 150,  field: 'report.rep_TYPE', sortable: true, filter: true },
  ];

  frameworkComponents = {actionsreportscheduler: ActionsreportschedulerComponent}

  defaultColDef = {
    width: 200,
    editable: false,
    floatingFilter: true,
    resizable: true,
    flex: 1,
  };

  columnTypes = {
    nonEditableColumn: { editable: false },
    dateColumn: {
        filter: 'agDateColumnFilter',
        suppressMenu: true
    },
  };

  rowData:any=[];

  constructor(public checkSavingDataService: CheckSavingDataService, private http: HttpClient , private dataApi : SchedulejobService, public datepipe: DatePipe) {}

  ngOnInit(): void {
    this.bindOnInit();

    this.dataApi.getAllScheduleJob().subscribe(
      schedulerform1 => {
        //console.log(schedulerform1);
        for(let i = 0; i < schedulerform1.length; i++){
          schedulerform1[i]["next_TIME_RUN"] = this.datepipe.transform(schedulerform1[i]["next_TIME_RUN"], 'yyyy-MM-dd HH:mm')
          schedulerform1[i]["last_END_TIME_RUN"] = this.datepipe.transform(schedulerform1[i]["last_END_TIME_RUN"], 'yyyy-MM-dd HH:mm')
          schedulerform1[i]["last_START_TIME_RUN"] = this.datepipe.transform(schedulerform1[i]["last_START_TIME_RUN"], 'yyyy-MM-dd HH:mm')
          //if(schedulerform1[i]["sch_FREQ"] == 'Monthly')

        }

        this.rowData = schedulerform1;
      }
    );
  }

  bindOnInit(){
    this.checkSavingDataService.bindListOnInitFn(this.ngOnInit.bind(this));
  }


  onBtnExport() {
    var params = {
      skipHeader: false,
    };
    this.gridApi.exportDataAsCsv(params);
  }

  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }

}

