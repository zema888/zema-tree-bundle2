import {Component, ElementRef} from '@angular/core';
import {Database} from './service/database.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private elementRef: ElementRef,
    public dataService: Database
  ) {
    const native = this.elementRef.nativeElement;
    this.dataService.host = native.getAttribute('host');
    this.dataService.edit = native.getAttribute('edit').replace('/%7Bid%7D/edit', '');
    this.dataService.rootId = native.getAttribute('root-id');
    this.dataService.siteHost = native.getAttribute('site-host');
  }
}
