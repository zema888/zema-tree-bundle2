import {Component, OnDestroy, OnInit} from '@angular/core';
import {Node} from '../model/node';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {Database} from '../service/database.service';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Observable} from 'rxjs/index';
import {Subscription} from 'rxjs';
import {TreeService} from '../service/tree.service';


@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(
    public dataService: Database,
    public treeService: TreeService
  ) {
  }

  ngOnInit() {
    this.subscriptions.push(this.dataService.dataChange$.subscribe(data => {
      this.treeService.dataSource.data = data;
    }));
  }

  /** Load more nodes from data source */
  loadMore(node: Node) {
    this.dataService.loadMore(node);
  }

  loadChildren(node: Node) {
    this.dataService.loadMore(node);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
