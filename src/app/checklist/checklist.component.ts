import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChecklistHeaderComponent } from './ui/checklist-header.component';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChecklistItemListComponent } from './ui/checklist-item-list.component';

@Component({
  standalone: true,
  selector: 'app-checklist',
  template: `
    <app-checklist-header
      *ngIf="checklist() as checklist"
      [checklist]="checklist"
    />

    <app-checklist-item-list [checklistItems]="[]" />
  `,
  imports: [CommonModule, ChecklistHeaderComponent, ChecklistItemListComponent],
})
export default class ChecklistComponent {
  checklistService = inject(ChecklistService);
  route = inject(ActivatedRoute);

  params = toSignal(this.route.paramMap);

  checklist = computed(() =>
    this.checklistService
      .checklists()
      .find((checklist) => checklist.id === this.params()?.get('id'))
  );
}
