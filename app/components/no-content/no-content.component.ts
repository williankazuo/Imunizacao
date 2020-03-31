import { Component, OnInit, Input } from '@angular/core';
import { NoContentModel } from 'src/app/@core/models/no-content/no-content.model';

@Component({
  selector: 'app-no-content',
  templateUrl: './no-content.component.html',
  styleUrls: ['./no-content.component.scss']
})
export class NoContentComponent implements OnInit {

  @Input() noContentConfig: NoContentModel = new NoContentModel();

  constructor() { }

  ngOnInit() { }

}
