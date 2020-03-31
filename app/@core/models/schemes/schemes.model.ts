import { VaccineListTypeAhead } from '../vaccines/vaccines.model';

export class SchemeModel {
    id: number;
    gender: string;
    isNotRequiredIfPreviouslyTaken: boolean;
    months: number;
    years: number;
    minimumMonthAge: number;
    minimumYearAge: number;
    maximumMonthAge: number;
    maximumYearAge: number;
    doses: Array<DoseModel>;
    observations: string;
    vaccineIds: Array<number>;
    vaccines: Array<VaccineListTypeAhead>;
    minimalMonthsAgeForReinforcement: number;
    minimalYearsAgeForReinforcement: number;
    minimalMonthsIntervalForReinforcement: number;
    minimalYearsIntervalForReinforcement: number;

    constructor() {
        this.id = 0;
        this.gender = '';
        this.isNotRequiredIfPreviouslyTaken = null;
        this.months = null;
        this.years = null;
        this.minimumMonthAge = null;
        this.minimumYearAge = null;
        this.maximumMonthAge = null;
        this.maximumYearAge = null;
        this.doses = new Array<DoseModel>();
        this.observations = '';
        this.vaccineIds = new Array<number>();
        this.vaccines = new Array<VaccineListTypeAhead>();
        this.minimalMonthsAgeForReinforcement = null;
        this.minimalYearsAgeForReinforcement = null;
        this.minimalMonthsIntervalForReinforcement = null;
        this.minimalYearsIntervalForReinforcement = null;
    }
}

export class DoseModel {
    id: number;
    number: number;
    doseType: string;
    intervalToNextInMonths: number;
    isRecurrent: boolean;
    // Campo utilizado apenas no get dos detalhes de patologia.
    intervalToNextDose: number;

    constructor() {
        this.number = null;
        this.doseType = '';
        this.intervalToNextInMonths = null;
        this.isRecurrent = null;
        this.id = 0;
        this.intervalToNextDose = 0;
    }
}

