import { TestBed } from '@angular/core/testing';
import { ChecklistService } from './checklist.service';
import { Subject } from 'rxjs';
import { StorageService } from './storage.service';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

describe('ChecklistService', () => {
  let service: ChecklistService;
  let loadChecklistsSubject: Subject<any>;

  beforeEach(() => {
    loadChecklistsSubject = new Subject();

    TestBed.configureTestingModule({
      providers: [
        ChecklistService,
        {
          provide: StorageService,
          useValue: {
            loadChecklists: jest.fn().mockReturnValue(loadChecklistsSubject),
          },
        },
      ],
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

  describe('source: edit$', () => {
    let preEdit = { title: 'test' };
    let postEdit = { title: 'edited' };

    beforeEach(() => {
      service.add$.next(preEdit);
      const addedChecklist = service.checklists()[0];
      service.edit$.next({ id: addedChecklist.id, data: { ...postEdit } });
    });

    it('should edit the checklist with the supplied data', () => {
      const checklist = service.checklists()[0];
      expect(checklist).toEqual({ id: checklist.id, ...postEdit });
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

  describe('source: checklistsLoaded$', () => {
    it('should update checklists state when loadChecklists() emits', () => {
      const testData = [{}, {}];
      loadChecklistsSubject.next(testData);
      expect(service.checklists()).toEqual(testData);
    });

    it('should set loaded flag to true if loaded successfully', () => {
      expect(service.loaded()).toEqual(false);
      loadChecklistsSubject.next([]);
      expect(service.loaded()).toEqual(true);
    });
  });
});
