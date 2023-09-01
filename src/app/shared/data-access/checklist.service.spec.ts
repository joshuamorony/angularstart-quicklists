import { TestBed } from '@angular/core/testing';
import { ChecklistService } from './checklist.service';
import { Subject } from 'rxjs';
import { StorageService } from './storage.service';
import { Component, Injector, runInInjectionContext } from '@angular/core';
import { ChecklistItemService } from 'src/app/checklist/data-access/checklist-item.service';

describe('ChecklistService', () => {
  let service: ChecklistService;
  let storageService: StorageService;
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
            saveChecklists: jest.fn(),
          },
        },
        {
          provide: ChecklistItemService,
          useValue: {
            checklistRemoved$: new Subject(),
          },
        },
      ],
    });

    service = TestBed.inject(ChecklistService);
    storageService = TestBed.inject(StorageService);
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

    it('should set the error state if load fails', () => {
      expect(service.error()).toEqual(null);
      const testError = 'err';
      loadChecklistsSubject.error(testError);
      expect(service.error()).toEqual(testError);
    });
  });

  describe('effect: checklists()', () => {
    it('should call saveChecklists method with checklists when checklists() changes', () => {
      const { flushEffects } = setUp();
      loadChecklistsSubject.next([]);
      service.add$.next({ title: 'test' });
      flushEffects();
      expect(storageService.saveChecklists).toHaveBeenCalledWith(
        service.checklists()
      );
    });

    it('should NOT call saveChecklists if the loaded flag is false', () => {
      const { flushEffects } = setUp();
      service.add$.next({ title: 'test' });
      flushEffects();
      expect(storageService.saveChecklists).not.toHaveBeenCalledWith();
    });
  });

  function setUp() {
    /*
     * https://github.com/jscutlery/devkit/blob/43924070eb8433f56ff9a2e65a24bf48b4a5122e/packages/rx-computed/src/lib/rx-computed.spec.ts#L133
     */
    const { flushEffects } = setUpSignalTesting();

    return {
      flushEffects,
    };
  }
});

function setUpWithoutInjectionContext() {
  const { flushEffects } = setUpSignalTesting();

  return {
    flushEffects,
  };
}

function setUpSignalTesting() {
  const injector = TestBed.inject(Injector);
  const fixture = TestBed.createComponent(NoopComponent);

  /* Inspiration: https://github.com/angular/angular/blob/06b498f67f2ad16bb465ef378bdb16da84e41a1c/packages/core/rxjs-interop/test/to_observable_spec.ts#LL30C25-L30C25 */
  return {
    flushEffects() {
      fixture.detectChanges();
    },
    runInTestingInjectionContext<T>(fn: () => T): T {
      return runInInjectionContext(injector, fn);
    },
  };
}

@Component({
  standalone: true,
  template: '',
})
class NoopComponent {}
