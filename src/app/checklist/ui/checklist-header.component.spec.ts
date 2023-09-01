import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChecklistHeaderComponent } from './checklist-header.component';
import { By } from '@angular/platform-browser';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { RouterTestingModule } from '@angular/router/testing';

describe('ChecklistHeaderComponent', () => {
  let component: ChecklistHeaderComponent;
  let fixture: ComponentFixture<ChecklistHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChecklistHeaderComponent, RouterTestingModule],
    })
      .overrideComponent(ChecklistHeaderComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ChecklistHeaderComponent);
    component = fixture.componentInstance;

    component.checklist = {
      id: 'one',
      title: 'one',
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('output: addItem', () => {
    it('should emit when add item button is clicked', () => {
      const observerSpy = subscribeSpyTo(component.addItem);

      const addButton = fixture.debugElement.query(
        By.css('[data-testid="create-checklist-item-button"]')
      );

      addButton.nativeElement.click();

      expect(observerSpy.getValuesLength()).toEqual(1);
    });
  });

  describe('output: resetChecklist', () => {
    it('should emit with the current checklistId when reset button is clicked', () => {
      const observerSpy = subscribeSpyTo(component.resetChecklist);

      const resetButton = fixture.debugElement.query(
        By.css('[data-testid="reset-items-button"]')
      );

      resetButton.nativeElement.click();

      expect(observerSpy.getLastValue()).toEqual(component.checklist.id);
    });
  });
});
