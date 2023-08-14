import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-form-modal',
  template: ` <p>Hello world</p> `,
})
export class FormModalComponent {
  @Input({ required: true }) formGroup!: FormGroup;
}
