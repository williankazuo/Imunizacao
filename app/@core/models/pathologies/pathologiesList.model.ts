export class PathologiesListModel {
    infantil: Array<PathologyModel>;
    adulto: Array<PathologyModel>;

    constructor() {
        this.infantil = new Array<PathologyModel>();
        this.adulto = new Array<PathologyModel>();
    }
}

export class PathologyModel {
    id: number;
    name: string;
    vaccineNames: Array<string>;
    vaccinationScheduleQuantity: number;

    constructor() {
        this.id = 0;
        this.name = '';
        this.vaccineNames = new Array<string>();
        this.vaccinationScheduleQuantity = 0;
    }
}
