import { Injectable, computed, effect, inject } from '@angular/core';
import { merge } from 'rxjs';
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
import { signalSlice } from 'src/app/shared/utils/signalSlice';

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
    reducers: {
      add: (state, checklistItem: AddChecklistItem) => ({
        ...state,
        checklistItems: [
          ...state.checklistItems,
          {
            ...checklistItem.item,
            id: Date.now().toString(),
            checklistId: checklistItem.checklistId,
            checked: false,
          },
        ],
      }),
      remove: (state, id: RemoveChecklistItem) => ({
        ...state,
        checklistItems: state.checklistItems.filter((item) => item.id !== id),
      }),
      edit: (state, update: EditChecklistItem) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.id === update.id ? { ...item, title: update.data.title } : item
        ),
      }),
      toggle: (state, checklistItemId: RemoveChecklistItem) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.id === checklistItemId
            ? { ...item, checked: !item.checked }
            : item
        ),
      }),
      reset: (state, checklistId: RemoveChecklistItem) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.checklistId === checklistId ? { ...item, checked: false } : item
        ),
      }),
      checklistRemoved: (state, checklistId: RemoveChecklist) => ({
        ...state,
        checklistItems: state.checklistItems.filter(
          (item) => item.checklistId !== checklistId
        ),
      }),
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
