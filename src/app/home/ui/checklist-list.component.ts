import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Checklist } from 'src/app/shared/interfaces/checklist';

@Component({
  standalone: true,
  selector: 'app-checklist-list',
  template: `
    <p *ngIf="!checklists.length" data-testid="no-checklists-message">
      Click the add button to add your first checklist!
    </p>
  `,
  imports: [CommonModule],
})
export class ChecklistListComponent {
  @Input({ required: true }) checklists!: Checklist[];
}
