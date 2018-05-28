import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as _ from 'lodash';
import {Item} from "./item";

@Injectable()
export class ItemService {
  static host: string;
  public parent_id;

  constructor(public http: Http) { }

  getEls(limit: number, offset: number, parent_id?: number): Promise<Item[]> {
    const host = ItemService.host;
    if (!parent_id) {
      parent_id = this.parent_id;
    }
    return this.http.post(host + 'get_items', {parent_id: parent_id, limit: limit, offset: offset}).map(res => {
      return _.map(res.json(), el => {
        return el;
      });
    }).toPromise();
  }

}
