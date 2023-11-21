import { Injectable, effect, inject } from '@angular/core';
import { Observable, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChecklistService } from 'src/app/shared/data-access/checklist.service';
import { StorageService } from 'src/app/shared/data-access/storage.service';
import { RemoveChecklist } from 'src/app/shared/interfaces/checklist';
import {
  AddChecklistItem,
  ChecklistItem,
  EditChecklistItem,
  RemoveChecklistItem,
} from 'src/app/shared/interfaces/checklist-item';
import { signalSlice } from 'ngxtension/signal-slice';

export interface ChecklistItemsState {
  checklistItems: ChecklistItem[];
  loaded: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  private storageService = inject(StorageService);
  private checklistService = inject(ChecklistService);

  initialState: ChecklistItemsState = {
    checklistItems: [],
    loaded: false,
  };

  // sources
  private checklistItemsLoaded$ = this.storageService.loadChecklistItems();

  sources$ = merge(
    this.checklistItemsLoaded$.pipe(
      map((checklistItems) => ({
        checklistItems,
        loaded: true,
      }))
    )
  );

  state = signalSlice({
    initialState: this.initialState,
    sources: [this.sources$],
    actionSources: {
      add: (state, action$: Observable<AddChecklistItem>) =>
        action$.pipe(
          map((checklistItem) => ({
            checklistItems: [
              ...state().checklistItems,
              {
                ...checklistItem.item,
                id: Date.now().toString(),
                checklistId: checklistItem.checklistId,
                checked: false,
              },
            ],
          }))
        ),
      remove: (state, action$: Observable<RemoveChecklistItem>) =>
        action$.pipe(
          map((id) => ({
            checklistItems: state().checklistItems.filter(
              (item) => item.id !== id
            ),
          }))
        ),
      edit: (state, action$: Observable<EditChecklistItem>) =>
        action$.pipe(
          map((update) => ({
            checklistItems: state().checklistItems.map((item) =>
              item.id === update.id
                ? { ...item, title: update.data.title }
                : item
            ),
          }))
        ),
      toggle: (state, action$: Observable<RemoveChecklistItem>) =>
        action$.pipe(
          map((checklistItemId) => ({
            checklistItems: state().checklistItems.map((item) =>
              item.id === checklistItemId
                ? { ...item, checked: !item.checked }
                : item
            ),
          }))
        ),
      reset: (state, action$: Observable<RemoveChecklistItem>) =>
        action$.pipe(
          map((checklistId) => ({
            checklistItems: state().checklistItems.map((item) =>
              item.checklistId === checklistId
                ? { ...item, checked: false }
                : item
            ),
          }))
        ),
      checklistRemoved: (state, action$: Observable<RemoveChecklist>) =>
        action$.pipe(
          map((checklistId) => ({
            checklistItems: state().checklistItems.filter(
              (item) => item.checklistId !== checklistId
            ),
          }))
        ),
    },
  });

  constructor() {
    // shared source
    this.state.checklistRemoved(this.checklistService.state.remove$);

    // effects
    effect(() => {
      if (this.state.loaded()) {
        this.storageService.saveChecklistItems(this.state.checklistItems());
      }
    });
  }
}
