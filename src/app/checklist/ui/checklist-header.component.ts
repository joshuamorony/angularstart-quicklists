import { Component, Input } from '@angular/core';
import { Checklist } from 'src/app/shared/interfaces/checklist';

@Component({
  standalone: true,
  selector: 'app-checklist-header',
  template: `
    <header>
      <h1 data-testid="checklist-title">
        {{ checklist.title }}
      </h1>
    </header>
  `,
})
export class ChecklistHeaderComponent {
  @Input({ required: true }) checklist!: Checklist;
}
