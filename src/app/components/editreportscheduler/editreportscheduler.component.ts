import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CKEditor4 } from 'ckeditor4-angular';
import { Scheduler } from 'src/app/interfaces/scheduler';
import { LookupapiService } from 'src/app/services/lookupapi.service';
import { SchedulejobService } from 'src/app/services/schedulejob.service';
import { SharedataService } from 'src/app/services/sharedata.service';
//import { LoginService } from '../../services/login.service';
import { AuthService } from '../../services/auth.service';
import { TagInputModule } from 'ngx-chips';
import * as $ from 'jquery';
import { CheckSavingDataService } from 'src/app/services/check-saving-data.service';
import { MatTabGroup, MatTabHeader, MatTab } from '@angular/material/tabs';

//declare var $: any;

@Component({
  selector: 'app-editreportscheduler',
  templateUrl: './editreportscheduler.component.html',
  styleUrls: ['./editreportscheduler.component.css']
})
export class EditreportschedulerComponent implements OnInit {
  [x: string]: any;
  prog_title:string="hhh";
  mainData: any;
  AllFreq: any;
  AllReports: any;
  last_TIME_RUN = "" ;
  sch_START = "" ;
  sch_TIME = "" ;
  schedulerformedit!: { cc: any; created_BY: any; email_BODY: any; email_SUBJECT: any; id: number; recipients: any; report: { rep_ID: any; rep_MODULE: string; rep_NAME: string; rep_SQL: string; rep_TYPE: string; }; sch_FREQ: any; sch_NAME: any; sch_START: string; sch_TIME: string; active_FLAG:number};
  schjob: any;
  flag: any;
  setflag!: number;
  sch_NAME: any;
  Schedulerjob : Scheduler[] =[];
  minute = ["00:00","00:05","00:10","00:15","00:20","00:25","00:30","00:35","00:40","00:45","00:50","00:55"] ;
  days=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 , 12]
  weeks=["Sunday", "Monday" , "Tuesday" , "Wednesday" , "Thursday" ,"Friday" , "Saturday"];
  minu: any;
  time: any;
  week: any;
  day: any;
  d: any;
  dayss : any;
  MultidayList: string[] =["Sunday" , 'Monday' , 'Tuesday' , 'Wednesday' , 'Thursday' ,'Friday' , 'Saturday' , "Sunday"];
  ActiveQueryBuilder!: boolean;
  Alldays: any;
  selected = 'option2';
  toppings = new FormControl();
  toppingList: string[] = ["Sunday" ,'Monday' , 'Tuesday' , 'Wednesday' , 'Thursday' ,'Friday' , 'Saturday' ];
  multidays: any;
  texteditor: any;
  rep_NAME: any;
  rep_MODULE: any;

  editPermissionName: string = "SRB.EDIT";
  activePermissionName: string = "SRB.ACTIVATION";

  editPerm: boolean = false;
  activePerm: boolean = false;

  changeDataFlag: boolean = false;

  @ViewChild('tabs', { static: true }) tabs!: MatTabGroup;

  constructor(public checkSavingDataService: CheckSavingDataService, public loginService: AuthService, private sharedata :SharedataService , private lookupApi : LookupapiService ,private dataApi : SchedulejobService) {}

  // Multiselect
  filter(data: { value: any; }){
    this.d= data.value;
  }

  // Editor
  public onChange( event: CKEditor4.EventInfo ) {
    this.texteditor=  event.editor.getData();
    //console.log(  this.texteditor );
  }



    ngOnInit(): void {

      // this.activePerm = this.loginService.checkAuth(this.activePermissionName);
      // this.editPerm = this.loginService.checkAuth(this.editPermissionName);
      this.editPerm = true;
      this.activePerm = true;


      this.lookupApi.getAllFreq().subscribe(
        Response=> {
          this.AllFreq = Response ;
        }
      );

      /*this.lookupApi.getAllReports().subscribe(
          Response=> {
            this.AllReports = Response ;
            console.log(this.AllReports)
            for(let i=0 ; i<this.AllReports.length ;i++ ){
              if(this.mainData.report.rep_ID == this.AllReports[i].rep_ID){
              this.repName = this.AllReports[i].rep_NAME;
              }
            }
          }
        );*/

      this.checkSavingDataService.bindMainDataFunc(this.checkDataNotSaved.bind(this));
      this.checkSavingDataService.bindActivateFn(this.activate.bind(this));

      this.tabs._handleClick = this.handleDataNotSavedFlow.bind(this);

      this.ckeConfig = {
        allowedContent: true,
        extraPlugins: "divarea"
    };
      this.mainData = this.sharedata.getdatarow();
      //console.log("maindata");
      //console.log(this.mainData);
      this.texteditor = this.mainData.email_BODY;


      let arr = [];
      if(this.mainData["recipients"] == "")
        this.mainData["recipients"] = null;

      if(this.mainData["recipients"] != null){
        let recipientsStrings = this.mainData["recipients"].split(";");
        for(let i = 0; i < recipientsStrings.length; i++)
          arr.push({display: recipientsStrings[i], value: recipientsStrings[i]});
      }
      this.mainData["recipients"] = arr;

      let arrCC = [];
      if(this.mainData["cc"] == "")
        this.mainData["cc"] = null;

      if(this.mainData["cc"] != null){
        let CCStrings = this.mainData["cc"].split(";");
        for(let i = 0; i < CCStrings.length; i++)
          arrCC.push({display: CCStrings[i], value: CCStrings[i]});
      }
      this.mainData["cc"] = arrCC;

      this.rep_MODULE = this.mainData.report.rep_MODULE;
      this.repName = this.mainData.report.rep_NAME;
      this.sharedata.activedatarow(this.mainData.active_FLAG);

      this.flag = this.sharedata.getactivedatarow();
      this.sch_START = formatDate(this.mainData.sch_START, 'yyyy-MM-dd', 'en_US');

    if(this.mainData.sch_FREQ == "Hourly"){
      this.minu = this.mainData.sch_TIME;
    }
    if(this.mainData.sch_FREQ == "Daily"){
      let dayArray = this.mainData.sch_TIME.split(" ");
      if(dayArray.length > 1){
        this.multidays = dayArray[0];
        this.d = this.multidays
      //  console.log(dayArray);
        this.time = dayArray[1];
      //  console.log(this.days);
        let daysArray =  this.multidays.split(",");
      //  console.log(daysArray);
        this.toppings.setValue(daysArray);
      }else{
        this.time = this.mainData.sch_TIME;
      }

    }

    if(this.mainData.sch_FREQ == "Weekly"){
      let dateArray = this.mainData.sch_TIME.split(" ");
      for(let i=0; i<dateArray.length; i++){
        let attr =dateArray[i];
      }
      this.week = dateArray[0];
      this.time = dateArray[1];
    }

    if(this.mainData.sch_FREQ == "Monthly"){
      let dateArray = this.mainData.sch_TIME.split(" ");
      for(let i=0; i<dateArray.length; i++){
        let attr =dateArray[i];
      }
      this.day = dateArray[0];
      this.time = dateArray[1];
    }
  }

  //////////////////////////////////////////////////////////
  public errorMessages = {
      'validateEmail': 'Please be sure to use a valid email format'
  };

  public validateEmail(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      var EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      //console.log("ssss");
      if (control.value.length != "" && !EMAIL_REGEXP.test(control.value))
        return { "validateEmail": true };
      return null;
    };
  }
  //////////////////////////////////////////////////////////

  onClickSubmit(_f: any) {
    //console.log("submit");
    //console.log(_f);
    this.sch_START = formatDate(_f.sch_START, 'yyyy-MM-dd', 'en_US');
    this.sch_NAME = _f.sch_NAME;

    if(_f.sch_FREQ=="Hourly"){
      this.sch_TIME =_f.minute;
    }
    else if (_f.sch_FREQ=="Daily"){
      this.Alldays = this.d.toString();
      this.sch_TIME  = this.d.toString() + " "+ _f.time;
    }
    else if (_f.sch_FREQ=="Weekly"){
      this.sch_TIME  = _f.week +" "+  _f.time;
    }
    else if (_f.sch_FREQ=="Monthly"){
      this.sch_TIME  = _f.day + " "+  _f.time;
    }

    let preparedRecipients = "";
    for(let i = 0; i < _f.recipients.length; i++){
      if(i == _f.recipients.length - 1)
        preparedRecipients += _f.recipients[i]["value"];
      else
        preparedRecipients += _f.recipients[i]["value"] + ';';
    }

    let preparedCC = "";
    for(let i = 0; i < _f.cc.length; i++){
      if(i == _f.cc.length - 1)
        preparedCC += _f.cc[i]["value"];
      else
        preparedCC += _f.cc[i]["value"] + ';';
    }

    this.schedulerformedit = {
      "cc": preparedCC,
      "created_BY": _f.created_BY,
      "email_BODY": this.texteditor,
      "email_SUBJECT":_f.email_SUBJECT,
      "id":_f.id,
      "recipients": preparedRecipients,
      "report": {
        "rep_ID": _f.rep_ID,
        "rep_MODULE": "",
        "rep_NAME":_f.rep_NAME,
        "rep_SQL": "",
        "rep_TYPE": ""
      },
      "sch_FREQ":_f.sch_FREQ,
      "sch_NAME": this.sch_NAME,
      "sch_START":this.sch_START,
      "sch_TIME":this.sch_TIME,
      "active_FLAG":this.flag,
    }

    this.dataApi.editschedulejob(this.schedulerformedit).subscribe(
      Response=> {
        //console.log('updated!');
        //console.log(Response);
        this.changeDataFlag = false;
        this.sharedata.savedatarow(Response);
        bootbox.alert({title: "<span style='color:#28a745;font-weight: 500; font-size: 16px'>" + "Success message" + "</span>", message: "<span style='color:black;font-weight: 500; font-size: 16px'> The Scheduled Report is updated successfully </span>"}) ;
        this.flag = Response.active_FLAG ;
        this.sharedata.activedatarow(Response.active_FLAG);
      }
    );

  }

  onClickActive(f: any){
    //console.log("active clicked");
   // console.log(this.tabs.selectedIndex);
    if(this.tabs.selectedIndex == 0)
      this.handleActivation(f);
    else if(this.tabs.selectedIndex == 1)
      this.checkSavingDataService.inputsTabHandleActivationFn();
    else if(this.tabs.selectedIndex == 2)
      this.checkSavingDataService.outputsTabHandleActivationFn();

  }

  onClickDeactivate(_f: any){

      this.dataApi.activeschedulejob(_f.id,0).subscribe(
        Response=> {
          bootbox.alert({title: "<span style='color:#28a745;font-weight: 500; font-size: 16px'>" + "Success message" + "</span>", message: "<span style='color:black;font-weight: 500; font-size: 16px'> Report has been deactivated </span>"}) ;
      //  console.log(Response);
          this.flag = 0 ;
       //   console.log(this.flag ); // 0
        //  console.log('setdeactive!');
          this.sharedata.activedatarow(0);
          this.sharedata.savedatarowandflag(_f ,0);
          _f.active_FLAG = 0 ;

          this.ActiveQueryBuilder = true;
     }


    );

  }

  goback(){
    window.history.back();
  }

  onDataChange(f: any){
    sessionStorage.removeItem("schedulerEditForm");
    sessionStorage.setItem("schedulerEditForm", JSON.stringify(f));
    this.changeDataFlag = true;
  }

  activate(id: any){
    this.sharedata.savedatarow(this.schedulerformedit);
    this.setflag = 1;
    this.dataApi.activeschedulejob(id, 1).subscribe(
      Response => {
        //console.log("Activated without save");
        bootbox.alert({title: "<span style='color:#28a745;font-weight: 500; font-size: 16px'>" + "Success message" + "</span>", message: "<span style='color:black;font-weight: 500; font-size: 16px'> Report has been activated </span>"}) ;
        this.flag = this.setflag ;
        this.ActiveQueryBuilder = false;
      },
      (error) => {
        bootbox.alert({title: "<span style='color:#a33;font-weight: 500; font-size: 16px'>" + "Error message" + "</span>", message: "<span style='color:black;font-weight: 500; font-size: 16px'>"+error.error.message+"</span>"});
      }
    );
  }

  activateWithSave(_f: any ) {
    this.sch_START = formatDate(_f.sch_START, 'yyyy-MM-dd', 'en_US');

    if(_f.sch_FREQ == "Hourly"){
      this.sch_TIME = _f.minute;
    }
    else if (_f.sch_FREQ == "Daily"){
      this.multidays = this.d;
      this.sch_TIME = this.multidays + " " + _f.time ;
    }
    else if (_f.sch_FREQ == "Weekly"){
      this.sch_TIME = _f.week + " " +  _f.time  ;
    }
    else if (_f.sch_FREQ == "Monthly"){
      this.sch_TIME = _f.day + " " +  _f.time;
    }

    let preparedRecipients = "";
    for(let i = 0; i < _f.recipients.length; i++){
      if(i == _f.recipients.length - 1)
        preparedRecipients += _f.recipients[i]["value"];
      else
        preparedRecipients += _f.recipients[i]["value"] + ';';
    }

    let preparedCC = "";
    for(let i = 0; i < _f.cc.length; i++){
      if(i == _f.cc.length - 1)
        preparedCC += _f.cc[i]["value"];
      else
        preparedCC += _f.cc[i]["value"] + ';';
    }

    this.schedulerformedit = {
      "cc": preparedCC,
      "created_BY": _f.created_BY,
      "email_BODY": this.texteditor,
      "email_SUBJECT":_f.email_SUBJECT,
      "id":_f.id,
      "recipients": preparedRecipients,
      "report": {
        "rep_ID": _f.rep_ID,
        "rep_MODULE": _f.rep_MODULE,
        "rep_NAME":_f.rep_NAME,
        "rep_SQL": "",
        "rep_TYPE": ""
      },
      "sch_FREQ":_f.sch_FREQ,
      "sch_NAME": _f.sch_NAME,
      "sch_START":this.sch_START,
      "sch_TIME":this.sch_TIME,
      "active_FLAG":_f.active_FLAG,
    }

   // console.log(this.schedulerformedit);

    this.dataApi.editschedulejob(this.schedulerformedit).subscribe(
      Response => {
        //console.log("gdd");
        //console.log(this.schedulerformedit);
        this.sharedata.savedatarow(this.schedulerformedit);
        if( _f.active_FLAG == 0)
          this.setflag = 1;
        else if( _f.active_FLAG == 1)
          this.setflag = 0;

        this.dataApi.activeschedulejob(_f.id, this.setflag).subscribe(
          Response => {
           // console.log(Response);
            //console.log('updated!');
            bootbox.alert({title: "<span style='color:#28a745;font-weight: 500; font-size: 16px'>" + "Success message" + "</span>", message: "<span style='color:black;font-weight: 500; font-size: 16px'> Report has been activated </span>"}) ;
            this.flag = this.setflag ;
            this.schedulerformedit.active_FLAG=1;
            this.sharedata.savedatarow(this.schedulerformedit);
            this.ActiveQueryBuilder = false;
          },
          (error) => {
            bootbox.alert({title: "<span style='color:#a33;font-weight: 500; font-size: 16px'>" + "Error message" + "</span>", message: "<span style='color:black;font-weight: 500; font-size: 16px'>"+error.error.message+"</span>"});
          }
        );
      }
    );
  }

  handleActivation(f: any){
    if(this.changeDataFlag){
      var dialog = bootbox.dialog({
        title: 'Confirm changes',
        message: "<p>It seems you want to activate without saving your changes in scheduler details</p>",
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
                label: "Don't save and activate",
                className: 'btn-warning',
                callback: () => {
                  this.ngOnInit();
                  this.changeDataFlag = false;
                  this.activate(f.id);
                }
            },
            ok: {
                label: "Save and activate",
                className: 'btn-info',
                callback: () => {
                  this.changeDataFlag = false;
                  this.activateWithSave(f);
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
                  this.activate(f.id);
                }
            }
        }
      });
    }
  }

  handleDataNotSavedFlow(tab: MatTab, tabHeader: MatTabHeader, idx: number){
    if(this.tabs.selectedIndex == 0)
      return this.checkSavingDataService.mainDataFunc(tab, tabHeader, idx);
    else if(this.tabs.selectedIndex == 1)
      return this.checkSavingDataService.inputsDataFunc(this.tabs, tab, tabHeader, idx);
    else if(this.tabs.selectedIndex == 2)
      return this.checkSavingDataService.outputsDataFunc(this.tabs, tab, tabHeader, idx);
  }

  checkDataNotSaved(tab: MatTab, tabHeader: MatTabHeader, idx: number){
    //debugger;
    if(this.changeDataFlag){
      var dialog = bootbox.dialog({
        title: 'Confirm changes',
        message: "<p>You didn't save the report changed data, do you want to save?</p>",
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
                    //console.log('do not save clicked');
                    this.ngOnInit();
                    this.changeDataFlag = false;
                    return true && MatTabGroup.prototype._handleClick.apply(this.tabs, [tab, tabHeader, idx]);
                }
            },
            ok: {
                label: "Save",
                className: 'btn-info',
                callback: () => {
                    //console.log('save clicked');
                    this.onClickSubmit(JSON.parse(sessionStorage.getItem('schedulerEditForm') || ''));
                    return true && MatTabGroup.prototype._handleClick.apply(this.tabs, [tab, tabHeader, idx]);
                }
            }
        }
      });
    }
    else
      return true && MatTabGroup.prototype._handleClick.apply(this.tabs, [tab, tabHeader, idx]);
  }

}
