import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { PathologiesService } from 'src/app/@core/services/pathologies/pathologies.service';
import { PathologiesModel } from 'src/app/@core/models/pathologies/pathologies.model';
import { DoseModel, SchemeModel } from 'src/app/@core/models/schemes/schemes.model';
import { PathologiesDetails } from 'src/app/@core/models/pathologies/pathologiesDetails.model';
import { HttpResponseEnum } from 'src/app/@core/enums/httpResponse/httpResponse.enum';
import { TooltipService } from 'src/app/@core/services/tooltip/tooltip.service';
import { TooltipEnum } from 'src/app/@core/enums/tooltip/tooltip.enum';
import { ToastModel } from 'src/app/@core/models/toast/toast.model';
import { OptionModel } from 'src/app/@core/models/select/option.model';
import { ModalAlertService } from 'src/app/@core/services/modal/modal-alert.service';
import { ToastService } from 'src/app/@core/services/toast/toast.service';
import { ModalAlertModel } from 'src/app/@core/models/modal/modal-alert.model';
import { CalendarTypeEnum } from 'src/app/@core/enums/pathologies/CalendarType.enum';

@Component({
  selector: 'app-details-pathology',
  templateUrl: './details-pathology.component.html',
  styleUrls: ['./details-pathology.component.scss'],
})
export class DetailsPathologyComponent implements OnInit, OnDestroy {

  public pathologies: PathologiesModel;
  private id: number;
  private routerSub: any;

  public options = new Array<OptionModel>(
    new OptionModel('Editar', 'Editar', () => { this.editVaccine(); }),
    new OptionModel('Excluir', 'Excluir', () => { this.deleteVaccine(); })
  );

  public calendarTypeEnum = CalendarTypeEnum;

  public tooltipLengthCharacter = TooltipEnum;

  /** Toast */
  private configToast: ToastModel = new ToastModel();

  constructor(
    private _route: Router,
    private _router: ActivatedRoute,
    private _tooltipService: TooltipService,
    private _pathologiesService: PathologiesService,
    private _toastService: ToastService,
    private _modalAlertService: ModalAlertService
  ) { }

  ngOnInit() {
    this.routerSub = this._router.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    this.pathologies = new PathologiesModel();
    this.getDetailsPathologies(this.id);
  }

  /**
   * Metodo responsavel por chamar o serviço para setar as configurações para exibição ou ocultação do tooltip
   * @param {any} $event Propriedade, contendo o evento de mouseOver. Através do evento, obtem a posição X e Y para posicionar o tooltip
   * acima do elemento em que se passou o mouse.
   * @param {string} tooltipText Texto para aparecer no tooltip
   * @param {boolean} showTooltip Propriedade para exibir ou esconder o tooltip
   * @param {number} numberOfCharacters propriedade para validar quando o tooltip deve ser exibido, de acordo com o tamanho do texto
   */
  public changeTooltip($event: any, tooltipText: string, showTooltip: boolean, numberOfCharacters: number): void {
    this._tooltipService.setTooltipConfig($event, tooltipText, showTooltip, numberOfCharacters);
  }

  /**
   * getDetailsPathologies() metodo responsavel por buscar o detalhe de uma patologia especifica
   * @param {number} _id id da patologia
   */
  private getDetailsPathologies(_id: number): void {
    this._pathologiesService.getPathologiesCalendarById(_id)
      .subscribe((result: PathologiesModel) => {
        this.pathologies = result;
        this.updatePathologies(this.pathologies);
      }, error => {
        if (error.status === HttpResponseEnum.Not_Found) {
          this._route.navigate(['/404']);
        }
      });
  }

  private updatePathologies(pathologies: PathologiesModel): void {
    pathologies.schemes.map((item: SchemeModel) => {
      item['dosePrimary'] = new Array<DoseModel>();
      item['intervalDosePrimary'] = false;
      item['countDosePrimary'] = 0;
      item['doseReinforcement'] = new Array<DoseModel>();
      item['intervalDoseReinforcement'] = false;
      item['countDoseReinforcement'] = 0;
    });
    this.treatDoses(pathologies.schemes);
  }

