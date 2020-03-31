import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TooltipModel } from '../../models/tooltip/tooltip.model';
import { SpacingTooltip } from '../../enums/tooltip/tooltip.enum';

/**
 * Serviço responsavel por controlar a aparição do tooltip pelo sistema.
 */
@Injectable()
export class TooltipService {

    // Criação de propriedades observaveis para 'emitir' as configurações do tooltip
    private showTooltipSource = new BehaviorSubject(new TooltipModel());
    // propriedade para o componente tooltip conseguir se inscrever e 'escutar a mudança'
    public showTooltip = this.showTooltipSource.asObservable();

    public tooltipConfig: TooltipModel = new TooltipModel();

    constructor() { }

    /**
     * Metodo responsavel por setar as propriedades e configurações do tooltip
     * @param {any} $event Propriedade, contendo o evento de mouseOver. Através do evento, obtem a posição X e Y para posicionar o tooltip
     * acima do elemento em que se passou o mouse.
     * @param {string} tooltipText Texto para aparecer no tooltip
     * @param {boolean} showTooltip Propriedade para exibir ou esconder o tooltip
     * @param {number} numberOfCharacters propriedade para validar quando o tooltip deve ser exibido, de acordo com o tamanho do texto
     */
    public setTooltipConfig($event: any, tooltipText: string, showTooltip: boolean, numberOfCharacters: number): void {
        this.tooltipConfig.textTooltip = tooltipText;

        // validação para exibir o tooltip apenas para valores que ultrapasse o container do texto
        tooltipText.length > numberOfCharacters
            ? this.tooltipConfig.showTooltip = showTooltip : this.tooltipConfig.showTooltip = false;

        this.tooltipConfig.positionX = ($event.target.getBoundingClientRect().x - SpacingTooltip.spaceX).toString();
        this.tooltipConfig.positionY = ($event.target.getBoundingClientRect().y - SpacingTooltip.spaceY + window.scrollY).toString();

        this.changeTooltip(this.tooltipConfig);
    }

    /**
     * Metodo responsavel por receber a configuração e repassar para o componente Tooltip
     * @param {TooltipModel} _configTooltip configuração do tooltip
     */
    public changeTooltip(_configTooltip: TooltipModel): void {
        this.showTooltipSource.next(_configTooltip);
    }
}