import { Injectable, InjectionToken, PLATFORM_ID, inject } from '@angular/core';
import { of } from 'rxjs';
import { Checklist } from '../interfaces/checklist';

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'window local storage object',
  {
    providedIn: 'root',
    factory: () => {
      return inject(PLATFORM_ID) === 'browser'
        ? window.localStorage
        : ({} as Storage);
    },
  }
);

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  storage = inject(LOCAL_STORAGE);

  loadChecklists() {
    const checklists = this.storage.getItem('checklists');
    return of(JSON.parse(checklists!) as Checklist[]);
  }
}
