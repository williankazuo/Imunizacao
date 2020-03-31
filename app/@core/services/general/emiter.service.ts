import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class EmiterService {

    public emiterClose = new EventEmitter();
    public emiterTypeahead = new EventEmitter();

    /**
     * metodo responsavel por emitr a ação de abrir e fechar o menu sanduiche
     * @param close flag booleana para abir ou fechar o menu sanduiche
     */
    public openedMenu(close: boolean): void {
        this.emiterClose.emit(close);
    }

    /**
     * Método criado para emitir o valor do componente pai para o filho ser atualizado.
     * @param value Valor da variável serach value do typeahead.
     */
    public emptyValue(value: string): void {
        this.emiterTypeahead.emit(value);
    }

}