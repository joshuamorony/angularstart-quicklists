import {
  Injectable,
  InjectionToken,
  PLATFORM_ID,
  inject,
  resource,
} from '@angular/core';
import { of } from 'rxjs';
import { Checklist } from '../interfaces/checklist';
import { ChecklistItem } from '../interfaces/checklist-item';

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'window local storage object',
  {
    providedIn: 'root',
    factory: () => {
      return inject(PLATFORM_ID) === 'browser'
        ? window.localStorage
        : ({} as Storage);
    },
  },
);

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  storage = inject(LOCAL_STORAGE);

  loadChecklists() {
    // NOTE: simulating async api
    return resource({
      loader: () =>
        Promise.resolve(this.storage.getItem('checklists')).then(
          (checklists) =>
            checklists ? (JSON.parse(checklists) as Checklist[]) : [],
        ),
    });
  }

  loadChecklistItems() {
    return resource({
      loader: () =>
        Promise.resolve(this.storage.getItem('checklistItems')).then(
          (checklistItems) =>
            checklistItems
              ? (JSON.parse(checklistItems) as ChecklistItem[])
              : [],
        ),
    });
  }

  saveChecklists(checklists: Checklist[]) {
    this.storage.setItem('checklists', JSON.stringify(checklists));
  }

  saveChecklistItems(checklistItems: ChecklistItem[]) {
    this.storage.setItem('checklistItems', JSON.stringify(checklistItems));
  }
}
