import {Component, OnInit} from '@angular/core';
import {Database} from '../service/database.service';

@Component({
  selector: 'app-move',
  templateUrl: './move.component.html',
  styleUrls: ['./move.component.scss']
})
export class MoveComponent implements OnInit {

  constructor(public dataService: Database) {
  }

  ngOnInit() {
  }

  cancel() {
    this.dataService.status = 'tree';
  }
}
