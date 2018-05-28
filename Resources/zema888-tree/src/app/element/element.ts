import {ElService} from './el.service';
import 'rxjs/Rx';
import {El} from "./el";
import {BehaviorSubject} from "rxjs/index";

export class Element implements El {
    public id: number;
    public title: string;
    public lft: number;
    public lvl: number;
    public is_child: boolean;
    public children: Element[];
    public isLoading: boolean;
    public active: boolean;
    public items: El[];
    public show_children = false;

    public constructor(protected elService: ElService, data: El) {
        for (let prop in data) {
            this[prop] = data[prop];
        }
        this.isLoading = false;
        this.active = false;
    }

    public openChildren(): BehaviorSubject<El[]> {
        const behavior = new BehaviorSubject<El[]>([]);
        this.elService.getEls(this.id).subscribe(list => {
            this.children = list;
            this.show_children = true;
            this.is_child = this.children.length > 0;
            behavior.next(this.children);
        });
        return behavior;
    }
}
