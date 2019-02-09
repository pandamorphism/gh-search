import {Component, OnDestroy, OnInit} from '@angular/core';
import {SearchService} from './shared/search.service';
import {FormControl} from '@angular/forms';
import {debounceTime, switchMap, take, tap} from 'rxjs/operators';
import {separate} from 'rxjs-etc';
import {isEmptyString} from './shared/misc/pure';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Subject} from 'rxjs';
import {Rel, SearchResult, UrlToRel} from './shared/model/model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private searchField: FormControl;
  private res$: Subject<SearchResult | null> = new Subject();

  constructor(private searchService: SearchService) {
  }

  ngOnInit(): void {
    this.searchField = new FormControl('');
    const [cleanUp$, search$] = separate(this.searchField.valueChanges.pipe(debounceTime(300)), isEmptyString);

    cleanUp$.pipe(
      tap(_ => this.res$.next(null)),
      untilDestroyed(this)
    ).subscribe();

    search$.pipe(
      switchMap(term => this.searchService.search$(term)),
      tap(response => this.res$.next(response)),
      untilDestroyed(this)
    ).subscribe();
  }

  ngOnDestroy(): void {
  }

  isAvailable(pagination: UrlToRel[], rel: Rel) {
    return pagination && pagination.some(page => page.rel === rel);
  }

  update(paging: UrlToRel[], rel: Rel) {
    this.searchService.searchDirect$(paging.find(page => page.rel === rel).url)
      .pipe(tap(response => this.res$.next(response)), take(1))
      .subscribe();
  }
}
