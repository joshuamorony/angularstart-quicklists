import { Component, effect, inject, signal } from '@angular/core';
import { ChecklistListComponent } from './ui/checklist-list.component';
import { Checklist } from '../shared/interfaces/checklist';
import { ModalComponent } from '../shared/ui/modal.component';
import { FormModalComponent } from '../shared/ui/form-modal.component';
import { FormBuilder } from '@angular/forms';
import { ChecklistService } from '../shared/data-access/checklist.service';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <header>
      <h1>Quicklists</h1>
      <button (click)="checklistBeingEdited.set({})">Add Checklist</button>
    </header>

    <section>
      <h2>Your checklists</h2>

      <app-checklist-list
        [checklists]="checklistService.checklists()"
        (delete)="checklistService.remove$.next($event)"
        (edit)="checklistBeingEdited.set($event)"
      />
    </section>

    <app-modal [isOpen]="!!checklistBeingEdited()">
      <ng-template>
        <app-form-modal
          [title]="
            checklistBeingEdited()?.title
              ? checklistBeingEdited()!.title!
              : 'Add Checklist'
          "
          [formGroup]="checklistForm"
          (save)="
            checklistBeingEdited()?.id
              ? checklistService.edit$.next({
                  id: checklistBeingEdited()!.id!,
                  data: checklistForm.getRawValue()
                })
              : checklistService.add$.next(checklistForm.getRawValue())
          "
          (close)="checklistBeingEdited.set(null)"
        />
      </ng-template>
    </app-modal>
  `,
  imports: [ChecklistListComponent, ModalComponent, FormModalComponent],
})
export default class HomeComponent {
  formBuilder = inject(FormBuilder);
  checklistService = inject(ChecklistService);

  checklistBeingEdited = signal<Partial<Checklist> | null>(null);

  checklistForm = this.formBuilder.nonNullable.group({
    title: [''],
  });

  constructor() {
    effect(() => {
      const checklist = this.checklistBeingEdited();

      if (!checklist) {
        this.checklistForm.reset();
      } else {
        this.checklistForm.patchValue({
          title: checklist.title,
        });
      }
    });
  }
}
