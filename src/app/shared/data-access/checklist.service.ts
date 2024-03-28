import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, merge } from 'rxjs';
import {
  catchError,
  concatMap,
  startWith,
  switchMap,
  mergeMap,
} from 'rxjs/operators';
import {
  AddChecklist,
  Checklist,
  EditChecklist,
} from '../interfaces/checklist';
import { ChecklistItemService } from 'src/app/checklist/data-access/checklist-item.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

export interface ChecklistsState {
  checklists: Checklist[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  private checklistItemService = inject(ChecklistItemService);
  private http = inject(HttpClient);

  // state
  private state = signal<ChecklistsState>({
    checklists: [],
    loaded: false,
    error: null,
  });

  // selectors
  checklists = computed(() => this.state().checklists);
  loaded = computed(() => this.state().loaded);
  error = computed(() => this.state().error);

  // sources
  add$ = new Subject<AddChecklist>();
  edit$ = new Subject<EditChecklist>();
  remove$ = this.checklistItemService.checklistRemoved$;

  checklistAdded$ = this.add$.pipe(
    concatMap((addChecklist) =>
      this.http
        .post(`${environment.API_URL}/checklists`, JSON.stringify(addChecklist))
        .pipe(catchError((err) => this.handleError(err))),
    ),
  );

  checklistRemoved$ = this.remove$.pipe(
    mergeMap((id) =>
      this.http
        .delete(`${environment.API_URL}/checklists/${id}`)
        .pipe(catchError((err) => this.handleError(err))),
    ),
  );

  checklistEdited$ = this.edit$.pipe(
    mergeMap((update) =>
      this.http
        .patch(
          `${environment.API_URL}/checklists/${update.id}`,
          JSON.stringify(update.data),
        )
        .pipe(catchError((err) => this.handleError(err))),
    ),
  );

  constructor() {
    this.http.get();
    this.http.post();
    this.http.patch();
    this.http.delete();

    // reducers
    merge(this.checklistAdded$, this.checklistEdited$, this.checklistRemoved$)
      .pipe(
        startWith(null),
        switchMap(() =>
          this.http
            .get<Checklist[]>(`${environment.API_URL}/checklists`)
            .pipe(catchError((err) => this.handleError(err))),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((checklists) =>
        this.state.update((state) => ({
          ...state,
          checklists,
          loaded: true,
        })),
      );
  }

  private handleError(err: any) {
    this.state.update((state) => ({ ...state, error: err }));
    return EMPTY;
  }
}
