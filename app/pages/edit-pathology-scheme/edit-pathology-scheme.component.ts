import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { VaccinationScheduleService } from 'src/app/@core/services/vaccination-schedule/vaccination-schedule.service';
import { PathologiesModel } from 'src/app/@core/models/pathologies/pathologies.model';
import { PathologiesService } from 'src/app/@core/services/pathologies/pathologies.service';
import { VaccinationScheduleDeactivate } from 'src/app/@core/guards/vac-schedule-deactivate-guard';
import { ModificationService } from 'src/app/@core/services/general/modification.service';

import { VaccineModel, VaccineListTypeAhead } from 'src/app/@core/models/vaccines/vaccines.model';
import { SchemeModel, DoseModel } from 'src/app/@core/models/schemes/schemes.model';
import { DoseQuantity } from 'src/app/@core/consts/doses/dosequantity.const';
import { FinalizationModel } from 'src/app/@core/models/finalization/finalization.model';
import {
  FinalizationEditPathologySuccess,
  FinalizationEditPathologyError,
  FinalizationEditPathologyErrorServerFailure
} from 'src/app/@core/consts/finalization/finalization.const';
import { NotMappedPropertiesEdit } from 'src/app/@core/consts/modification/properties.const';
import { DoseEnum } from 'src/app/@core/enums/scheme/Dose.enum';
import { SchemeErrorModel } from 'src/app/@core/models/schemes/schemeError.model';
import { PathologyErrorModel } from 'src/app/@core/models/pathologies/pathologesError.model';
import { AnchorService } from 'src/app/@core/services/anchor/anchor.service';
import { HttpResponseEnum } from 'src/app/@core/enums/httpResponse/httpResponse.enum';

@Component({
  selector: 'app-edit-pathology-scheme',
  templateUrl: './edit-pathology-scheme.component.html',
  styleUrls: ['./edit-pathology-scheme.component.scss']
})
export class EditPathologySchemeComponent implements OnInit {

