import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { observable, Observable } from 'rxjs';
import { Scheduler } from '../interfaces/scheduler';

declare var apiURL : any;

@Injectable({
  providedIn: 'root'
})

export class SchedulejobService {
  SchedulejobAll!: string;

  URL = apiURL;

  //URL : string = "https://localhost:8443";
  //URL : string = "https://192.168.0.80:8443";
  //URL : string = "http://167.86.87.9:8080";


  constructor(private http: HttpClient , private route:ActivatedRoute) { }

  getAllScheduleJob(): Observable<Scheduler[]> {
    this.SchedulejobAll= this.URL+'/schedulejob/getjobs';
    //console.log(this.SchedulejobAll);
    return this.http.get<Scheduler[]> (this.SchedulejobAll);
  }

  createScheduleJob(schedulejob: any): Observable<any> {
    //console.log("add:");
    //console.log(schedulejob);
    return this.http.post(this.URL+"/schedulejob/create/", schedulejob);
    }

    cloneScheduleJob(schedulejob: any): Observable<any> {
      //console.log(schedulejob);
      return this.http.post(this.URL+"/schedulejob/clone", schedulejob);
    }

   serachScheduleJob(schedulesearch: any): Observable<any> {
    //console.log("serach:");
    //console.log(schedulesearch);
    return this.http.post(this.URL+"/schedulejob/search/", schedulesearch);
    }




    deleteScheduleJob(_data: any): Observable<Scheduler[]>{
      //console.log(this.URL+"/schedulejob/delete/"+_data.id);
      return this.http.delete<Scheduler[]>(this.URL+"/schedulejob/delete/" + _data.id);
    }


    editschedulejob(schedulejob: any): Observable<any> {
    //  console.log("Editschedulejob");
    //  console.log(schedulejob);
    return this.http.put(this.URL+"/schedulejob/edit/" , schedulejob);
   }

   activeschedulejob(scheduleid: any , flagActive: any ): Observable<any> {
  //  console.log("activeschedulejob");
  //  console.log(scheduleid);
  //  console.log(flagActive);
  return this.http.put(this.URL+"/schedulejob/setactiveflag/"+scheduleid+"/"+flagActive , null);
 }
}







  // edit(user): Observable<any> {
  //   return this.http.put(this.cashrequest + user.id, user);
  // }
