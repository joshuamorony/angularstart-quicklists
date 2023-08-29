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
});
