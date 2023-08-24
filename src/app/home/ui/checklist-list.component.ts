import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Checklist } from 'src/app/shared/interfaces/checklist';

@Component({
  standalone: true,
  selector: 'app-checklist-list',
  template: `
    <ul>
      <li
        *ngFor="let checklist of checklists; trackBy: trackByFn"
        data-testid="checklist-item"
      >
        <a
          routerLink="/checklist/{{ checklist.id }}"
          data-testid="checklist-link"
        >
          {{ checklist.title }}
        </a>
        <button (click)="edit.emit(checklist)" data-testid="edit-checklist">
          Edit
        </button>
        <button
          (click)="delete.emit(checklist.id)"
          data-testid="delete-checklist"
        >
          Delete
        </button>
      </li>
    </ul>

    <p *ngIf="!checklists.length" data-testid="no-checklists-message">
      Click the add button to create your first checklist!
    </p>
  `,
  imports: [CommonModule, RouterModule],
})
export class ChecklistListComponent {
  @Input({ required: true }) checklists!: Checklist[];
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Checklist>();

  trackByFn(index: number, checklist: Checklist) {
    return checklist.id;
  }
}
