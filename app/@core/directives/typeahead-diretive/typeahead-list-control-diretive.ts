
import { Directive, HostListener, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { KeyKode, KeyKodeScroll } from '../../enums/typeahead/keyCode.enum';
import { InitialLength, BoxList } from '../../enums/typeahead/length-initial.enum';

@Directive({
    selector: '[typeahead-list]',
})
export class TypeaHeadListDiretive implements OnInit {

    /** propriedade para receber o texto que esta sendo digitado */
    @Input() value: string;
    /** Propriedade contendo o elemento HTML do container responsavel pela lista de vacinas */
    @Input() containerElements: Element;
    /** Propriedade contendo uma lista HTML das vacinas */
    @Input() listElement: HTMLCollectionOf<Element>;
    /** Propriedade para devolver o elemento selecionado atraves do botão entrer */
    @Output() returnElementSelected = new EventEmitter();

    /** Propriedade para validar o scroll que esta sendo criado ao box */
    private count: number;
    private countScroll: number;

    constructor() { }

    ngOnInit(): void {
        this.count = InitialLength.InicialDefaultLength;
        this.countScroll = 0; // inicializando o valor padrão
    }

    /**
     * Decorator para validar todos os clicks no teclado
     * Função para validar a ativação das teclas do teclado: Arrow up, Arrow down e Enter
     */
    @HostListener('keyup', ['$event'])
    onkeyup(event: any) {
        if (this.listElement !== undefined && this.listElement.length > 0) {

            this.validSearch();

            // down key code 40
            if (event.keyCode === KeyKode.KeyDown && this.count < this.listElement.length) {
                this.count + 1 > this.listElement.length - 1 ? this.count = 0 : this.count++;
                this.scroll(KeyKodeScroll.ScrollUp, this.listElement[this.count].clientHeight);
                this.focusList();

                // up key code 38
            } else if (event.keyCode === KeyKode.KeyUp && this.count >= 0) {
                this.count - 1 < 0 ? this.count = this.listElement.length - 1 : this.count--;
                this.scroll(KeyKodeScroll.ScrollDown, this.listElement[this.count].clientHeight);
                this.focusList();

                // enter key code 13
            } else if (event.keyCode === KeyKode.KeyEnter) {
                this.returnElementSelected.emit(this.count);
                this.removeFocus();
                this.count = InitialLength.InicialDefaultLength;
                this.resetScroll();

            } else {
                this.removeFocus();
                this.count = InitialLength.InicialDefaultLength;
            }
        }
    }

    /**
     * Metodo responsavel por validar a busca do usuário. Caso o usuário zerar o texto de busca, 
     * o scroll será zerado para que na busca seguinte apareça no topo do box
     */
    private validSearch(): void {
        if (!this.value.length) {
            this.resetScroll();
        }
    }

    /**
     * Metodo responsavel por resetar o scroll do box de texto
     */
    private resetScroll(): void {
        this.containerElements.scrollTop = 0;
    }

    /**
     * Metodo responsavel por criar scroll automatico para um container conforme navegação das teclas do teclado
     * Arrow up e Arrow down
     * @param _scroll Flag para definar se o scroll é feito para cima ou para baixo
     * @param heightElement tamanho do elemento para realizar o scroll. o tamanho do Scroll será exatamente o tamanho
     * do proximo elemento que aparecerá atraves do scroll.
     */
    private scroll(_scroll: number, heightElement: number): void {
        if (_scroll === KeyKodeScroll.ScrollUp) {
            this.countScroll > BoxList.ElementsVisibleBox ? this.containerElements.scrollTop += heightElement : this.countScroll++;
        } else {
            this.countScroll > InitialLength.InicialLength ? this.containerElements.scrollTop -= heightElement : this.countScroll--;
        }
        this.validPositionScroll(this.countScroll - 1);
    }

    /**
     * Metodo responsavel por 'aplicar foco' a um elemento de uma lista html
     */
    private focusList(): void {
        this.removeFocus();
        this.listElement[this.count].classList.add('hover');
    }

    /**
     * Metodo responsavel por 'remover foco' a todos os elemento de uma lista html
     */
    private removeFocus(): void {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.listElement.length; i++) {
            this.listElement[i].classList.remove('hover');
        }
    }

    /**
     * Metodo responsavel por levar o scroll para o proximo elemento a receber foco, caso o usuário tenha modificado
     * o scroll do box através do mouse
     * @param _count posição para comecar o calculo da posição que o scroll deve retornar
     */
    validPositionScroll(_count: number) {
        // Medida criada a partir da soma da altura de todos os elementos até o elemento que esta com foco
        let maxheight = 0;
        for (let i = _count; i < this.count; i++) {
            maxheight += this.listElement[i].clientHeight;
        }
        // verificar se a posição atual do scroll, é diferente da altura total de todos os itens até o item focado
        if (this.containerElements.scrollTop !== maxheight) {
            this.containerElements.scrollTop = maxheight;
        }
    }
}
