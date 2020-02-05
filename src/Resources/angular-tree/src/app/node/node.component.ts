import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Node} from '../model/node';
import {Database} from '../service/database.service';
import {Subscription} from 'rxjs';
import {WindowRefService} from '../service/window-ref.service';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit, OnDestroy {
  @Input() node: Node;
  @Input() hideMenu: boolean;
  public edited = false;

  private _window: any;
  private subscriptions: Subscription[] = [];

  constructor(
    public dataService: Database,
    private windowRef: WindowRefService
  ) {
    this._window = windowRef.nativeWindow;
  }

  ngOnInit() {
    this.subscriptions.push(this.dataService.statusChange$.subscribe((statuses: string[]) => {
      if (this.edited && statuses[1] === 'tree') {
        this.edited = false;
      }
    }));
  }

  public finishMove(type: string) {
    this.dataService.finishMove(this.node, type);
  }

  public move() {
    this.dataService.moveNode(this.node);
    this.edited = true;
  }

  public select(node) {
      if (typeof this._window.selectModeHundler === 'function') {
          this._window.selectModeHundler(node.id);
      }
  }

  public edit() {
    if (this.dataService.edit.includes('?')) {
      const pregArr = /([^?]+)([?].*)/.exec(this.dataService.edit);
      if (pregArr[1] && pregArr[2]) {
        this._window.location.href = pregArr[1] + '/' + this.node.id + '/edit' + pregArr[2];
      }
    } else {
      this._window.location.href = this.dataService.edit + '/' + this.node.id + '/edit';
    }
  }

  public site() {
    const localPath = '/' + this.node.path;
    const path = (this.node.path !== '/' ? this.dataService.siteHost : '') + localPath.replace('//', '/');
    this._window.open(path, '_blank');
  }

  public toogleActive() {
    this.dataService.toogleActive(this.node);
  }

  public delete() {
    this.dataService.delete(this.node);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

}
