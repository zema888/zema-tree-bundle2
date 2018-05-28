import {Component, OnInit, Input} from '@angular/core';
import * as _ from 'lodash';
import {El} from './el';
import {DragulaService} from 'ng2-dragula/ng2-dragula';
import {Element} from './element';
import {ElService} from './el.service';
import {WindowRefService} from "../window-ref.service";

@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.css'],
  providers: [ ElService, WindowRefService ]
})
export class ElementComponent implements OnInit {
  @Input() root: number;
  public list: Element[];
  public last_move_index: string;
  private _window: any;

  constructor(private elService: ElService, private dragulaService: DragulaService, windowRef: WindowRefService) {
    this._window = windowRef.nativeWindow;

    dragulaService.drop.subscribe((value) => {
      console.log('drop', this.root, value);
      this.onDrop(value.slice(1));
    });
    dragulaService.drag.subscribe((value) => {
      console.log('drag', this.root, value);
    });
    dragulaService.dragend.subscribe((value) => {
      console.log('dragend', this.root, value);
    });
    dragulaService.over.subscribe((value) => {
      console.log('over', this.root, value);
    });
    dragulaService.out.subscribe((value) => {
      console.log('out', this.root, value);
    });
  }

  private onDrop(args) {
    const move_index = args.join();
    const [el, target, source, sibling] = args.map(e => {
      if (e) {
        return e.getAttribute('id').replace(/^([^_]+_)/g, '');
      } else {
        return null;
      }
    });
    if (move_index == this.last_move_index) {
      return false;
    }
    this.last_move_index = move_index;
    console.log(typeof args[0]);
    if (target == source && target == this.root) {
      console.log('папка', this.root, 'сортировка элемента', el);
      if (sibling == null) {
        console.log('новая позиция конец');
      } else {
        console.log('новая позиция перед', sibling);
      }
      this.elService.moveEl(el, target, source, sibling).then(success => {
        if (success) {
          this.getData(function () {
            if (args[1].hasChildNodes() && args[1].isEqualNode(args[0].parentNode)) {
              args[1].removeChild(args[0]);
            }
          });
        }
      });
    } else if (source == this.root) {
      console.log('папка', this.root, 'удаление элемента', el);
      _.reject(this.list, {id: el});
    } else if (target == this.root) {
      console.log('папка', this.root, 'добавление элемента', el);
      this.elService.moveEl(el, target, source, sibling).then(success => {
        if (success) {
          this.getData(function () {
            if (args[1].hasChildNodes() && args[1].isEqualNode(args[0].parentNode)) {
              args[1].removeChild(args[0]);
            }
          });
        }
      });
      if (sibling == null) {
        console.log('новая позиция конец');
      } else {
        console.log('новая позиция перед', sibling);
      }
    }
  }


  ngOnInit() {
    this.getData();
  }

  private getData(callback = null): void {
    this.elService.getEls(this.root).then( list => {
      this.list = list;
      if (this.root == 0) {
        this.list.forEach(el => {
          el.openChildren(true);
        });
      }
      if (callback) {
        callback();
      }
    });
  }

  public editElement(el: Element): void {
    this._window.start_field_dialog_form_edit_tree(ElService.edit + '/' + el.id + '/edit');
    this._window.returnEdit = (id, title) => {
      el.id = id;
      el.title = title;
    }
  }

  public createChild(el: Element): void {
    this._window.start_field_dialog_form_edit_tree(ElService.edit + 'create');
    this._window.returnEdit = (id, title) => {
      el.show_children = false;
      this.elService.moveEl(id, el.id, null, null).then(res => {
        if (res) {
          el.openChildren(true);
        }
      });
    }
  }

  public deleteEl(el: Element): void {
    el.loader = true;
    this.elService.deleteEl(el.id).then(res => {
      if (res) {
        this.list = _.reject(this.list, {id: el.id});
      }
      el.loader = false;
    });
  }
}
