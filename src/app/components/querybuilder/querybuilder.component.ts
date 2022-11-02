import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Field, FieldMap, QueryBuilderConfig, QueryBuilderClassNames,QueryBuilderModule, Rule} from 'angular2-query-builder';
import { QueryserviceService } from 'src/app/services/queryservice.service';
import { HttpErrorResponse } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { SharedataService } from 'src/app/services/sharedata.service';
//import { LoginService } from '../../services/login.service';
import { AuthService } from '../../services/auth.service';
import { CheckSavingDataService } from 'src/app/services/check-saving-data.service';
import { MatTabGroup, MatTabHeader, MatTab } from '@angular/material/tabs';
import { SchedulejobService } from 'src/app/services/schedulejob.service';

@Component({
  selector: 'app-querybuilder',
  templateUrl: './querybuilder.component.html',
  styleUrls: ['./querybuilder.component.css']
})
export class QuerybuilderComponent implements OnInit{
  @Input() ActiveFlagQuery!: number;
  @Input() ReportID!: number;
  @Input() SchID!: number;
  @Input() editPermissionName!: string;

  title = 'querybuilder';
  ActiveFlag: any;
  isNotActive!: boolean;
  value1: any;


  constructor(private dataApi : SchedulejobService, public checkSavingDataService: CheckSavingDataService, public loginService: AuthService,
    private queryService: QueryserviceService , private sharedata:SharedataService) {}

  query = {
    condition: 'and',
    rules: [

    ]
  };

  config: QueryBuilderConfig = {
    fields: {

    }
  }

  operationsObject: any;
  reportFilters: any;
  lookupObjects: any = [];
  selectedReportID: number = 1;
  selectedSchID: number = 1;
  initDone: Boolean = false;
  changeDataFlag: boolean = false;
  uiFilled: boolean = false;
  visitsCounter: number = 0;

  editPerm: boolean = false;

  clonedQuery: any = {};

