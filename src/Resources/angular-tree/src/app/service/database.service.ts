import {Injectable} from '@angular/core';
import {Node} from '../model/node';
import {BehaviorSubject, merge, Observable, of, Subject} from 'rxjs/index';
import {NodeTransformer} from '../transformer/node-transformer';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {TreeService} from './tree.service';
import {MatSnackBar} from '@angular/material';


/**
 * A database that only load part of the data initially. After user clicks on the `Load more`
 * button, more data will be loaded.
 */
@Injectable({
  providedIn: 'root'
})
export class Database {
  public host: string;
  public edit: string;
  public siteHost: string;
  public dataChange$: BehaviorSubject<Node[]>;
  public searchResult$: Subject<Node[]>;
  public statusChange$: Subject<string[]>;
  public movedNode: Node;

  constructor(
    public http: HttpClient,
    private treeService: TreeService,
    public snackBar: MatSnackBar
  ) {
    this.dataChange$ = new BehaviorSubject<Node[]>([]);
    this.statusChange$ = new Subject<string[]>();
    this.searchResult$ = new Subject<Node[]>();
    this.status = 'tree';
  }

  private _status: string;

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    if (value !== 'load' && value !== 'move') {
      this.movedNode = null;
    }
    if (this._status === 'search' && value === 'load') {
      this.searchResult$ = null;
    }
    this.statusChange$.next([this._status, value]);
    this._status = value;
  }

  private _rootId: number;

  get rootId(): number {
    return this._rootId;
  }

  set rootId(value: number) {
    this._rootId = value;
    this.getNodeById(this._rootId).subscribe(node => {
      this.dataChange$.next([node]);
    });
  }

  public moveNode(node: Node): void {
    this.movedNode = node;
    this.status = 'move';
  }

  public finishMove(node: Node, type: string): void {
    let target;
    let sibling;
    switch (type) {
      case 'before':
        target = node.parentId;
        sibling = node.id;
        break;
      case 'after':
        target = node.parentId;
        sibling = node.id;
        break;
      case 'into':
        target = node.id;
        sibling = null;
        break;
    }
    const request = {
      id: this.movedNode.id,
      source: this.movedNode.parentId,
      target: target,
      sibling: sibling,
      type: type
    };
    this.status = 'load';
    this.http.post(this.host + 'move_node', request).subscribe((response: any) => {
      if (response.error) {
        this.snackBar.open('Ошибка:  "' + response.error + '"', '', {
          duration: 2000,
        });
        this.status = 'tree';
        return false;
      }
      if (target == this.movedNode.parentId) {
        const subscriber = this.updateNode(target).subscribe(result => {
          this.status = 'tree';
          subscriber.unsubscribe();
        });
      } else {
        const subscriber = merge(
          this.updateNode(target),
          this.updateNode(this.movedNode.parentId)
        ).subscribe(result => {
          this.status = 'tree';
          subscriber.unsubscribe();
        });
      }

    });
  }

  public updateNode(id: number): Observable<boolean> {
    const subject$ = new Subject<boolean>();
    const node = this.searchNode(this.dataChange$.value, id);
    if (node) {
      this.treeService.treeControl.collapse(node);
      node.childrenChange.next([]);
      this.getNodeById(id).subscribe(newNode => {
        node.updateByNewNode(newNode);
        this.loadMore(node);
        subject$.next(true);
        setTimeout(() => {
          if (node.children!.length > 0) {
            this.treeService.treeControl.toggle(node);
          }
        }, 300);
      });
    } else {
      setTimeout(() => {
        subject$.next(true);
      }, 100);
    }
    return subject$;
  }

  public searchNode(nodes: Node[], id: number): Node {
    for (let node of nodes) {
      if (node.id == id) {
        return node;
      }
      const finded = this.searchNode(node.children, id);
      if (finded) {
        return finded;
      }
    }
    return null;
  }

  /** Expand a node whose children are not loaded */
  public loadMore(parent: Node): void {
    let nodes = [];
    if (parent.children!.length === 0) {
      this.http.get(this.host + 'get_nodes&id=' + parent.id).subscribe((response: any) => {
        if (response.error) {
          this.snackBar.open('Ошибка:  "' + response.error + '"', '', {
            duration: 2000,
          });
          return [];
        }
        nodes = NodeTransformer.fromJsonToCollection(response);
        parent.childrenChange.next(nodes);
        this.dataChange$.next(this.dataChange$.value);
      });
    } else {
      this.dataChange$.next(this.dataChange$.value);
    }
  }

  public getNodeById(id: number): Observable<Node> {
    return this.http.get(this.host + 'get_one_node&id=' + id).pipe(
      map<any, Node>(response => {
        if (response.error) {
          this.snackBar.open('Ошибка:  "' + response.error + '"', '', {
            duration: 2000,
          });
          return null;
        }
        return NodeTransformer.fromJsonToModel(response);
      })
    );
  }

  public delete(node: Node): void {
    this.status = 'load';
    this.http.get(this.host + 'delete_node&id=' + node.id)
      .subscribe((response: any) => {
        if (response.error) {
          this.snackBar.open('Ошибка:  "' + response.error + '"', '', {
            duration: 2000,
          });
          return;
        }
        if (response.ok) {
          this.updateNode(node.parentId).subscribe(res => {
            this.snackBar.open('Успешно удалено "' + node.title + '"', '', {
              duration: 2000,
            });
            this.status = 'tree';
          });
        }
      });
  }

  public toogleActive(node: Node): void {
    this.status = 'load';
    this.http.get(this.host + 'toogle_active&id=' + node.id)
      .subscribe((response: any) => {
        if (response.error) {
          this.snackBar.open('Ошибка:  "' + response.error + '"', '', {
            duration: 2000,
          });
          return;
        }
        if (response.ok) {
          this.updateNode(node.id).subscribe(res => {
            this.snackBar.open('Успешно сменён статус "' + node.title + '"', '', {
              duration: 2000,
            });
            this.status = 'tree';
          });
        }
      });
  }

  public search(query: string) {
    this.status = 'load';
    this.http.get(this.host + 'search&query=' + query).subscribe((response: any) => {
      if (response.error) {
        this.snackBar.open('Ошибка:  "' + response.error + '"', '', {
          duration: 2000,
        });
        return [];
      }
      const nodes = response.length > 0 ? NodeTransformer.fromJsonToCollection(response) : [];
      this.searchResult$.next(nodes);
      this.status = 'search';
    });
  }
}
