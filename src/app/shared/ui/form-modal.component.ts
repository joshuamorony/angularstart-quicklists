import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-form-modal',
  template: `
    <form [formGroup]="formGroup">
      <div *ngFor="let control of formGroup.controls | keyvalue">
        <label [for]="control.key">{{ control.key }}</label>
        <input [id]="control.key" type="text" [formControlName]="control.key" />
      </div>
    </form>
  `,
  imports: [ReactiveFormsModule, CommonModule],
})
export class FormModalComponent {
  @Input({ required: true }) formGroup!: FormGroup;
}
