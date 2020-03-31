import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from './components/components.module';

import { AuthGuard } from './@core/guards/auth-guard';
import { AuthGuardMenu } from './@core/guards/auth-guard-menu';
import { AuthInterceptor } from './@core/interceptor/auth.interceptor';
import { AuthenticationService } from './@core/services/authentication/authentication.service';
import { PathologiesService } from './@core/services/pathologies/pathologies.service';
import { MenuService } from './@core/services/menu/menu.service';
import { LoadingService } from './@core/services/loading/loading.service';
import { VaccineService } from './@core/services/vaccines/vaccine.service';
import { EmiterService } from './@core/services/general/emiter.service';
import { ModalAlertService } from './@core/services/modal/modal-alert.service';
import { VaccinationScheduleService } from './@core/services/vaccination-schedule/vaccination-schedule.service';
import { ModificationService } from './@core/services/general/modification.service';
import { TooltipService } from './@core/services/tooltip/tooltip.service';
import { ToastService } from './@core/services/toast/toast.service';
import { VaccinationScheduleDeactivate } from './@core/guards/vac-schedule-deactivate-guard';
import { AnchorService } from './@core/services/anchor/anchor.service';
import { ExcelService } from './@core/services/excel/excel.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ComponentsModule
  ],
  providers: [
    AuthGuard,
    AuthGuardMenu,
    AuthenticationService,
    PathologiesService,
    MenuService,
    LoadingService,
    VaccineService,
    VaccinationScheduleService,
    EmiterService,
    ModificationService,
    ModalAlertService,
    TooltipService,
    ToastService,
    AnchorService,
    ExcelService,
    VaccinationScheduleDeactivate,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
