import { Component, OnInit } from '@angular/core';

import { PathologiesService } from 'src/app/@core/services/pathologies/pathologies.service';
import { PathologiesListModel, PathologyModel } from 'src/app/@core/models/pathologies/pathologiesList.model';
import { CalendarTypeEnum } from 'src/app/@core/enums/pathologies/CalendarType.enum';
import { OptionModel } from 'src/app/@core/models/select/option.model';
import { ModalAlertService } from 'src/app/@core/services/modal/modal-alert.service';
import { ModalAlertModel } from 'src/app/@core/models/modal/modal-alert.model';
import { Router } from '@angular/router';
import { TooltipService } from 'src/app/@core/services/tooltip/tooltip.service';
import { TooltipEnum } from 'src/app/@core/enums/tooltip/tooltip.enum';
import { ToastModel } from 'src/app/@core/models/toast/toast.model';
import { ToastService } from 'src/app/@core/services/toast/toast.service';
import { NoContentModel } from 'src/app/@core/models/no-content/no-content.model';
import { ExcelService } from 'src/app/@core/services/excel/excel.service';
import { NameDownloadExcel } from 'src/app/@core/consts/excel/excel.const';

@Component({
  selector: 'app-home-list-pathology',
  templateUrl: './home-list-pathology.component.html',
  styleUrls: ['./home-list-pathology.component.scss']
})
export class HomeListPathologyComponent implements OnInit {

  public calendarTypeEnum = CalendarTypeEnum;

  public calendar: PathologiesListModel = new PathologiesListModel();
  public calendarBkp: PathologiesListModel;

  public calendarTypeSelected = CalendarTypeEnum.Infantil;
  public calendarSelected = new Array<PathologyModel>();
  public search: string = '';

  public showNotFound: boolean = false;
  public configNotFound: NoContentModel;

  public options = new Array<OptionModel>(
    new OptionModel('Editar', 'Editar', () => { this.editPathology(); }),
    new OptionModel('Excluir', 'Excluir', () => { this.deletePathology(); })
  );
  public pathologyIdSelected: number = 0;

  /** Tooltip */
  public tooltipLengthCharacter = TooltipEnum;

  /** Toast */
  private configToast: ToastModel = new ToastModel();

  public showMenuMobile: boolean = false;

  constructor(
    private _pathologyService: PathologiesService,
    private _modalAlertService: ModalAlertService,
    private _tooltipService: TooltipService,
    private _toastService: ToastService,
    private _excelService: ExcelService,
    private _router: Router
  ) { }

