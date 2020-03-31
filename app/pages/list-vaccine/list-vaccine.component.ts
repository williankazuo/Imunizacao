import { Component, OnInit } from '@angular/core';
import { VaccineService } from 'src/app/@core/services/vaccines/vaccine.service';
import { VaccineModel, NotConcomitanceModel } from 'src/app/@core/models/vaccines/vaccines.model';
import { OptionModel } from 'src/app/@core/models/select/option.model';
import { ModalAlertService } from 'src/app/@core/services/modal/modal-alert.service';
import { ModalAlertModel } from 'src/app/@core/models/modal/modal-alert.model';
import { Router } from '@angular/router';
import { TooltipService } from 'src/app/@core/services/tooltip/tooltip.service';
import { TooltipEnum } from 'src/app/@core/enums/tooltip/tooltip.enum';
import { ToastService } from 'src/app/@core/services/toast/toast.service';
import { ToastModel } from 'src/app/@core/models/toast/toast.model';
import { NoContentModel } from 'src/app/@core/models/no-content/no-content.model';
import { ExcelService } from 'src/app/@core/services/excel/excel.service';
import { NameDownloadExcel } from 'src/app/@core/consts/excel/excel.const';

@Component({
  selector: 'app-list-vaccine',
  templateUrl: './list-vaccine.component.html',
  styleUrls: ['./list-vaccine.component.scss']
})
export class ListVaccineComponent implements OnInit {

  public search: string = '';
  public vaccineList: Array<VaccineModel> = new Array<VaccineModel>();
  public vaccineListBkp: Array<VaccineModel> = new Array<VaccineModel>();

  public showNotFound: boolean = false;
  public configNotFound: NoContentModel;

  public options = new Array<OptionModel>(
    new OptionModel('Editar', 'Editar', () => { this.editVaccine(); }),
    new OptionModel('Excluir', 'Excluir', () => { this.deleteVaccine(); })
  );
  public vaccineIdSelected: number = 0;

  private subscriptionButtonAlert: any;

  /** Tooltip */
  public tooltipLengthCharacter = TooltipEnum;

  /** Toast */
  private configToast: ToastModel = new ToastModel();

  public showMenuMobile: boolean = false;

  constructor(
    private _router: Router,
    private _vaccineService: VaccineService,
    private _modalAlertService: ModalAlertService,
    private _tooltipService: TooltipService,
    private _toastService: ToastService,
    private _excelService: ExcelService
  ) { }

