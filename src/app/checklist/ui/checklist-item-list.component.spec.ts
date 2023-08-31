import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChecklistItemListComponent } from './checklist-item-list.component';
import { By } from '@angular/platform-browser';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

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
    it('should render a list item for each element', () => {
      const testData = [{}, {}, {}] as any;
      component.checklistItems = testData;

      fixture.detectChanges();

      const result = fixture.debugElement.queryAll(
        By.css('[data-testid="checklist-item"]')
      );

      expect(result.length).toEqual(testData.length);
    });

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

  describe('output: delete', () => {
    it('should emit checklist item id to be deleted', () => {
      const testData = [{ id: '1', title: 'test' }] as any;
      component.checklistItems = testData;

      const observerSpy = subscribeSpyTo(component.delete);

      fixture.detectChanges();

      const deleteButton = fixture.debugElement.query(
        By.css('[data-testid="delete-checklist-item-button"]')
      );
      deleteButton.nativeElement.click();

      expect(observerSpy.getLastValue()).toEqual(testData[0].id);
    });
  });

  describe('output: toggle', () => {
    it('should emit checklist item id to be toggled', () => {
      const testData = [{ id: '1', title: 'test' }] as any;
      component.checklistItems = testData;

      const observerSpy = subscribeSpyTo(component.toggle);

      fixture.detectChanges();

      const toggleButton = fixture.debugElement.query(
        By.css('[data-testid="toggle-checklist-item-button"]')
      );
      toggleButton.nativeElement.click();

      expect(observerSpy.getLastValue()).toEqual(testData[0].id);
    });
  });

  describe('output: edit', () => {
    it('should emit checklist item to be edited', () => {
      const testData = [{ id: '1', title: 'test' }] as any;
      component.checklistItems = testData;

      const observerSpy = subscribeSpyTo(component.edit);
      fixture.detectChanges();

      const editButton = fixture.debugElement.query(
        By.css('[data-testid="edit-checklist-item-button"]')
      );

      editButton.nativeElement.click();

      expect(observerSpy.getLastValue()).toEqual(testData[0]);
    });
  });
});
