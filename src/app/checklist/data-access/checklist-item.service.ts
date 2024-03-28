import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, concatMap, merge } from 'rxjs';
import {
  catchError,
  exhaustMap,
  mergeMap,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { RemoveChecklist } from 'src/app/shared/interfaces/checklist';
import {
  AddChecklistItem,
  ChecklistItem,
  EditChecklistItem,
  RemoveChecklistItem,
} from 'src/app/shared/interfaces/checklist-item';
import { environment } from 'src/environments/environment';

export interface ChecklistItemsState {
  checklistItems: ChecklistItem[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  private http = inject(HttpClient);

  // state
  private state = signal<ChecklistItemsState>({
    checklistItems: [],
    loaded: false,
    error: null,
  });

  // selectors
  checklistItems = computed(() => this.state().checklistItems);
  loaded = computed(() => this.state().loaded);
  error = computed(() => this.state().error);

  // sources
  add$ = new Subject<AddChecklistItem>();
  remove$ = new Subject<RemoveChecklistItem>();
  edit$ = new Subject<EditChecklistItem>();
  toggle$ = new Subject<EditChecklistItem>();
  reset$ = new Subject<RemoveChecklist>();
  checklistRemoved$ = new Subject<RemoveChecklist>();

  checklistItemAdded$ = this.add$.pipe(
    concatMap((addChecklistItem) =>
      this.http
        .post(
          `${environment.API_URL}/checklist-items/${addChecklistItem.checklistId}`,
          JSON.stringify(addChecklistItem.item),
        )
        .pipe(catchError((err) => this.handleError(err))),
    ),
  );

  checklistItemRemoved$ = this.remove$.pipe(
    mergeMap((id) =>
      this.http
        .delete(`${environment.API_URL}/checklist-items/${id}`)
        .pipe(catchError((err) => this.handleError(err))),
    ),
  );

  checklistItemEdited$ = merge(this.edit$, this.toggle$).pipe(
    mergeMap((update) =>
      this.http
        .patch(
          `${environment.API_URL}/checklist-items/${update.id}`,
          JSON.stringify(update.data),
        )
        .pipe(catchError((err) => this.handleError(err))),
    ),
  );

  checklistReset$ = this.reset$.pipe(
    exhaustMap((id) =>
      this.http
        .post(`${environment.API_URL}/checklist/${id}/reset`, {})
        .pipe(catchError((err) => this.handleError(err))),
    ),
  );

  constructor() {
    merge(
      this.checklistItemAdded$,
      this.checklistItemEdited$,
      this.checklistItemRemoved$,
      this.checklistReset$,
    )
      .pipe(
        startWith(null),
        switchMap(() =>
          this.http
            .get<ChecklistItem[]>(`${environment.API_URL}/checklist-items`)
            .pipe(catchError((err) => this.handleError(err))),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((checklistItems) =>
        this.state.update((state) => ({
          ...state,
          checklistItems,
          loaded: true,
        })),
      );
  }

  private handleError(err: any) {
    this.state.update((state) => ({ ...state, error: err }));
    return EMPTY;
  }
}
