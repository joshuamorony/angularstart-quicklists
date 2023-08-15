import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-form-modal',
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="save.emit(); close.emit()">
      <div *ngFor="let control of formGroup.controls | keyvalue">
        <label [for]="control.key">{{ control.key }}</label>
        <input [id]="control.key" type="text" [formControlName]="control.key" />
      </div>
      <button type="submit">Save</button>
    </form>
  `,
  imports: [ReactiveFormsModule, CommonModule],
})
export class FormModalComponent {
  @Input({ required: true }) formGroup!: FormGroup;
  @Output() save = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
}
