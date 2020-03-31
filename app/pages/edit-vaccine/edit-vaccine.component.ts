import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { FinalizationModel } from 'src/app/@core/models/finalization/finalization.model';
import {
  FinalizationConst,
  FinalizationEditVaccineSucessConst,
  FinalizationEditVaccineErrorConst
} from 'src/app/@core/consts/finalization/finalization.const';

import { VaccineService } from 'src/app/@core/services/vaccines/vaccine.service';
import { VaccineModel, NotConcomitanceModel } from 'src/app/@core/models/vaccines/vaccines.model';
import { HttpResponseEnum } from 'src/app/@core/enums/httpResponse/httpResponse.enum';
import { ModificationService } from 'src/app/@core/services/general/modification.service';

@Component({
  selector: 'app-edit-vaccine',
  templateUrl: './edit-vaccine.component.html',
  styleUrls: ['./edit-vaccine.component.scss']
})
export class EditVaccineComponent implements OnInit {

  private idVaccine: number;
  private oldVaccine: VaccineModel = new VaccineModel();
  public vaccine: VaccineModel = new VaccineModel();
  public response: boolean;
  public options: FinalizationModel = new FinalizationModel();

  constructor(
    private _route: Router,
    private _router: ActivatedRoute,
    private _vaccineService: VaccineService,
    private _modificationService: ModificationService
  ) { }

  ngOnInit() {
    this.idVaccine = 0;
    this._router.params.subscribe((param: Params) => {
      this.idVaccine = param['id'];
    });
    this.getVaccineById();
    this.response = false;
  }

  /**
   * Metodo responsavel por buscar a vacina no serviço atraves de um id especifico
   */
  private getVaccineById(): void {
    this._vaccineService.getVaccinesById(this.idVaccine).subscribe((result: VaccineModel) => {
      this.vaccine = result;
      this.oldVaccine = JSON.parse(JSON.stringify(this.vaccine));
    }, error => {
      if (error.status === HttpResponseEnum.Not_Found) {
        this._route.navigate(['404']);
      }
    })
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
        this.options = FinalizationEditVaccineSucessConst;
        break;
      case FinalizationConst.error:
        this.options = FinalizationEditVaccineErrorConst;
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
    this._route.navigate(['lista-vacinas']);
  }

  /**
   * Método responsável por validar se houve mudanças no formulário.
   * Verifica todas as propriedades com as propriedades antigas recebida do backend.
   * Se houver mudanças, define a modificação como true no ModificationService.
   * * Este método é chamado pelo deactivate do guarda de rotas personalizado para cada componente.
   */
  public validateChanges() {
    this.checkEqual(this.vaccine, this.oldVaccine);
  }

  /**
   * Método resposável por verificar se os campos estão diferentes de vazio.
   * Para poder exibir o alerta de modificações.
   * @param vaccine Vacina atual.
   */
  private checkEqual(vaccine: VaccineModel, oldVaccine: VaccineModel): void {
    let modification = false;
    if (vaccine.name !== oldVaccine.name) { modification = true; }
    if (vaccine.millenniumId !== oldVaccine.millenniumId) { modification = true; }
    if (vaccine.medicalOrderIsRequired !== oldVaccine.medicalOrderIsRequired) { modification = true; }
    if (vaccine.isLiveVirus !== oldVaccine.isLiveVirus) { modification = true; }
    if (vaccine.observations !== oldVaccine.observations) { modification = true; }
    if (vaccine.recommendations !== oldVaccine.recommendations) { modification = true; }

    if (oldVaccine.contraIndications.length < 1) {
      oldVaccine.contraIndications.push('');
    }
    if (oldVaccine.notConcomitanceVaccines.length < 1) {
      oldVaccine.notConcomitanceVaccines.push(new NotConcomitanceModel());
    }

    vaccine.contraIndications.forEach((data: string, index: number) => {
      if (data !== oldVaccine.contraIndications[index]) { modification = true; }
    });
    vaccine.notConcomitanceVaccines.forEach((data: NotConcomitanceModel, index: number) => {
      if (data.name !== oldVaccine.notConcomitanceVaccines[index].name) { modification = true; }
    });
    
    this._modificationService.setModification(modification);
  }
}
