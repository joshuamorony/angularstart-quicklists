import { Component } from '@angular/core';
import { ChecklistListComponent } from './ui/checklist-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <button data-testid="create-checklist-button">Add</button>
    <app-checklist-list [checklists]="[]" />
  `,
  imports: [ChecklistListComponent],
})
export default class HomeComponent {}