  ngOnInit(){

    this.editPerm = true;
    // this.editPerm = this.loginService.checkAuth(this.editPermissionName);

    this.query = {
      condition: 'and',
      rules: [

      ]
    };

    this.config = {
      fields: {

      }
    }

    this.lookupObjects = [];

    this.checkSavingDataService.bindInputsDataFunc(this.checkDataNotSaved.bind(this));
    this.checkSavingDataService.bindInputsTabHandleActivationFn(this.handleActivation.bind(this));

    this.selectedReportID = this.ReportID;
    this.selectedSchID = this.SchID ;

    // load all filters operations
    this.queryService.getAllFiltersOperations().subscribe(
      (response: any) => {
        this.operationsObject = response;
       // console.log("obs");
      //  console.log(this.operationsObject);

        // load filters of current report
        this.queryService.getRepFilters(this.selectedReportID).subscribe(
          (response: any) => {
            this.reportFilters = response;
            //console.log(this.reportFilters);
            for(let i = 0; i < this.reportFilters.length; i++){
                if(this.reportFilters[i]["is_LOOKUP"] === 1){
                  this.lookupObjects.push({filterID: this.reportFilters[i]["id"], filterObjects: this.reportFilters[i]["lookup"]["objects"]});
                }
            }

            this.fillConfig(this.reportFilters);

            this.queryService.getQuery(this.selectedSchID).subscribe(  //Sch_ID
              (response: any) => {
                if(response){
                  this.UpdateUIWithQuery(response);
                }
              },
              (error: HttpErrorResponse) => {
                bootbox.alert(error.message);
              }
            );
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );


  }

  // this is used because not every operator can be a function
  validatedWithOperator(rule: Rule){
    if(rule.operator == 'endwith' || rule.operator == 'startwith' || rule.operator == 'like')
      return false;
    else
      return true;
  }

  public fillMandatoryFilters(){
    let rules: any = [];
    for(let i = 0; i < this.reportFilters.length; i++){
      if(this.reportFilters[i]["is_REQUIRED"] === 1){

        // set the first operator of this filter by default
        let operator = "";
        for(let j = 0; j < this.operationsObject.length; j++){
          if(this.operationsObject[j]["filter_ID"] === this.reportFilters[i]["id"]){
            operator = this.operationsObject[j]["operation_SIGN"];
            break;
          }
        }

        rules.push({
          field : this.reportFilters[i]["filter_NAME"],
          operator: operator,
          required: true
        });

      }
    }

    let query = {
      condition: 'and',
      rules: rules
    };
    this.query = query;
  }

  public showInputBox(isFunction: any, selectedFunction: any){

    if(isFunction == true && (selectedFunction == null || selectedFunction == undefined))
      return false;

    if(selectedFunction == null || selectedFunction == undefined || isFunction == false)
      return "regular";

    for(let i = 0; i < this.reportFilters.length; i++){
      if(this.reportFilters[i]["is_FUNCTION"] == 1){
        for(let j = 0; j < this.reportFilters[i]["functions"].length; j++){
          if(this.reportFilters[i]["functions"][j]["func_SQL"] == selectedFunction && this.reportFilters[i]["functions"][j]["has_PARAMS"] == 1){
            return "param";
          }
        }
      }
    }
    return false;
  }

   public fillConfig(filtersObject: any): void {

    const newconfig: QueryBuilderConfig = {
      fields: {}
    }

    for(let i = 0; i < filtersObject.length; i++){
      const fieldObj = filtersObject[i];

      // Getting operations of the current filter
      let operations: string[] = [];
      const thisFilterOperations = this.operationsObject.filter(((oper: { [x: string]: any; }) => oper["filter_ID"] === fieldObj["id"]));
      for(let j = 0; j < thisFilterOperations.length; j++){
        const operatorObj = thisFilterOperations[j];
        operations.push(operatorObj["operation_SIGN"]);
      }
      // ----------------------

      // Getting options of this filter if it's a lookup (lookupObjects.length != 0)
      let filterOptions: any = [];
      for(let k = 0; k < this.lookupObjects.length; k++){
        if(fieldObj["id"] === this.lookupObjects[k]["filterID"]){
          for(let y = 0; y < this.lookupObjects[k]["filterObjects"].length; y++){
            filterOptions.push({
              name : this.lookupObjects[k]["filterObjects"][y]["object_NAME_EN"],
              value: this.lookupObjects[k]["filterObjects"][y]["object_CODE"]
            });
          }
        }
      }
      // ----------------------

      // if the current filter is a function, add them to the options attribute
      if(fieldObj["is_FUNCTION"] === 1){
        for(let f = 0; f < fieldObj["functions"].length; f++){
          filterOptions.push({
            name : fieldObj["functions"][f]["func_NAME_EN"],
            value: fieldObj["functions"][f]["func_SQL"]
          });
        }
      }
      // ------------------------------

      // Building field
      var field: Field = {
        name: fieldObj["filter_NAME"],
        type: fieldObj["filter_TYPE"],
        operators: operations,
        options: filterOptions,
        entity: fieldObj["is_FUNCTION"]  // entity att is mapped to the isFunction flag
      }

      const fieldMap: FieldMap = {
        [fieldObj["filter_NAME"]] : field
      };

      newconfig.fields = Object.assign(newconfig.fields, fieldMap);
    }
    this.config = newconfig;
    //console.log("config");
    //console.log(this.config);
    this.fillMandatoryFilters();
  }

  checkIfFuncHasParams(selectedFunction: any){
    for(let i = 0; i < this.reportFilters.length; i++){
      if(this.reportFilters[i]["is_FUNCTION"] == 1){
        for(let j = 0; j < this.reportFilters[i]["functions"].length; j++){
          if(this.reportFilters[i]["functions"][j]["func_SQL"] == selectedFunction && this.reportFilters[i]["functions"][j]["has_PARAMS"] == 1)
            return true;
        }
      }
    }
    return false;
  }

  public prepareQuery(){
    let preparedQuery = JSON.parse(JSON.stringify(this.query));

    // array of values
    for(let i = 0; i < preparedQuery["rules"].length; i++){
      let values = [];

      if(preparedQuery["rules"][i]["operator"]==="between"){

        // first value is function, second is input
        if(preparedQuery["rules"][i]["isFunction1"] && !preparedQuery["rules"][i]["isFunction"]){
          // Pushing first value if this function has params
          if(this.checkIfFuncHasParams(preparedQuery["rules"][i]["selectedFunction1"]))
            values.push((<string>preparedQuery["rules"][i]["value1"]));
          else{
            values.push(<string><unknown>undefined);
            preparedQuery["rules"][i]["value1"] = null;
          }

          // Pushing second value
          //values.push((<string>preparedQuery["rules"][i]["value"]));
          if(typeof preparedQuery["rules"][i]["value"] === "object" && preparedQuery["rules"][i]["value"] != null)
              values.push((<string>preparedQuery["rules"][i]["value"][0]));
          else
              values.push((<string>preparedQuery["rules"][i]["value"]));

          preparedQuery["rules"][i]["selectedFunction"] = null;
        }
        else if(!preparedQuery["rules"][i]["isFunction1"] && preparedQuery["rules"][i]["isFunction"]){
          // Pushing first value
          values.push((<string>preparedQuery["rules"][i]["value1"]));

          // Pushing second value if this function has params
          if(this.checkIfFuncHasParams(preparedQuery["rules"][i]["selectedFunction"])){
            //values.push((<string>preparedQuery["rules"][i]["value"]));
            if(typeof preparedQuery["rules"][i]["value"] === "object" && preparedQuery["rules"][i]["value"] != null)
              values.push((<string>preparedQuery["rules"][i]["value"][0]));
            else
              values.push((<string>preparedQuery["rules"][i]["value"]));
          }
          else{
            values.push(<string><unknown>undefined);
            preparedQuery["rules"][i]["value"] = null;
          }

          preparedQuery["rules"][i]["selectedFunction1"] = null;
        }
        else if(preparedQuery["rules"][i]["isFunction1"] && preparedQuery["rules"][i]["isFunction"]){

          // Pushing first value if this function has params
          if(this.checkIfFuncHasParams(preparedQuery["rules"][i]["selectedFunction1"]))
            values.push((<string>preparedQuery["rules"][i]["value1"]));
          else{
            values.push(<string><unknown>undefined);
            preparedQuery["rules"][i]["value1"] = null;
          }

          // Pushing second value if this function has params
          if(this.checkIfFuncHasParams(preparedQuery["rules"][i]["selectedFunction"])){
            //values.push((<string>preparedQuery["rules"][i]["value"]));
            if(typeof preparedQuery["rules"][i]["value"] === "object" && preparedQuery["rules"][i]["value"] != null)
              values.push((<string>preparedQuery["rules"][i]["value"][0]));
            else
              values.push((<string>preparedQuery["rules"][i]["value"]));
          }
          else{
            values.push(<string><unknown>undefined);
            preparedQuery["rules"][i]["value"] = null;
          }
        }
        else if(!preparedQuery["rules"][i]["isFunction1"] && !preparedQuery["rules"][i]["isFunction"]){
          // neither 2 values of the between is a function
          values.push((<string>preparedQuery["rules"][i]["value1"]));
          if(typeof preparedQuery["rules"][i]["value"] === "object" && preparedQuery["rules"][i]["value"] != null)
            values.push((<string>preparedQuery["rules"][i]["value"][0]));
          else
            values.push((<string>preparedQuery["rules"][i]["value"]));

            preparedQuery["rules"][i]["selectedFunction"] = null;
            preparedQuery["rules"][i]["selectedFunction1"] = null;
          }
      }
      else if(typeof preparedQuery["rules"][i]["value"] === "number")
        values.push((<number>preparedQuery["rules"][i]["value"]).toString());

      else if(typeof preparedQuery["rules"][i]["value"] === "string")
        values.push((<string>preparedQuery["rules"][i]["value"]));

      else if(typeof preparedQuery["rules"][i]["value"] === "object" && preparedQuery["rules"][i]["value"] != null){
        (<Array<string>>preparedQuery["rules"][i]["value"]).forEach(element => {
          values.push(element);
        });
      }
      (<Array<string>>preparedQuery["rules"][i]["value"]) = values;

      // map filter name to filter column in the query
      for(let k = 0; k < this.reportFilters.length; k++){
        if(this.reportFilters[k]["filter_NAME"] === preparedQuery["rules"][i]["field"]){
          (<string>preparedQuery["rules"][i]["field"]) = this.reportFilters[k]["filter_COLUMN"];

          if(this.reportFilters[k]["is_COL_QUERY"] == 1)
            preparedQuery["rules"][i]["isColQuery"] = true;

          break;
        }
      }

      if(preparedQuery["rules"][i]["isFunction"] == false)
        preparedQuery["rules"][i]["selectedFunction"] = null;

      // clear value of rules that are functions and should has no params
      if(preparedQuery["rules"][i]["isFunction"] == true && preparedQuery["rules"][i]["operator"]!="between"){
        let done = false;
        for(let p = 0; p < this.reportFilters.length; p++){
          if(this.reportFilters[p]["is_FUNCTION"] == 1){
            for(let j = 0; j < this.reportFilters[p]["functions"].length; j++){
              if(this.reportFilters[p]["functions"][j]["func_SQL"] == preparedQuery["rules"][i]["selectedFunction"] && this.reportFilters[p]["functions"][j]["has_PARAMS"] == 0){
                preparedQuery["rules"][i]["value"] = [];
                done = true;
                break;
              }
              else if(preparedQuery["rules"][i]["selectedFunction"] == null)
                preparedQuery["rules"][i]["value"] = [];
            }
          }
          if(done) break;
        }
      }


      if(preparedQuery["rules"][i]["operator"] == 'startwith' || preparedQuery["rules"][i]["operator"] == 'endwith' || preparedQuery["rules"][i]["operator"] == 'like'){
        preparedQuery["rules"][i]["isFunction"] = false;
        preparedQuery["rules"][i]["selectedFunction"] = null;
      }
    }
    return preparedQuery;

  }

  public UpdateUIWithQuery(queryResponse: any){
    //console.log( queryResponse["rules"]);
    for(let i = 0; i < queryResponse["rules"].length; i++){
      if(queryResponse["rules"][i]["operator"]==="between"){
        queryResponse["rules"][i]["value1"]=queryResponse["rules"][i]["value"][0];
        queryResponse["rules"][i]["value"]=queryResponse["rules"][i]["value"][1];

      }
      for(let k = 0; k < this.reportFilters.length; k++){
        if(this.reportFilters[k]["filter_COLUMN"] === queryResponse["rules"][i]["field"]){
          (queryResponse["rules"][i]["field"]) = this.reportFilters[k]["filter_NAME"];
          // console.log( this.reportFilters[k]["filter_COLUMN"] );
          // console.log( (queryResponse["rules"][i]["field"]));
          // console.log(this.reportFilters[k]["filter_NAME"]);
          break;
        }
      }
    }
    this.query = queryResponse;
  }

  onDataChange($event: any){
      this.changeDataFlag = true;
  }

  checkDataNotSaved(tabs: MatTabGroup, tab: MatTab, tabHeader: MatTabHeader, idx: number){
    if(this.changeDataFlag){
      var dialog = bootbox.dialog({
        title: 'Confirm changes',
        message: "<p>You didn't save the inputs changed data, do you want to save?</p>",
        size: 'medium',
        closeButton: false,
        buttons: {
            cancel: {
                label: "Cancel",
                className: 'btn-danger',
                callback: () => {
                   // console.log('cancel clicked');
                }
            },
            noclose: {
                label: "Don't save",
                className: 'btn-warning',
                callback: () => {
                   // console.log('do not save clicked');
                    this.ngOnInit();
                    this.changeDataFlag = false;
                    return true && MatTabGroup.prototype._handleClick.apply(tabs, [tab, tabHeader, idx]);
                }
            },
            ok: {
                label: "Save",
                className: 'btn-info',
                callback: () => {
                    //console.log('save clicked');
                    this.onSubmitQuery();
                    return true && MatTabGroup.prototype._handleClick.apply(tabs, [tab, tabHeader, idx]);
                }
            }
        }
      });
    }
    else
      return true && MatTabGroup.prototype._handleClick.apply(tabs, [tab, tabHeader, idx]);
  }

  public onSubmitQuery() : void {
    let res = this.prepareQuery();
    //console.log("query");
    //console.log(res);
    this.queryService.processQuery(this.selectedSchID, res).subscribe(
    (response: any) => {
      bootbox.alert({title: "<span style='color:#28a745;font-weight: 500; font-size: 16px'>" + "Success message" + "</span>", message: "<span style='color:black;font-weight: 500; font-size: 16px'>" + response + "</span>"}) ;
      this.changeDataFlag = false;
    },
    (error: HttpErrorResponse) => {
      bootbox.alert(error.message);
    }
    );
  }

  activateWithSave(){
    let res = this.prepareQuery();
    this.queryService.processQuery(this.selectedSchID, res).subscribe(
    (response: any) => {
      this.changeDataFlag = false;
      bootbox.alert(
        {
          title: "<span style='color:#28a745;font-weight: 500; font-size: 16px'>" + "Success message" + "</span>",
          message: "<span style='color:black;font-weight: 500; font-size: 16px'>" + response + "</span>",
          callback: () => {
            this.checkSavingDataService.activateFn(this.SchID);
          }
        }
      ) ;
    },
    (error: HttpErrorResponse) => {
      bootbox.alert(error.message);
    }
    );
  }

  handleActivation(){
    if(this.changeDataFlag){
      var dialog = bootbox.dialog({
        title: 'Confirm changes',
        message: "<p>It seems you want to activate without saving your changes in inputs</p>",
        size: 'medium',
        closeButton: false,
        buttons: {
            cancel: {
                label: "Cancel",
                className: 'btn-danger',
                callback: () => {
                   // console.log('cancel clicked');
                }
            },
            noclose: {
                label: "Don't save and activate",
                className: 'btn-warning',
                callback: () => {
                  this.ngOnInit();
                  this.changeDataFlag = false;
                  this.checkSavingDataService.activateFn(this.SchID);
                }
            },
            ok: {
                label: "Save and activate",
                className: 'btn-info',
                callback: () => {
                  this.changeDataFlag = false;
                  this.activateWithSave();
                }
            }
        }
      });
    }
    else{
      var dialog = bootbox.dialog({
        title: 'Confirm changes',
        message: "<p>Are you sure you want to activate schedule?</p>",
        size: 'medium',
        closeButton: false,
        buttons: {
            cancel: {
                label: "No",
                className: 'btn-danger',
                callback: () => {
                }
            },
            ok: {
                label: "Yes",
                className: 'btn-info',
                callback: () => {
                  this.checkSavingDataService.activateFn(this.SchID);
                }
            }
        }
      });
    }
  }
}
