import {Component, Injectable, Input, OnInit} from '@angular/core';
import {ElService} from "./el.service";
import {FlatTreeControl} from '@angular/cdk/tree';
import {CollectionViewer, SelectionChange} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, merge} from 'rxjs';
import {map} from 'rxjs/operators';
import {El} from "./el";
import {Element} from "./element";
import {WindowRefService} from "../window-ref.service";


/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable()
export class DynamicDataSource {

    dataChange: BehaviorSubject<El[]> = new BehaviorSubject<El[]>([]);

    get data(): El[] {
        return this.dataChange.value;
    }

    set data(value: El[]) {
        this.treeControl.dataNodes = value;
        this.dataChange.next(value);
    }

    constructor(private treeControl: FlatTreeControl<El>,
                private elService: ElService) {
    }
    initialData (root: number) :void {
        this.elService.getEls(root).subscribe(list => {
            this.data = list;
        });
    }

    connect(collectionViewer: CollectionViewer): Observable<El[]> {
        this.treeControl.expansionModel.onChange!.subscribe(change => {
            if ((change as SelectionChange<Element>).added ||
                (change as SelectionChange<Element>).removed) {
                this.handleTreeControl(change as SelectionChange<Element>);
            }
        });

        return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
    }

    /** Handle expand/collapse behaviors */
    handleTreeControl(change: SelectionChange<Element>) {
        if (change.added) {
            change.added.forEach((node) => this.toggleNode(node, true));
        }
        if (change.removed) {
            change.removed.reverse().forEach((node) => this.toggleNode(node, false));
        }
    }

    /**
     * Toggle the node, remove from display list
     */
    toggleNode(node: Element, expand: boolean) {
        const index = this.data.indexOf(node);
        node.isLoading = true;
        node.openChildren().subscribe(children => {
            if (children) {
                if (expand) {
                    this.data.splice(index + 1, 0, ...children);
                } else {
                    this.data.splice(index + 1, children.length);
                }
                this.dataChange.next(this.data);
                setTimeout(() => node.isLoading = false, 500);
            } else {
                setTimeout(() => node.isLoading = false, 500);
                return;
            }
        });
    }

    deleteNode(node: Element, children_length: number) {
        const index = this.data.indexOf(node);
        this.data.splice(index, children_length + 1);
        this.dataChange.next(this.data);
    }
}

@Component({
    selector: 'app-element',
    templateUrl: './element.component.html',
    styleUrls: ['./element.component.sass']
})
export class ElementComponent implements OnInit {
    @Input() root: number;
    public treeControl: FlatTreeControl<El>;
    public dataSource: DynamicDataSource;
    private _window: any;

    constructor(private elService: ElService, windowRef: WindowRefService) {
        this.treeControl = new FlatTreeControl<El>(this.getLevel, this.isExpandable);
        this.dataSource = new DynamicDataSource(this.treeControl, this.elService);
        this.dataSource.initialData(this.root);
        this._window = windowRef.nativeWindow;
    }

    public ngOnInit() {
    }

    public getLevel = (node: El) => {
        return node.lvl;
    };

    public isExpandable = (node: El) => {
        return node.is_child;
    };

    hasChild = (_: number, _nodeData: El) => {
        return _nodeData.is_child;
    };

    public editElement(el: Element): void {
        console.error('edit', el.id);
        this._window.start_field_dialog_form_edit_tree(ElService.edit + '/' + el.id + '/edit');
        this._window.returnEdit = (id, title) => {
            el.id = id;
            el.title = title;
        }
    }

    public createChild(el: Element): void {
        console.error('create', el.id);
        el.isLoading = true;
        this._window.start_field_dialog_form_edit_tree(ElService.edit + '/create');
        this._window.returnEdit = (id, title) => {
            this.dataSource.toggleNode(el, false);
            el.show_children = false;
            this.elService.moveEl(id, el.id, null, null).subscribe(res => {
                if (res) {
                    this.dataSource.toggleNode(el, true);
                }
            });
        }
    }

    public deleteEl(el: Element): void {
        console.error('deleteEl', el.id);
        el.isLoading = true;
        this.elService.deleteEl(el.id).subscribe(res => {
            if (res) {
                this.dataSource.deleteNode(el, this.getChildrenList(el, []).length);
            }
            setTimeout(() => el.isLoading = false, 500);
        });
    }

    private getChildrenList(el: Element, list: Element[]) {
        if (el.is_child) {
            el.children.forEach(child => {
                list.push(child);
                if (child.is_child) {
                    this.getChildrenList(child, list);
                }
            })
        }
        return list;
    }

}
