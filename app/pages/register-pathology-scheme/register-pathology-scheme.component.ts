import { Component, OnInit } from '@angular/core';
import { PathologiesModel } from 'src/app/@core/models/pathologies/pathologies.model';
import { SchemeModel } from 'src/app/@core/models/schemes/schemes.model';
import { FinalizationModel } from 'src/app/@core/models/finalization/finalization.model';
import {
  FinalizationRegisterPathologySuccess,
  FinalizationRegisterPathologyError,
  FinalizationRegisterPathologyErrorDuplicated,
  FinalizationRegisterPathologyErrorServerFailure
} from 'src/app/@core/consts/finalization/finalization.const';
import { NotMappedPropertiesRegister } from 'src/app/@core/consts/modification/properties.const';

import { VaccinationScheduleService } from 'src/app/@core/services/vaccination-schedule/vaccination-schedule.service';
import { Router } from '@angular/router';
import { ModificationService } from 'src/app/@core/services/general/modification.service';
import { VaccinationScheduleDeactivate } from 'src/app/@core/guards/vac-schedule-deactivate-guard';
import { PathologyErrorModel } from 'src/app/@core/models/pathologies/pathologesError.model';
import { SchemeErrorModel, DoseErrorModel } from 'src/app/@core/models/schemes/schemeError.model';
import { AnchorService } from 'src/app/@core/services/anchor/anchor.service';
import { HttpResponseEnum } from 'src/app/@core/enums/httpResponse/httpResponse.enum';

@Component({
  selector: 'app-register-pathology-scheme',
  templateUrl: './register-pathology-scheme.component.html',
  styleUrls: ['./register-pathology-scheme.component.scss']
})
export class RegisterPathologySchemeComponent implements OnInit {

  public pathologyScheme: PathologiesModel = new PathologiesModel();
  public errorPathology = new PathologyErrorModel();
  public errorScheme = new Array<SchemeErrorModel>();
  public passedPathology = false;
  public passedScheme = false;
  private schemeBackup: Array<SchemeModel>;
  public response = false;
  public options: FinalizationModel = new FinalizationModel();

  constructor(
    private _vaccinationScheduleService: VaccinationScheduleService,
    private _router: Router,
    private _modificationService: ModificationService,
    private _vaccinationScheduleDeactivate: VaccinationScheduleDeactivate,
    private _anchorService: AnchorService
  ) { }

  ngOnInit() {
  }

  /**
   * Método responsável por triggar o botão de cadastrar e ativar os métodos de validar o esquema e patologia.
   */
  public registerPathology(): void {
    this._vaccinationScheduleService.triggerButton(true);
  }

  /**
   * Método responsável por receber por output se o formulário de patologia está válida ou não.
   * @param pathologyValid validação do formulário de patologia.
   * pathologyValid[0] validação da patologia, se houve algum campo com erro ou não.
   * pathologyValid[1] objeto com os erros da patologia para ancoragem.
   */
  public receivePathologyValidation(pathologyValid: any): void {
    this.passedPathology = pathologyValid[0];
    this.errorPathology = pathologyValid[1];
  }

  /**
   * Método responsável por receber por output se o formulário de esquemas está válido ou não.
   * @param schemeValid array contendo a validação, e o esquema de backup, caso aconteça algum erro no cadastro.
   * schemeValid[0] boolean validação dos esquemas, se houve algum campo com erro ou não.
   * schemeValid[1] objeto com os erros dos esquemas para fazer ancoragem.
   * schemeValid[2] modelo de esquema backup do esquema caso o serviço post/put falhar e voltar com os dados intactos.
   */
  public receiveSchemeValidation(schemeValid: any): void {
    this.passedScheme = schemeValid[0];
    this.errorScheme = schemeValid[1];
    this.schemeBackup = schemeValid[2];
    this.registerScheme();
  }

  /**
   * Método responsável por registrar a patologia e esquema.
   */
  private registerScheme(): void {
    if (this.passedPathology && this.passedScheme) {
      this._vaccinationScheduleService.addPathologyScheme(this.pathologyScheme).subscribe(response => {
        this.options = FinalizationRegisterPathologySuccess;
        this.options.actionbtn1 = () => { this.newPathology(); };
        this.options.actionbtn2 = () => { this.finalization(); };
        // Definir que a validação do formulário está ok para não exibir o modal de confirmação de sair sem salvar.
        this._vaccinationScheduleDeactivate.setValidate(true);
        this.response = true;
      }, error => {
        this.options = this.configureResponseError(error.status);
        this.options.actionbtn1 = () => { this.tryAgain(); };
        this.options.actionbtn2 = () => { this.finalization(); };
        this.pathologyScheme.schemes = this.schemeBackup;
        this.response = true;
      });
    } else {
      const route = location.pathname;
      const patAnchor = this._anchorService.anchorPathology(this.errorPathology, route);
      if (!patAnchor) {
        this._anchorService.anchorScheme(this.errorScheme, route);
      }
    }
  }

  /**
   * Metodo responsavel por validar a mensagem de erro que será exibia caso algum problema aconteça na edição
   * @param {number} statusCode numero status code da resposta de erro
   */
  private configureResponseError(statusCode: number): FinalizationModel {
    switch (statusCode) {
      case HttpResponseEnum.Duplicated:
        return FinalizationRegisterPathologyErrorDuplicated;
      case HttpResponseEnum.Error_Server_Failure:
        return FinalizationRegisterPathologyErrorServerFailure;
      default:
        return FinalizationRegisterPathologyError;
    }
  }


  /**
   * Método responsável por esconder o componente de finalização e zerar o formulário.
   */
  private newPathology() {
    this.pathologyScheme = new PathologiesModel();
    this.response = false;
  }

  /**
   * Método responsável por esconder o componente de finalização, para que o usuário possa tentar novamente.
   */
  private tryAgain() {
    this.response = false;
  }

  /**
   * Método responsável por voltar para a lista de patologia quando o botão de finalizar for acionado.
   */
  private finalization() {
    this._router.navigate(['lista-patologias']);
  }

  /**
   * Método responsável por validar se houve mudanças no formulário.
   * Verifica todas as propriedades com as propriedades antigas recebida do backend.
   * Se houver mudanças, define a modificação como true no ModificationService.
   * * Este método é chamado pelo deactivate do guarda de rotas personalizado para cada componente.
   */
  public validateChanges() {
    let modification = false;
    if (this.pathologyScheme.pathologyName !== '') { modification = true; }
    if (this.pathologyScheme.pathologyCalendarType !== '') { modification = true; }
    if (modification) {
      this._modificationService.setModification(modification);
    } else {
      this.checkEmptiness(this.pathologyScheme.schemes);
    }
  }

  /**
   * Método responsável por varrer todas as propridades do objeto atual.
   * Verifica se está preenchido.
   * Verifica todas as propriedades, caso a proprieade também for um objeto deve ser feito de forma separada.
   * @param actualScheme Esquemas atuais.
   */
  private checkEmptiness(actualScheme: Array<SchemeModel>) {
    let modification = false;
    actualScheme.forEach((scheme: SchemeModel) => {
      Object.entries(scheme).forEach(([key]) => {
        if (key === 'doses') {
          if (scheme.doses.length > 0) { modification = true; }
        } else if (key === 'vaccineIds') {
          if (scheme.vaccineIds.length > 0) { modification = true; }
        } else if (scheme[key] !== null && scheme[key] !== '' && NotMappedPropertiesRegister.indexOf(key) === -1) {
          modification = true;
        }
      });
    });
    this._modificationService.setModification(modification);
  }
}


