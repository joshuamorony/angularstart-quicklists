import { Component, inject, signal } from '@angular/core';
import { ChecklistListComponent } from './ui/checklist-list.component';
import { Checklist } from '../shared/interfaces/checklist';
import { ModalComponent } from '../shared/ui/modal.component';
import { FormModalComponent } from '../shared/ui/form-modal.component';
import { FormBuilder } from '@angular/forms';

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

    <app-modal [isOpen]="!!checklistBeingEdited()">
      <ng-template>
        <app-form-modal [formGroup]="checklistForm" />
      </ng-template>
    </app-modal>
  `,
  imports: [ChecklistListComponent, ModalComponent, FormModalComponent],
})
export default class HomeComponent {
  formBuilder = inject(FormBuilder);

  checklistBeingEdited = signal<Partial<Checklist> | null>(null);

  checklistForm = this.formBuilder.nonNullable.group({
    title: [''],
  });
}
