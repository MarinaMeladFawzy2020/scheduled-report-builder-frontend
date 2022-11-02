import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showErrorMessage = false;
  usernamepara: any;

constructor(private authService: AuthService, private http: HttpClient , private router: Router) {

}

ngOnInit(): void {
}

submit(f: { value: { username: string; password: string; }; }){
 /*if(f.value.username == 'Test' && f.value.password == 'test'){
    // this.router.navigate(["home/dashboard"]);
    this.usernamepara = f.value.username ;
    this.usernamepara = localStorage.setItem("username", JSON.stringify(this.usernamepara));

     this.router.navigate(["/ReportSchedulerList"], { queryParams: { user: this.usernamepara } });

   }
  else {
     this.showErrorMessage = true;
   }*/
   /*this.loginService.login(f.value.username, f.value.password).subscribe(
    (response: any) => {
      //debugger;
      //localStorage.removeItem("token");
      //localStorage.setItem("token", response["Authorization"]);
      this.usernamepara = f.value.username ;
      this.usernamepara = localStorage.setItem("username", JSON.stringify(this.usernamepara));
      this.router.navigate(["/ReportSchedulerList"], { queryParams: { user: this.usernamepara } });
    },
    (error: HttpErrorResponse) => {
      console.log(error);
      this.showErrorMessage = true;
    }
  );*/
  
  this.authService.loginUser(f.value.username, f.value.password)
    .subscribe(
        data => {
            sessionStorage.setItem("token", data["token"]);  
            this.usernamepara = f.value.username ;
            this.usernamepara = localStorage.setItem("username", this.usernamepara);
            this.router.navigate(["/ReportSchedulerList"], { queryParams: { user: this.usernamepara } });    
          },
        error => {
            console.log(error);
            this.showErrorMessage = true;
        });
                
}

}


