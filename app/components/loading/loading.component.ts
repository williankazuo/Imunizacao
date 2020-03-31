import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/@core/services/loading/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  public showLoading = false;

  constructor(
    private _loadingService: LoadingService
  ) { }

  ngOnInit() {
    this._loadingService.showLoading.subscribe(data => this.showLoading = data);
  }

}
