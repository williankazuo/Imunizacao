import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImmunizationRoutingModule } from './immunization.routing';
import { ComponentsModule } from '../../components/components.module';
import { CoreModule } from 'src/app/@core/core.module';

// componentes
import { ImmunizationComponent } from './immunization.component';
import { HomeListPathologyComponent } from '../../pages/home-list-pathology/home-list-pathology.component';
import { DetailsPathologyComponent } from '../../pages/details-pathology/details-pathology.component';
import { NotFoundPageComponent } from 'src/app/pages/not-found/not-found.component';
import { ListVaccineComponent } from 'src/app/pages/list-vaccine/list-vaccine.component';
import { RegisterVaccineComponent } from 'src/app/pages/register-vaccine/register-vaccine.component';
import { RegisterPathologySchemeComponent } from 'src/app/pages/register-pathology-scheme/register-pathology-scheme.component';
import { DetailsVaccineComponent } from 'src/app/pages/details-vaccine/details-vaccine.component';
import { EditVaccineComponent } from 'src/app/pages/edit-vaccine/edit-vaccine.component';
import { EditPathologySchemeComponent } from 'src/app/pages/edit-pathology-scheme/edit-pathology-scheme.component';

@NgModule({
  declarations: [
    ImmunizationComponent,
    NotFoundPageComponent,
    HomeListPathologyComponent,
    DetailsPathologyComponent,
    ListVaccineComponent,
    RegisterVaccineComponent,
    RegisterPathologySchemeComponent,
    DetailsVaccineComponent,
    EditVaccineComponent,
    EditPathologySchemeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ImmunizationRoutingModule,
    ComponentsModule,
    CoreModule
  ]
})
export class ImmunizationModule { }
