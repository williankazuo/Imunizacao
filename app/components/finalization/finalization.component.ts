import { Component, OnInit, Input } from '@angular/core';
import { FinalizationModel } from 'src/app/@core/models/finalization/finalization.model';

@Component({
  selector: 'app-finalization',
  templateUrl: './finalization.component.html',
  styleUrls: ['./finalization.component.scss']
})
export class FinalizationComponent implements OnInit {

  @Input() options: FinalizationModel = new FinalizationModel();

  constructor() { }

  ngOnInit() { }

}
