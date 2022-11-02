import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  usernameparam1: string | null ;

  constructor(private authService : AuthService, private route:ActivatedRoute) {
    var nameparam1 = localStorage.getItem("username");
    this.usernameparam1 = nameparam1;
  }

  ngOnInit(): void {
  }

  logout(){
    //console.log("logout");
    //this.authService.logoutUser();
    localStorage.clear();
    sessionStorage.clear();
  }

}
