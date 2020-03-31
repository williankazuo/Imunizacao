export class VaccineModel {
    name: string;
    millenniumId: number;
    contraIndications: Array<string>;
    notConcomitanceVaccines: Array<NotConcomitanceModel>;
    notConcomitanceVaccinesId: Array<number>;
    medicalOrderIsRequired: boolean;
    isLiveVirus: boolean;
    observations: string;
    recommendations: string;
    id: number;
    dateCreated: Date;
    userWhoCreated: string;
    dateUpdated: Date;
    userWhoUpdated: string;
    status: number;

    constructor() {
        this.name = '';
        this.millenniumId = 0;
        this.contraIndications = new Array<string>();
        this.notConcomitanceVaccines = new Array<NotConcomitanceModel>();
        this.notConcomitanceVaccinesId = new Array<number>();
        this.medicalOrderIsRequired = null;
        this.isLiveVirus = null;
        this.observations = '';
        this.recommendations = '';
        this.id = 0;
        this.dateCreated = new Date();
        this.userWhoCreated = '';
        this.dateUpdated = new Date();
        this.userWhoUpdated = '';
        this.status = 0;
    }
}

export class VaccineMilleniumModel {
    id: number;
    name: string;

    constructor() {
        this.id = 0;
        this.name = '';
    }
}

export class NotConcomitanceModel {
    id: number;
    name: string;

    constructor() {
        this.id = 0;
        this.name = '';
    }
}

export class NotConcomitanceIdModel {
    id: number;

    constructor() {
        this.id = 0;
    }
}

export class VaccineListTypeAhead {
    id: number;
    name: string;
    activeError: boolean;
    blockVaccine: boolean;
    errorMsg: string;

    constructor() {
        this.id = 0;
        this.name = '';
        this.activeError = false;
        this.blockVaccine = false;
        this.errorMsg = '';
    }

}