import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS ,MAT_DATE_LOCALE} from '@angular/material/core';
import { Router } from '@angular/router';
import { CKEditor4 } from 'ckeditor4-angular';
import { Scheduler } from 'src/app/interfaces/scheduler';
import { LookupapiService } from 'src/app/services/lookupapi.service';
import { SchedulejobService } from 'src/app/services/schedulejob.service';
import { AuthService } from '../../services/auth.service';
import jwt_decode from "jwt-decode";
import { pairwise } from 'rxjs/operators';
import { SharedataService } from 'src/app/services/sharedata.service';

declare var $: any;

@Component({
  selector: 'app-creatreportscheduler',
  templateUrl: './creatreportscheduler.component.html',
  styleUrls: ['./creatreportscheduler.component.css'],

  // providers: [
  //    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  //   ],

})
export class CreatreportschedulerComponent implements OnInit {
  [x: string]: any;
  schedulerform!: FormGroup;
  submitted = false;
  Schedulerjob : Scheduler[] =[];
  checkrec: boolean = true;
  checkcc: boolean = true;
  // schedulerform1 = {
  //     "created_BY": "Ibrahim",
  //     "email_BODY": "string",
  //     "email_SUBJECT": "string",
  //     "last_TIME_RUN": "2021-08-01",
  //     "recipients": "string",
  //     "report": {
  //       "rep_ID": 2,
  //       "rep_MODULE": "string",
  //       "rep_NAME": "string",
  //       "rep_SQL": "string",
  //       "rep_TYPE": "string"
  //     },
  //     "sch_FREQ": "Hourly",
  //     "sch_FREQ_UNIT": "string",
  //     "sch_ID": 0,
  //     "sch_NAME": "string",
  //     "sch_START": "2021-08-12",
  //     "sch_TIME": "2021-04-01"
  //   }

