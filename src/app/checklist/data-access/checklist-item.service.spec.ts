import { TestBed } from '@angular/core/testing';
import { ChecklistItemService } from './checklist-item.service';

describe('ChecklistItemService', () => {
  let service: ChecklistItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChecklistItemService],
    });

    service = TestBed.inject(ChecklistItemService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('source: add$', () => {
    let item = { title: 'test' };
    let checklistId = 'one';

    beforeEach(() => {
      service.add$.next({ item, checklistId });
    });

    it('should add the supplied data to the checklists array', () => {
      expect(
        service
          .checklistItems()
          .find((checklistItem) => checklistItem.title === item.title)
      ).toBeTruthy();
    });

    it('should not remove other data from the checklists array', () => {
      service.add$.next({ item, checklistId });
      expect(service.checklistItems().length).toEqual(2);
    });
  });

  describe('source: edit$', () => {
    let preEdit = { title: 'test' };
    let postEdit = { title: 'edited' };
    const checklistId = '1';

    beforeEach(() => {
      service.add$.next({ item: preEdit, checklistId });
      const addedChecklistItem = service.checklistItems()[0];
      service.edit$.next({ id: addedChecklistItem.id, data: { ...postEdit } });
    });

    it('should edit the checklist with the supplied data', () => {
      const checklist = service.checklistItems()[0];
      expect(checklist).toEqual({
        id: checklist.id,
        checklistId,
        checked: false,
        ...postEdit,
      });
    });
  });

  describe('source: remove$', () => {
    beforeEach(() => {
      // add some test data
      Date.now = jest.fn(() => 1);
      service.add$.next({ item: { title: 'abc' }, checklistId: '1' });
      Date.now = jest.fn(() => 2);
      service.add$.next({ item: { title: 'def' }, checklistId: '2' });
      Date.now = jest.fn(() => 3);
      service.add$.next({ item: { title: 'ghi' }, checklistId: '3' });
    });

    it('should remove the checklist with the supplied id', () => {
      const testChecklistItem = service.checklistItems()[0];
      service.remove$.next(testChecklistItem.id);
      expect(
        service
          .checklistItems()
          .find((checklistItem) => checklistItem.id === testChecklistItem.id)
      ).toBeFalsy();
    });

    it('should NOT remove checklists that do not match the id', () => {
      const testChecklistItem = service.checklistItems()[0];
      const prevLength = service.checklistItems().length;
      service.remove$.next(testChecklistItem.id);
      expect(service.checklistItems().length).toEqual(prevLength - 1);
    });
  });
});
