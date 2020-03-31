import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivate,
    Router
} from '@angular/router';
import { Observable } from 'rxjs';

import { MenuService } from '../services/menu/menu.service';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { RouteEnum } from '../enums/route/routes.enum';
import { VaccinationScheduleDeactivate } from './vac-schedule-deactivate-guard';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private _router: Router,
        private _menuService: MenuService,
        private _authenticationService: AuthenticationService,
        private _vaccinationScheduleDeactivate: VaccinationScheduleDeactivate
    ) { }

    /**
     * Indica se a página poderá ou não ser ativada
     * @param _next Local que está sendo analizado
     * @param _state Estado da resposta
     *
     * Verifica se existe um usuário ativo, caso tenha um usuário ativo ele poderá navegar na rota.
     * Caso não tenha um usuário ativo, ele é enviado para a tela de login.
     * Responsável também por setar qual menu está ativo de acordo com a rota.
     */
    canActivate(
        _next: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        window.scrollTo(0, 0);

        // Resetar a validação de modificação do formulário.
        this._vaccinationScheduleDeactivate.setValidate(false);

        const rota = _state.url.split('/')[1];

        if (this.validateUser()) {
            this.setMenuItem(rota);
            return this.validateLoginUserActive(rota);
        } else {
            this._authenticationService.removeCurrentUser();
            return this.validateLoginUserOff(rota);
        }
    }

    /**
     * Método repsonsável por setar o item do menu, para ser possível pintá-lo quando selecionado.
     * @param rota Nome da primeira rota.
     * Ex: imunizacao.einstein.br/primeira-rota
     */
    private setMenuItem(rota: string): void {
        this._menuService.setItemMenu(rota);
    }

    /**
     * Valida se existe um usuário logado ou não.
     */
    private validateUser(): boolean {
        const user = this._authenticationService.getCurrentUser();
        return user ? true : false;
    }

    /**
     * Metodo responsavel por validar a rota de login
     * @param {string} _route string contendo a rota que esta sendo acessada
     */
    private validateLoginUserActive(_route: string): boolean {
        if (_route === RouteEnum.login) {
            this._router.navigate([RouteEnum.list_pathology]);
        }
        return true;
    }

    /**
     * Metodo responsavel por validar a rota de login
     * @param {string} _route string contendo a rota que esta sendo acessada
     */
    private validateLoginUserOff(_route: string): boolean {
        if (_route !== RouteEnum.login) {
            this._router.navigate([RouteEnum.login]);
        }
        return true;
    }

}