  /**
   * Quando iniciar listar patologias com o filtro vazio, buscando todas as patologias.
   */
  ngOnInit() {
    this.getCalendar(this.search);
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
   * Método responsável por buscar as patologias separando por calendário adulto ou infantil.
   * @param filter Filtro de busca.
   */
  private getCalendar(filter: string): void {
    this._pathologyService.getPathologiesCalendar(filter).subscribe(response => {
      this.calendar = response;
      if (!this.calendarBkp) {
        this.calendarBkp = JSON.parse(JSON.stringify(response));
      }

      this.updateList(this.calendar.adulto);
      this.updateList(this.calendar.infantil);
      this.selectCalendar(this.calendarTypeSelected, filter);
    }, error => {
      this.showErrorConfig();
    });
  }

  /**
   * Metodo responsavel por criar em cada elemento da lista de vacinas, uma propriedade
   * contendo uma lista de até tres itens de vacinas para ser exibidas em cada elemento no layout
   * @param {Array<VaccineModel>} vaccine Lista de vacinas
   */
  private updateList(vaccine: Array<PathologyModel>) {
    vaccine.forEach((item: PathologyModel) => {
      item['showNameVaccine'] = [];
      item['showNameVaccine'] = this.getTwoItemsFromList(item.vaccineNames);
    });
  }

  /**
   * Metodo responsavel por retornar uma lista de até tres itens de contra vacinas
   * e vacinas não concomitantes
   * @param {Array<string} listElements Lista de vacinas
   */
  public getTwoItemsFromList(listElements: Array<string>): Array<string> {
    const newList: Array<string> = [];

    listElements.every((value: string, index: number) => {
      if (index <= 2) {
        newList.push(value);
        return true;
      }
      return false;
    });
    return newList;
  }

  /**
   * Método responsável por selecionar o tipo de calendário, e escolher a lista para mostrar na tela.
   * @param type Tipo de calendário, infantil ou adulto.
   */
  public selectCalendar(type: CalendarTypeEnum, textFilter?: string): void {
    // verificação para a tratativa da mensagem. Por ser parametro opcional, dependendo de onde for chamado
    // este valor pode ser indefinido, e necessita ser tratado.
    if (!textFilter) {
      textFilter = this.search ? this.search : '';
    }

    this.calendarTypeSelected = type;
    this.calendarSelected = this.calendarTypeSelected === CalendarTypeEnum.Infantil ? this.calendar.infantil : this.calendar.adulto;
    this.showNotFound = this.calendarSelected.length < 1 ? true : false;

    if (this.calendarTypeSelected === CalendarTypeEnum.Infantil) {
      (this.calendarBkp.infantil.length > 0) && textFilter.length > 0 && this.calendarSelected.length < 1 ?
        this.showNotFoundConfig() : this.showFolderConfig();
    } else {
      (this.calendarBkp.adulto.length > 0) && textFilter.length > 0 && this.calendarSelected.length < 1 ?
        this.showNotFoundConfig() : this.showFolderConfig();
    }

  }

  /**
   * Metodo responsavel por setar as configurações para nenhuma vacina no sistema
   */
  private showFolderConfig(): void {
    this.configNotFound = new NoContentModel();
    this.configNotFound.showImageFolder = true;
    this.configNotFound.text = 'Ainda não existem patologias cadastradas';
    this.configNotFound.info = '';
  }

  /**
   * Metodo responsavel por setar as configurações para nenhum resultado de busca
   */
  private showNotFoundConfig(): void {
    this.configNotFound = new NoContentModel();
    this.configNotFound.showImageNotFound = true;
    this.configNotFound.text = 'Sem resultados de busca';
    this.configNotFound.info = '';
  }

  /**
   * Metodo responsavel por setar as configurações para quando ocorrer um erro na busca das vacina
   */
  private showErrorConfig(): void {
    this.configNotFound = new NoContentModel();
    this.configNotFound.showImageNotFound = true;
    this.configNotFound.text = 'Tivemos um problema para buscar as patologias';
    this.configNotFound.info = 'Tente novamente mais tarde';
    this.showNotFound = true;
  }

  /**
   * Método responsável por filtrar as patologias de acordo com o valor da busca.
   */
  public filterPathologies(): void {
    this.getCalendar(this.search);
  }

  /**
   * Metodo responsavel por realizar a exportação do excel de acordo com a situação atual da lista de patologias.
   * A exportação será feita de acordo com os elementos que foram filtrados e o tipo de calendário.
   */
  public exportExcel(): void {
    this._excelService.pathologiesExportExcel(this.calendarSelected, this.calendarTypeSelected)
      .subscribe((excel: any) => {
        this._excelService.downloadExcel(excel, NameDownloadExcel.pathologie);
      }, (error: any) => {
        this.configToast.showToast = true;
        this.configToast.textToast = 'Náo foi possível gerar o excel.';
        this._toastService.changeToast(this.configToast);
      });
  }

  /**
   * Método ativado quando algum botão das opções do menu de 3 pontos for clicado.
   * * A ação do item, está na model preenchida anteriormente.
   * @param item Item que foi clicado.
   * @param pathologyId id da patologia que o menu foi selecionado.
   */
  public receiveSelected(item: OptionModel, pathologyId: number) {
    this.pathologyIdSelected = pathologyId;
    item.action();
  }

  /**
   * Método responsável por redirecionar o usuário para a tela de edição de patologia.
   * Ação realizada quando o item de editar for clicado.
   */
  private editPathology(): void {
    this._router.navigate([`editar-patologia/${this.pathologyIdSelected}`]);
  }

  /**
   * Método repsonsável por abrir o modal de confirmação para deletar uma patologia.
   * Ação realizada quando o item de excluir for clicado.
   */
  private deletePathology(): void {
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
    modalConfig.buttonAction = () => { this.confirmDelete() };
    this._modalAlertService.setModalAlertConfig(modalConfig);
  }

  /**
   * Método repsonsável por excluir a patologia quando o usuário confirmar a exclusão no modal de alerta.
   */
  private confirmDelete(): void {
    this._pathologyService.deletePathology(this.pathologyIdSelected).subscribe(response => {
      this._modalAlertService.closeModal();
      this.getCalendar(this.search);

      this.configToast.showToast = true;
      this.configToast.textToast = 'Patologia excluída com sucesso.';
      this._toastService.changeToast(this.configToast);
    }, error => {
      this._modalAlertService.closeModal();

      this.configToast.showToast = true;
      this.configToast.textToast = 'Não foi possível excluir a patologia.';
      this._toastService.changeToast(this.configToast);
    })
  }

}
