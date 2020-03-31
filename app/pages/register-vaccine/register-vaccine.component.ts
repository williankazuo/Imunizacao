import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FinalizationModel } from 'src/app/@core/models/finalization/finalization.model';
import {
  FinalizationConst,
  FinalizationRegisterVaccineSucessConst,
  FinalizationRegisterVaccineErrorConst,
  FinalizationRegisterVaccineDuplicatedConst
} from 'src/app/@core/consts/finalization/finalization.const';
import { VaccineModel } from 'src/app/@core/models/vaccines/vaccines.model';
import { ModificationService } from 'src/app/@core/services/general/modification.service';

@Component({
  selector: 'app-register-vaccine',
  templateUrl: './register-vaccine.component.html',
  styleUrls: ['./register-vaccine.component.scss']
})
export class RegisterVaccineComponent implements OnInit {

  public vaccine = new VaccineModel();
  public response: boolean;
  public options: FinalizationModel = new FinalizationModel();

  constructor(
    private _router: Router,
    private _modificationService: ModificationService
  ) { }

  ngOnInit() {
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
        this.vaccine = new VaccineModel();
        this.options = FinalizationRegisterVaccineSucessConst;
        break;
      case FinalizationConst.error:
        this.options = FinalizationRegisterVaccineErrorConst;
        break;
      case FinalizationConst.vaccine_duplicated:
        this.options = FinalizationRegisterVaccineDuplicatedConst;
        break;
    }

    this.options.actionbtn1 = () => { this.newVaccine(); };
    this.options.actionbtn2 = () => { this.finalization(); };
  }

  /**
   * Metodo responsavel por manter o usuário na tela de cadastro e possibilitar um novo cadastro
   */
  public newVaccine(): void {
    this.response = false;
  }

  /**
   * Metodo responsavel por finalizar o processo de cadastro e levar o usuário para a listagem de vacinas
   */
  public finalization(): void {
    this._router.navigate(['lista-vacinas']);
  }

  /**
   * Método responsável por validar se houve mudanças no formulário.
   * Verifica todas as propriedades com as propriedades antigas recebida do backend.
   * Se houver mudanças, define a modificação como true no ModificationService.
   * * Este método é chamado pelo deactivate do guarda de rotas personalizado para cada componente.
   */
  public validateChanges() {
    this.checkEmptiness(this.vaccine);
  }

  /**
   * Método resposável por verificar se os campos estão diferentes de vazio.
   * Para poder exibir o alerta de modificações.
   * @param vaccine Vacina atual.
   */
  private checkEmptiness(vaccine: VaccineModel): void {
    let modification = false;
    if (vaccine.name !== '') { modification = true; }
    if (vaccine.millenniumId !== 0) { modification = true; }
    if (vaccine.contraIndications[0] !== '') { modification = true; }
    if (vaccine.notConcomitanceVaccines[0].name !== '') { modification = true; }
    if (vaccine.notConcomitanceVaccinesId[0] !== 0) { modification = true; }
    if (vaccine.medicalOrderIsRequired != null) { modification = true; }
    if (vaccine.isLiveVirus != null) { modification = true; }
    if (vaccine.observations !== '') { modification = true; }
    if (vaccine.recommendations !== '') { modification = true; }
    this._modificationService.setModification(modification);
  }

}
