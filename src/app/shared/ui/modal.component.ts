import { Dialog } from '@angular/cdk/dialog';
import {
  Component,
  TemplateRef,
  contentChild,
  effect,
  inject,
  input,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-modal',
  template: `<div></div>`,
})
export class ModalComponent {
  dialog = inject(Dialog);
  isOpen = input.required<boolean>();
  template = contentChild.required(TemplateRef);

  constructor() {
    effect(() => {
      const isOpen = this.isOpen();

      if (isOpen) {
        this.dialog.open(this.template(), { panelClass: 'dialog-container' });
      } else {
        this.dialog.closeAll();
      }
    });
  }
}
