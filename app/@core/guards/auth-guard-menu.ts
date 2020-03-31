import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivate,
} from '@angular/router';
import { Observable } from 'rxjs';

import { MenuService } from '../services/menu/menu.service';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { MenuConst } from '../consts/menu/menu.const';

@Injectable()
export class AuthGuardMenu implements CanActivate {

    constructor( 
        private _menuServie: MenuService,
        private _authenticationService: AuthenticationService,
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

        this.validateMenuForUserActive();
        return true;
    }

    /**
     * Metodo responsável por validar se o usuário poderá ou não visuallizar os menus do sistema
     */
    private validateMenuForUserActive(): void {
        const user = this._authenticationService.getCurrentUser();
        user ? this._menuServie.setActiveMenuFor404(MenuConst.activeMenu) : this._menuServie.setActiveMenuFor404(MenuConst.hiddenMenu);
    }

}
