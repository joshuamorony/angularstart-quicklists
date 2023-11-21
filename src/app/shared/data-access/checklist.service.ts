import { Injectable, effect, inject } from '@angular/core';
import { EMPTY, Observable, Subject, catchError, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AddChecklist,
  Checklist,
  EditChecklist,
  RemoveChecklist,
} from '../interfaces/checklist';
import { StorageService } from './storage.service';
import { signalSlice } from 'ngxtension/signal-slice';

export interface ChecklistsState {
  checklists: Checklist[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  private storageService = inject(StorageService);

  private initialState: ChecklistsState = {
    checklists: [],
    loaded: false,
    error: null,
  };

  // sources
  private error$ = new Subject<string>();
  private checklistsLoaded$ = this.storageService.loadChecklists().pipe(
    catchError((err) => {
      this.error$.next(err);
      return EMPTY;
    })
  );

  sources$ = merge(
    this.checklistsLoaded$.pipe(
      map((checklists) => ({ checklists, loaded: true }))
    ),
    this.error$.pipe(map((error) => ({ error })))
  );

  state = signalSlice({
    initialState: this.initialState,
    sources: [this.sources$],
    actionSources: {
      add: (state, action$: Observable<AddChecklist>) =>
        action$.pipe(
          map((checklist) => ({
            checklists: [
              ...state().checklists,
              this.addIdToChecklist(checklist),
            ],
          }))
        ),
      edit: (state, action$: Observable<EditChecklist>) =>
        action$.pipe(
          map((update) => ({
            checklists: state().checklists.map((checklist) =>
              checklist.id === update.id
                ? { ...checklist, title: update.data.title }
                : checklist
            ),
          }))
        ),
      remove: (state, action$: Observable<RemoveChecklist>) =>
        action$.pipe(
          map((id) => ({
            checklists: state().checklists.filter(
              (checklist) => checklist.id !== id
            ),
          }))
        ),
    },
  });

  constructor() {
    effect(() => {
      if (this.state.loaded()) {
        this.storageService.saveChecklists(this.state.checklists());
      }
    });
  }

  private addIdToChecklist(checklist: AddChecklist) {
    return {
      ...checklist,
      id: this.generateSlug(checklist.title),
    };
  }

  private generateSlug(title: string) {
    // NOTE: This is a simplistic slug generator and will not handle things like special characters.
    let slug = title.toLowerCase().replace(/\s+/g, '-');

    // Check if the slug already exists
    const matchingSlugs = this.state
      .checklists()
      .find((checklist) => checklist.id === slug);

    // If the title is already being used, add a string to make the slug unique
    if (matchingSlugs) {
      slug = slug + Date.now().toString();
    }

    return slug;
  }
}
