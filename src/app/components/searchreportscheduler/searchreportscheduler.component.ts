import { formatDate } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LookupapiService } from 'src/app/services/lookupapi.service';
import { SchedulejobService } from 'src/app/services/schedulejob.service';

@Component({
  selector: 'app-searchreportscheduler',
  templateUrl: './searchreportscheduler.component.html',
  styleUrls: ['./searchreportscheduler.component.css']
})
export class SearchreportschedulerComponent implements OnInit {
  AllFreq: any;
  AllReports: any;
  rowData: any;
  searchresult: any;
  @Output() getResponse = new EventEmitter;
  rep_ID!: number;
  sch_FREQ!: string;
  sch_NAME!: string;
  sch_TIME!:string;
  module!: string;
  userScopes: string[] = [];

  constructor( public loginService: AuthService, private dataApi : SchedulejobService , private lookupApi : LookupapiService) {}

  ngOnInit(): void {
    this.lookupApi.getAllFreq().subscribe(
      Response=> {
        this.AllFreq = Response ;
      }
     )

    this.userScopes = this.loginService.getUserScopes();
    //console.log("scopessss", this.userScopes);
  }

  onSelectModule($event: any){
    this.module = $event;

    if(this.module == "")
      this.AllReports = [];
    else
      this.getReports(this.module);
  }

  getReports(module: string){
    this.lookupApi.getAllReports(module).subscribe(
    Response => {
      this.AllReports = Response ;
    }
   );
  }


  search(_f: any) {
    //console.log("search 1:");
    //console.log(_f.value);

    if(_f.value.creation_DATE == null || _f.value.creation_DATE == ""){
       var createdate = "";
    }else{
      var createdate = formatDate(_f.value.creation_DATE , 'yyyy-MM-dd', 'en_US');;
    }

    if(_f.value.sch_FREQ == "" || _f.value.sch_FREQ == null ){
      this.sch_FREQ = "";
   }else {
    this.sch_FREQ = _f.value.sch_FREQ ;
   }

   if(_f.value.sch_NAME == ""  || _f.value.sch_NAME == null  ){
    this.sch_NAME = ""
 }else {
  this.sch_NAME = _f.value.sch_NAME ;
 }

 if(_f.value.sch_TIME == ""  || _f.value.sch_TIME == null  ){
  this.sch_TIME = ""
}else {
this.sch_TIME = _f.value.sch_TIME ;
}

   if(_f.value.rep_ID == "" || _f.value.rep_ID == 0 || _f.value.rep_ID == null ){
    this.rep_ID = 0;
   }else{
    this.rep_ID = _f.value.rep_ID;
   }


  var objectsearch = {
      "creation_DATE": createdate ,
      "rep_ID": this.rep_ID,
      "sch_FREQ":this.sch_FREQ ,
      "sch_NAME":this.sch_NAME,
      "sch_TIME":this.sch_TIME,
      "module": this.module
    }
    //console.log(objectsearch);
    this.dataApi.serachScheduleJob(objectsearch).subscribe(
      objectsearch=> {
        //console.log(objectsearch.status);
        this.rowData= objectsearch;
         //console.log(this.rowData.length);
         this.searchresult = this.rowData.length;
        //console.log(objectsearch);
        if(this.searchresult == 0){
          bootbox.alert({title: "<span style='color:#a33;font-weight: 500; font-size: 16px'>" + "Warning message" + "</span>", message: "<span style='color:Black;font-weight: 500; font-size: 16px'>" + "No data found" + "</span>"});
        }

        this.getResponse.emit(this.rowData);

   },
    (error) => {                              //Error callback
      console.log(error);
      console.log(error.error.message);
      bootbox.alert({title: "<span style='color:#a33;font-weight: 500; font-size: 16px'>" + "Warning message" + "</span>", message: "<span style='color:Black;font-weight: 500; font-size: 16px'>" + "No data found" + "</span>"});
      // this.errorMessage = error;
      // this.loading = false;

      //throw error;   //You can also throw the error to a global error handler
    }
  );



  }

  reset(_f: any){
    //console.log("reset");
    _f.reset();
    //console.log(_f.value);
    var objectsearch = {
      "creation_DATE": "" ,
      "rep_ID": 0,
      "sch_FREQ":"",
      "sch_NAME":"",
      "sch_TIME":"",
      "module": ""

    }
    this.dataApi.serachScheduleJob(objectsearch).subscribe(
      objectsearch=> {
        this.rowData= objectsearch;
        //console.log(objectsearch);
        this.searchresult = 0;
        this.getResponse.emit(this.rowData);

   }
  );

  }
}
