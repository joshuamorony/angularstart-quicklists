import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-form-modal',
  template: `
    <button (click)="close.emit()" data-testid="close-modal-button">
      close
    </button>
    <form [formGroup]="formGroup" (ngSubmit)="save.emit(); close.emit()">
      @for (control of formGroup.controls | keyvalue; track control.key){
      <div>
        <label [for]="control.key">{{ control.key }}</label>
        <input [id]="control.key" type="text" [formControlName]="control.key" />
      </div>
      }
      <button type="submit" data-testid="save-checklist-button">Save</button>
    </form>
  `,
  imports: [ReactiveFormsModule, CommonModule],
})
export class FormModalComponent {
  @Input({ required: true }) formGroup!: FormGroup;
  @Output() save = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
}
