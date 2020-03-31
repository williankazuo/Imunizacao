import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/@core/guards/auth-guard';
import { AuthGuardMenu } from 'src/app/@core/guards/auth-guard-menu';

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
import { VaccinationScheduleDeactivate } from 'src/app/@core/guards/vac-schedule-deactivate-guard';

const routes: Routes = [
    {
        path: '',
        component: ImmunizationComponent,
        children: [
            {
                path: 'lista-patologias',
                component: HomeListPathologyComponent,
                canActivate: [AuthGuard, AuthGuardMenu]
            },
            {
                path: 'detalhes-patologia/:id',
                component: DetailsPathologyComponent,
                canActivate: [AuthGuard, AuthGuardMenu]
            },
            {
                path: 'detalhes-vacina/:id',
                component: DetailsVaccineComponent,
                canActivate: [AuthGuard, AuthGuardMenu]
            },
            {
                path: 'lista-vacinas',
                component: ListVaccineComponent,
                canActivate: [AuthGuard, AuthGuardMenu]
            },
            {
                path: 'cadastro-vacinas',
                component: RegisterVaccineComponent,
                canActivate: [AuthGuard, AuthGuardMenu],
                canDeactivate: [VaccinationScheduleDeactivate]
            },
            {
                path: 'editar-vacina/:id',
                component: EditVaccineComponent,
                canActivate: [AuthGuard, AuthGuardMenu],
                canDeactivate: [VaccinationScheduleDeactivate]
            },
            {
                path: 'cadastro-patologia',
                component: RegisterPathologySchemeComponent,
                canActivate: [AuthGuard, AuthGuardMenu],
                canDeactivate: [VaccinationScheduleDeactivate]
            },
            {
                path: 'editar-patologia/:id',
                component: EditPathologySchemeComponent,
                canActivate: [AuthGuard, AuthGuardMenu],
                canDeactivate: [VaccinationScheduleDeactivate]
            },
            {
                path: '**',
                component: NotFoundPageComponent,
                canActivate: [AuthGuardMenu]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ImmunizationRoutingModule { }