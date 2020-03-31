export class OptionModel {
    value: string;
    name: string;
    action: any;

    constructor(value: string, name: string, action?: any) {
        this.value = value;
        this.name = name;
        this.action = action;
    }
}
