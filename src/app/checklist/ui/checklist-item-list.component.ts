import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChecklistItem } from 'src/app/shared/interfaces/checklist-item';

@Component({
  standalone: true,
  selector: 'app-checklist-item-list',
  template: `
    <ul>
      @for (item of checklistItems; track item.id){
      <li data-testid="checklist-item">
        @if (item.checked){
        <span data-testid="checked-indicator">[DONE]</span>
        }
        {{ item.title }}
        <button
          (click)="toggle.emit(item.id)"
          data-testid="toggle-checklist-item-button"
        >
          Toggle
        </button>
        <button
          (click)="edit.emit(item)"
          data-testid="edit-checklist-item-button"
        >
          Edit
        </button>
        <button
          (click)="delete.emit(item.id)"
          data-testid="delete-checklist-item-button"
        >
          Delete
        </button>
      </li>
      } @empty {
      <div>
        <h2>Add an item</h2>
        <p data-testid="no-checklist-items-message">
          Click the add button to add your first item to this quicklist
        </p>
      </div>
      }
    </ul>
  `,
  imports: [CommonModule],
})
export class ChecklistItemListComponent {
  @Input({ required: true }) checklistItems!: ChecklistItem[];
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<ChecklistItem>();
  @Output() toggle = new EventEmitter<string>();
}
