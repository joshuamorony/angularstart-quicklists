import { Dialog } from '@angular/cdk/dialog';
import {
  Component,
  ContentChild,
  Input,
  TemplateRef,
  inject,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-modal',
  template: `<div></div>`,
})
export class ModalComponent {
  dialog = inject(Dialog);

  @Input() set isOpen(value: boolean) {
    if (value) {
      this.dialog.open(this.template, { panelClass: 'dialog-container' });
    } else {
      this.dialog.closeAll();
    }
  }

  @ContentChild(TemplateRef, { static: false }) template!: TemplateRef<any>;
}
