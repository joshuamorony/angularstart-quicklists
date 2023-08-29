import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChecklistHeaderComponent } from './ui/checklist-header.component';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChecklistItemListComponent } from './ui/checklist-item-list.component';
import { ModalComponent } from '../shared/ui/modal.component';
import { ChecklistItem } from '../shared/interfaces/checklist-item';

@Component({
  standalone: true,
  selector: 'app-checklist',
  template: `
    <app-checklist-header
      *ngIf="checklist() as checklist"
      [checklist]="checklist"
      (addItem)="checklistItemBeingEdited.set({})"
    />

    <app-checklist-item-list [checklistItems]="[]" />

    <app-modal [isOpen]="!!checklistItemBeingEdited()">
      <ng-template> </ng-template>
    </app-modal>
  `,
  imports: [
    CommonModule,
    ChecklistHeaderComponent,
    ChecklistItemListComponent,
    ModalComponent,
  ],
})
export default class ChecklistComponent {
  checklistService = inject(ChecklistService);
  route = inject(ActivatedRoute);

  checklistItemBeingEdited = signal<Partial<ChecklistItem> | null>(null);

  params = toSignal(this.route.paramMap);

  checklist = computed(() =>
    this.checklistService
      .checklists()
      .find((checklist) => checklist.id === this.params()?.get('id'))
  );
}
