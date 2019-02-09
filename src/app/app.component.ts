import {Component, OnDestroy, OnInit} from '@angular/core';
import {SearchService} from './shared/search.service';
import {FormControl} from '@angular/forms';
import {catchError, debounceTime, finalize, switchMap, take, tap} from 'rxjs/operators';
import {separate} from 'rxjs-etc';
import {isEmptyString} from './shared/misc/pure';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Subject, throwError} from 'rxjs';
import {Rel, SearchResult, UrlToRel, UserDetails, UserInfo} from './shared/model/model';
import {animate, style, transition, trigger} from '@angular/animations';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({opacity: '0'}),
        animate('.5s ease-out', style({opacity: '1'})),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  private searchField: FormControl;
  private res$: Subject<SearchResult | null> = new Subject();
  private pendingDetailsProfileIds: number[] = [];
  private userDetails: { [id: number]: UserDetails } = {};

  constructor(private searchService: SearchService,
              private domSanitizer: DomSanitizer,
              private matIconRegistry: MatIconRegistry) {
    this.matIconRegistry.addSvgIcon(
      'github',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/gh.svg')
    );
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

  navigate(url: string) {
    window.open(url, '_blank');
  }

  getDetails(item: UserInfo) {
    this.pendingDetailsProfileIds = [...this.pendingDetailsProfileIds, item.id];
    this.searchService.getDetails$(item).pipe(
      tap(details => this.userDetails[item.id] = details),
      catchError(err => {
        console.error(err);
        return throwError(err);
      }),
      finalize(
        () => this.pendingDetailsProfileIds = this.pendingDetailsProfileIds.filter(id => id !== item.id)))
      .subscribe();
  }
}
