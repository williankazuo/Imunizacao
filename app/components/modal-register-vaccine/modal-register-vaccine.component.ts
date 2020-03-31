import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FinalizationModel } from 'src/app/@core/models/finalization/finalization.model';
import {
  FinalizationConst,
  FinalizationRegisterVaccineSucessModalConst,
  FinalizationRegisterVaccineErrorModalConst,
  FinalizationRegisterVaccineDuplicatedModalConst
} from 'src/app/@core/consts/finalization/finalization.const';
import { VaccineModel } from 'src/app/@core/models/vaccines/vaccines.model';

@Component({
  selector: 'app-modal-register-vaccine',
  templateUrl: './modal-register-vaccine.component.html',
  styleUrls: ['./modal-register-vaccine.component.scss']
})
export class ModalRegisterVaccineComponent implements OnInit {

  @Input() showModal: boolean;
  @Input() vaccineSelected = new VaccineModel();
  @Output() receiveResponse = new EventEmitter();

  public modalId: string;
  public response: boolean;
  public options: FinalizationModel = new FinalizationModel();
  public success: boolean;

  constructor() { }

  ngOnInit() {
    this.modalId = 'idModal';
    this.response = false;
  }

  /**
   * Metodo responsavel por fechar o modal
   * @param {boolean} _close flag para fechar o modal
   */
  public closeModal(_close: boolean) {
    this.showModal = _close;
    this.receiveResponse.emit([_close, this.success]);
    this.response = false;
  }

  /**
   * metodo responsavel por receber a resposta do componente filho, com relação a resposta 
   * da tentativa de salvar uma nova vacina. De acordo com a resposta, as configurações do componente
   * de sucesso será finalizada para sucesso ou erro.
   * @param {number} _typeResponse resposta do componente filho com relação ao resultado do cadastro
   */
  public responseChild(_typeResponse: number): void {
    this.response = true;

    switch (_typeResponse) {
      case FinalizationConst.success:
        this.options = FinalizationRegisterVaccineSucessModalConst;
        this.success = true;
        break;
      case FinalizationConst.error:
        this.options = FinalizationRegisterVaccineErrorModalConst;
        this.success = false;
        break;
      case FinalizationConst.vaccine_duplicated:
        this.options = FinalizationRegisterVaccineDuplicatedModalConst;
        break;
    }

    this.options.actionbtn1 = () => { this.newTry(); };
    this.options.actionbtn2 = () => { this.closeModal(false); };
  }

  /**
   * Metodo responsavel por manter o usuário na tela de cadastro e possibilitar um novo cadastro
   */
  public newTry(): void {
    this.response = false;
  }

}
