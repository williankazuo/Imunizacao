import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { SchemeModel, DoseModel } from 'src/app/@core/models/schemes/schemes.model';
import { GenderEnum } from 'src/app/@core/enums/scheme/Gender.enum';
import { DoseEnum } from 'src/app/@core/enums/scheme/Dose.enum';
import { SchemeErrorModel, DoseErrorModel } from 'src/app/@core/models/schemes/schemeError.model';
import { VaccinationScheduleService } from 'src/app/@core/services/vaccination-schedule/vaccination-schedule.service';
import { VaccineModel, VaccineListTypeAhead } from 'src/app/@core/models/vaccines/vaccines.model';
import { VaccineService } from 'src/app/@core/services/vaccines/vaccine.service';
import { HttpResponseEnum } from 'src/app/@core/enums/httpResponse/httpResponse.enum';
import { ModalAlertService } from 'src/app/@core/services/modal/modal-alert.service';
import { ModalAlertModel } from 'src/app/@core/models/modal/modal-alert.model';
import { CalendarTypeEnum } from 'src/app/@core/enums/pathologies/CalendarType.enum';
import { EmiterService } from 'src/app/@core/services/general/emiter.service';
import { DoseQuantity } from 'src/app/@core/consts/doses/dosequantity.const';

@Component({
  selector: 'app-crud-vaccination-schedule',
  templateUrl: './crud-vaccination-schedule.component.html',
  styleUrls: ['./crud-vaccination-schedule.component.scss'],
})
export class CrudVaccinationScheduleComponent implements OnInit, OnDestroy {

  @Input() schemes: Array<SchemeModel> = new Array<SchemeModel>();
  @Input() errorScheme = new Array<SchemeErrorModel>();
  @Input() set calendarType(value: string) {
    if (this._calendarType != null) {
      this.clearField();
    }
    this._calendarType = value;
  }
  @Input() backupDoses = new Array<Array<DoseModel>>();
  @Output() valid = new EventEmitter();
  public _calendarType: any;
  public genderEnum = GenderEnum;
  public doseEnum = DoseEnum;
  public calendarTypeEnum = CalendarTypeEnum;
  public numberDoses: Array<number> = DoseQuantity;
  public listVaccine: Array<VaccineModel>;
  public showVaccineModal = [false];

  private subscription: any;
  private vaccineSelected: VaccineModel = new VaccineModel();
  private deletedSchemes = new Array<number>();

  /** Propriedade para exibir as mensagens de erro que serão comuns para os campos de inputs de idades minimas e maximas */
  public errorMessageMinimumAgeAndMaximumConflicting: string;

  constructor(
    private _vaccinationScheduleService: VaccinationScheduleService,
    private _vaccinesService: VaccineService,
    private _modalAlertService: ModalAlertService,
    private _emiterService: EmiterService
  ) { }

