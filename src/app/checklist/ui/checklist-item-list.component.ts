import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChecklistItem } from 'src/app/shared/interfaces/checklist-item';

@Component({
  standalone: true,
  selector: 'app-checklist-item-list',
  template: `
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
}
