import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedataService {
  schedulejobdetails: any;
  schedulerformedit: { cc: any; created_BY: any; email_BODY: any; email_SUBJECT: any; id: any; recipients: any; report: { rep_ID: any; rep_MODULE: string; rep_NAME: string; rep_SQL: string; rep_TYPE: string; }; sch_FREQ: any; sch_NAME: any; sch_START: any; sch_TIME: any; active_FLAG: any; } | undefined;

  constructor() { }

  savedatarow(schedulejob: any){
    this.schedulejobdetails = schedulejob;
   // console.log("save");
   //console.log(this.schedulejobdetails);
   localStorage.removeItem("schedulejobdetails");
     localStorage.setItem("schedulejobdetails", JSON.stringify(this.schedulejobdetails));
  //  console.log("savecon");
  //  console.log(this.schedulejobdetails);
  }

  getdatarow(){
   // console.log("get");
    var z=localStorage.getItem("schedulejobdetails");
    if(z!=null)
    this.schedulejobdetails = JSON.parse(z);
  //  console.log(this.schedulejobdetails);
    return this.schedulejobdetails;

  }


  activedatarow(flag: any){
    this.schedulejobdetails.active_FLAG = flag;
     localStorage.setItem("ActiveFlag", JSON.stringify(this.schedulejobdetails.active_FLAG));
  }

  getactivedatarow(){
   // console.log("getActive");
    var z=localStorage.getItem("ActiveFlag");
    if(z!=null)
    this.schedulejobdetails.active_FLAG = JSON.parse(z);
 //   console.log(this.schedulejobdetails.active_FLAG);
    return this.schedulejobdetails.active_FLAG;

  }

  savedatarowandflag(schedulejob: any , flag: any){
//console.log(schedulejob);
    this.schedulerformedit = {
      "cc": schedulejob.cc,
      "created_BY": schedulejob.created_BY,
      "email_BODY": schedulejob.email_BODY,
      "email_SUBJECT":schedulejob.email_SUBJECT,
      "id":schedulejob.id,
      "recipients": schedulejob.recipients,
      "report": {
        "rep_ID": schedulejob.rep_ID,
        "rep_MODULE": "",
        "rep_NAME": "",
        "rep_SQL": "",
        "rep_TYPE": ""
      },
      "sch_FREQ":schedulejob.sch_FREQ,
      "sch_NAME": schedulejob.sch_NAME,
      "sch_START":schedulejob.sch_START,
      "sch_TIME":schedulejob.sch_TIME,
      "active_FLAG":flag,

    }

     localStorage.setItem("schedulejobdetails", JSON.stringify(this.schedulerformedit));
//    console.log("saveconflag");
 //   console.log(this.schedulerformedit);
  }



  getactivedatarowandflag(){
  //  console.log("getActive");
    var z=localStorage.getItem("schedulejobdetails");
    if(z!=null)
    this.schedulerformedit = JSON.parse(z);
   // console.log(this.schedulejobdetails);
    return this.schedulerformedit;

  }

}
