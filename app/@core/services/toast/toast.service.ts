import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ToastModel } from '../../models/toast/toast.model';

@Injectable()
export class ToastService {

    // criação da propriedade observavel para 'emitir' as propriedades de exibição do tost
    private showToastSource = new BehaviorSubject(new ToastModel());
    // propriedade para o componente que utilizar o toast conseguir se inscrever para receber as modificações
    public showToast = this.showToastSource.asObservable();

    constructor() { }

    /**
     * Metodo responsavel por atualizar as mudanças do toast. Responsável por exibir ou esconder o toast
     * @param _configTost objeto contendo as configurações do toast
     */
    public changeToast(_configTost: ToastModel): void {
        this.showToastSource.next(_configTost);
    }
}