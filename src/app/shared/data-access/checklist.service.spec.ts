import { TestBed } from '@angular/core/testing';
import { ChecklistService } from './checklist.service';

describe('ChecklistService', () => {
  let service: ChecklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChecklistService],
    });

    service = TestBed.inject(ChecklistService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('source: add$', () => {
    let testData = { title: 'test' };

    beforeEach(() => {
      service.add$.next(testData);
    });

    it('should add the supplied data to the checklists array', () => {
      expect(
        service
          .checklists()
          .find((checklist) => checklist.title === testData.title)
      ).toBeTruthy();
    });

    it('should not remove other data from the checklists array', () => {
      service.add$.next({ title: 'another' });
      expect(service.checklists().length).toEqual(2);
    });
  });

  describe('source: remove$', () => {
    beforeEach(() => {
      // add some test data
      service.add$.next({ title: 'abc' });
      service.add$.next({ title: 'def' });
      service.add$.next({ title: 'ghi' });
    });

    it('should remove the checklist with the supplied id', () => {
      const testChecklist = service.checklists()[0];
      service.remove$.next(testChecklist.id);
      expect(
        service
          .checklists()
          .find((checklist) => checklist.id === testChecklist.id)
      ).toBeFalsy();
    });

    it('should NOT remove checklists that do not match the id', () => {
      const testChecklist = service.checklists()[0];
      const prevLength = service.checklists().length;
      service.remove$.next(testChecklist.id);
      expect(service.checklists().length).toEqual(prevLength - 1);
    });
  });
});
