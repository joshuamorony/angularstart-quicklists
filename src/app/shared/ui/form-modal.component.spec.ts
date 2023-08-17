import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormModalComponent } from './form-modal.component';
import { FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-form-modal',
  template: `<div></div>`,
})
export class MockFormModalComponent {
  @Input() formGroup!: FormGroup;
  @Output() save = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
}

describe('FormModalComponent', () => {
  let component: FormModalComponent;
  let fixture: ComponentFixture<FormModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormModalComponent],
    })
      .overrideComponent(FormModalComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(FormModalComponent);
    component = fixture.componentInstance;

    component.formGroup = new FormGroup({
      title: new FormControl(),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('input: formGroup', () => {
    it('should render a text input for each control', () => {
      const controls = {
        testOne: new FormControl(''),
        testTwo: new FormControl(''),
        testThree: new FormControl(''),
      };

      component.formGroup = new FormGroup(controls);

      fixture.detectChanges();

      const inputs = fixture.debugElement.queryAll(
        By.css('input[type="text"]')
      );

      expect(inputs.length).toEqual(Object.entries(controls).length);
    });

    it('should bind the inputs to the controls', () => {
      const testValue = 'hello';

      component.formGroup = new FormGroup({
        title: new FormControl(testValue),
      });

      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[type="text"]'));

      expect(input.nativeElement.value).toEqual(testValue);
    });

    it('should use the form control name as label for input', () => {
      component.formGroup = new FormGroup({
        title: new FormControl(),
      });

      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('label'));

      expect(label.nativeElement.innerHTML).toContain('title');
    });
  });

  describe('output: save', () => {
    it('should emit when the save button is clicked', () => {
      const observerSpy = subscribeSpyTo(component.save);

      const saveButton = fixture.debugElement.query(
        By.css('form button[type="submit"]')
      );

      saveButton.nativeElement.click();

      expect(observerSpy.getValuesLength()).toEqual(1);
    });
  });

  describe('output: close', () => {
    let closeSpy: SubscriberSpy<void>;

    beforeEach(() => {
      closeSpy = subscribeSpyTo(component.close);
    });

    it('should emit when save button is clicked', () => {
      const saveButton = fixture.debugElement.query(
        By.css('form button[type="submit"]')
      );

      saveButton.nativeElement.click();

      expect(closeSpy.getValuesLength()).toEqual(1);
    });

    it('should emit when the close button is clicked', () => {
      const closeButton = fixture.debugElement.query(
        By.css('[data-testid="close-modal-button"]')
      );

      closeButton.nativeElement.click();

      expect(closeSpy.getValuesLength()).toEqual(1);
    });
  });
});
