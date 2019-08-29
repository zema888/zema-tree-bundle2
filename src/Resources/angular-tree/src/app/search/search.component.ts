import {Component, OnDestroy, OnInit} from '@angular/core';
import {Database} from '../service/database.service';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Node} from '../model/node';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  public query: FormControl;
  public nodes: Node[];
  private subscriptions: Subscription[] = [];

  constructor(public dataService: Database) {
  }

  ngOnInit() {
    this.query = new FormControl('');
    this.subscriptions.push(this.dataService.searchResult$.subscribe(nodes => {
      this.nodes = nodes;
    }));
  }

  public search(): void {
    this.dataService.search(this.query.value);
  }

  public cancel(): void {
    this.dataService.status = 'tree';
    this.query.setValue('');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
