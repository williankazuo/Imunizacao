import { DoseModel } from '../schemes/schemes.model';

export class PathologiesDetails {
    doses: Array<DoseModel>;
    intervalDoses: boolean;
    countDoses: number;

    constructor() {
        this.doses = new Array<DoseModel>();
        this.intervalDoses = false;
        this.countDoses = 0;
    }
}