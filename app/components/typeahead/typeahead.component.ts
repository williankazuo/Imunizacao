import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NotConcomitanceModel, VaccineMilleniumModel } from 'src/app/@core/models/vaccines/vaccines.model';
import { EmiterService } from 'src/app/@core/services/general/emiter.service';

@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss']
})
export class TypeaheadComponent implements OnInit, OnDestroy {

  /** Decorator para o campo input de vaccinas - Passado para a diretiva de exibir e esconder a listagem de vacinas */
  @ViewChild('inputVaccine') inputVaccine: ElementRef;

  /** Decorator para o box de vacinas */
  @ViewChild('boxList') boxList: ElementRef;

  /** Propriedade para aplicar uma tag ID ao elemento Input */
  @Input() idInput: string;

  /** Propriedade para aplicar uma tag ID ao elemento Input */
  @Input() idBox: string;

  /** Propriedade para aplicar placeholder ao elemento Input */
  @Input() placeholder: string;

  /** Propriedade contendo a lista de elementos que aparecerá no typeahead */
  @Input() listElements: Array<NotConcomitanceModel> | Array<VaccineMilleniumModel>;

  /** Propriedade para preencher o campo texto com algum valor passado do componente pai */
  @Input() searchValue = '';

  /** Propriedade para dizer se o campo texto deve ser bloqueado  */
  @Input() blockInput: boolean;

  /** Propriedade para definir se o campo deve ou não ser obrigatório */
  @Input() requiredField: boolean;

  /** Propriedade para preencher o campo texto com algum valor passado do componente pai */
  @Input() error = '';

  /** Propriedade para preencher o campo texto com algum valor passado do componente pai */
  @Input() activeError: boolean;

  /** Propriedade para retonrar ao componente pai, qual elemento foi selecionado */
  @Output() returnValue = new EventEmitter();

  /** Propriedade utilizada para exibir item na lista dizendo que não foi econtrado nenhuma vacina */
  public notfound: boolean;
  /** Propriedade para controlar a obrigatóriedade do input */
  public required: boolean;
  /** Propriedade para validar se o texto do input corresponde a algo que exista na lista é valido ou não */
  public invalidData: boolean;
  /** Propriedade para abrir e fechar o container da lista */
  public openTypeaHead: boolean;
  /** Propriedade para armazenar a lista filtrada de acordo com o que o usuário digitar no campo input */
  public filteredList: Array<NotConcomitanceModel> | Array<VaccineMilleniumModel>;

  /** Propriedade para controlar o name e id de alguma vacina selecionada */
  public elementSelected: NotConcomitanceModel | VaccineMilleniumModel;

  /** Propriedades para serem utilizada na diretiva para controle da listagem */
  public containerList: Element;
  public htmlList: HTMLCollectionOf<Element>;

  private subscription: any;

  constructor(private _emiterService: EmiterService) { }

  ngOnInit() {
    this.notfound = false;
    this.required = false;
    this.invalidData = false;
    this.openTypeaHead = false;
    this.filteredList = [];
    this.elementSelected = null;
    this.subscription = this._emiterService.emiterTypeahead.subscribe(data => {
      if (this.idInput === data) {
        this.searchValue = '';
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Metodo responsavel por exibir e esconder a lista de vacinas, filtrada pelo usuário
   * @param {boolean} _show flag para definir se o container deve ser ou não exibido
   */
  public showBox(_show: boolean): void {
    // condição para exibir o box com a listagem
    if (_show && this.searchValue.length) {
      this.validField();
      this.openTypeaHead = _show;
    } else if (_show === false) {
      this.openTypeaHead = _show;
    }

    // condição para exibir/esconder o box not found
    if (this.searchValue.length > 0 && this.filteredList.length === 0) {
      this.notfound = _show;
    }
  }

  /**
   * Metodo responsavel por buscar vacinas, atraves de um filtro de palavras
   * Caso Não encontre nenhuma vacina, uma fleg de retorno de mensagem é acionada para indicar ao usuário
   * que nenhum resultado foi encontrado
   * @param {string} word palavra que esta sendo procurada
   */
  public searchElement(word: string, event: any): void {
    if (event.keyCode !== 13) {
      if (this.listElements.length > 0 && this.elementSelected === null) {

        this.filteredList = [];
        this.openTypeaHead = false;
        this.activeError = false;

        if (word.length > 0) {
          this.listElements.forEach((item: NotConcomitanceModel | VaccineMilleniumModel) => {
            /* if (item.name.toLowerCase().substr(0, word.length) === (word.toLowerCase())) { */
            if (item.name.toLowerCase().indexOf(word.toLowerCase()) >= 0) {
              this.openTypeaHead = true;
              this.filteredList.push(item);
            } else {
              this.notfound = true;
            }
          });
        }
        // buscando o container da listagem
        this.containerList = document.getElementById('option-elements' + this.idBox);

        // buscando a lista de elementos do HTML
        this.htmlList = document.getElementsByClassName('list' + this.idBox);
      }
      this.validField();
    }
  }

  /**
   * Metodo responsavel por validar o campo. Verifica se o input é obrigatório ou se a vacina esta invalida
   */
  private validField(): void {
    // validação de campo obrigatorio
    if (this.requiredField) {
      this.searchValue.length > 0 ? this.required = false : this.required = true;
    }

    // validação para campo invalido
    if ((this.searchValue === '' && !this.openTypeaHead) || this.required) {
      this.invalidData = false;

      // validação para que as mensagem de campo invalido e obrigatório apareçam juntas
    } else if (this.searchValue.length > 0 && !this.openTypeaHead || this.required) {
      this.invalidData = true;
      this.required = false;
    }

    this.resetElements();
  }

  /**
   * Metodo responsavel por resetar o Typeahead.
   * O reset ocorre quando algum elemento é selecionado, quando nenhum elemento é encontrado ou quando o usuário apague
   * tudo que estiver escrito no campo.
   */
  private resetElements(): void {
    if (this.elementSelected || this.filteredList.length === 0 || this.searchValue.length === 0) {
      this.elementSelected = null;
    }
  }

  /**
   * Metodo responsavel por emitir ao componente pai, qual elemento foi selecionado,
   * preencher no imput qual o valor foi selecionado e por fim, fechar o bloco de elementos.
   * @param {number} _elementSelectedIndex elemento de uma lista que foi selecionado
   */
  public selectElementByEnter(_elementSelectedIndex: number) {
    if (this.filteredList.length && (_elementSelectedIndex >= 0 && _elementSelectedIndex <= this.filteredList.length)) {
      this.selectItem(this.filteredList[_elementSelectedIndex]);
    } else {
      // para fechar o bloco de not found com o enter
      this.selectItem(null);
    }
  }

  /**
   * Metodo responsavel por emitir ao componente pai, qual elemento foi selecionado,
   * preencher no imput qual o valor foi selecionado e por fim, fechar o bloco de elementos.
   * @param {NotConcomitanceModel | VaccineMilleniumModel} _item elemento de uma lista que foi selecionado
   */
  public selectItem(_item: NotConcomitanceModel | VaccineMilleniumModel): void {
    if (_item !== null) {
      this.invalidData = false;
      this.searchValue = _item.name;
      this.elementSelected = _item;
    } else {
      this.invalidData = true;
    }
    this.resetElements();
    this.notfound = false;
    this.openTypeaHead = false;
    this.returnValue.emit(_item);
  }

}