  minute = ["00:00","00:05","00:10","00:15","00:20","00:25","00:30","00:35","00:40","00:45","00:50","00:55"] ;
  days=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 , 12]
  weeks=["Sunday" ,"Monday" , "Tuesday" , "Wednesday" , "Thursday" ,"Friday" , "Saturday" ];

  multiday = new FormControl();
  MultidayList: string[] =["Sunday", "Monday" , "Tuesday" , "Wednesday" , "Thursday" ,"Friday" , "Saturday"];
  permissionName: string = "SRB.CREATE";
  userScopes: string[] = [];

  constructor(private sharedata :SharedataService, private router: Router, public loginService: AuthService, private dataApi : SchedulejobService , private lookupApi : LookupapiService) {}

   public onChange( event: CKEditor4.EventInfo ) {
    //console.log( event.editor.getData() );
  }

  ngOnInit(): void {
    this.nameparam1 = localStorage.getItem("username");

    // this.createPerm = this.loginService.checkAuth(this.permissionName);
    this.createPerm = true;

    this.schedulerform = new FormGroup({
      'cc': new FormControl ("" ),  //[Validators.email ,  Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]
      'created_BY': new FormControl (),
      'email_BODY': new FormControl (null),
      'email_SUBJECT': new FormControl (null , [Validators.maxLength(4000)]),
      'id': new FormControl (),
      'recipients' : new FormControl (""),
      'rep_ID': new FormControl (null , [Validators.required ]),
      'sch_FREQ': new FormControl (null),
      'sch_NAME': new FormControl  (null , [Validators.required , Validators.maxLength(100)] ),
      'sch_START': new FormControl (null , [Validators.required ]),
      'sch_TIME': new FormControl (null),
      'minute' : new FormControl (""),
      'time' : new FormControl (""),
      'day' : new FormControl (""),
      'week' : new FormControl (""),
      'days' : new FormControl (""),
      'module': new FormControl(null, [Validators.required ])
    })

    //console.log("create");
    //console.log(this.schedulerform);
    this.freqchange = this.schedulerform.value.sch_FREQ ;

    this.lookupApi.getAllFreq().subscribe(
      Response=> {
        this.AllFreq = Response ;
      }
    );

    this.userScopes = this.loginService.getUserScopes();

    this.schedulerform.get('module')?.valueChanges.subscribe( value => {
      this.getReports(value);
    });
  }

  getReports(module: string){
    this.AllReports = [];
    this.lookupApi.getAllReports(module).subscribe(
    Response => {
      this.AllReports = Response ;
    }
   );
  }

  public resetForm(){
    this.schedulerform.reset();
    this.nameparam1 = localStorage.getItem("username");
    this.schedulerform.patchValue({
      'created_BY': this.nameparam1
    });
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


  createsub(_f: any){
    if(_f.sch_FREQ=="Hourly"){
      this.sch_TIME =_f.minute ;
    }
    else if (_f.sch_FREQ=="Daily"){
      //console.log(_f.days.toString());
      this.Alldays = _f.days.toString();
      this.sch_TIME  = _f.days.toString() + " "+ _f.time ;
    }
    else if (_f.sch_FREQ=="Weekly"){
      this.sch_TIME  = _f.week +" "+  _f.time  ;
    }
    else if (_f.sch_FREQ=="Monthly"){
      this.sch_TIME  = _f.day + " "+  _f.time;
    }

    this.last_TIME_RUN = "" ;
    this.sch_START = "" ;

    if(_f.last_TIME_RUN == null || _f.last_TIME_RUN == "" ){
      this.last_TIME_RUN ="";
    }else {
      this.last_TIME_RUN = formatDate(_f.last_TIME_RUN, 'yyyy-MM-dd', 'en_US');
    }

    if(_f.sch_START == null || _f.sch_START == "" ){
      this.sch_START ="";
    }else {
      this.sch_START = formatDate(_f.sch_START, 'yyyy-MM-dd', 'en_US');
    }

    let preparedRecipients = "";
    for(let i = 0; i < _f.recipients?.length; i++){
      if(i == _f.recipients.length - 1)
        preparedRecipients += _f.recipients[i]["value"];
      else
        preparedRecipients += _f.recipients[i]["value"] + ';';
    }

    let preparedCC = "";
    for(let i = 0; i < _f.cc?.length; i++){
      if(i == _f.cc.length - 1)
        preparedCC += _f.cc[i]["value"];
      else
        preparedCC += _f.cc[i]["value"] + ';';
    }

   this.schedulerform1 = {
    "cc": preparedCC,
    "created_BY": _f.created_BY,
    "email_BODY": _f.email_BODY,
    "email_SUBJECT":_f.email_SUBJECT,
    "id":0,
    "recipients": preparedRecipients,
    "report": {
      "rep_ID": _f.rep_ID,
      "rep_MODULE": "",
      "rep_NAME": "",
      "rep_SQL": "",
      "rep_TYPE": ""
    },
    "sch_FREQ":_f.sch_FREQ,
    "sch_NAME": _f.sch_NAME,
    "sch_START":this.sch_START,
    "sch_TIME":this.sch_TIME,
  }

  //console.log("create request");
  //console.log(this.schedulerform1);

  this.dataApi.createScheduleJob(this.schedulerform1).subscribe(
    schedulerform1 => {
      //console.log("create response");
     // console.log(schedulerform1);
      this.Schedulerjob.unshift(schedulerform1);  //push
      //console.log(this.schedulerform1);
      //console.log("Success Add : ");

      var t = bootbox.alert({
        title: "<span style='color:#28a745;font-weight: 500; font-size: 16px'>" + "Success message" + "</span>",
        message: "<span style='font-weight: 400; font-size: 16px;'>"+" The Scheduled Report is created successfully "+"</span>  </i>",
        callback: function(){
        }
      });

      schedulerform1["active_FLAG"] = 0;
      this.sharedata.savedatarow(schedulerform1);


      $('#schedulerModal').modal('hide');
      this.router.navigate(["/EditReportScheduler"]);//, { queryParams: { id: schedulerform1.id }});

      // var t = bootbox.alert({title: "<span style='color:#28a745;font-weight: 500; font-size: 16px'>" + "Success message" + "</span>", message: "<span style='color:black;font-weight: 500; font-size: 16px'> The Scheduled Report is created successfully </span>"});
      // t.init(() =>{
      //   setTimeout(() =>{
      //     window.location.reload();
      //     //this.router.navigate(["/EditReportScheduler"], { queryParams: { id: schedulerform1["id"] } });
      //   }, 3000);
      // });
    },
    (error) => {
      console.log(error);
      console.log(error.error.message);
      bootbox.alert("Error Create");

    }
  );



  }

  reloadCurrentPage() {
    window.location.reload();
    localStorage.setItem("emailAll", JSON.stringify(""));
    this.ngOnInit();
  }

onReset() {
  this.submitted = false;
  this.schedulerform.reset();
  //console.log(this.schedulerform.value);
  localStorage.setItem("emailAll", JSON.stringify(""));
  this.checked = false;
}



}




