import {
  Injectable,
  ResourceStatus,
  effect,
  inject,
  linkedSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { StorageService } from 'src/app/shared/data-access/storage.service';
import { RemoveChecklist } from 'src/app/shared/interfaces/checklist';
import {
  AddChecklistItem,
  ChecklistItem,
  EditChecklistItem,
  RemoveChecklistItem,
} from 'src/app/shared/interfaces/checklist-item';
import { sourceSignal } from 'src/app/shared/utils/sourceSignal';

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
  add$ = new Subject<AddChecklistItem>();
  remove$ = new Subject<RemoveChecklistItem>();
  edit$ = new Subject<EditChecklistItem>();
  toggle$ = new Subject<RemoveChecklistItem>();
  reset$ = new Subject<RemoveChecklist>();
  checklistRemoved = sourceSignal<RemoveChecklist>();

  // state
  checklistItems = linkedSignal({
    source: this.loadedChecklistItems.value,
    computation: (checklistItems) => checklistItems ?? [],
  });

  constructor() {
    this.add$.pipe(takeUntilDestroyed()).subscribe((checklistItem) =>
      this.checklistItems.update((checklistItems) => [
        ...checklistItems,
        {
          ...checklistItem.item,
          id: Date.now().toString(),
          checklistId: checklistItem.checklistId,
          checked: false,
        },
      ]),
    );

    this.edit$
      .pipe(takeUntilDestroyed())
      .subscribe((update) =>
        this.checklistItems.update((checklistItems) =>
          checklistItems.map((item) =>
            item.id === update.id
              ? { ...item, title: update.data.title }
              : item,
          ),
        ),
      );

    this.remove$
      .pipe(takeUntilDestroyed())
      .subscribe((id) =>
        this.checklistItems.update((checklistItems) =>
          checklistItems.filter((item) => item.id !== id),
        ),
      );

    this.toggle$
      .pipe(takeUntilDestroyed())
      .subscribe((checklistItemId) =>
        this.checklistItems.update((checklistItems) =>
          checklistItems.map((item) =>
            item.id === checklistItemId
              ? { ...item, checked: !item.checked }
              : item,
          ),
        ),
      );

    this.reset$
      .pipe(takeUntilDestroyed())
      .subscribe((checklistId) =>
        this.checklistItems.update((checklistItems) =>
          checklistItems.map((item) =>
            item.checklistId === checklistId
              ? { ...item, checked: false }
              : item,
          ),
        ),
      );

    // this.checklistRemoved$
    //   .pipe(takeUntilDestroyed())
    //   .subscribe((checklistId) =>
    //     this.checklistItems.update((checklistItems) =>
    //       checklistItems.filter((item) => item.checklistId !== checklistId),
    //     ),
    //   );

    // effects
    effect(() => {
      const checklistItems = this.checklistItems();
      if (this.loadedChecklistItems.status() === ResourceStatus.Resolved) {
        this.storageService.saveChecklistItems(checklistItems);
      }
    });
  }
}
