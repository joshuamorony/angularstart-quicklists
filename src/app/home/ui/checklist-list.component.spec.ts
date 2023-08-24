import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ChecklistListComponent } from './checklist-list.component';
import { By } from '@angular/platform-browser';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Checklist } from 'src/app/shared/interfaces/checklist';

@Component({
  standalone: true,
  selector: 'app-checklist-list',
  template: ` <p>Hello world</p> `,
})
export class MockChecklistListComponent {
  @Input({ required: true }) checklists!: Checklist[];
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Checklist>();
}

describe('ChecklistListComponent', () => {
  let component: ChecklistListComponent;
  let fixture: ComponentFixture<ChecklistListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChecklistListComponent, RouterTestingModule],
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
    it('should render a list item for each element', () => {
      const testData = [{}, {}, {}] as any;
      component.checklists = testData;

      fixture.detectChanges();

      const result = fixture.debugElement.queryAll(
        By.css('[data-testid="checklist-item"]')
      );

      expect(result.length).toEqual(testData.length);
    });

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

  describe('output: delete', () => {
    it('should emit checklist id to be deleted', () => {
      const testData = [{ id: '1', title: 'test' }] as any;
      component.checklists = testData;

      const observerSpy = subscribeSpyTo(component.delete);

      fixture.detectChanges();

      const deleteButton = fixture.debugElement.query(
        By.css('[data-testid="delete-checklist"]')
      );
      deleteButton.nativeElement.click();

      expect(observerSpy.getLastValue()).toEqual(testData[0].id);
    });
  });

  describe('output: edit', () => {
    it('should emit checklist to be edited', () => {
      const testData = [{ id: '1', title: 'test' }];
      component.checklists = testData;

      const observerSpy = subscribeSpyTo(component.edit);
      fixture.detectChanges();

      const editButton = fixture.debugElement.query(
        By.css('[data-testid="edit-checklist"]')
      );

      editButton.nativeElement.click();

      expect(observerSpy.getLastValue()).toEqual(testData[0]);
    });
  });
});
