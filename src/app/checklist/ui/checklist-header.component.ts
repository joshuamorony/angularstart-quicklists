import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Checklist } from 'src/app/shared/interfaces/checklist';

@Component({
  standalone: true,
  selector: 'app-checklist-header',
  template: `
    <header>
      <h1 data-testid="checklist-title">
        {{ checklist.title }}
      </h1>
      <button
        (click)="resetChecklist.emit(checklist.id)"
        data-testid="reset-items-button"
      >
        Reset
      </button>
      <button
        (click)="addItem.emit()"
        data-testid="create-checklist-item-button"
      >
        Add item
      </button>
    </header>
  `,
})
export class ChecklistHeaderComponent {
  @Input({ required: true }) checklist!: Checklist;
  @Output() addItem = new EventEmitter<void>();
  @Output() resetChecklist = new EventEmitter<void>();
}
