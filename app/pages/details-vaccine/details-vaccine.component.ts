import { Component, OnInit, OnDestroy } from '@angular/core';
import { VaccineModel } from 'src/app/@core/models/vaccines/vaccines.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { VaccineService } from 'src/app/@core/services/vaccines/vaccine.service';
import { HttpResponseEnum } from 'src/app/@core/enums/httpResponse/httpResponse.enum';
import { TooltipService } from 'src/app/@core/services/tooltip/tooltip.service';
import { TooltipEnum } from 'src/app/@core/enums/tooltip/tooltip.enum';
import { OptionModel } from 'src/app/@core/models/select/option.model';
import { ModalAlertModel } from 'src/app/@core/models/modal/modal-alert.model';
import { ModalAlertService } from 'src/app/@core/services/modal/modal-alert.service';
import { ToastService } from 'src/app/@core/services/toast/toast.service';
import { ToastModel } from 'src/app/@core/models/toast/toast.model';

@Component({
  selector: 'app-details-vaccine',
  templateUrl: './details-vaccine.component.html',
  styleUrls: ['./details-vaccine.component.scss']
})
export class DetailsVaccineComponent implements OnInit, OnDestroy {

  public vaccine: VaccineModel;
  private id: number;
  private routerSub: any;

  public options = new Array<OptionModel>(
    new OptionModel('Editar', 'Editar', () => { this.editVaccine(); }),
    new OptionModel('Excluir', 'Excluir', () => { this.deleteVaccine(); })
  );
  public vaccineIdSelected: number = 0;

  /** Tooltip */
  public tooltipLengthCharacter = TooltipEnum;

  /** Toast */
  private configToast: ToastModel = new ToastModel();

  constructor(
    private _route: Router,
    private _router: ActivatedRoute,
    private _tooltipService: TooltipService,
    private _vaccineService: VaccineService,
    private _toastService: ToastService,
    private _modalAlertService: ModalAlertService

  ) { }

  ngOnInit() {
    this.routerSub = this._router.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    this.vaccine = new VaccineModel();
    this.getDetailsVaccine(this.id);
  }

  /**
   * getDetailsPathologies() metodo responsavel por buscar o detalhe de uma patologia especifica
   * @param {number} _id id da patologia
   */
  private getDetailsVaccine(_id: number): void {
    this._vaccineService.getVaccinesById(_id)
      .subscribe((result: VaccineModel) => {
        this.vaccine = result;
      }, error => {
        if (error.status === HttpResponseEnum.Not_Found) {
          this._route.navigate(['/404']);
        }
      });
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
    this._route.navigate([`editar-vacina/${this.id}`]);
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
    this._vaccineService.deleteVaccine(this.id).subscribe(response => {
      this._route.navigate(['lista-vacinas']);

      this._modalAlertService.closeModal();

      this.configToast.showToast = true;
      this.configToast.textToast = 'Vacina excluída com sucesso';
      this._toastService.changeToast(this.configToast);
    }, error => {
      this._modalAlertService.closeModal();

      this.configToast.showToast = true;
      this.configToast.textToast = 'Não foi possível excluir a vacina.';
      this._toastService.changeToast(this.configToast);
    });
  }

  /**
   * Metodo do ciclo de vida de um componente Angular
   * chamado sempre que o componenete é substituido ou fechado atraves do navegador
   * Responsavel por finalizar o subscribe de alguns metodos async
   */
  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

}
