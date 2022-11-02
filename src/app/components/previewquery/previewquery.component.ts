import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { QueryserviceService } from 'src/app/services/queryservice.service';
import { HttpErrorResponse } from '@angular/common/http';

import * as angular from 'angular';
declare var $: any
//declare var $:JQueryStatic;


@Component({
  selector: 'app-previewquery',
  templateUrl: './previewquery.component.html',
  styleUrls: ['./previewquery.component.css']
})

export class PreviewqueryComponent implements OnInit {
  [x: string]: any;

  rowData: any = [];
  gridApi: any;
  gridColumnApi: any;
  columnDefs: any = [];
  isPreviewDone: boolean = false;

  constructor(private queryService: QueryserviceService) { }

  @Input() SchIDpreview!: number;
  @Input() ReportID!: number;
  @Input() ActiveFlag!: number;
  @Input() editPermissionName!: string;

  ngOnInit(): void {
    this.columnDefs = [];
  }

  gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  }

  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
    //console.log(this.gridApi);

    this.gridApi.setColumnDefs([]);
    this.gridApi.setRowData([]);
    this.gridApi.showLoadingOverlay();

    this.queryService.getPreview(this.SchIDpreview).subscribe(
      (Response: any) => {
        this.rowData = [];
        this.columnDefs = [];

        //console.log("prev res");
        //console.log(Response);
        for (var key in Response[0]) {
          this.columnDefs.push({ field: key });
        }
        this.gridApi.setColumnDefs(this.columnDefs);
        this.rowData = Response;
        this.isPreviewDone = true;
      },
      (error: HttpErrorResponse) => {
        bootbox.alert({title: "<span style='color:#a33;font-weight: 500; font-size: 16px'>" + "Warning" + "</span>", message: "<span style='color:black;font-weight: 500; font-size: 16px'>" +  error.error.message + "</span>"});
        this.gridApi.setColumnDefs([]);
        this.rowData = [];
        this.isPreviewDone = true;
      }
    );
  }


  onBtnExport() {
    var params = {
      skipHeader: false,
    };
    this.gridApi.exportDataAsCsv(params);
  }


  getResponse($event: any) {
    if(this.gridApi != null){
      let param= {api:this.gridApi};
      //this.columnDefs=[];
      //this.rowData=[];
      //this.gridApi.setColumnDefs(this.columnDefs);
      //this.gridApi.setRowData(this.rowData);
      //this.gridApi.showLoadingOverlay();
      this.onGridReady(param);
    }
    this.message = $event;
  }

}
