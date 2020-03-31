import { Component, OnInit } from '@angular/core';

import { ToastService } from 'src/app/@core/services/toast/toast.service';
import { ToastModel } from 'src/app/@core/models/toast/toast.model';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  public configToast: ToastModel = new ToastModel();

  constructor(
    private _toastService: ToastService
  ) { }

  /**
   * Init com a incrição no serviço para ouvir as modificações de ativação do toast
   */
  ngOnInit() {
    this._toastService.showToast.subscribe((data: ToastModel) => {
      this.configToast = data;
      this.showToast(this.configToast);
    });
  }

  /**
   * Metodo responsavel por exibir o toast, criar o timeout de exibição, e fazer com que o mesmo
   * saia da tela no final deste timeout
   * @param _configToast configuração do toast, contendo a configuração de exibição e texto infomativo
   */
  private showToast(_configToast: ToastModel): void {
    if (_configToast.showToast) {
      const elem = document.getElementById('myBar');
      let width = 1;
      const id = setInterval(() => {
        if (width >= 100) {
          this.configToast = new ToastModel();
          clearInterval(id);
        } else {
          width++;
          elem.style.width = width + '%';
        }
      }, 20);
    }
  }

}
