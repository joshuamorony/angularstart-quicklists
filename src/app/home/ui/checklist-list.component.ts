import { Component, Input } from '@angular/core';
import { Checklist } from 'src/app/shared/interfaces/checklist';

@Component({
  standalone: true,
  selector: 'app-checklist-list',
  template: `
    <p data-testid="no-checklists-message">
      Click the add button to add your first checklist!
    </p>
  `,
})
export class ChecklistListComponent {
  @Input({ required: true }) checklists!: Checklist[];
}
