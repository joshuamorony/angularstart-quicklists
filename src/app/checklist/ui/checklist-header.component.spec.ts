import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChecklistHeaderComponent } from './checklist-header.component';
import { By } from '@angular/platform-browser';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

describe('ChecklistHeaderComponent', () => {
  let component: ChecklistHeaderComponent;
  let fixture: ComponentFixture<ChecklistHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChecklistHeaderComponent],
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

      addButton.nativeElement().click();

      expect(observerSpy.getValuesLength()).toEqual(1);
    });
  });
});
