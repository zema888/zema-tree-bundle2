import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Element} from "../element";

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {
    @Input() el: Element;
    @Output()
    edit: EventEmitter<Element> = new EventEmitter<Element>();
    @Output()
    create: EventEmitter<Element> = new EventEmitter<Element>();
    @Output()
    delete: EventEmitter<Element> = new EventEmitter<Element>();

    constructor() {
    }

    ngOnInit() {
    }

    onEdit () {
        console.error('menu edit', this.el.id);
        this.edit.emit(this.el);
    }
    onCreate () {
        console.error('menu create', this.el.id);
        this.create.emit(this.el);
    }
    onDelete () {
        console.error('new menu delete', this.el.id);
        this.delete.emit(this.el);
    }
}