  ngOnInit() {
    this.addScheme();
    this.getVaccines();
    this.subscription = this._vaccinationScheduleService.buttonRegister$.subscribe(data => this.validateScheme());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Método responsável por adicionar um esquema vazio no início, já que pode haver mais de um esquema por patologia.
   * Esquema de start.
   */
  private addScheme(): void {
    if (this.schemes.length < 1) {
      this.pushScheme();
    } else {
      this.schemes.forEach((scheme: SchemeModel) => {
        this.validAddVaccineField(scheme);
      });
    }
  }

  /**
   * Método responsável por adicionar um esquema no array.
   */
  public pushScheme(): void {
    const schemeModel = new SchemeModel();
    schemeModel['disableQuantityPrimary'] = true;
    schemeModel['disableQuantityReinforcement'] = true;
    schemeModel['addNewVaccine'] = false;
    const vaccine = new VaccineListTypeAhead();
    schemeModel.vaccines.push(vaccine);

    this.schemes.push(schemeModel);

    const error = new SchemeErrorModel();
    this.errorScheme.push(error);
  }

  /**
   * Método responsável por adicionar doses no array de doses de acordo com a opção escolhida.
   * Este método é para as opções de radio, e desabilita a opção de texto.
   * @param numberOfDoses Número de doses escolhida.
   * @param schemeIndex Index do esquema.
   * @param doseType Tipo de dose.
   */
  public selectDoseNumber(numberOfDoses: number, scheme: SchemeModel, doseType: DoseEnum): void {
    this.disableQuantity(true, scheme, doseType);
    this.addFields(numberOfDoses, scheme, doseType);
    if (doseType === this.doseEnum.Primaria) {
      // caso a quantidade de doses primárias for 0, os campos de intervalo minimo para doses primarias e doses
      // de reforço, deverá ser zerado para o back end, ja que os mesmos não serão mais visiveis
      this.validQuantitySchemePrimary(scheme, numberOfDoses);
    }
  }

  /**
   * Metodo responsavel por validar a quantidade de esquema primário que está sendo selecionado e preparar
   * o envio dos dados ao backend
   * @param {SchemeModel} scheme esquema de vacinação que esta sendo validado
   * @param {number} numberDoses controle da quantidade de doses primárias
   */
  private validQuantitySchemePrimary(scheme: SchemeModel, numberDoses: number): void {
    if (numberDoses === 0) {
      scheme.minimalMonthsIntervalForReinforcement = 0;
      scheme.minimalYearsIntervalForReinforcement = 0;
    } else {
      scheme.minimalMonthsIntervalForReinforcement = null;
      scheme.minimalYearsIntervalForReinforcement = null;
    }
  }

  /**
   * Método responsável por adicionar doses no array de doses de acordo com a opção escolhida.
   * Este método é para a opção de campo livre. Ativado no keyup.
   * @param numberOfDoses Número de doses escolhida.
   * @param schemeIndex Index do esquema.
   * @param doseType Tipo de dose.
   */
  public addDoseNumber(numberOfDoses: number, scheme: SchemeModel, schemeIndex: number, doseType: DoseEnum): void {
    this.validateDose(numberOfDoses, scheme, schemeIndex, doseType);
  }

  /**
   * Método responsável por adicionar a quantidade de doses escolhida no array de doses.
   * Deleta as doses e adiciona.
   * @param numberOfDoses Número de doses escolhida.
   * @param schemeIndex Index do esquema.
   * @param doseType Tipo de dose.
   */
  private addFields(numberOfDoses: number, scheme: SchemeModel, doseType: DoseEnum): void {
    const dosesPrimary = scheme.doses.filter(x => x.doseType === DoseEnum.Primaria);
    const dosesReinforcement = scheme.doses.filter(x => x.doseType === DoseEnum.Reforco);
    const doseSelected = doseType === DoseEnum.Primaria ? dosesPrimary : dosesReinforcement;

    if (doseSelected.length + 1 > numberOfDoses) {
      for (let i = doseSelected.length + 1; i > numberOfDoses; i--) {
        doseSelected.pop();
      }
    } else {
      for (let i = doseSelected.length + 1; i < numberOfDoses; i++) {
        const dose = this.addSimpleDose(i, doseType, null, null);
        doseSelected.push(dose);
      }
    }
    scheme.doses = doseSelected.concat(doseType === DoseEnum.Primaria ? dosesReinforcement : dosesPrimary);
  }

  /**
   * Método responsável por desabilitar o campo de quantidade de dose por texto de acordo com o tipo de dose.
   * @param disable Boolean de disable ou não.
   * @param schemeIndex Index do esquema.
   * @param doseType Tipo de dose,
   */
  public disableQuantity(disable: boolean, scheme: SchemeModel, doseType: DoseEnum): void {
    switch (doseType) {
      case (DoseEnum.Primaria):
        scheme['disableQuantityPrimary'] = disable;
        scheme['doseQuantityPrimary'] = '';
        break;
      case (DoseEnum.Reforco):
        scheme['disableQuantityReinforcement'] = disable;
        scheme['doseQuantityReinforcement'] = '';
        break;
    }
  }

  /**
   * metodo responsavel por resetar os campos de eaquema de reforço.
   * Acionado quando o usuário, diz que existe doses de reforço
   * @param {SchemeModel} scheme esquema de vacinação que esta sendo validado
   */
  public resetDosesSchemeReinforcement(scheme: SchemeModel): void {
    this.validQuantitySchemePrimary(scheme, scheme['doseNumberPrimary']);
    scheme.minimalMonthsAgeForReinforcement = null;
    scheme.minimalYearsAgeForReinforcement = null;
    scheme['isRecurrent'] = null;
  }

  /**
   * Método responsável por deletar o array de doses dependendo do tipo.
   * @param schemeIndex Index do esquema.
   * @param doseType Tipo de dose que vai ser deletada.
   */
  public deleteArrayOfDoses(scheme: SchemeModel, doseType: DoseEnum): void {
    scheme.doses = scheme.doses.filter(dose => dose.doseType !== doseType);

    // condição para quando for doses de reforço não recorrentes, resetar os checkbox de quantidade.
    if (doseType === DoseEnum.Reforco) {
      scheme['doseNumberReinforcement'] = null;
    }

    this.resetDosesReinforcement(scheme);
  }

  /**
   * Metodo responsavel por resetar os campos de 'Intervalo entre as doses de reforço' do esquema de reforço.
   * Metodo acionado atraves do combo de escolhas de Doses recorrentes
   * @param {SchemeModel} scheme esquema de vacinação que está sendo validado
   */
  private resetDosesReinforcement(scheme: SchemeModel): void {
    scheme['doseEqualQuantityMonthsReinforcement'] = null;
    scheme['doseEqualQuantityYearsReinforcement'] = null;
    scheme['differentIntervalReinforcement'] = null;
  }

  /**
   * Método responsável por validar a quantidade no campo livre de doses, maio
   * @param numberOfDoses Número de doses escolhida.
   * @param schemeIndex Index do esquema.
   * @param doseType Tipo de dose.
   */
  private validateDose(numberOfDoses: number, scheme: SchemeModel, schemeIndex: number, doseType: DoseEnum): void {
    if (numberOfDoses > this.numberDoses[this.numberDoses.length - 1] && numberOfDoses < 100) {
      this.addFields(numberOfDoses, scheme, doseType);
      doseType === DoseEnum.Primaria ? this.errorScheme[schemeIndex].invalidDoseQuantityPrimary = false :
        this.errorScheme[schemeIndex].invalidDoseQuantityReinforcement = false;
    } else {
      doseType === DoseEnum.Primaria ? this.errorScheme[schemeIndex].invalidDoseQuantityPrimary = true :
        this.errorScheme[schemeIndex].invalidDoseQuantityReinforcement = true;
    }
  }

  /**
   * Método responsável por deletar o esquema.
   * @param schemeIndex Index do esquema.
   */
  public deleteScheme(schemeIndex: number, idScheme: number) {
    if (idScheme !== 0) {
      this.deletedSchemes.push(idScheme);
    }
    this.schemes.splice(schemeIndex, 1);
    this.errorScheme.splice(schemeIndex, 1);
  }

  /**
   * Método responsável por validar o esquema inteiro. É acionado quando o botão do componente pai é pressionado.
   * Adiciona uma model de erro para cada esquema adicionado.
   * Emite para o componente pai se está valido ou não, e também o esquema de backup caso de algum erro na hora da criação.
   * O esquema de backup serve para retornar aos dados antigos, pois antes de enviar ao backend é necessário converter as doses.
   */
  private validateScheme(): void {
    this.schemes.forEach((scheme: SchemeModel, index: number) => {
      if (this.errorScheme.length < index) {
        this.errorScheme.push(new SchemeErrorModel());
      }

      // reseta a verificação dos erros
      this.errorScheme[index] = new SchemeErrorModel();

      // validação dos campos
      this.errorScheme[index].gender = scheme.gender === '' ? true : false;
      this.errorScheme[index].isNotRequiredIfPreviouslyTaken = (
        scheme.isNotRequiredIfPreviouslyTaken == null && this._calendarType === CalendarTypeEnum.Adulto
      ) ? true : false;
      // Apenas um dos campos, mês ou ano, é obrigatório.
      this.errorScheme[index].months = this.verifyNull(scheme.months, scheme.years);
      this.errorScheme[index].years = this.verifyNull(scheme.months, scheme.years);
      this.errorScheme[index].minimumMonthAge = this.verifyNull(scheme.minimumMonthAge, scheme.minimumYearAge);
      this.errorScheme[index].minimumYearAge = this.verifyNull(scheme.minimumMonthAge, scheme.minimumYearAge);
      this.errorScheme[index].maximumMonthAge = this.verifyNull(scheme.maximumMonthAge, scheme.maximumYearAge);
      this.errorScheme[index].maximumYearAge = this.verifyNull(scheme.maximumMonthAge, scheme.maximumYearAge);

      // verificação para idades minimas e maximas, não conflitarem. Idade minima maior que maxima e maxima menor que minima
      this.errorScheme[index] = this.verifyMinimalAndMaximalAge(scheme, this.errorScheme[index]);

      // verificar se existe doses de esquemas. É obrgatório pelo menos uma dose 
      // de esquema primário ou uma dose de esquema de reforço
      this.errorScheme[index].doseNumber =
        (scheme['doseNumberPrimary'])
          || (scheme['doseNumberReinforcement'])
          || (!scheme['doseNumberReinforcement'] && scheme['isRecurrent'])
          ? false : true;

      this.errorScheme[index] = this.validateVaccinesList(scheme, this.errorScheme[index]);
      this.errorScheme[index] = this.validateArrayOfDoses(scheme, this.errorScheme[index], DoseEnum.Primaria);
      this.errorScheme[index] = this.validateReinforcementDosesErrors(scheme, this.errorScheme[index], DoseEnum.Reforco);
      this.errorScheme[index] = this.countErrors(this.errorScheme[index]);

    });

    const valid = this.verifyErrors();
    const schemeBackup = JSON.parse(JSON.stringify(this.schemes));
    if (valid) {
      this.parseData();
    }
    this.valid.emit([valid, this.errorScheme, schemeBackup, this.deletedSchemes]);
  }


  /**
   * Método responsável por verificar se os esquemas estão validos, de acordo com a quantidade de erros retornada.
   */
  private verifyErrors(): boolean {
    let valid = true;
    this.errorScheme.every((scheme: SchemeErrorModel) => {
      valid = scheme.countErrors < 1 ? true : false;
      return valid;
    });
    return valid;
  }

  /**
   * Metodo responsavel por verificar se alguma idade minima é maior que alguma idade máxima
   * @param {SchemeModel} scheme esquema de vacinação que será validado
   * @param {SchemeErrorModel} errorScheme lista de erros para o esquema que esta sendo validado
   */
  private verifyMinimalAndMaximalAge(scheme: SchemeModel, errorScheme: SchemeErrorModel): SchemeErrorModel {
    // condição para ser executada apenas quando todas as idades estiverem preechidas
    if (!(errorScheme.minimumMonthAge || errorScheme.minimumYearAge)
      && !(errorScheme.maximumMonthAge || errorScheme.maximumYearAge)
      && !(errorScheme.minimalMonthsAgeForReinforcement || errorScheme.minimalYearsAgeForReinforcement)) {

      // verificar idade minima menor que idade maxima
      errorScheme.invalidMinimumAge = (this._vaccinationScheduleService.calcTotalPeriodInMonths(
        scheme.minimumMonthAge, scheme.minimumYearAge
      ) <= this._vaccinationScheduleService.calcTotalPeriodInMonths(scheme.maximumMonthAge, scheme.maximumYearAge)
      ) ? false : true;

      // verificar idade minima para doses de reforço menor que idade maxima
      errorScheme.invalidMinimalAgeForReinforcement = (this._vaccinationScheduleService.calcTotalPeriodInMonths(
        scheme.minimalMonthsAgeForReinforcement, scheme.minimalYearsAgeForReinforcement
      ) <= this._vaccinationScheduleService.calcTotalPeriodInMonths(scheme.maximumMonthAge, scheme.maximumYearAge)
      ) ? false : true;

      // validação para a exibição da mensagem
      if (errorScheme.invalidMinimalAgeForReinforcement || errorScheme.invalidMinimumAge) {
        this.errorMessageMinimumAgeAndMaximumConflicting = 'idade mínima não pode ser maior que idade máxima.';
      }
    }
    return errorScheme;
  }


  /**
   * Método reponsável por converter as doses do esquema para enviar ao backend.
   */
  private parseData(): void {
    this.schemes.forEach((scheme: SchemeModel, schemeIndex: number) => {
      scheme.doses.forEach(dose => {
        dose = this.parseDosesByType(scheme, dose, dose.doseType);
      });
      this.prepareDoses(scheme, schemeIndex);
      this.checkCalendarAndMinimal(scheme);
      this.checkMonthsAndYears(scheme);
    });
  }

  /**
   * Método responsável por filtrar doses por tipo e adicionar uma nova dose no esquema.
   * E também parear com os ids que veio do get, os Ids estão no backup de doses.
   * Necessário fazer um de-para pois ao mudar o número da dose, perde-se o id dessas doses no splice/pop.
   * @param scheme Modelo de esquema.
   */
  private prepareDoses(scheme: SchemeModel, schemeIndex: number): void {
    let primary = scheme.doses.filter(dose => dose.doseType === DoseEnum.Primaria);
    let reinforcement = scheme.doses.filter(dose => dose.doseType === DoseEnum.Reforco);

    /** Se houver intervalo diferentes entre as doses, a próxima dose deve ser com 0.
     * Se não houver intervalo diferentes a nova dose é o mesmo intervalo da dose anterior.
     */
    if (primary.length > 0 && scheme['doseNumberPrimary'] !== primary.length) {
      this.addDose(scheme, primary, DoseEnum.Primaria);
    } else if (scheme['doseNumberPrimary'] === 1 && scheme['doseNumberPrimary'] !== primary.length) {
      const dose = this.addSimpleDose(1, DoseEnum.Primaria, 0, false);
      scheme.doses.push(dose);
    }

    if (reinforcement.length > 0 && scheme['doseNumberReinforcement'] !== reinforcement.length) {
      this.addDose(scheme, reinforcement, DoseEnum.Reforco);
    } else if (scheme['doseNumberReinforcement'] === 1 && scheme['doseNumberReinforcement'] !== reinforcement.length) {
      const dose = this.addSimpleDose(1, DoseEnum.Reforco, 0, scheme['isRecurrent']);
      scheme.doses.push(dose);

      // condição para doses de reforços que são recorrentes. Cria a dose e formata os anos para meses.
    } else if (scheme['isRecurrent'] && scheme['doseNumberReinforcement'] === 0) {
      let dose = this.addSimpleDose(1, DoseEnum.Reforco, 0, scheme['isRecurrent']);
      dose = this.parseDosesByType(scheme, dose, dose.doseType);
      scheme.doses.push(dose);
    }

    // Quando for edição, envia as doses de backup para fazer o de-para dos ids das doses.
    if (this.backupDoses.length > 0 && this.backupDoses[schemeIndex]) {
      primary = scheme.doses.filter(dose => dose.doseType === DoseEnum.Primaria);
      const primaryBkp = this.backupDoses[schemeIndex].filter(dose => dose.doseType === DoseEnum.Primaria);
      primary.map((dose: DoseModel, index: number) => {
        dose.id = primaryBkp[index] ? primaryBkp[index].id : 0;
      });

      reinforcement = scheme.doses.filter(dose => dose.doseType === DoseEnum.Reforco);
      const reinforcementBkp = this.backupDoses[schemeIndex].filter(dose => dose.doseType === DoseEnum.Reforco);
      reinforcement.map((dose: DoseModel, index: number) => {
        dose.id = reinforcementBkp[index] ? reinforcementBkp[index].id : 0;
      });
    }
  }

  /**
   * Método responsável por criar e retornar uma dose preenchida.
   * @param numberDose número dose.
   * @param doseType tipo da dose.
   */
  private addSimpleDose(numberDose: number, doseType: string, intervalMonths: number, isReccurent: boolean): DoseModel {
    const dose = new DoseModel();
    dose.number = numberDose;
    dose['intervalToNextInYears'] = null;
    dose.intervalToNextInMonths = intervalMonths;
    dose.doseType = doseType;
    dose.isRecurrent = isReccurent;

    return dose;
  }

  /**
   * Método responsável por adicionar uma nova dose no esquema.
   * Quando os dados são enviados para o back end, é necessário enviar uma nova dose.
   * Se houver intervalo diferentes entre as doses, a próxima dose deve ser com 0.
   * Se não houver intervalo diferentes a nova dose é o mesmo intervalo da dose anterior.
   * @param scheme Modelo de esquema.
   * @param doses Array de doses filtrado.
   */
  private addDose(scheme: SchemeModel, doses: Array<DoseModel>, sufix: string) {
    if (doses[0].intervalToNextInMonths !== 0) {
      const newDose = this.addSimpleDose(doses[doses.length - 1].number + 1, sufix,
        scheme['differentInterval' + sufix] ? 0 : doses[doses.length - 1].intervalToNextInMonths, doses[doses.length - 1].isRecurrent);
      scheme.doses.push(newDose);
    }
  }

  /**
   * Método responsável por verificar o tipo de calendário, caso for calendário infantil,
   * o campo de esquema não necessário tem que ser falso, pois é um campo obrigatório no backend, não é possível enviar nulo.
   * @param scheme Modelo do esquema
   */
  private checkCalendarAndMinimal(scheme: SchemeModel): void {
    if (this._calendarType === CalendarTypeEnum.Infantil) {
      scheme.isNotRequiredIfPreviouslyTaken = false;
    }
    // Campos obrigatórios, mesmo se não houver dose de reforço.
    if (scheme['reinforcementDose'] === false) {
      scheme.minimalMonthsAgeForReinforcement = 0;
      scheme.minimalYearsAgeForReinforcement = 0;
      scheme.minimalMonthsIntervalForReinforcement = 0;
      scheme.minimalYearsIntervalForReinforcement = 0;
      // Deletar as doses de reforço caso o usuário tenha preenchido.
      this.deleteArrayOfDoses(scheme, DoseEnum.Reforco);
    }
  }

  /**
   * Método responsável por enviar 0 quando um dos campos mes ou ano não for preenchido,
   * pois somente um dos dois é obrigatório. Mas no backend os dois são obrigatórios.
   * @param scheme Modelo do esquema
   */
  private checkMonthsAndYears(scheme: SchemeModel): void {
    scheme.months = !scheme.months ? 0 : scheme.months;
    scheme.years = !scheme.years ? 0 : scheme.years;
    scheme.minimumMonthAge = !scheme.minimumMonthAge ? 0 : scheme.minimumMonthAge;
    scheme.minimumYearAge = !scheme.minimumYearAge ? 0 : scheme.minimumYearAge;
    scheme.maximumMonthAge = !scheme.maximumMonthAge ? 0 : scheme.maximumMonthAge;
    scheme.maximumYearAge = !scheme.maximumYearAge ? 0 : scheme.maximumYearAge;
    scheme.minimalMonthsAgeForReinforcement = !scheme.minimalMonthsAgeForReinforcement ? 0 : scheme.minimalMonthsAgeForReinforcement;
    scheme.minimalYearsAgeForReinforcement = !scheme.minimalYearsAgeForReinforcement ? 0 : scheme.minimalYearsAgeForReinforcement;
    scheme.minimalMonthsIntervalForReinforcement =
      !scheme.minimalMonthsIntervalForReinforcement ? 0 : scheme.minimalMonthsIntervalForReinforcement;
    scheme.minimalYearsIntervalForReinforcement =
      !scheme.minimalYearsIntervalForReinforcement ? 0 : scheme.minimalYearsIntervalForReinforcement;
  }


  /**
   * Método responsável por preparar as doses para enviar ao backend.
   * As doses devem ser enviadas em meses, então deve se converter os anos para somar a propriedade de meses.
   * @param scheme Modelo de esquema.
   * @param dose Modelo de dose.
   * @param doseType Tipo de dose.
   */
  private parseDosesByType(scheme: SchemeModel, dose: DoseModel, doseType: string): DoseModel {
    // Sufixo Primary ou Reinforcement. Serve para pegar as propriedades do objeto.
    const sufix = doseType;

    // Só pode ser recorrente se for dose do tipo reforço.
    dose.isRecurrent = (scheme['isRecurrent'] && doseType === DoseEnum.Reforco) ? true : false;

    dose.intervalToNextInMonths = !dose.intervalToNextInMonths ? 0 : dose.intervalToNextInMonths;

    if (scheme['differentInterval' + sufix]) {
      dose['intervalToNextInYears'] = !dose['intervalToNextInYears'] ? 0 : dose['intervalToNextInYears'];
      dose.intervalToNextInMonths += dose['intervalToNextInYears'] * 12;
    } else if (scheme['differentInterval' + sufix] === false || (doseType === DoseEnum.Reforco && scheme['isRecurrent'])) {
      scheme['doseEqualQuantityMonths' + sufix] = !scheme['doseEqualQuantityMonths' + sufix]
        ? 0 : scheme['doseEqualQuantityMonths' + sufix];
      scheme['doseEqualQuantityYears' + sufix] = !scheme['doseEqualQuantityYears' + sufix] ? 0 : scheme['doseEqualQuantityYears' + sufix];
      dose.intervalToNextInMonths = scheme['doseEqualQuantityMonths' + sufix] + (scheme['doseEqualQuantityYears' + sufix] * 12);
    }
    return dose;
  }


  /**
   * Método responsável por validar os erros dos campos de doses de reforço.
   * Se a opção escolhida for que não existe intervalo de dose diferente, devem ser
   * criados o número de doses escolhida com o mesmo intervalo.
   * @param scheme Modelo de esquema.
   * @param error Modelo de erro do esquema.
   * @param doseType Tipo de dose.
   */
  private validateReinforcementDosesErrors(scheme: SchemeModel, error: SchemeErrorModel, doseType: DoseEnum): SchemeErrorModel {
    if (scheme['reinforcementDose']) {
      // Apenas um dos campos, mês ou ano, é obrigatório.
      error.minimalMonthsIntervalForReinforcement = this.verifyNull(scheme.minimalMonthsIntervalForReinforcement,
        scheme.minimalYearsIntervalForReinforcement);

      error.minimalYearsIntervalForReinforcement = this.verifyNull(scheme.minimalMonthsIntervalForReinforcement,
        scheme.minimalYearsIntervalForReinforcement);

      error.minimalMonthsAgeForReinforcement = this.verifyNull(scheme.minimalMonthsAgeForReinforcement,
        scheme.minimalYearsAgeForReinforcement);

      error.minimalYearsAgeForReinforcement = this.verifyNull(scheme.minimalMonthsAgeForReinforcement,
        scheme.minimalYearsAgeForReinforcement);

      error.isRecurrent = scheme['isRecurrent'] == null ? true : false;
      if (scheme['isRecurrent']) {
        error.doseEqualQuantityMonthsReinforcement = this.verifyNull(scheme['doseEqualQuantityMonthsReinforcement'],
          scheme['doseEqualQuantityYearsReinforcement']);
        error.doseEqualQuantityYearsReinforcement = this.verifyNull(scheme['doseEqualQuantityMonthsReinforcement'],
          scheme['doseEqualQuantityYearsReinforcement']);
        error.doseNumberReinforcement = false;
      } else if (scheme['isRecurrent'] === false) {
        error = this.validateArrayOfDoses(scheme, error, doseType);
      }
    } else if (scheme['reinforcementDose'] == null) {
      error.reinforcementDose = true;
    }

    return error;
  }

  /**
   * Método responsável por validar o array de doses.
   * Se a opção escolhida for que não existe intervalo de dose diferente, devem ser
   * criados o número de doses escolhida com o mesmo intervalo.
   * @param scheme Modelo de esquema.
   * @param error Modelo de erro do esquema.
   * @param doseType Tipo de dose.
   */
  private validateArrayOfDoses(scheme: SchemeModel, error: SchemeErrorModel, doseType: DoseEnum): SchemeErrorModel {
    // sufixo para os campos diferentes de tipo de dose. Todos os campos são iguais, porém com sufixo diferente.
    const sufix = doseType === DoseEnum.Primaria ? 'Primary' : 'Reinforcement';
    if (scheme['doseNumber' + sufix] !== null && scheme['doseNumber' + sufix] !== undefined) {
      if (scheme['doseNumber' + sufix] === this.numberDoses[this.numberDoses.length - 1] + 1) {
        error['doseQuantity' + sufix] = !scheme['doseQuantity' + sufix] ? true : false;
      }
      if (scheme['doseNumber' + sufix] > 1) {
        error['differentInterval' + sufix] = this.verifyNull(scheme['differentInterval' + sufix]);
        if (scheme['differentInterval' + sufix]) {
          scheme.doses.forEach(dose => {
            if (dose.doseType === doseType) {
              const doseError = new DoseErrorModel();
              // Apenas um dos campos, mês ou ano, é obrigatório.
              doseError.intervalToNextInMonths = this.verifyNull(dose.intervalToNextInMonths, dose['intervalToNextInYears']);
              doseError.intervalToNextInYears = this.verifyNull(dose.intervalToNextInMonths, dose['intervalToNextInYears']);
              error['doses' + sufix].push(doseError);
            }
          });
        } else if (scheme['differentInterval' + sufix] === false) {
          // Apenas um dos campos, mês ou ano, é obrigatório.
          error['doseEqualQuantityMonths' + sufix] = this.verifyNull(scheme['doseEqualQuantityMonths' + sufix],
            scheme['doseEqualQuantityYears' + sufix]);
          error['doseEqualQuantityYears' + sufix] = this.verifyNull(scheme['doseEqualQuantityMonths' + sufix],
            scheme['doseEqualQuantityYears' + sufix]);
        }
      }
    } else {
      error['doseNumber' + sufix] = true;
    }
    return error;
  }

  /**
   * Método responsável por contar os erros, varrendo as propriedades e somando quem está 'true'.
   * @param error modelo de erro para o esquema.
   */
  private countErrors(error: SchemeErrorModel): SchemeErrorModel {
    Object.entries(error).forEach(([key, value]) => {
      if (value === true) {
        error.countErrors++;
      }
    });
    error.vaccineIds.forEach((vac: boolean) => {
      error.countErrors += vac ? 1 : 0;
    });
    error.dosesPrimary.forEach(dose => {
      error.countErrors += dose.intervalToNextInMonths ? 1 : 0;
      error.countErrors += dose.intervalToNextInYears ? 1 : 0;
    });
    error.dosesReinforcement.forEach(dose => {
      error.countErrors += dose.intervalToNextInMonths ? 1 : 0;
      error.countErrors += dose.intervalToNextInYears ? 1 : 0;
    });
    return error;
  }

  /**
   * Metodo responsavel por selecionar uma vacina e buscar as vacinas concomitantementes
   * @param {VaccineModel} _vaccine item selecionado em uma lista de vacinas
   */
  public selectVaccine(_vaccine: VaccineModel, scheme: SchemeModel, vaccineIndex: number): void {
    if (_vaccine !== null) {
      const idSearch = _vaccine.id ? _vaccine.id.toString() : _vaccine.millenniumId.toString();
      this._vaccinesService.getVaccineByMillId(idSearch).subscribe(response => {
        // Exibir modal se a vacina já estiver selecionada.
        if (scheme.vaccineIds.indexOf(response) !== -1) {
          this.configureDuplicatedVaccineModal();
          this._emiterService.emptyValue('name-vaccine' + vaccineIndex.toString());
          this._modalAlertService.openModal();
        } else {
          scheme.vaccines[vaccineIndex].blockVaccine = true;
          scheme.vaccines[vaccineIndex].activeError = false;
          scheme.vaccines[vaccineIndex].name = _vaccine.name;
          scheme.vaccines[vaccineIndex].id = response;
          scheme.vaccineIds.push(response);
          this.validAddVaccineField(scheme);
        }
      }, error => {
        // Exibir modal de vacina não cadastrada.
        if (error.status === HttpResponseEnum.Not_Found) {
          this._emiterService.emptyValue('name-vaccine' + vaccineIndex.toString());
          this.configureVaccineModal(vaccineIndex);
          this.initiateVaccineSelected(_vaccine);
          this._modalAlertService.openModal();
        }
      });
    } else {
      scheme.vaccines[vaccineIndex].errorMsg = 'Vacina inválida';
    }
  }

  /**
   * Método responsável por iniciar o modelo da vacina com o Id e o nome da vacina selecionada no typeahead.
   * Vacina selecionada vai ser preenchida no modal de cadastro de vacinas.
   * @param _vaccine Modelo da vacina com nome e id do millenium.
   */
  private initiateVaccineSelected(_vaccine: VaccineModel) {
    this.vaccineSelected = new VaccineModel();
    this.vaccineSelected.millenniumId = _vaccine.id;
    this.vaccineSelected.name = _vaccine.name;
    this.vaccineSelected.id = 0;
  }

  /**
   * Metodo responsavel por buscar do serviço a lista de vacinas.
   */
  private getVaccines(): void {
    this._vaccinesService.getAllVaccinesMillenium()
      .subscribe((result: Array<VaccineModel>) => {
        this.listVaccine = result;
      }, error => { });
  }

  /**
   * Método responsável por remover a vacina selecionada.
   * @param schemeIndex Index do esquema.
   * @param vaccineIndex Index da vacina.
   */
  public removeVaccine(scheme: SchemeModel, vaccineIndex: number): void {
    scheme.vaccineIds.splice(vaccineIndex, 1);
    if (scheme.vaccines.length > 1) {
      scheme.vaccines.splice(vaccineIndex, 1);
    } else {
      scheme.vaccines[vaccineIndex].name = '';
      scheme.vaccines[vaccineIndex].id = 0;
      scheme.vaccines[vaccineIndex].blockVaccine = false;
    }
    this.validAddVaccineField(scheme);
  }

  /**
   * Método responsável por adicionar um novo campo de vacina.
   * @param schemeIndex Index do esquema.
   */
  public newVaccineField(scheme: SchemeModel) {
    if (this.validAddVaccineField(scheme)) {
      const vaccine = new VaccineListTypeAhead();
      scheme.vaccines.push(vaccine);
    }
  }

  /**
   * Método responsável por validar se vai ser possível adicionar um novo campo de vacina.
   * @param schemeIndex Index do esquema.
   */
  public validAddVaccineField(scheme: SchemeModel) {
    const valid = scheme.vaccines[scheme.vaccines.length - 1].name !== '';
    scheme['addNewVaccine'] = valid;
    return valid;
  }

  /**
   * Método responsável por validar a lista de typeahead. Verificar se não está preenchida ou se existe algum inválido.
   * @param scheme Modelo de esquema.
   * @param error Modelo de erro.
   */
  private validateVaccinesList(scheme: SchemeModel, error: SchemeErrorModel): SchemeErrorModel {
    scheme.vaccines.forEach((vac: VaccineListTypeAhead) => {
      error.vaccineIds.push(vac.name === '' ? true : false);
    });
    return error;
  }

  /**
   * Método reponsável por configurar os títulos, e botão do modal.
   */
  private configureVaccineModal(vaccineIndex: number): void {
    const modalConfig = new ModalAlertModel();
    modalConfig.title = 'Vacina não configurada';
    modalConfig.text = 'Configure a nova vacina para prosseguir';
    modalConfig.button = 'Ok';
    modalConfig.buttonAction = () => {
      this._modalAlertService.closeModal();
      this.showVaccineModal[vaccineIndex] = true;
    };
    this._modalAlertService.setModalAlertConfig(modalConfig);
  }

  /**
   * Método responsável por receber o boolean quando o modal for fechado.
   * @param response output de modal de vacina [closed, sucesso]
   */
  public receiveVaccineClose(response: any, scheme: SchemeModel, vaccineIndex: number) {
    this.showVaccineModal[vaccineIndex] = response[0];
    if (response[1]) {
      this.selectVaccine(this.vaccineSelected, scheme, vaccineIndex);
    }
  }

  /**
   * Método responsável por limpar o campo de esquema necessário
   * caso o calendário for infantil.
   */
  private clearField() {
    this.schemes.forEach((scheme: SchemeModel) => {
      if (this._calendarType === CalendarTypeEnum.Infantil) {
        scheme.isNotRequiredIfPreviouslyTaken = null;
      }
      scheme.months = null;
      scheme.years = null;
      scheme.minimumMonthAge = null;
      scheme.minimumYearAge = null;
      scheme.maximumMonthAge = null;
      scheme.maximumYearAge = null;
      scheme.minimalMonthsAgeForReinforcement = null;
      scheme.minimalYearsAgeForReinforcement = null;
    });
  }

  /**
   * Método responsável por verificar se a propriedade é nula, e retornar true ou false.
   * Pode ser enviado 2 propriedades e verificar se as duas são nulas.
   * @param prop1 propriedade 1.
   * @param prop2 propriedade 2 opcional.
   */
  private verifyNull(prop1: any, prop2?: any): boolean {
    if (prop1 && prop2) {
      return prop1 == null && prop2 == null;
    } else {
      return prop1 == null;
    }
  }

  /**
   * Método responsável por validar idade a idade de calendário.
   * Calendário Infantil: idade deve ser < 19.
   * Calendário Adulto: idade deve ser >= 19
   * @param age idade digitada.
   * @param schemeIndex índice do esquema para atrelar ao erro.
   * @param errorProperty propriedade de erro.
   */
  public validateAge(age: number, schemeIndex: number, errorProperty: string) {
    age = age ? age : 0;
    if (this._calendarType === CalendarTypeEnum.Adulto) {
      this.errorScheme[schemeIndex][errorProperty] = age < 19 ? true : false;
    } else if (this._calendarType === CalendarTypeEnum.Infantil) {
      this.errorScheme[schemeIndex][errorProperty] = age >= 19 ? true : false;
    }
  }

  /**
   * Método responsável por configurar o modal de alerta para vacinas duplicadas no esquema.
   */
  private configureDuplicatedVaccineModal(): void {
    const modalConfig = new ModalAlertModel();
    modalConfig.title = 'Alerta';
    modalConfig.text = 'Vacina já selecionada. Não é possível selecionar a mesma vacina.';
    modalConfig.button = 'Ok';
    modalConfig.buttonAction = () => {
      this._modalAlertService.closeModal();
    };
    this._modalAlertService.setModalAlertConfig(modalConfig);
  }

  public checkValue(prop: any) {
    return (prop === null || prop === '' || prop === undefined) ? false : true;
  }
}
