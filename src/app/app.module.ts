import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SharedModule} from './shared/shared.module';
import {environment} from '../environments/environment';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    SharedModule.forRoot({baseSearchAPI: environment.baseSearchAPI})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
