export class TooltipModel {
    showTooltip: boolean;
    textTooltip: string;
    positionX: string;
    positionY: string;

    constructor() {
        this.showTooltip = false;
        this.textTooltip = '';
        this.positionX = '0px';
        this.positionY = '0px';
    }
}