import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { OptionModel } from 'src/app/@core/models/select/option.model';

@Component({
  selector: 'app-single-select',
  templateUrl: './single-select.component.html',
  styleUrls: ['./single-select.component.scss']
})
export class SingleSelectComponent implements OnInit {

  /** Propriedade para bloquear o select de tipo de calendário, para o caso de edição de esquema de vacinação */
  @Input() desableSelect: boolean;

  // Array de opções que vão ser apresentadas no select.
  @Input() options = new Array<OptionModel>();

  // Value da opção selecionada para vir pré selecionada.
  @Input() valueSelected: string;

  @Output() optionSelected = new EventEmitter();

  public opened: boolean = false;

  constructor() { }

  ngOnInit() {
    this.valueSelected = 'Selecionar';
  }

  /**
   * Método responsável por emitir a opção selecionada no select.
   * @param option Opção selecionada.
   */
  public optionClicked(option: OptionModel) {
    this.opened = false;
    this.valueSelected = option.name;
    this.optionSelected.emit(option);
  }
}
