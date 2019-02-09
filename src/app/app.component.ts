import {Component, OnDestroy, OnInit} from '@angular/core';
import {SearchService} from './shared/search.service';
import {FormControl} from '@angular/forms';
import {debounceTime, switchMap, tap} from 'rxjs/operators';
import {separate} from 'rxjs-etc';
import {isEmptyString} from './shared/misc/pure';
import {untilDestroyed} from 'ngx-take-until-destroy';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private searchField: FormControl;
  private res$;

  constructor(private searchService: SearchService) {
  }

  ngOnInit(): void {
    this.searchField = new FormControl('');
    const [cleanUp$, search$] = separate(this.searchField.valueChanges.pipe(debounceTime(300)), isEmptyString);

    cleanUp$.pipe(
      tap(_ => console.log('CleanUp')),
      untilDestroyed(this)
    ).subscribe();

    this.res$ = search$.pipe(
      switchMap(term => this.searchService.search(term)),
    );
  }

  ngOnDestroy(): void {
  }
}
