import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import jwt_decode from "jwt-decode";

declare var apiURL : any;

@Injectable({
  providedIn: 'root'
})
export class LookupapiService {

  URL : string = apiURL;
  //URL : string = "https://localhost:8443";
  //URL : string = "https://192.168.0.80:8443";
  //URL : string = "http://167.86.87.9:8080";

  constructor(private http: HttpClient) { }

  
  getAllReports(module: string): Observable<any> {
    return this.http.get(this.URL+`/reportslookup/get/${module}`);
  }
 
  getAllFreq(): Observable<any> {
  return this.http.get(this.URL+"/freqlookup/get");
  }


}