  public pathologyScheme: PathologiesModel = new PathologiesModel();
  public oldPathologyScheme: PathologiesModel;
  public response = false;
  public options: FinalizationModel = new FinalizationModel();
  public errorPathology = new PathologyErrorModel();
  public errorScheme = new Array<SchemeErrorModel>();
  public backupDoses = new Array<Array<DoseModel>>();
  private passedPathology = false;
  private passedScheme = false;
  private schemeBackup: Array<SchemeModel>;
  private idPathologyScheme = 0;
  private numberDoses: Array<number> = DoseQuantity;
  private deletedSchemes = new Array<number>();
  private modificationPathology = false;
  private modificationSchemes = new Array<number>();

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _vaccinationScheduleService: VaccinationScheduleService,
    private _pathologyService: PathologiesService,
    private _modificationService: ModificationService,
    private _vaccinationScheduleDeactivate: VaccinationScheduleDeactivate,
    private _anchorService: AnchorService
  ) { }

  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
      this.idPathologyScheme = params['id'];
    });
    this.getPathologySchemeById();
  }

  /**
   * Método responsável por triggar o botão de cadastrar e ativar os métodos de validar o esquema e patologia.
   */
  public savePathology(): void {
    this._vaccinationScheduleService.triggerButton(true);
  }

  /**
   * Método responsável por buscar a patologia e esquema por Id.
   * Após buscar, tratar os dados para serem exibidos corretamente nas telas.
   */
  private getPathologySchemeById() {
    this._vaccinationScheduleService.getPathologySchemeById(this.idPathologyScheme).subscribe(response => {
      this.pathologyScheme = response;
      this.pathologyScheme.schemes.forEach((scheme: SchemeModel) => {
        this.backupDoses.push(JSON.parse(JSON.stringify(scheme.doses)));
        scheme = this.populateVaccineTypeahead(scheme);
        scheme = this.populateDosesFields(scheme);
        scheme = this.checkMonthsAndYears(scheme);
        const error = new SchemeErrorModel();
        this.errorScheme.push(error);
      });
      if (this.pathologyScheme.schemes.length < 1) {
        this.pushScheme();
      }
      this.oldPathologyScheme = JSON.parse(JSON.stringify(this.pathologyScheme));
    });
  }

  /**
   * Método responsável por setar nulo quando mês ou ano vier com 0. Pois a validação é feita com nulo.
   * @param scheme Modelo do esquema
   */
  private checkMonthsAndYears(scheme: SchemeModel): SchemeModel {
    scheme.months = scheme.months === 0 ? 0 : scheme.months;
    scheme.years = scheme.years === 0 ? 0 : scheme.years;
    scheme.minimumMonthAge = scheme.minimumMonthAge === 0 ? 0 : scheme.minimumMonthAge;
    scheme.minimumYearAge = scheme.minimumYearAge === 0 ? 0 : scheme.minimumYearAge;
    scheme.maximumMonthAge = scheme.maximumMonthAge === 0 ? 0 : scheme.maximumMonthAge;
    scheme.maximumYearAge = scheme.maximumYearAge === 0 ? 0 : scheme.maximumYearAge;
    scheme.minimalMonthsAgeForReinforcement = scheme.minimalMonthsAgeForReinforcement === 0
      ? 0 : scheme.minimalMonthsAgeForReinforcement;
    scheme.minimalYearsAgeForReinforcement = scheme.minimalYearsAgeForReinforcement === 0
      ? 0 : scheme.minimalYearsAgeForReinforcement;
    scheme.minimalMonthsIntervalForReinforcement = scheme.minimalMonthsIntervalForReinforcement === 0
      ? 0 : scheme.minimalMonthsIntervalForReinforcement;
    scheme.minimalYearsIntervalForReinforcement = scheme.minimalYearsIntervalForReinforcement === 0
      ? 0 : scheme.minimalYearsIntervalForReinforcement;

    return scheme;
  }

  /**
   * Método responsável por adicionar um esquema no array.
   */
  private pushScheme(): void {
    const schemeModel = new SchemeModel();
    schemeModel['disableQuantityPrimary'] = true;
    schemeModel['disableQuantityReinforcement'] = true;
    schemeModel['addNewVaccine'] = false;
    const vaccine = new VaccineListTypeAhead();
    schemeModel.vaccines.push(vaccine);

    this.pathologyScheme.schemes.push(schemeModel);

    const error = new SchemeErrorModel();
    this.errorScheme.push(error);
  }

  /**
   * Método responsável por popular as vacinas do typeahead.
   * @param scheme Modelo de esquema.
   */
  private populateVaccineTypeahead(scheme: SchemeModel): SchemeModel {
    // Possível adicionar vacina, pois foi validado antes de cadastrar.
    scheme['addNewVaccine'] = true;
    scheme.vaccines = new Array<VaccineListTypeAhead>();
    scheme.vaccineIds = new Array<number>();
    const vaccineList = scheme['vaccineList'];
    vaccineList.forEach((vacc: VaccineModel) => {
      const vaccineTypeAhead = new VaccineListTypeAhead();
      vaccineTypeAhead.id = vacc.id;
      vaccineTypeAhead.name = vacc.name;
      vaccineTypeAhead.blockVaccine = true;
      scheme.vaccines.push(vaccineTypeAhead);
      scheme.vaccineIds.push(vacc.id);
    });
    return scheme;
  }

  /**
   * Método responsável por popular os campos de doses separados por tipo de dose.
   * Preenche os campos personalizados que não são enviados pro backend.
   * Campos de doses de de reforço, dose recorrente, e intervalo de doses diferentes ou não.
   * @param scheme Modelo de esquema.
   */
  private populateDosesFields(scheme: SchemeModel): SchemeModel {
    // Filtra doses por tipo de dose.
    const primary = scheme.doses.filter(dose => dose.doseType === DoseEnum.Primaria);
    const reinforcement = scheme.doses.filter(dose => dose.doseType === DoseEnum.Reforco);

    // Verifica quantidade de dose para preencher o radio button com o numero de doses, e verifica se existe um intervalo diferente.
    // Dose do tipo primária.
    scheme['differentIntervalPrimary'] = this.validateIntervalDose(primary);
    this.checkDoseNumber(scheme, primary, DoseEnum.Primaria);
    if (primary.length > 0) { primary.pop(); }
    this.fillDoseNumbers(primary, scheme, scheme['differentIntervalPrimary'], DoseEnum.Primaria);

    // Faz a mesma verificação para dose do tipo Reforço.
    if (reinforcement.length > 0) {
      if (reinforcement[0].isRecurrent) {
        scheme['isRecurrent'] = true;
        scheme['doseEqualQuantityYearsReinforcement'] = Math.floor(reinforcement[0].intervalToNextDose / 12);
        scheme['doseEqualQuantityMonthsReinforcement'] = reinforcement[0].intervalToNextDose % 12;
      } else {
        scheme['isRecurrent'] = false;
        scheme['differentIntervalReinforcement'] = this.validateIntervalDose(reinforcement);
        this.checkDoseNumber(scheme, reinforcement, DoseEnum.Reforco);
        this.fillDoseNumbers(reinforcement, scheme, scheme['differentIntervalReinforcement'], DoseEnum.Reforco);
      }
      reinforcement.pop();
      scheme['reinforcementDose'] = true;

    } else {
      scheme['reinforcementDose'] = false;
    }
    scheme.doses = primary.concat(reinforcement);
    return scheme;
  }

  /**
   * Método reponsável por verificar se o intervalo de doses é diferente ou não.
   * @param doses Array de doses.
   */
  private validateIntervalDose(doses: Array<DoseModel>): boolean {
    let interval = false;
    doses.forEach((doseItem: DoseModel) => {
      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < doses.length; j++) {
        if (doseItem.id !== doses[j].id && doseItem.intervalToNextDose !== doses[j].intervalToNextDose) {
          interval = true;
          break;
        }
      }
    });

    // condição para que o checkBox não fique pré-selecionado quando não tiver campos
    // para serem exibidos, ja que a quantidade de doses para este caso é até 1
    if (doses.length <= 1) {
      return null;
    }

    return interval;
  }

  /**
   * Método responsável por preencher os campos das doses, de intervalo diferente ou não.
   * Preencher todos os campos se não for de intervalo diferente, ou preencher apenas dois campos se for de intervalo igual.
   * @param doses Array de doses.
   * @param scheme Modelo de esquema.
   * @param differentInterval Intervalo diferente ou não para saber quais campos preencher.
   * @param doseType Tipo da dose, primária ou reforço.
   */
  private fillDoseNumbers(doses: Array<DoseModel>, scheme: SchemeModel, differentInterval: boolean, doseType: string) {
    // Deve fazer a conversão para o campo de anos e meses, pois o backend devolve o valor apenas em meses.
    if (differentInterval) {
      doses.forEach((doseItem: DoseModel) => {
        doseItem['intervalToNextInYears'] = Math.floor(doseItem.intervalToNextDose / 12);
        doseItem.intervalToNextInMonths = doseItem.intervalToNextDose % 12;
      });
    } else if (!differentInterval && doses.length >= 1) {
      scheme['doseEqualQuantityYears' + doseType] = Math.floor(doses[0].intervalToNextDose / 12);
      scheme['doseEqualQuantityMonths' + doseType] = doses[0].intervalToNextDose % 12;
    }
  }

  /**
   * Método responsável por preencher o radio button de doses e o campo de texto se necessário.
   * @param scheme modelo de esquema.
   * @param doses array de doses.
   * @param doseType tipo da dose.
   */
  private checkDoseNumber(scheme: SchemeModel, doses: Array<DoseModel>, doseType: string) {
    // condição para doses acima de 5 itens
    if (doses.length > this.numberDoses[this.numberDoses.length - 1]) {
      scheme['doseNumber' + doseType] = this.numberDoses[this.numberDoses.length - 1] + 1;
      scheme['doseQuantity' + doseType] = doses.length;
    } else {
      scheme['doseNumber' + doseType] = doses.length;
      scheme['disableQuantity' + doseType] = true;
    }
  }

  /**
   * Método responsável por:
   * Atualizar o nome da patologia.
   * Atualizar o esquema, um por um.
   * E deletar o esquema caso algum esquema tenha sido deletado.
   */
  public updatePathologyScheme() {
    if (this.passedPathology && this.passedScheme) {
      this.validateWhichToUpdate();
      if (this.modificationSchemes.length > 0) {
        this.pathologyScheme.schemes = this.filterSchemesToUpdate(this.pathologyScheme.schemes, this.modificationSchemes);
      }

      if (this.modificationPathology && this.modificationSchemes.length > 0) {
        this.deleteSchemes();
        this._vaccinationScheduleService.updatePathologyScheme(this.idPathologyScheme, this.pathologyScheme).subscribe(response => {
          this.configureFinalization(true);
        }, error => {
          this.configureFinalization(false, error.status);
        });
      } else if (this.modificationPathology) {
        this.deleteSchemes();
        this._pathologyService.updatePathology(this.idPathologyScheme, this.pathologyScheme.pathologyName).subscribe(response => {
          this.configureFinalization(true);
        }, error => {
          this.configureFinalization(false, error.status);
        });
      } else if (this.modificationSchemes.length > 0) {
        this.deleteSchemes();
        this._vaccinationScheduleService.updateSchemes(this.pathologyScheme.schemes, this.idPathologyScheme).subscribe(response => {
          this.configureFinalization(true);
        }, error => {
          this.configureFinalization(false, error.status);
        });
      } else {
        this.configureFinalization(true);
        this.deleteSchemes();
      }
    } else {
      const route = location.pathname;
      const patAnchor = this._anchorService.anchorPathology(this.errorPathology, route);
      if (!patAnchor) {
        this._anchorService.anchorScheme(this.errorScheme, route);
      }
    }
  }

  /**
   * Método responsável por deletar os esquemas que foram selecionados.
   */
  private deleteSchemes(): void {
    this.deletedSchemes.forEach((idScheme: number) => {
      this._vaccinationScheduleService.deleteScheme(idScheme).subscribe(reponse => {
        this.configureFinalization(true);
      }, error => {
        this.configureFinalization(false);
      });
    });
  }

  /**
   * Método responsável por configurar a tela de finalização.
   * @param success se houve sucesso na chamada da API ou não.
   */
  private configureFinalization(success: boolean, statusCode?: number) { // adicionar status de error ou sucesso
    this.response = true;

    this.options = success ? FinalizationEditPathologySuccess : this.configureResponseError(statusCode);

    if (success) {
      this._modificationService.setModification(false);
      // Definir que a validação do formulário está ok para não exibir o modal de confirmação de sair sem salvar.
      this._vaccinationScheduleDeactivate.setValidate(true);
    }
    this.options.actionbtn1 = () => { this.newPathology(); };
    this.options.actionbtn2 = () => { this.finalization(); };
  }

  /**
   * Metodo responsavel por validar a mensagem de erro que será exibia caso algum problema aconteça na edição
   * @param {number} statusCode numero status code da resposta de erro
   */
  private configureResponseError(statusCode: number): FinalizationModel {
    switch (statusCode) {
      case HttpResponseEnum.Error_Server_Failure:
        return FinalizationEditPathologyErrorServerFailure;
      default:
        return FinalizationEditPathologyError;
    }
  }

  /**
   * Método responsável por Filtrar quais esquemas devem ser enviados para a API de update.
   * @param schemes Array de esquemas.
   * @param modificationSchemes Id de esquemas que devem ser modificados.
   */
  private filterSchemesToUpdate(schemes: Array<SchemeModel>, modificationSchemes: Array<number>): Array<SchemeModel> {
    schemes = schemes.filter(scheme => {
      if (modificationSchemes.indexOf(scheme.id) !== -1 || scheme.id === 0) {
        return scheme;
      }
    });
    return schemes;
  }

  /**
   * Método responsável por receber por output se o formulário de patologia está válida ou não.
   * @param pathologyValid validação do formulário de patologia.
   * pathologyValid[0] boolean validação da patologia, se houve algum campo com erro ou não.
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
   * schemeValid[3] array de números contendo os ids dos esquemas que devem ser deletados.
   */
  public receiveSchemeValidation(schemeValid: any): void {
    this.passedScheme = schemeValid[0];
    this.errorScheme = schemeValid[1];
    this.schemeBackup = schemeValid[2];
    this.deletedSchemes = schemeValid[3];
    this.updatePathologyScheme();
  }

  /**
   * Método chamado no botão finalizar da tela de finalização.
   * Navega para a listagem de patologias ao finalizar.
   */
  private finalization(): void {
    this._router.navigate(['/lista-patologias']);
  }

  /**
   * Método chamado no botão de novo cadastro ou tentar novamente.
   */
  private newPathology(): void {
    this.response = false;
  }

  /**
   * Método responsável por validar se houve mudanças no formulário.
   * Verificando se deve precisa ser atualizado ou não.
   * Caso a patologia precise ser atualizada, o boolean de patologia é modificado para true.
   * Caso o esquema precise ser atualizado, são adicionados em um array de number os ids dos esquemas que precisam ser atualizados.
   */
  private validateWhichToUpdate() {
    if (this.pathologyScheme.pathologyName !== this.oldPathologyScheme.pathologyName) { this.modificationPathology = true; }
    if (this.pathologyScheme.pathologyCalendarType !== this.oldPathologyScheme.pathologyCalendarType) { this.modificationPathology = true; }

    this.checkEqual(this.pathologyScheme.schemes, this.oldPathologyScheme.schemes, false);
  }

  /**
   * Método responsável por validar se houve mudanças no formulário.
   * Verifica todas as propriedades com as propriedades antigas recebida do backend.
   * Se houver mudanças, define a modificação como true no ModificationService.
   * Este método é chamado pelo deactivate do guarda de rotas personalizado para cada componente.
   */
  public validateChanges() {
    let modification = false;
    if (this.pathologyScheme.pathologyName !== this.oldPathologyScheme.pathologyName) { modification = true; }
    if (this.pathologyScheme.pathologyCalendarType !== this.oldPathologyScheme.pathologyCalendarType) { modification = true; }
    if (modification) {
      this._modificationService.setModification(modification);
    } else {
      this.checkEqual(this.pathologyScheme.schemes, this.oldPathologyScheme.schemes, true);
    }
  }

  /**
   * Método responsável por varrer todas as propridades do objeto antigo com o objeto atual.
   * Verifica se houve alguma mudança comparando com o objeto antigo.
   * Verifica todas as propriedades, caso a proprieade também for um objeto deve ser feito de forma separada.
   * @param actualScheme Esquemas atuais.
   * @param oldScheme Esquemas antigos.
   * @param fromRoute Boolean para saber se a chamada vem da rota ou da verificação de qual esquema atualizar.
   */
  private checkEqual(actualScheme: Array<SchemeModel>, oldScheme: Array<SchemeModel>, fromRoute: boolean) {
    let modification = false;
    actualScheme.forEach((scheme: SchemeModel, index: number) => {
      let comparedScheme = JSON.parse(JSON.stringify(scheme));
      // Quando não for um esquema novo, verificar se houve mudanças nas propriedades.
      if (comparedScheme.id !== 0) {
        // Transformar propriedades de mês e ano em null caso seja 0, pois na tela não pode ser exibido 0.
        comparedScheme = this.checkMonthsAndYears(comparedScheme);
        // Navegando nas propriedades do objeto.
        Object.entries(comparedScheme).forEach(([key]) => {
          if (key === 'doses') {
            comparedScheme.doses.forEach((dose: DoseModel, doseIndex: number) => {
              // Verificar se o id da dose que veio do backend ainda existe.
              const iDose = this.backupDoses[index].findIndex(x => x.id === dose.id);
              if (iDose !== -1) {
                const monthsBkp = this.backupDoses[index][iDose].intervalToNextDose;
                const months = fromRoute ? monthsBkp % 12 : monthsBkp;
                const years = Math.floor(this.backupDoses[index][iDose].intervalToNextDose / 12);
                // Se a dose existir, verificar se continua com o mesmo intervalo.
                if (fromRoute) {
                  // Se vier da rota, as doses não estão parseadas em meses.
                  // Se for inervalo diferente entre as does comparar os meses e anos de cada dose.
                  if (scheme['differentInterval' + dose.doseType]) {
                    if (dose.intervalToNextInMonths !== months) { modification = true; }
                    if (dose['intervalToNextInYears'] !== years) { modification = true; }
                  } else { // Se não for intervalo diferente, comparar com a propriedade criada para intervalos iguais.
                    if (scheme['doseEqualQuantityMonths' + dose.doseType]
                      !== months && scheme['doseEqualQuantityMonths' + dose.doseType] !== undefined) {
                      modification = true;
                    }

                    if (scheme['doseEqualQuantityYears' + dose.doseType]
                      !== years && scheme['doseEqualQuantityYears' + dose.doseType] !== undefined) {
                      modification = true;
                    }
                  }

                } else { // Se não vier da rota, as doses já estão 'parseadas' para enviar ao backend.
                  if (dose.intervalToNextInMonths !== months) { modification = true; }
                }
              } else { // Caso a dose não existir mais, significa que houve modificação.
                modification = true;
              }
            });
          } else if (key === 'vaccineIds') {
            comparedScheme.vaccineIds.forEach((id: number, indexVac: number) => {
              // Verificar os typeaheads de vacinas se continuam com os mesmo ids.
              if (id !== oldScheme[index][key][indexVac]) {
                modification = true;
              }
            });
          } else if (comparedScheme[key] !== oldScheme[index][key] && NotMappedPropertiesEdit.indexOf(key) === -1) {
            // Comparar propriedades restantes que não são objetos, verificar se o valor continua o mesmo, ou se foi modificado.
            modification = true;
          }
        });
      } else { // Se houver um esquema com id 0, significa que o usuário adicionou um novo esquema. Assim já sendo uma modificação.
        modification = true;
      }
      // Se houver modificação e o método não tenha sido ativado pelo guarda de rotas,
      // adicionar o Id do esquema no array de esquemas para que esse esquema seja atualizado.
      if (modification && !fromRoute) { this.modificationSchemes.push(comparedScheme.id); }
    });
    this._modificationService.setModification(modification);
  }
}
