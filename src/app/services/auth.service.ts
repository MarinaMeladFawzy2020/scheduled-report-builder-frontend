import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import jwt_decode from "jwt-decode";

declare var apiURL : any;

@Injectable({ providedIn: 'root' })
export class AuthService {

     public baseUrl = apiURL;
    //public baseUrl = "https://localhost:8443";
    //public baseUrl = "https://192.168.0.80:8443";

   // permissions: string[] = [];

    constructor(private httpClient: HttpClient) {}

    loginUser(username: string, password: string) {
        return this.httpClient.post<any>(`${this.baseUrl}/login`, { username, password })
            .pipe(map(response=> {
                sessionStorage.setItem("token", response["token"]);
                const decodedToken: string[] = jwt_decode(response["token"]?.split(" ")[1] || '');
                //this.permissions = decodedToken["roles"];
                sessionStorage.setItem("permissions", JSON.stringify(response["authorities"]));
                // sessionStorage.setItem("permissions", JSON.stringify(decodedToken["roles"]));
                return response;
            }));
    }

    logoutUser() {
      //sessionStorage.removeItem('token');
      localStorage.clear();
      sessionStorage.clear();
    }

    getUserScopes(){
      const token = this.getToken();
      const decodedToken: string[] = jwt_decode(token?.split(" ")[1] || '');
      // console.log(decodedToken);
      // console.log("User Scopes");
      // console.log(decodedToken["scopes"].split(";"))
      return decodedToken["scopes"].split(";");
    }

    getToken(): string {
      return sessionStorage.getItem('token') || '';
    }

    getTokenExpirationDate(token: string): any {
      token = this.getToken()
      const decoded: any = jwt_decode(token);

      if (decoded.exp === undefined) return null;

      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);
      return date;
    }

    isTokenExpired(token?: string): boolean {
      //debugger;
      if (!token) token = this.getToken();
      if (!token) return false;

      const date = this.getTokenExpirationDate(token);
      if (date === undefined) return false;
      return !(date.valueOf() > new Date().valueOf());
    }

    public checkAuth(actionPermission: string){
      //const token = sessionStorage.getItem("token");
      //const decodedToken: string[] = jwt_decode(token?.split(" ")[1] || '');
      //return decodedToken["roles"].includes(actionPermission) ?  true : false;
      let permissionsStored = sessionStorage.getItem("permissions");
      let permissions = JSON.parse(permissionsStored? permissionsStored : "");
      //console.log("permi ", permissions);
      return permissions.includes(actionPermission) ?  true : false;
    }
}

