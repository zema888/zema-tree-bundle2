import {Component, ElementRef} from '@angular/core';
import {AppInterceptorService} from "./app-interceptor.service";
import {ElService} from "./element/el.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'app';

  constructor (private elementRef: ElementRef) {
      const native = this.elementRef.nativeElement;
      AppInterceptorService.host = native.getAttribute("host");
      // ItemService.host = native.getAttribute("host");
      ElService.edit = native.getAttribute("edit").replace('/%7Bid%7D/edit','');
  }
}
