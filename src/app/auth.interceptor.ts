import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router, private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      //debugger;
      //console.log('sssssssssss token');
      //console.log(localStorage.getItem('token'));
      //console.log("curr");
      //console.log(this.router.url);
      var token = this.authService.getToken();

      //if(token == null && window.location.pathname != '/')
        //this.router.navigate(["/"]);

      if (token != null && this.authService.isTokenExpired()) {
        this.authService.logoutUser()
        bootbox.alert({title: "<span style='color:#a33;font-weight: 500; font-size: 16px'>" + "Information message" + "</span>", message: "<span style='color:black;font-weight: 500; font-size: 16px'> Session Timed Out! Please Login </span>"});
        this.router.navigate(['/'])
        return throwError("Session Timed Out")
      } 
      else {
        const authRquest = request.clone({
          setHeaders: {
            "Authorization": token,
            "Access-Control-Allow-Origin": "*"
          }
        })
        return next.handle(authRquest)
          .pipe(
            tap(event => {
            }, error => {
            })
          )
      }
    }
}