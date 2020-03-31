import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { OptionModel } from 'src/app/@core/models/select/option.model';
import { PathologyErrorModel } from 'src/app/@core/models/pathologies/pathologesError.model';
import { PathologiesModel } from 'src/app/@core/models/pathologies/pathologies.model';
import { CalendarTypeEnum } from 'src/app/@core/enums/pathologies/CalendarType.enum';
import { VaccinationScheduleService } from 'src/app/@core/services/vaccination-schedule/vaccination-schedule.service';


@Component({
  selector: 'app-crud-pathology',
  templateUrl: './crud-pathology.component.html',
  styleUrls: ['./crud-pathology.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrudPathologyComponent implements OnInit, OnDestroy {

  /** Propriedade para controlar a edição de patologia. Usada na entrada de dados do componente de single-select */
  @Input() editPathology: boolean;

  @Input() pathology = new PathologiesModel();

  @Output() valid = new EventEmitter();

  public errorPathology = new PathologyErrorModel();
  private subscription: any;
  public options = new Array<OptionModel>(
    new OptionModel(CalendarTypeEnum.Infantil, 'Infantil'), new OptionModel(CalendarTypeEnum.Adulto, 'Adulto')
  );

  constructor(
    private _vaccinationScheduleService: VaccinationScheduleService
  ) { }

  ngOnInit() {
    this.subscription = this._vaccinationScheduleService.buttonRegister$.subscribe(data => this.validatePathology());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Método responsável por receber a opção selecionada do select.
   * @param option Opção recebida do componente de select.
   */
  public receiveOption(option: OptionModel): void {
    this.pathology.pathologyCalendarType = option.value;
  }

  /**
   * Método reponsável por validar os campos da patologia.
   * E emitir se está valida ou não.
   */
  public validatePathology() {
    this.errorPathology = new PathologyErrorModel();
    this.errorPathology.pathologyName = this.pathology.pathologyName === '' ? true : false;
    this.errorPathology.pathologyCalendarType = this.pathology.pathologyCalendarType === '' ? true : false;

    this.errorPathology = this.countErrors(this.errorPathology);
    const valid = this.errorPathology.countErrors < 1 ? true : false;

    this.valid.emit([valid, this.errorPathology]);
  }

  /**
   * Método responsável por contabilizar os erros. Verifica os parâmetros e verificar quem é 'true'.
   * @param error Modelo de erro de patologia.
   */
  private countErrors(error: PathologyErrorModel): PathologyErrorModel {
    Object.entries(error).forEach(([key, value]) => {
      if (value === true) {
        error.countErrors++;
      }
    });
    return error;
  }

  /**
   * Método responsável por buscar, e retornar a opção que contém o valor da opção passado por input.
   * @param value valor da opção.
   */
  public selectValueSelected(value: string) {
    const option = this.options.find(data => data.value.toLowerCase() === value.toLowerCase());
    return option ? option.name : '';
  }
}
