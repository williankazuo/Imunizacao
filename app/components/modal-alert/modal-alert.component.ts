import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalAlertModel } from 'src/app/@core/models/modal/modal-alert.model';
import { ModalAlertService } from 'src/app/@core/services/modal/modal-alert.service';

@Component({
  selector: 'app-modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.scss']
})
export class ModalAlertComponent implements OnInit, OnDestroy {
  public modalConfig: ModalAlertModel = new ModalAlertModel();
  public open = false;

  private subscriptionOpen: any;
  private subscriptionConfig: any;

  constructor(
    private _modalAlertService: ModalAlertService
  ) { }

  /**
   * Emitters para abrir o modal e configurar os títulos e botão.
   */
  ngOnInit() {
    this.subscriptionOpen = this._modalAlertService.openEmitter.subscribe(data => this.open = data);
    this.subscriptionConfig = this._modalAlertService.configEmitter.subscribe(data => this.modalConfig = data);
  }

  ngOnDestroy() {
    this.subscriptionOpen.unsubscribe();
    this.subscriptionConfig.unsubscribe();
  }

  /**
   * Método reponsável por executar a função que foi enviada por configuração.
   */
  public buttonAction(): void {
    if (this.modalConfig.buttonAction) {
      this.modalConfig.buttonAction();
    } else if (this.modalConfig.buttonEmit) {
      this.modalConfig.buttonEmit.emit(true);
    }
  }

  /**
   * Método responsável por fechar o modal. E emitir falso para o botão que não foi clicado.
   */
  public closeModal(): void {
    this.open = false;
    if (this.modalConfig.buttonEmit) {
      this.modalConfig.buttonEmit.emit(false);
    }
  }
}
