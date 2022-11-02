import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CheckSavingDataService } from 'src/app/services/check-saving-data.service';
import { QueryserviceService } from 'src/app/services/queryservice.service';
//import { LoginService } from '../../services/login.service';
import { AuthService } from '../../services/auth.service';
import { MatTabGroup, MatTabHeader, MatTab } from '@angular/material/tabs';

@Component({
  selector: 'app-previewcolum',
  templateUrl: './previewcolum.component.html',
  styleUrls: ['./previewcolum.component.css']
})
export class PreviewcolumComponent implements OnInit {
  @Input() SchIDpreviewcol!: number;
  @Input() ReportIDcol!: number;
  @Input() ActiveFlag!: number;
  @Input() editPermissionName!: string;

  @Output() getResponse = new EventEmitter;

  [x: string]: any;
  masterSelected: boolean = false;
  checklist: any;
  checkedList: any;
  checklist1: any = [{}];
  messpreview:boolean = false;
  previewPermissionName: string = "SRB.PREVIEW";
  changeDataFlag: boolean = false;
  //editPermissionName: string = "System.creatse";
  editPerm: boolean = false;
  prevPerm: boolean = false;

  constructor(public checkSavingDataService: CheckSavingDataService, public loginService: AuthService, private queryService: QueryserviceService) { }

  ngOnInit(): void {

    this.editPerm = true;
    // this.editPerm = this.loginService.checkAuth(this.editPermissionName);
    // this.prevPerm = this.loginService.checkAuth(this.previewPermissionName);
    this.prevPerm = true;

    this.checkSavingDataService.bindOutputsDataFunc(this.checkDataNotSaved.bind(this));
    this.checkSavingDataService.bindOutputsTabHandleActivationFn(this.handleActivation.bind(this));


    // Get ColumName CheckBox
    this.queryService.getColumReportchecked(this.SchIDpreviewcol).subscribe(
      (Response: any) => {
        this.arrcolcheck = Response.split(';');

        this.queryService.getColumReport(this.ReportIDcol).subscribe(
          (Response: any) => {

           // console.log("prev");
           // console.log(Response);

            this.columNameList = Response;
            var dataList = [];
            var datachecklist = [];

            if(this.arrcolcheck.length > 0){
              for (let i = 0; i < this.columNameList.length; i++) {
                this.messpreview = true;
                let found = false;
                for (let ii=0; ii<this.arrcolcheck.length; ii++){
                  if(this.columNameList[i].column_NAME === this.arrcolcheck[ii]){
                    found = true;
                    break;
                  }
                }

                if(found)
                  datachecklist[i] = { id: i + 1, value: this.columNameList[i].column_NAME, column_NAME: this.columNameList[i].column_LABEL_EN, isSelected: true };
                else
                  datachecklist[i] = { id: i + 1, value: this.columNameList[i].column_NAME, column_NAME: this.columNameList[i].column_LABEL_EN, isSelected: false };

                datachecklist[i]["is_MANDATORY"] = this.columNameList[i].is_MANDATORY;
                dataList.push(datachecklist[i]);
              }
            }

            this.checklist = dataList;
            this.getCheckedItemList();

            if(this.columNameList.length == this.arrcolcheck.length){
              this.masterSelected = true;
            }
          }
        );

      }
    );


  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      if(this.checklist[i].is_MANDATORY != 1)
        this.checklist[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  // Check All Checkbox Checked
  isAllSelected() {
    this.masterSelected = this.checklist.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }


  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.checklist.length; i++) {
      if (this.checklist[i].isSelected)
        this.checkedList.push(this.checklist[i]);
    }
    this.checkedList = JSON.stringify(this.checkedList);
  }

  datasendList: string = "" ;

  onDataChange(f: any){
    sessionStorage.removeItem("OutputsForm");
    //console.log("fff");
    sessionStorage.setItem("OutputsForm", f);
    this.changeDataFlag = true;
  }

  checkDataNotSaved(tabs: MatTabGroup, tab: MatTab, tabHeader: MatTabHeader, idx: number){
    //debugger;
    if(this.changeDataFlag){
      var dialog = bootbox.dialog({
        title: 'Confirm changes',
        message: "<p>You didn't save the outputs changed data, do you want to save?</p>",
        size: 'medium',
        closeButton: false,
        buttons: {
            cancel: {
                label: "Cancel",
                className: 'btn-danger',
                callback: () => {
                    //console.log('cancel clicked');
                }
            },
            noclose: {
                label: "Don't save",
                className: 'btn-warning',
                callback: () => {
                   // console.log('do not save clicked');
                    this.ngOnInit();
                    this.changeDataFlag = false;
                    return true && MatTabGroup.prototype._handleClick.apply(tabs, [tab, tabHeader, idx]);
                }
            },
            ok: {
                label: "Save",
                className: 'btn-info',
                callback: () => {
                    //console.log('save clicked');
                    this.sendcolum(sessionStorage.getItem('OutputsForm') || '');
                    return true && MatTabGroup.prototype._handleClick.apply(tabs, [tab, tabHeader, idx]);
                }
            }
        }
      });
    }
    else
      return true && MatTabGroup.prototype._handleClick.apply(tabs, [tab, tabHeader, idx]);
  }

