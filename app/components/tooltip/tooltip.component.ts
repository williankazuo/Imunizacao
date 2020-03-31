import { Component, OnInit } from '@angular/core';
import { TooltipService } from 'src/app/@core/services/tooltip/tooltip.service';
import { TooltipModel } from 'src/app/@core/models/tooltip/tooltip.model';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {

  public configTooltip: TooltipModel = new TooltipModel();

  constructor(
    private _tooltipService: TooltipService
  ) { }

  /**
   * Init com a incrição no serviço para ouvir as modificações de ativação do tooltip
   */
  ngOnInit() {
    this._tooltipService.showTooltip.subscribe((data: TooltipModel) => {
      this.configTooltip = data;
    });
  }

  /**
   * Metodo responsavel por fazer o tooltip aparecer em cima do componente ou elemento que está passando o mouse
   * @param positionX posição X da tela com relação ao plano cartesiano
   * @param positionY posição Y da tela com relação ao plano cartesiano
   */
  public setPositionTooltip(positionX: string, positionY: string): boolean {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
      // tslint:disable-next-line: radix
      tooltip.style.transform = 'translate3d(' + positionX + 'px,' + (parseInt(positionY) - tooltip.offsetHeight) + 'px, 0px)';

      return true;
    }
    return false;
  }

}