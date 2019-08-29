import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {
  MatIconModule,
  MatTreeModule,
  MatMenuModule,
  MatButtonModule,
  MatInputModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule, MatTooltipModule,
} from '@angular/material';
import {TreeComponent} from './tree/tree.component';
import {NodeComponent} from './node/node.component';
import {LoaderComponent} from './loader/loader.component';
import {MoveComponent} from './move/move.component';
import {SearchComponent} from './search/search.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TreeComponent,
    NodeComponent,
    LoaderComponent,
    MoveComponent,
    SearchComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTreeModule,
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
