import { TagInputModule } from 'ngx-chips';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { ListreportschedulerComponent } from './components/listreportscheduler/listreportscheduler.component';
import { CreatreportschedulerComponent } from './components/creatreportscheduler/creatreportscheduler.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ActionsreportschedulerComponent } from './components/actionsreportscheduler/actionsreportscheduler.component';
import { EditreportschedulerComponent } from './components/editreportscheduler/editreportscheduler.component';
import { SearchreportschedulerComponent } from './components/searchreportscheduler/searchreportscheduler.component';
import { QuerybuilderComponent } from './components/querybuilder/querybuilder.component';
import { QueryBuilderModule } from "angular2-query-builder";
import { CKEditorModule } from 'ckeditor4-angular';
import { PreviewqueryComponent } from './components/previewquery/previewquery.component';
import { PreviewcolumComponent } from './components/previewcolum/previewcolum.component';
import { DatePipe } from '@angular/common';
import { AuthInterceptor } from './auth.interceptor';
import { NgSelectModule } from '@ng-select/ng-select';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
TagInputModule.withDefaults({
  tagInput: {
      placeholder: 'Enter another email',
      secondaryPlaceholder : 'Enter email'
  }
});

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListreportschedulerComponent,
    CreatreportschedulerComponent,
    NavbarComponent,
    ActionsreportschedulerComponent,
    EditreportschedulerComponent,
    SearchreportschedulerComponent,
    QuerybuilderComponent,
    PreviewqueryComponent,
    PreviewcolumComponent


  ],
  imports: [
    TagInputModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,  //File import All component Material Design
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgGridModule.withComponents([ActionsreportschedulerComponent]),
    QueryBuilderModule,

    // IonicModule.forRoot(AppComponent) // (Optional) for IonicFramework 2+
    CKEditorModule,
  ],
  providers: [DatePipe, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {provide: LocationStrategy, useClass: HashLocationStrategy}],

  bootstrap: [AppComponent]
})
export class AppModule {

}
