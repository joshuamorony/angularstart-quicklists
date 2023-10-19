import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChecklistItem } from 'src/app/shared/interfaces/checklist-item';

@Component({
  standalone: true,
  selector: 'app-checklist-item-list',
  template: `
    <section>
      <ul>
        @for (item of checklistItems; track item.id){
        <li data-testid="checklist-item">
          <div>
            @if (item.checked){
            <span data-testid="checked-indicator">✅</span>
            }
            {{ item.title }}
          </div>
          <div>
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
          </div>
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
    </section>
  `,
  styles: [
    `
      ul {
        padding: 0;
        margin: 0;
      }
      li {
        font-size: 1.5em;
        display: flex;
        justify-content: space-between;
        background: var(--color-light);
        list-style-type: none;
        margin-bottom: 1rem;
        padding: 1rem;

        button {
          margin-left: 1rem;
        }
      }
    `,
  ],
  imports: [CommonModule],
})
export class ChecklistItemListComponent {
  @Input({ required: true }) checklistItems!: ChecklistItem[];
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<ChecklistItem>();
  @Output() toggle = new EventEmitter<string>();
}
