import {BehaviorSubject} from 'rxjs/index';
import {IElement} from './i-element';

/** Nested node */
export class Node implements IElement {
    public childrenChange = new BehaviorSubject<Node[]>([]);

    public id: number;
    public title: string;
    public path: string;
    public module: string;
    public lft: number;
    public lvl: number;
    public parentId: number | null;
    public hasChildren: boolean;
    public active: boolean;

    get children(): Node[] {
        return this.childrenChange.value;
    }

    public updateByNewNode(node: Node) {
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
        this[field] = node[field];
      });
    }
}
