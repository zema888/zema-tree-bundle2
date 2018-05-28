import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HttpModule, BaseRequestOptions, Http } from '@angular/http';
import { DragulaModule } from 'ng2-dragula';
import 'rxjs/Rx';

import { AppComponent } from './app.component';
import { ArticleComponent } from './article/article.component';
import { ElementComponent } from './element/element.component';
import { SortPipe } from './pipe/sort.pipe';
import {WindowRefService} from "./window-ref.service";
import { ItemComponent } from './item/item.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticleComponent,
    ElementComponent,
    SortPipe,
    ItemComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    HttpModule,
    DragulaModule
  ],
  providers: [ WindowRefService],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
