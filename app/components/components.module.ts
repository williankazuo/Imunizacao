import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CoreModule } from '../@core/core.module';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { CrudVaccinesComponent } from './crud-vaccines/crud-vaccines.component';
import { NoContentComponent } from './no-content/no-content.component';
import { CrudPathologyComponent } from './crud-pathology/crud-pathology.component';
import { SingleSelectComponent } from './single-select/single-select.component';
import { TypeaheadComponent } from './typeahead/typeahead.component';
import { ThreeDotMenuComponent } from './three-dot-menu/three-dot-menu.component';
import { ModalAlertComponent } from './modal-alert/modal-alert.component';
import { CrudVaccinationScheduleComponent } from './crud-vaccination-schedule/crud-vaccination-schedule.component';
import { FinalizationComponent } from './finalization/finalization.component';
import { ModalRegisterVaccineComponent } from './modal-register-vaccine/modal-register-vaccine.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { ToastComponent } from './toast/toast.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CoreModule
    ],
    declarations: [
        HeaderComponent,
        FooterComponent,
        LoadingComponent,
        CrudVaccinesComponent,
        NoContentComponent,
        CrudPathologyComponent,
        SingleSelectComponent,
        TypeaheadComponent,
        ThreeDotMenuComponent,
        ModalAlertComponent,
        CrudVaccinationScheduleComponent,
        FinalizationComponent,
        ModalRegisterVaccineComponent,
        TooltipComponent,
        ToastComponent
    ],
    exports: [
        HeaderComponent,
        FooterComponent,
        LoadingComponent,
        CrudVaccinesComponent,
        NoContentComponent,
        CrudPathologyComponent,
        SingleSelectComponent,
        ThreeDotMenuComponent,
        ModalAlertComponent,
        CrudVaccinationScheduleComponent,
        FinalizationComponent,
        ModalRegisterVaccineComponent,
        TooltipComponent,
        ToastComponent
    ]
})

export class ComponentsModule { }