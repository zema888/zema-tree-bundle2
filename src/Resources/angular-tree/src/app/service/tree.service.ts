import {Injectable} from '@angular/core';
import {Node} from '../model/node';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Observable} from 'rxjs/index';
import {Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TreeService {
  public treeControl: FlatTreeControl<Node>;
  public treeFlattener: MatTreeFlattener<Node, Node>;
  // Flat tree data source
  public dataSource: MatTreeFlatDataSource<Node, Node>;
  public getChildren = (node: Node): Observable<Node[]> => node.childrenChange;
  public transformer = (node: Node, level: number) => {
    return node;
  };
  public getLevel = (node: Node) => node.lvl;
  public isExpandable = (node: Node) => node.hasChildren;
  public hasChild = (_: number, _nodeData: Node) => _nodeData.hasChildren;

  constructor() {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );

    this.treeControl = new FlatTreeControl<Node>(this.getLevel, this.isExpandable);

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }
}
