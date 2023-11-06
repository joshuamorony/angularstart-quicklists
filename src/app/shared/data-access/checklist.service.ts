import { Injectable, computed, effect, inject } from '@angular/core';
import { EMPTY, Subject, catchError, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AddChecklist,
  Checklist,
  EditChecklist,
  RemoveChecklist,
} from '../interfaces/checklist';
import { ChecklistItemService } from 'src/app/checklist/data-access/checklist-item.service';
import { StorageService } from './storage.service';
import { signalSlice } from '../utils/signalSlice';

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
    reducers: {
      add: (state, checklist: AddChecklist) => ({
        checklists: [...state.checklists, this.addIdToChecklist(checklist)],
      }),
      edit: (state, update: EditChecklist) => ({
        checklists: state.checklists.map((checklist) =>
          checklist.id === update.id
            ? { ...checklist, title: update.data.title }
            : checklist
        ),
      }),
      remove: (state, id: RemoveChecklist) => ({
        checklists: state.checklists.filter((checklist) => checklist.id !== id),
      }),
    },
  });

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
