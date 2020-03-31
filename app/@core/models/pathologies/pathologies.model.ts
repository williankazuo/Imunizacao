import { SchemeModel } from '../schemes/schemes.model';

export class PathologiesModel {
    id: number;
    pathologyName: string;
    pathologyCalendarType: string;
    schemes: Array<SchemeModel>;

    constructor() {
        this.id = 0;
        this.pathologyName = '';
        this.pathologyCalendarType = '';
        this.schemes = new Array<SchemeModel>();
    }
}