import { El} from './el';
import { Http } from '@angular/http';
import { ElService } from './el.service';
import 'rxjs/Rx';
// declare var jquery:any;
// declare var $ :any;

export class Element implements El {
  public id: number;
  public title: string;
  public lft: number;
  public is_child: boolean;
  public children: El[];
  public loader: boolean;
  public active: boolean;
  public items: El[];
  public show_children = false;

  public constructor(protected elService: ElService, data: El) {
      for (let prop in data) {
        this[prop] = data[prop];
      }
      this.loader = false;
      this.active = false;
  }

  public openChildren(force?: boolean): void { console.error('openChildren', this.show_children);
    if (!this.show_children || force) {
      this.elService.getEls(this.id).then(list => {
        this.children = list;
        this.show_children = true;
        this.is_child = this.children.length > 0;
      });
    } else {
      this.show_children = false;
    }
  }
}
