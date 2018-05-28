import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from 'rxjs/operators';
import {Element} from "./element";
import {Observable} from "rxjs/internal/Observable";

@Injectable({
    providedIn: 'root'
})
export class ElService {
    static edit: string;

    constructor(private http: HttpClient) {
    }

    getEls(root: number): Observable<Element[]> {
        return this.http.post('get_node&id=' + root, []).pipe(map<any, Element[]>(res => {
            return res.map(el => {
                return new Element(this, el);
            });
        }));
    }

    deleteEl(id: number): Observable<boolean> {
        return this.http.post('delete_node&id=' + id, []).pipe(map<any, boolean>(res => {
            return res.ok;
        }));
    }

    moveEl(id: number, target: number, source: number, sibling: number): Observable<boolean> {
        if (id > 0 && target > 0) {
            console.log(id, target, source, sibling);
            return this.http.post('move_node', {
                id: id, target: target, source: source, sibling: sibling
            }).pipe(map<any, boolean>(res => {
                return res.ok;
            }));
        }
        return null;
    }
}
