import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  checklists = signal<{ title: string }[]>([]);

  add$ = new Subject();
}
