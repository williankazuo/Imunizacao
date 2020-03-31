export class FinalizationModel {
    title: string;
    text?: string;
    successImg: boolean;
    buttonName1?: string;
    buttonName2?: string;
    actionbtn1?: any;
    actionbtn2?: any;

    constructor() {
        this.title = '';
        this.text = '';
        this.successImg = false;
        this.buttonName1 = '';
        this.buttonName2 = '';
    }
}