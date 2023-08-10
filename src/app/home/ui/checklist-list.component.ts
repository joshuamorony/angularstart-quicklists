import { Component, Input } from '@angular/core';
import { Checklist } from 'src/app/shared/interfaces/checklist';

@Component({
  standalone: true,
  selector: 'app-checklist-list',
  template: ` <p>Hello world</p> `,
})
export class ChecklistListComponent {
  @Input({ required: true }) checklists!: Checklist[];
}
