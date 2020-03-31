export class ModalAlertModel {
    title: string;
    text: string;
    button: string;
    buttonAction: any;
    buttonEmit: any;

    constructor() {
        this.title = '';
        this.text = '';
        this.button = '';
    }
}