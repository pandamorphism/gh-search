import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {searchUsersAPI} from './search.service';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
  ]
})
export class SharedModule {
  static forRoot(config: { baseSearchAPI: string } = {baseSearchAPI: 'https://api.github.com/search'}): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [{
        provide: searchUsersAPI, useValue: `${config.baseSearchAPI}/users`
      }]
    };
  }

}
