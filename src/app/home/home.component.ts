import { Component, signal } from '@angular/core';
import { ChecklistListComponent } from './ui/checklist-list.component';
import { Checklist } from '../shared/interfaces/checklist';
import { ModalComponent } from '../shared/ui/modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <button
      (click)="checklistBeingEdited.set({})"
      data-testid="create-checklist-button"
    >
      Add
    </button>
    <app-checklist-list [checklists]="[]" />

    <app-modal [isOpen]="!!checklistBeingEdited()"></app-modal>
  `,
  imports: [ChecklistListComponent, ModalComponent],
})
export default class HomeComponent {
  checklistBeingEdited = signal<Partial<Checklist> | null>(null);
}
