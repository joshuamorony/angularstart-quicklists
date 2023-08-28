import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChecklistItemListComponent } from './checklist-item-list.component';
import { By } from '@angular/platform-browser';

describe('ChecklistItemListComponent', () => {
  let component: ChecklistItemListComponent;
  let fixture: ComponentFixture<ChecklistItemListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChecklistItemListComponent],
    })
      .overrideComponent(ChecklistItemListComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ChecklistItemListComponent);
    component = fixture.componentInstance;

    component.checklistItems = [];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('input: checklistItems', () => {
    it('should render empty message when checklist items are empty', () => {
      const testData = [] as any;
      component.checklistItems = testData;

      fixture.detectChanges();

      const emptyMessage = fixture.debugElement.query(
        By.css('[data-testid="no-checklist-items-message"]')
      );

      expect(emptyMessage).toBeTruthy();
    });

    it('should NOT render empty if there are checklists', () => {
      const testData = [{}] as any;
      component.checklistItems = testData;

      fixture.detectChanges();

      const emptyMessage = fixture.debugElement.query(
        By.css('[data-testid="no-checklist-items-message"]')
      );

      expect(emptyMessage).toBeFalsy();
    });
  });
});
