import {
  Injectable,
  ResourceStatus,
  effect,
  inject,
  linkedSignal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { AddChecklist, EditChecklist } from '../interfaces/checklist';
import { ChecklistItemService } from 'src/app/checklist/data-access/checklist-item.service';
import { StorageService } from './storage.service';
import { reducer, sourceSignal } from '../utils/sourceSignal';

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  private checklistItemService = inject(ChecklistItemService);
  private storageService = inject(StorageService);

  // sources
  loadedChecklists = this.storageService.loadChecklists();
  add = sourceSignal<AddChecklist>();
  edit = sourceSignal<EditChecklist>();
  remove = this.checklistItemService.checklistRemoved;

  // state
  checklists = linkedSignal({
    source: this.loadedChecklists.value,
    computation: (checklists) => checklists ?? [],
  });

  constructor() {
    reducer(this.add, (checklist) =>
      this.checklists.update((checklists) =>
        checklist
          ? [...checklists, this.addIdToChecklist(checklist)]
          : checklists,
      ),
    );

    reducer(this.remove, (id) =>
      this.checklists.update((checklists) =>
        checklists.filter((checklist) => checklist.id !== id),
      ),
    );

    reducer(this.edit, (update) =>
      this.checklists.update((checklists) =>
        update
          ? checklists.map((checklist) =>
              checklist.id === update.id
                ? { ...checklist, title: update.data.title }
                : checklist,
            )
          : checklists,
      ),
    );

    // effects
    effect(() => {
      const checklists = this.checklists();
      if (this.loadedChecklists.status() === ResourceStatus.Resolved) {
        this.storageService.saveChecklists(checklists);
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
      (checklist) => checklist.id === slug,
    );

    // If the title is already being used, add a string to make the slug unique
    if (matchingSlugs) {
      slug = slug + Date.now().toString();
    }

    return slug;
  }
}
