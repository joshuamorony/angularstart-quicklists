import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  standalone: true,
  selector: 'app-modal',
  template: ``,
})
export class MockModalComponent {
  @Input() isOpen!: boolean;
}

@Component({
  standalone: true,
  template: `
    <app-modal [isOpen]="isOpen">
      <ng-template #testTemplate>
        <p>test content</p>
      </ng-template>
    </app-modal>
  `,
  imports: [ModalComponent],
})
class TestHostComponent {
  isOpen = false;
  @ViewChild('testTemplate') templateRef!: TemplateRef<any>;
}

describe('ModalComponent', () => {
  let component: ModalComponent;
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let dialog: Dialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalComponent, TestHostComponent],
      providers: [
        {
          provide: Dialog,
          useValue: {
            open: jest.fn(),
            closeAll: jest.fn(),
          },
        },
      ],
    })
      .overrideComponent(ModalComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    dialog = TestBed.inject(Dialog);

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('input: isOpen', () => {
    it('should call open method of dialog with template ref when changed to true', () => {
      hostComponent.isOpen = true;
      fixture.detectChanges();

      expect(dialog.open).toHaveBeenCalledWith(hostComponent.templateRef);
    });

    it('should call closeAll method of dialog when changed to false', () => {
      hostComponent.isOpen = true;
      fixture.detectChanges();
      hostComponent.isOpen = false;
      fixture.detectChanges();

      expect(dialog.closeAll).toHaveBeenCalled();
    });
  });
});
