import { Injectable } from '@angular/core';
import { MatTabGroup, MatTabHeader, MatTab } from '@angular/material/tabs';

@Injectable({
  providedIn: 'root'
})
export class CheckSavingDataService {

  constructor() { }

  public mainDataFunc!: (tab: MatTab, tabHeader: MatTabHeader, idx: number) => any;
  bindMainDataFunc(fn: (tab: MatTab, tabHeader: MatTabHeader, idx: number) => any) {
    this.mainDataFunc = fn;
  }

  public inputsDataFunc!: (tabs: MatTabGroup, tab: MatTab, tabHeader: MatTabHeader, idx: number) => any;
  bindInputsDataFunc(fn: (tabs: MatTabGroup, tab: MatTab, tabHeader: MatTabHeader, idx: number) => any) {
    this.inputsDataFunc = fn;
  }

  public outputsDataFunc!: (tabs: MatTabGroup, tab: MatTab, tabHeader: MatTabHeader, idx: number) => any;
  bindOutputsDataFunc(fn: (ttabs: MatTabGroup, ab: MatTab, tabHeader: MatTabHeader, idx: number) => any) {
    this.outputsDataFunc = fn;
  }

  public listOnInitFn!: () => void;
  bindListOnInitFn(fn: () => void) {
    this.listOnInitFn = fn;
  }

  public activateFn!: (id: any) => void;
  bindActivateFn(fn: (id: any) => void) {
    this.activateFn = fn;
  }

  public inputsTabHandleActivationFn!: () => void;
  bindInputsTabHandleActivationFn(fn: () => void) {
    this.inputsTabHandleActivationFn = fn;
  }

  public outputsTabHandleActivationFn!: () => void;
  bindOutputsTabHandleActivationFn(fn: () => void) {
    this.outputsTabHandleActivationFn = fn;
  }
}
