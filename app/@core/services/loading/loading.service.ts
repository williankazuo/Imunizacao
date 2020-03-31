import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class LoadingService {
    private showLoadingSource = new BehaviorSubject(false);
    public showLoading = this.showLoadingSource.asObservable();

    constructor() {

    }

    public changeLoading(show: boolean): void {
        this.showLoadingSource.next(show);
    }
}