import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTreeModule} from '@angular/material/tree';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

import {MatTableDataSource} from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { A11yModule } from '@angular/cdk/a11y';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { NgxMatDateFormats, NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';



// const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
//   parse: {
//     dateInput: "l, LTS"
//   },
//   display: {
//     dateInput: "l, LTS",
//     monthYearLabel: "MMM YYYY",
//     dateA11yLabel: "LL",
//     monthYearA11yLabel: "MMMM YYYY"
//   }
// };

const materialComponents=[
  MatButtonModule ,               //Button
  MatButtonToggleModule,          //Button Toggle
  MatIconModule,                  //Icons
  MatBadgeModule,                 //Badge
  MatChipsModule,                 //Chips
  MatProgressSpinnerModule,       //ProgressSpinner
  MatProgressBarModule,           //ProgressBar
  MatToolbarModule,               //Toolbar(Navbar)
  MatSidenavModule,               //SideBar
  FormsModule,                    //Forms
  MatMenuModule,                  // menu&submenu
  MatListModule,                  //menulist
  MatGridListModule,              //GridList(Cols & Rows)
  MatExpansionModule,             //Expansion(Collapse)
  MatCardModule,                  //Cards-login
  MatTabsModule,                  //Tabs
  MatTreeModule,
  MatStepperModule,               //Stepper(horizontal , Vertical)
  MatFormFieldModule,
  MatInputModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,

  A11yModule,
  ClipboardModule,
  CdkStepperModule,
  CdkTableModule,
  CdkTreeModule,
  DragDropModule,
  MatAutocompleteModule,
  MatBottomSheetModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatNativeDateModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatTooltipModule,
  OverlayModule,
  PortalModule,
  ScrollingModule,

  NgxMatTimepickerModule,
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,



];

@NgModule({
  imports: [CommonModule , ...materialComponents],
  
  providers: [
  // { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ],
  
  exports: [...materialComponents]
})
export class MaterialModule { }

