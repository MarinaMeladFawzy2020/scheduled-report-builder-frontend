import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

declare var apiURL : any;

@Injectable({
  providedIn: 'root'
})
export class QueryserviceService {

  private apiServerUrl = apiURL;
  //private apiServerUrl = "https://localhost:8443";
  //private apiServerUrl = "https://192.168.0.80:8443";
  //private apiServerUrl = "http://167.86.87.9:8080";

  constructor(private http: HttpClient){}

  public sendQuery(query: any): Observable<any> {
    return this.http.post(`${this.apiServerUrl}/querybuilder/sendquery`, query, {responseType: 'text'});
  }

  public processQuery(SCH_ID: number, query: any): Observable<any> {
    return this.http.post(`${this.apiServerUrl}/schedulejob/setfilters/${SCH_ID}`, query, {responseType: 'text'});
  }

  public getFilterLookupObjects(lookups: any[]): Observable<any> {
    return this.http.post(`${this.apiServerUrl}/lookups/getalllookupsobjects`, lookups);
  }

  public getQuery(jobId: number): any {
    return this.http.get<any>(`${this.apiServerUrl}/schedulejob/getfilters/${jobId}`);
  }

  public getRepFilters(REP_ID: number): any {
    return this.http.get<any>(`${this.apiServerUrl}/filters/getfilters/${REP_ID}`);
  }

  public getFilterOperations(FILTER_ID: number): any{
    return this.http.get<any>(`${this.apiServerUrl}/filters/getfilteroperations/${FILTER_ID}`);
  }

  public getAllFiltersOperations(): any{
    return this.http.get<any>(`${this.apiServerUrl}/filters/getallfiltersoperations`);
  }

  public getPreview(jobId: number): any { 
    return this.http.get<any>(`${this.apiServerUrl}/report/preview/${jobId}`);
  }

  public getColumReport(ReportId: number): any { 
    return this.http.get<any>(`${this.apiServerUrl}/report/getcolumns/${ReportId}`);
  }

  public SendColumReport(sendcolumobject: any): Observable<any> {
    return this.http.post(this.apiServerUrl+"/schedulejob/setcolumns/", sendcolumobject, {responseType: 'text'}); 
  }

  public getColumReportchecked(SCH_ID: number): any { 
    return this.http.get(`${this.apiServerUrl}/schedulejob/getcolumns/${SCH_ID}` ,{responseType: 'text'});
  }
}




