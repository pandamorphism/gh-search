import {Inject, Injectable, InjectionToken} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {SearchResult} from './model/model';
import {parseLinks} from './misc/pure';

export const searchUsersAPI: InjectionToken<string> = new InjectionToken('searchUsersAPI');

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(@Inject(searchUsersAPI) private searchUsersEndpoint: string,
              private http: HttpClient) {
  }

  search$(q: string): Observable<SearchResult> {
    return this.http.get<SearchResult>(this.searchUsersEndpoint, {params: {q}, observe: 'response'}).pipe(
      map(res => ({...res.body, pagination: parseLinks(res.headers.get('Link'))})),
      tap(result => console.log('res : %O', result))
    );
  }

  searchDirect$(url): Observable<SearchResult> {
    return this.http.get<SearchResult>(url, {observe: 'response'}).pipe(
      map(res => ({...res.body, pagination: parseLinks(res.headers.get('Link'))})),
      tap(result => console.log('res : %O', result))
    );
  }
}
