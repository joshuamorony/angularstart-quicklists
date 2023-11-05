import { Injectable, computed, effect, inject } from '@angular/core';
import { EMPTY, Subject, catchError, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AddChecklist,
  Checklist,
  EditChecklist,
} from '../interfaces/checklist';
import { ChecklistItemService } from 'src/app/checklist/data-access/checklist-item.service';
import { StorageService } from './storage.service';
import { connectSignal, withReducer } from '../utils/connectSignal';

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
  private storageService = inject(StorageService);

  private initialState: ChecklistsState = {
    checklists: [],
    loaded: false,
    error: null,
  };

  // sources
  private checklistsLoaded$ = this.storageService.loadChecklists().pipe(
    catchError((err) => {
      this.error$.next(err);
      return EMPTY;
    })
  );

  private error$ = new Subject<string>();
  add$ = new Subject<AddChecklist>();
  edit$ = new Subject<EditChecklist>();
  remove$ = this.checklistItemService.checklistRemoved$;

  nextState$ = merge(
    this.checklistsLoaded$.pipe(
      map((checklists) => ({ checklists, loaded: true }))
    ),
    this.error$.pipe(map((error) => ({ error })))
  );

  state = connectSignal(
    this.initialState,
    this.nextState$,
    withReducer(this.add$, (state, checklist) => ({
      checklists: [...state.checklists, this.addIdToChecklist(checklist)],
    })),
    withReducer(this.remove$, (state, id) => ({
      checklists: state.checklists.filter((checklist) => checklist.id !== id),
    })),
    withReducer(this.edit$, (state, update) => ({
      checklists: state.checklists.map((checklist) =>
        checklist.id === update.id
          ? { ...checklist, title: update.data.title }
          : checklist
      ),
    }))
  );

  // selectors
  checklists = computed(() => this.state().checklists);
  loaded = computed(() => this.state().loaded);
  error = computed(() => this.state().error);

  constructor() {
    // effects
    effect(() => {
      if (this.loaded()) {
        this.storageService.saveChecklists(this.checklists());
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
    const matchingSlugs = this.checklists().find(
      (checklist) => checklist.id === slug
    );

    // If the title is already being used, add a string to make the slug unique
    if (matchingSlugs) {
      slug = slug + Date.now().toString();
    }

    return slug;
  }
}
