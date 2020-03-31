
import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: '[typeahead-close]'
})
export class TypeaHeadCloseDiretive {

    /** Propriedade contendo o elemento HTML que não deverá receber o click */
    @Input() element: Element;

    /** Propriedade para retornar uma resposta para fechar o box */
    @Output() showBox = new EventEmitter();

    constructor() { }

    @HostListener('document:click', ['$event'])
    onClick($event: any) {

        if (this.element !== $event.target) {
            this.showBox.emit(false);
        }
    }
}
