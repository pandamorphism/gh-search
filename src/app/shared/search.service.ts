import {Inject, Injectable, InjectionToken} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';

export const searchUsersAPI: InjectionToken<string> = new InjectionToken('searchUsersAPI');

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(@Inject(searchUsersAPI) private searchUsersEndpoint: string,
              private http: HttpClient) {
  }

  search(q: string) {
    return this.http.get(this.searchUsersEndpoint, {params: {q}}).pipe(
      tap(result => console.log('res: %O', result))
    );
  }

}
