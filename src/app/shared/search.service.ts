import {Inject, Injectable, InjectionToken} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {SearchResult, UserDetails, UserInfo} from './model/model';
import {linksNPage} from './misc/pure';

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
      map(res => ({...res.body, pagination: linksNPage(res.headers.get('Link'))})),
    );
  }

  searchDirect$(url): Observable<SearchResult> {
    return this.http.get<SearchResult>(url, {observe: 'response'}).pipe(
      map(res => ({...res.body, pagination: linksNPage(res.headers.get('Link'))})),
    );
  }

  getDetails$(item: UserInfo): Observable<UserDetails> {
    return this.http.get<UserDetails>(item.url);
  }
}
