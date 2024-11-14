import {
  Injectable,
  ResourceStatus,
  effect,
  inject,
  linkedSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { reduce, Subject } from 'rxjs';
import { StorageService } from 'src/app/shared/data-access/storage.service';
import {
  EditChecklist,
  RemoveChecklist,
} from 'src/app/shared/interfaces/checklist';
import {
  AddChecklistItem,
  ChecklistItem,
  EditChecklistItem,
  RemoveChecklistItem,
} from 'src/app/shared/interfaces/checklist-item';
import { reducer, sourceSignal } from 'src/app/shared/utils/sourceSignal';

export interface ChecklistItemsState {
  checklistItems: ChecklistItem[];
  loaded: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  private storageService = inject(StorageService);

  // sources
  loadedChecklistItems = this.storageService.loadChecklistItems();
  add = sourceSignal<AddChecklistItem>();
  remove = sourceSignal<RemoveChecklistItem>();
  edit = sourceSignal<EditChecklist>();
  toggle = sourceSignal<RemoveChecklistItem>();
  reset = sourceSignal<RemoveChecklist>();
  checklistRemoved = sourceSignal<RemoveChecklist>();

  // state
  checklistItems = linkedSignal({
    source: this.loadedChecklistItems.value,
    computation: (checklistItems) => checklistItems ?? [],
  });

  constructor() {
    reducer(this.add, (checklistItem) =>
      this.checklistItems.update((checklistItems) =>
        checklistItem
          ? [
              ...checklistItems,
              {
                ...checklistItem.item,
                id: Date.now().toString(),
                checklistId: checklistItem.checklistId,
                checked: false,
              },
            ]
          : checklistItems,
      ),
    );

    reducer(this.edit, (update) =>
      this.checklistItems.update((checklistItems) =>
        checklistItems.map((item) =>
          update && item.id === update.id
            ? { ...item, title: update.data.title }
            : item,
        ),
      ),
    );

    reducer(this.remove, (id) =>
      this.checklistItems.update((checklistItems) =>
        id ? checklistItems.filter((item) => item.id !== id) : checklistItems,
      ),
    );

    reducer(this.toggle, (checklistItemId) =>
      this.checklistItems.update((checklistItems) =>
        checklistItems.map((item) =>
          checklistItemId && item.id === checklistItemId
            ? { ...item, checked: !item.checked }
            : item,
        ),
      ),
    );

    reducer(this.reset, (checklistId) =>
      this.checklistItems.update((checklistItems) =>
        checklistItems.map((item) =>
          checklistId && item.checklistId === checklistId
            ? { ...item, checked: false }
            : item,
        ),
      ),
    );

    reducer(this.checklistRemoved, (checklistId) =>
      this.checklistItems.update((checklistItems) =>
        checklistId
          ? checklistItems.filter((item) => item.checklistId !== checklistId)
          : checklistItems,
      ),
    );

    // effects
    effect(() => {
      const checklistItems = this.checklistItems();
      if (this.loadedChecklistItems.status() === ResourceStatus.Resolved) {
        this.storageService.saveChecklistItems(checklistItems);
      }
    });
  }
}
