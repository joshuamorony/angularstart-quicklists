import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChecklistItem } from 'src/app/shared/interfaces/checklist-item';

@Component({
  standalone: true,
  selector: 'app-checklist-item-list',
  template: `
    <ul>
      <li
        *ngFor="let item of checklistItems; trackBy: trackByFn"
        data-testid="checklist-item"
      >
        {{ item.title }}
        <button
          (click)="delete.emit(item.id)"
          data-testid="delete-checklist-item-button"
        >
          Delete
        </button>
      </li>
    </ul>

    <div *ngIf="!checklistItems.length">
      <h2>Add an item</h2>
      <p data-testid="no-checklist-items-message">
        Click the add button to add your first item to this quicklist
      </p>
    </div>
  `,
  imports: [CommonModule],
})
export class ChecklistItemListComponent {
  @Input({ required: true }) checklistItems!: ChecklistItem[];
  @Output() delete = new EventEmitter<string>();

  trackByFn(index: number, item: ChecklistItem) {
    return item.id;
  }
}
