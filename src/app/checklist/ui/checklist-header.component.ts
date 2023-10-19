import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Checklist } from 'src/app/shared/interfaces/checklist';

@Component({
  standalone: true,
  selector: 'app-checklist-header',
  template: `
    <header>
      <a data-testid="back-button" routerLink="/home">Back</a>
      <h1 data-testid="checklist-title">
        {{ checklist.title }}
      </h1>
      <div>
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
      </div>
    </header>
  `,
  styles: [
    `
      button {
        margin-left: 1rem;
      }
    `,
  ],
  imports: [RouterModule],
})
export class ChecklistHeaderComponent {
  @Input({ required: true }) checklist!: Checklist;
  @Output() addItem = new EventEmitter<void>();
  @Output() resetChecklist = new EventEmitter<string>();
}
