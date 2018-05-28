import { Component, ElementRef } from '@angular/core';
import {ElService} from "./element/el.service";
import {ItemService} from "./item/item.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'app';

  constructor(public elementRef: ElementRef) {
    const native = this.elementRef.nativeElement;
    ElService.host = native.getAttribute("host");
    ItemService.host = native.getAttribute("host");
    ElService.edit = native.getAttribute("edit").replace('/%7Bid%7D/edit','');
  }
}
