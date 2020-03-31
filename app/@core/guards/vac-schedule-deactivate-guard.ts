import { Injectable, EventEmitter } from '@angular/core';
import { EditPathologySchemeComponent } from 'src/app/pages/edit-pathology-scheme/edit-pathology-scheme.component';
import { CanDeactivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ModificationService } from '../services/general/modification.service';
import { ModalAlertService } from '../services/modal/modal-alert.service';
import { ModalAlertModel } from '../models/modal/modal-alert.model';
import { RegisterPathologySchemeComponent } from 'src/app/pages/register-pathology-scheme/register-pathology-scheme.component';
import { RegisterVaccineComponent } from 'src/app/pages/register-vaccine/register-vaccine.component';
import { EditVaccineComponent } from 'src/app/pages/edit-vaccine/edit-vaccine.component';

@Injectable()
export class VaccinationScheduleDeactivate implements CanDeactivate<
EditPathologySchemeComponent | RegisterPathologySchemeComponent | RegisterVaccineComponent | EditVaccineComponent
> {
    private emit = new EventEmitter();
    private validate = false;

    constructor(
        private _router: Router,
        private _modificationService: ModificationService,
        private _modalAlertService: ModalAlertService
    ) {

    }

    canDeactivate(
        component: EditPathologySchemeComponent | RegisterPathologySchemeComponent | RegisterVaccineComponent | EditVaccineComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot): boolean {

        if (!this.validate) { component.validateChanges(); }

        return this.validateChangesForm(nextState.url);
    }

    /**
     * Método responsável por validar se houve modificações no formulário e exibir o modal de confirmação.
     * Se ele deseja sair e perder as modificações ou não.
     * @param route rota que ele vai navegar.
     */
    private validateChangesForm(route: string): boolean {
        if (this._modificationService.getModification()) {
            const modalConfig = new ModalAlertModel();
            modalConfig.title = 'Atenção';
            modalConfig.text = 'Suas alterações não serão salvas, tem certeza que deseja sair?';
            modalConfig.button = 'Sim';
            modalConfig.buttonAction = null;
            modalConfig.buttonEmit = this.emit;
            this._modalAlertService.setModalAlertConfig(modalConfig);
            this._modalAlertService.openModal();
            this.emit.subscribe(data => {
                if (data) {
                    this.validate = true;
                    this._modificationService.setModification(false);
                    this._modalAlertService.closeModal();
                    this._router.navigate([route]);
                    return true;
                } else {
                    return false;
                }
            });
        } else {
            return true;
        }
    }

    public setValidate(validate: boolean) {
        this.validate = validate;
    }
}