  /**
   * Método responsavel por tratar os dados de DOSES a serem exibodos na tela para o usuário.
   * @param {Array<SchemeModel>} schemes lista de esquemas
   */
  private treatDoses(schemes: Array<SchemeModel>): void {
    let reinforcement: PathologiesDetails = new PathologiesDetails();
    let primary: PathologiesDetails = new PathologiesDetails();

    schemes.forEach((scheme: SchemeModel) => {
      // separação das doses de reforço e doses primárias
      reinforcement = this.valideIntervalDose(scheme.doses, 'Reinforcement');
      primary = this.valideIntervalDose(scheme.doses, 'Primary');

      // verificar se as doses de reforço são recorrentes
      reinforcement.doses.every((dose: DoseModel) => {
        if(dose.isRecurrent) {
          scheme['isRecurrent'] = true;
          return false;
        }
        return true;
      });

      // adicionando para a lista os valores tratados
      scheme['dosePrimary'] = primary.doses;
      scheme['intervalDosePrimary'] = primary.intervalDoses;
      scheme['countDosePrimary'] = primary.countDoses;
      scheme['doseReinforcement'] = reinforcement.doses;
      scheme['intervalDoseReinforcement'] = reinforcement.intervalDoses;
      scheme['countDoseReinforcement'] = reinforcement.countDoses;
    });

  }

  /**
   * Metodo responsavel por validar a quantidade de doses existentes para um tipo especifico de Dose, seja ela primária ou de reforço.
   * Além disso, valida se existe tempo de intervalo diferente para cada dose (do tipo especifico de Dose em questão)
   *
   * @param {DoseModel} _doses lista de doses de um esquema especifico
   * @param {string} _typeDose tipo de dose
   */
  private valideIntervalDose(_doses: Array<DoseModel>, _typeDose: string): PathologiesDetails {
    let interval = false;
    let countDoses = 0;
    let doses: Array<DoseModel> = new Array<DoseModel>();
    const detailsPathologie: PathologiesDetails = new PathologiesDetails();

    _doses.forEach((doseItem: DoseModel) => {

      if (!interval) {
        for (let j = 0; j < _doses.length; j++) {

          if (doseItem.id !== _doses[j].id
            && doseItem.intervalToNextDose !== _doses[j].intervalToNextDose
            && doseItem.doseType === _typeDose
            && _doses[j].doseType === _typeDose) {
            interval = true;
            break;
          }

        }
      }

      // condição para adicionar na lista que será exibida no html
      if (doseItem.doseType === _typeDose) {
        doses.push(doseItem);
        countDoses++;
      }

    });

    // condição para esquemas que não possuem intervalo de doses tanto para doses de esquemas primários
    // quanto para doses de reforços. Como deverá ser sempre exibido um intervalo para este caso
    // e a lista possue dois itens, um item da mesma, é removido, para exibição no html
    if (!interval && doses.length > 0) {
      doses = new Array<DoseModel>(doses[0]);
    }

    detailsPathologie.intervalDoses = interval;
    detailsPathologie.countDoses = countDoses;
    detailsPathologie.doses = doses;

    return detailsPathologie;
  }


  /**
   * Método ativado quando algum botão das opções do menu de 3 pontos for clicado.
   * A ação do item, está na model preenchida anteriormente.
   * @param item Item que foi clicado.
   */
  public receiveSelected(item: OptionModel) {
    item.action();
  }

  /**
   * Método responsável por redirecionar o usuário para a tela de edição de vacinas.
   * Ação realizada quando o item de editar for clicado.
   */
  private editVaccine(): void {
    this._route.navigate([`editar-patologia/${this.id}`]);
  }


  /**
   * Método repsonsável por abrir o modal de confirmação para deletar uma vacina.
   * Ação realizada quando o item de excluir for clicado.
   */
  private deleteVaccine(): void {
    this.configureModal();
    this._modalAlertService.openModal();
  }

  /**
   * Método reponsável por configurar os títulos, e botão do modal.
   */
  private configureModal(): void {
    const modalConfig = new ModalAlertModel();
    modalConfig.title = 'Excluir patologia?';
    modalConfig.text = 'Tem certeza que deseja excluir a patologia?';
    modalConfig.button = 'Sim';
    modalConfig.buttonAction = () => { this.confirmDelete(); };
    this._modalAlertService.setModalAlertConfig(modalConfig);
  }

  /**
   * Método repsonsável por excluir a patologia quando o usuário confirmar a exclusão no modal de alerta.
   */
  private confirmDelete(): void {
    this._pathologiesService.deletePathology(this.id).subscribe(response => {

      this._modalAlertService.closeModal();

      this._route.navigate(['lista-patologias']);

      this.configToast.showToast = true;
      this.configToast.textToast = 'Patologia excluída com sucesso';
      this._toastService.changeToast(this.configToast);
    }, error => {
      this._modalAlertService.closeModal();

      this.configToast.showToast = true;
      this.configToast.textToast = 'Não foi possível excluir a patologia.';
      this._toastService.changeToast(this.configToast);
    })
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

}
