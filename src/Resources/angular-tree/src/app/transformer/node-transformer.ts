import {Node} from '../model/node';

export class NodeTransformer {
  static fromJsonToModel(data: any): Node {
    const obj = new Node();

    [
      'id',
      'title',
      'path',
      'module',
      'lft',
      'lvl',
      'parentId',
      'hasChildren',
      'active',
    ].forEach(field => {
      if (data.hasOwnProperty(field)) {
        obj[field] = data[field];
      }
    });
    return obj;
  }


  static fromJsonToCollection(datas: any[]): Node[] {
    if (datas) {
      return datas.map(data => {
        return this.fromJsonToModel(data);
      });
    } else {
      return [];
    }
  }
}