  ngOnInit() {
    this.getListVaccines(this.search);
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
   * Método responsável por buscar a lista de vacinas, e se necessário passar o filtro como parâmetro.
   * O filtro busca-se pelo nome da vacina.
   * @param filter filtro de pesquisa por nome da vacina.
   */
  private getListVaccines(filter: string): void {
    this._vaccineService.getVaccines(filter).subscribe(response => {
      this.vaccineList = response;
      this.updateList(this.vaccineList);
      this.showNotFoundList(filter);
    }, error => {
      this.showErrorConfig();
    });
  }

  /**
   * Metodo responsavel por validar a exibição da pagina de nenhum resultado encontrado,
   * ou ainda não ha vacinas cadastradas
   * @param {string} filter string contendo o texto usado para fazer uma busca
   */
  private showNotFoundList(filter: string): void {
    // validação para exibição da tela de nenhum dado encontrado
    filter.length > 0 ? this.showNotFoundConfig() : this.showFolderConfig();

    this.showNotFound = this.vaccineList.length < 1 ? true : false;
  }

  /**
   * Metodo responsavel por criar em cada elemento da lista de vacinas, uma propriedade
   * contendo uma lista de até dois itens de não concomitantes e contraindicação para ser 
   * exibido em cada elemento no layout
   * @param {Array<VaccineModel>} vaccine Lista de vacinas
   */
  private updateList(vaccine: Array<VaccineModel>) {
    vaccine.forEach((item: VaccineModel) => {
      item['showContraindation'] = [];
      item['showNotConcomitance'] = [];

      item['showContraindication'] = this.getTwoItemsFromList(item.contraIndications);
      item['showNotConcomitance'] = this.getTwoItemsFromList(item.notConcomitanceVaccines);
    });

    this.vaccineListBkp = JSON.parse(JSON.stringify(this.vaccineList));
  }

  /**
   * Metodo responsavel por retornar uma lista de até dois itens de contra indicações
   * e vacinas não concomitantes
   * @param {Array<string | NotConcomitanceModel>} listElements Lista de contraindicações ou 
   * Vacinas não concomitantes
   */
  public getTwoItemsFromList(listElements: Array<string | NotConcomitanceModel>): Array<string | NotConcomitanceModel> {
    const newList: Array<string | NotConcomitanceModel> = [];

    listElements.every((value: string | NotConcomitanceModel, index: number) => {
      if (index <= 1) {
        newList.push(value);
        return true;
      }
      return false;
    });
    return newList;
  }

  /**
   * Metodo responsavel por setar as configurações para nenhuma vacina no sistema
   */
  private showFolderConfig(): void {
    this.configNotFound = new NoContentModel();
    this.configNotFound.showImageFolder = true;
    this.configNotFound.text = 'Ainda não existem vacinas cadastradas';
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
    this.configNotFound.text = 'Tivemos um problema para buscar as vacinas';
    this.configNotFound.info = 'Tente novamente mais tarde';
    this.showNotFound = true;
  }

  /**
   * Metodo responsavel por realizar a exportação do excel de acordo com a situação atual da lista de vacinas.
   * A exportação será feita de acordo com os elementos que foram filtrados.
   */
  public exportExcel(): void {
    this._excelService.vaccinesExportExcel(this.vaccineList)
      .subscribe((excel: any) => {
        this._excelService.downloadExcel(excel, NameDownloadExcel.vaccine);
      }, (error: any) => {
        this.configToast.showToast = true;
        this.configToast.textToast = 'Náo foi possível gerar o excel.';
        this._toastService.changeToast(this.configToast);
      });

  }

  /**
   * Método reponsável por filtrar a listagem de vacinas pelo nome da vacina, e vacinas concomitantes.
   */
  public filterVaccines(): void {
    const newList: Array<VaccineModel> = new Array<VaccineModel>();

    // Verificar se não ha nada para buscar, para atualizar a listagem com seu estado inicial
    if (this.search.length === 0) {
      this.vaccineList = this.vaccineListBkp;

      // validar se a lista está preenchida
      this.showNotFoundList(this.search);

    } else {
      // Caso tenha algo para ser filtrado a lista original será percorrida para atualizar a listagem que exibe no HTML
      this.vaccineListBkp.forEach((vaccine: VaccineModel) => {
        // if para verificar se o texto existe no nome da vacina
        if (vaccine.name.toLowerCase().indexOf(this.search.toLowerCase()) >= 0) {
          newList.push(vaccine);
        } else {
          // Se não encontrar o nome da vacina, ocorre uma busca para verificar se o texto existe nas vacinas não concomitantes
          vaccine.notConcomitanceVaccines.every((notConcomitanceVaccine: NotConcomitanceModel) => {
            if (notConcomitanceVaccine.name.toLowerCase().indexOf(this.search.toLowerCase()) >= 0) {
              newList.push(vaccine);
              return false;
            }
          });
        }
      });

      this.vaccineList = newList;

      // validar se a lista está preenchida
      this.showNotFoundList(this.search);
    }
  }


  /**
   * Método ativado quando algum botão das opções do menu de 3 pontos for clicado.
   * A ação do item, está na model preenchida anteriormente.
   * @param item Item que foi clicado.
   * @param idVaccine id da patologia que o menu foi selecionado.
   */
  public receiveSelected(item: OptionModel, idVaccine: number) {
    this.vaccineIdSelected = idVaccine;
    item.action();
  }

  /**
   * Método responsável por redirecionar o usuário para a tela de edição de vacinas.
   * Ação realizada quando o item de editar for clicado.
   */
  private editVaccine(): void {
    this._router.navigate([`editar-vacina/${this.vaccineIdSelected}`]);
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
    modalConfig.title = 'Excluir vacina?';
    modalConfig.text = 'Tem certeza que deseja excluir a vacina?';
    modalConfig.button = 'Sim';
    modalConfig.buttonAction = () => { this.confirmDelete(); };
    this._modalAlertService.setModalAlertConfig(modalConfig);
  }

  /**
   * Método repsonsável por excluir a vacina quando o usuário confirmar a exclusão no modal de alerta.
   */
  private confirmDelete(): void {
    this._vaccineService.deleteVaccine(this.vaccineIdSelected).subscribe(response => {
      this._modalAlertService.closeModal();
      this.getListVaccines(this.search);

      this.configToast.showToast = true;
      this.configToast.textToast = 'Vacina excluída com sucesso.';
      this._toastService.changeToast(this.configToast);
    }, error => {
      this._modalAlertService.closeModal();
      this.configToast.showToast = true;
      this.configToast.textToast = 'Não foi possível excluir a vacina.';
      this._toastService.changeToast(this.configToast);
    });
  }
}
