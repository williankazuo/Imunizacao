export class PathologyErrorModel {
    countErrors: number;
    pathologyName: boolean;
    pathologyCalendarType: boolean;

    constructor() {
        this.countErrors = 0;
        this.pathologyName = false;
        this.pathologyCalendarType = false;
    }
}