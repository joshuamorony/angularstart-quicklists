import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AddChecklistItem } from 'src/app/shared/interfaces/checklist-item';

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  // sources
  add$ = new Subject<AddChecklistItem>();
}
