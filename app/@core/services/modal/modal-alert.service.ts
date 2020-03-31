import { Injectable, EventEmitter } from "@angular/core";
import { ModalAlertModel } from '../../models/modal/modal-alert.model';

@Injectable()
export class ModalAlertService {
    public openEmitter = new EventEmitter();
    public configEmitter = new EventEmitter();

    /**
     * Método responsável por emitir quando um modal deve ser aberto.
     */
    public openModal(): void {
        this.openEmitter.emit(true);
    }

    /**
     * Método repsonsável por emitir quando um modal deve ser fechado.
     */
    public closeModal(): void {
        this.openEmitter.emit(false);
    }

    /**
     * Método reponsável por emitir a configuração do modal.
     * @param config configuração do modal de títulos e botão.
     */
    public setModalAlertConfig(config: ModalAlertModel) {
        this.configEmitter.emit(config);
    }
}