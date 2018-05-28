import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as _ from 'lodash';
import { El } from './el';
import { Element } from './element';

@Injectable()
export class ElService {
  static host: string;
  static edit: string;

  constructor(public http: Http) { }

  getEls(root: number): Promise<Element[]> {
    const host = ElService.host;
    return this.http.post(host + 'get_node&id=' + root, []).map(res => {
      return _.map(res.json(), el => {
        return new Element(this, el);
      });
    }).toPromise();
  }

  deleteEl(id: number): Promise<boolean> {
    const host = ElService.host;
    return this.http.post(host + 'delete_node&id=' + id, []).map(res => {
      return res.ok;
    }).toPromise();
  }

  moveEl(id: number, target: number, source: number, sibling: number): Promise<boolean> {
    const host = ElService.host;
    if (id > 0 && target > 0) {
      console.log(id, target, source, sibling);
      return this.http.post(host + 'move_node', {
        id: id, target: target, source: source, sibling: sibling
      }).map(res => {
        return res.ok;
      }).toPromise();
    }
    return null;
  }

}
