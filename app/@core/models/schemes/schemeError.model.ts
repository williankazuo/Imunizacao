export class SchemeErrorModel {
    countErrors: number;
    vaccineIds: Array<boolean>;
    gender: boolean;
    isNotRequiredIfPreviouslyTaken: boolean;
    months: boolean;
    years: boolean;
    invalidYear: boolean;
    minimumMonthAge: boolean;
    invalidMinimumYearAge: boolean;
    minimumYearAge: boolean;
    maximumMonthAge: boolean;
    invalidMinimumAge: boolean;
    invalidMaximumYearAge: boolean;
    maximumYearAge: boolean;
    invalidMaximumAge: boolean;
    doseNumberPrimary: boolean;
    doseQuantityPrimary: boolean;
    invalidDoseQuantityPrimary: boolean;
    doseNumber: boolean;
    differentIntervalPrimary: boolean;
    dosesPrimary: Array<DoseErrorModel>;
    doseEqualQuantityMonthsPrimary: boolean;
    doseEqualQuantityYearsPrimary: boolean;
    reinforcementDose: boolean;
    isRecurrent: boolean;
    minimalMonthsIntervalForReinforcement: boolean;
    minimalYearsIntervalForReinforcement: boolean;
    invalidMinimalYearsIntervalForReinforcement: boolean;
    minimalMonthsAgeForReinforcement: boolean;
    minimalYearsAgeForReinforcement: boolean;
    invalidMinimalAgeForReinforcement: boolean;
    invalidMinimalYearsAgeForReinforcement: boolean;
    doseNumberReinforcement: boolean;
    doseQuantityReinforcement: boolean;
    invalidDoseQuantityReinforcement: boolean;
    differentIntervalReinforcement: boolean;
    dosesReinforcement: Array<DoseErrorModel>;
    doseEqualQuantityMonthsReinforcement: boolean;
    doseEqualQuantityYearsReinforcement: boolean;

    constructor() {
        this.countErrors = 0;
        this.vaccineIds = new Array<boolean>();
        this.gender = false;
        this.isNotRequiredIfPreviouslyTaken = false;
        this.months = false;
        this.years = false;
        this.invalidYear = false;
        this.minimumMonthAge = false;
        this.invalidMinimumYearAge = false;
        this.minimumYearAge = false;
        this.maximumMonthAge = false;
        this.invalidMinimumAge = false;
        this.invalidMaximumYearAge = false;
        this.maximumYearAge = false;
        this.invalidMaximumAge = false;
        this.doseNumberPrimary = false;
        this.doseQuantityPrimary = false;
        this.invalidDoseQuantityPrimary = false;
        this.doseNumber = false;
        this.differentIntervalPrimary = false;
        this.dosesPrimary = new Array<DoseErrorModel>();
        this.doseEqualQuantityMonthsPrimary = false;
        this.doseEqualQuantityYearsPrimary = false;
        this.reinforcementDose = false;
        this.isRecurrent = false;
        this.minimalMonthsIntervalForReinforcement = false;
        this.minimalYearsIntervalForReinforcement = false;
        this.invalidMinimalYearsIntervalForReinforcement = false;
        this.minimalMonthsAgeForReinforcement = false;
        this.minimalYearsAgeForReinforcement = false;
        this.invalidMinimalAgeForReinforcement = false;
        this.invalidMinimalYearsAgeForReinforcement = false;
        this.doseNumberReinforcement = false;
        this.doseQuantityReinforcement = false;
        this.invalidDoseQuantityReinforcement = false;
        this.differentIntervalReinforcement = false;
        this.dosesReinforcement = new Array<DoseErrorModel>();
        this.doseEqualQuantityMonthsReinforcement = false;
        this.doseEqualQuantityYearsReinforcement = false;
    }
}

export class DoseErrorModel {
    intervalToNextInMonths: boolean;
    intervalToNextInYears: boolean;

    constructor() {
        this.intervalToNextInMonths = false;
        this.intervalToNextInYears = false;
    }
}