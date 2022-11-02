import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditreportschedulerComponent } from './components/editreportscheduler/editreportscheduler.component';
import { ListreportschedulerComponent } from './components/listreportscheduler/listreportscheduler.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';

const routes: Routes = [
  { path:'', component: LoginComponent } ,

  {
    path:'',
    
    loadChildren: () => import("src/app/components/navigations.module").then(m => m.NavModule)
  },
  
  { path:'**',  redirectTo:'' , pathMatch:'full' } ,

 // { path:'**',  redirectTo:'/login' , pathMatch:'full' } ,

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }






