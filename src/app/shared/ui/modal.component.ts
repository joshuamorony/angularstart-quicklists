import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-modal',
  template: ``,
})
export class ModalComponent {
  @Input({ required: true }) isOpen!: boolean;
}