  // Send ColumName CheckBox
  sendcolum(_f: any) {
    var datasend = JSON.parse(_f);
    this.datasendList = "";
    for (let i = 0; i < datasend.length; i++) {
      if(i === datasend.length - 1){
        this.coluName = datasend[i].value;
        this.datasendList+= this.coluName;
      }
      else{
        this.coluName = datasend[i].value;
        this.datasendList+= this.coluName + ";";
      }
    }

    var sendcolumobject = {
      sch_ID: this.SchIDpreviewcol  ,
      columns_STRING: this.datasendList
    }

    //console.log(sendcolumobject);
    this.queryService.SendColumReport(sendcolumobject).subscribe(
      (Response: any) => {
        this.messpreview = true;
        this.changeDataFlag = false;
        bootbox.alert(
          {
            title: "<span style='color:#28a745;font-weight: 500; font-size: 16px'>" + "Success message" + "</span>",
            message: "<span style='color:black;font-weight: 500; font-size: 16px'>"+Response+"</span>"
          }
        );
      },
      (error: any) => {
        bootbox.alert({title : "<span style='color:#a33;font-weight: 500; font-size: 16px'>" + "Warning" + "</span>", message: "<span style='color:black;font-weight: 500; font-size: 16px'>" + error.error.message + "</span>"});
      }
    );
  }

  activateWithSave(){
    var datasend = JSON.parse(this.checkedList);
    this.datasendList = "";
    for (let i = 0; i < datasend.length; i++) {
      if(i === datasend.length - 1){
        this.coluName = datasend[i].value;
        this.datasendList+= this.coluName;
      }
      else{
        this.coluName = datasend[i].value;
        this.datasendList+= this.coluName + ";";
      }
    }

    var sendcolumobject = {
      sch_ID: this.SchIDpreviewcol  ,
      columns_STRING: this.datasendList
    }

    //console.log(sendcolumobject);
    this.queryService.SendColumReport(sendcolumobject).subscribe(
      (Response: any) => {
        this.messpreview = true;
        this.changeDataFlag = false;
        bootbox.alert(
          {
            title: "<span style='color:#28a745;font-weight: 500; font-size: 16px'>" + "Success message" + "</span>",
            message: "<span style='color:black;font-weight: 500; font-size: 16px'>"+Response+"</span>",
            callback: () => {
              this.checkSavingDataService.activateFn(this.SchIDpreviewcol);
            }
          }
        );
      },
      (error: any) => {
        bootbox.alert({title : "<span style='color:#a33;font-weight: 500; font-size: 16px'>" + "Warning" + "</span>", message: "<span style='color:black;font-weight: 500; font-size: 16px'>" + error.error.message + "</span>"});
      }
    );
  }

  handleActivation(){
    if(this.changeDataFlag){
      var dialog = bootbox.dialog({
        title: 'Confirm changes',
        message: "<p>It seems you want to activate without saving your changes in outputs</p>",
        size: 'medium',
        closeButton: false,
        buttons: {
            cancel: {
                label: "Cancel",
                className: 'btn-danger',
                callback: () => {
                   // console.log('cancel clicked');
                }
            },
            noclose: {
                label: "Don't save and activate",
                className: 'btn-warning',
                callback: () => {
                  this.ngOnInit();
                  this.changeDataFlag = false;
                  this.checkSavingDataService.activateFn(this.SchIDpreviewcol);
                }
            },
            ok: {
                label: "Save and activate",
                className: 'btn-info',
                callback: () => {
                  this.changeDataFlag = false;
                  this.activateWithSave();
                }
            }
        }
      });
    }
    else{
      var dialog = bootbox.dialog({
        title: 'Confirm changes',
        message: "<p>Are you sure you want to activate schedule?</p>",
        size: 'medium',
        closeButton: false,
        buttons: {
            cancel: {
                label: "No",
                className: 'btn-danger',
                callback: () => {
                }
            },
            ok: {
                label: "Yes",
                className: 'btn-info',
                callback: () => {
                  this.checkSavingDataService.activateFn(this.SchIDpreviewcol);
                }
            }
        }
      });
    }
  }

  PreviewTable(){
    this.getResponse.emit(true);
  }

}
