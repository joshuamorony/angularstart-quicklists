import { TestBed } from '@angular/core/testing';
import { ChecklistItemService } from './checklist-item.service';
import { Component, Injector, runInInjectionContext } from '@angular/core';
import { StorageService } from 'src/app/shared/data-access/storage.service';
import { Subject } from 'rxjs';

describe('ChecklistItemService', () => {
  let service: ChecklistItemService;
  let storageService: StorageService;
  let loadChecklistItemsSubject: Subject<any>;

  beforeEach(() => {
    loadChecklistItemsSubject = new Subject();

    TestBed.configureTestingModule({
      providers: [
        ChecklistItemService,
        {
          provide: StorageService,
          useValue: {
            loadChecklistItems: jest
              .fn()
              .mockReturnValue(loadChecklistItemsSubject),
            saveChecklistItems: jest.fn(),
          },
        },
      ],
    });

    service = TestBed.inject(ChecklistItemService);
    storageService = TestBed.inject(StorageService);
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

  describe('source: toggle$', () => {
    beforeEach(() => {
      // add some test data
      Date.now = jest.fn(() => 1);
      service.add$.next({ item: { title: 'abc' }, checklistId: '1' });
      Date.now = jest.fn(() => 2);
      service.add$.next({ item: { title: 'def' }, checklistId: '2' });
      Date.now = jest.fn(() => 3);
      service.add$.next({ item: { title: 'ghi' }, checklistId: '3' });
    });

    it('should toggle the checklist with the supplied id', () => {
      const testChecklistItem = service.checklistItems()[0];
      service.toggle$.next(testChecklistItem.id);
      expect(
        service
          .checklistItems()
          .find((checklistItem) => checklistItem.id === testChecklistItem.id)
          ?.checked
      ).toEqual(true);
    });

    it('should NOT toggle checklists that do not match the id', () => {
      const testChecklistItem = service.checklistItems()[0];
      service.toggle$.next(testChecklistItem.id);
      expect(
        service
          .checklistItems()
          .filter((checklistItem) => checklistItem.id !== testChecklistItem.id)
          .every((item) => !item.checked)
      ).toBeTruthy();
    });
  });

  describe('source: reset$', () => {
    beforeEach(() => {
      // add some test data
      Date.now = jest.fn(() => 1);
      service.add$.next({ item: { title: 'abc' }, checklistId: '1' });
      Date.now = jest.fn(() => 2);
      service.add$.next({ item: { title: 'def' }, checklistId: '1' });
      Date.now = jest.fn(() => 3);
      service.add$.next({ item: { title: 'ghi' }, checklistId: '3' });

      service.toggle$.next('1');
      service.toggle$.next('2');
      service.toggle$.next('3');
    });

    it('should set checked of all items matching checklistId to false', () => {
      service.reset$.next('1');

      expect(
        service
          .checklistItems()
          .filter((item) => item.checklistId === '1')
          .every((item) => item.checked === false)
      ).toBeTruthy();
    });

    it('should not set checked status of NON matching items to false', () => {
      service.reset$.next('1');
      expect(
        service
          .checklistItems()
          .filter((item) => item.checklistId !== '1')
          .every((item) => item.checked === true)
      ).toBeTruthy();
    });
  });

  describe('source: checklistRemoved$', () => {
    beforeEach(() => {
      // add some test data
      Date.now = jest.fn(() => 1);
      service.add$.next({ item: { title: 'abc' }, checklistId: '1' });
      Date.now = jest.fn(() => 2);
      service.add$.next({ item: { title: 'def' }, checklistId: '1' });
      Date.now = jest.fn(() => 3);
      service.add$.next({ item: { title: 'ghi' }, checklistId: '3' });
    });

    it('should remove every checklist item that matches checklistId', () => {
      service.checklistRemoved$.next('1');
      expect(
        service.checklistItems().find((item) => item.checklistId === '1')
      ).toBeFalsy();
    });

    it('should NOT remove checklist items that dont match the checklistId', () => {
      service.checklistRemoved$.next('1');
      expect(
        service.checklistItems().find((item) => item.checklistId === '3')
      ).toBeTruthy();
    });
  });

  describe('source: checklistItemsLoaded$', () => {
    it('should update checklistItems state when loadChecklists() emits', () => {
      const testData = [{}, {}];
      loadChecklistItemsSubject.next(testData);
      expect(service.checklistItems()).toEqual(testData);
    });

    it('should set loaded flag to true if loaded successfully', () => {
      expect(service.loaded()).toEqual(false);
      loadChecklistItemsSubject.next([]);
      expect(service.loaded()).toEqual(true);
    });
  });

  describe('effect: checklistItems()', () => {
    it('should call saveChecklistItems method with checklistItems when checklistItems() changes', () => {
      const { flushEffects } = setUp();
      loadChecklistItemsSubject.next([]);
      service.add$.next({ item: { title: 'test' }, checklistId: '1' });
      flushEffects();
      expect(storageService.saveChecklistItems).toHaveBeenCalledWith(
        service.checklistItems()
      );
    });

    it('should NOT call saveChecklistItems if the loaded flag is false', () => {
      const { flushEffects } = setUp();
      service.add$.next({ item: { title: 'test' }, checklistId: '1' });
      flushEffects();
      expect(storageService.saveChecklistItems).not.toHaveBeenCalledWith();
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
