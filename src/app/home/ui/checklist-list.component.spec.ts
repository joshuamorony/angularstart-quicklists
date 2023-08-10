import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChecklistListComponent } from './checklist-list.component';
import { By } from '@angular/platform-browser';

describe('ChecklistListComponent', () => {
  let component: ChecklistListComponent;
  let fixture: ComponentFixture<ChecklistListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChecklistListComponent],
    })
      .overrideComponent(ChecklistListComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ChecklistListComponent);
    component = fixture.componentInstance;

    component.checklists = [];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('input: checklists', () => {
    it('should render empty message when checklists are empty', () => {
      const testData = [] as any;
      component.checklists = testData;

      fixture.detectChanges();

      const emptyMessage = fixture.debugElement.query(
        By.css('[data-testid="no-checklists-message"]')
      );

      expect(emptyMessage).toBeTruthy();
    });

    it('should NOT render empty if there are checklists', () => {
      const testData = [{}] as any;
      component.checklists = testData;

      fixture.detectChanges();

      const emptyMessage = fixture.debugElement.query(
        By.css('[data-testid="no-checklists-message"]')
      );

      expect(emptyMessage).toBeFalsy();
    });
  });
});
