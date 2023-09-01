import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService],
    });

    jest.clearAllMocks();

    service = TestBed.inject(StorageService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('loadChecklists', () => {
    it('should return an observable of whatever data is stored on the "checklists" key', () => {
      const testData = [{}, {}];
      const getItem = jest
        .spyOn(Storage.prototype, 'getItem')
        .mockReturnValue(JSON.stringify(testData));

      const observerSpy = subscribeSpyTo(service.loadChecklists());

      expect(observerSpy.getLastValue()).toEqual(testData);
      expect(getItem).toHaveBeenCalledWith('checklists');
      expect(getItem).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if value is null in storage', () => {
      const getItem = jest
        .spyOn(Storage.prototype, 'getItem')
        .mockReturnValue(null);

      const observerSpy = subscribeSpyTo(service.loadChecklists());

      expect(observerSpy.getLastValue()).toEqual([]);
      expect(getItem).toHaveBeenCalledWith('checklists');
      expect(getItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('saveChecklists()', () => {
    it('should call setItem of local storage on checklists key with supplied data', () => {
      const setItem = jest.spyOn(Storage.prototype, 'setItem');

      const testChecklists = [{}, {}] as any;

      service.saveChecklists(testChecklists);

      expect(setItem).toHaveBeenCalledWith(
        'checklists',
        JSON.stringify(testChecklists)
      );
    });
  });

  describe('loadChecklistItems()', () => {
    it('should return an observable of whatever data is stored on the "checklistsItems" key', () => {
      const testData = [{}, {}];
      const getItem = jest
        .spyOn(Storage.prototype, 'getItem')
        .mockReturnValue(JSON.stringify(testData));

      const observerSpy = subscribeSpyTo(service.loadChecklistItems());

      expect(observerSpy.getLastValue()).toEqual(testData);
      expect(getItem).toHaveBeenCalledWith('checklistItems');
      expect(getItem).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if value is null in storage', () => {
      const getItem = jest
        .spyOn(Storage.prototype, 'getItem')
        .mockReturnValue(null);

      const observerSpy = subscribeSpyTo(service.loadChecklistItems());

      expect(observerSpy.getLastValue()).toEqual([]);
      expect(getItem).toHaveBeenCalledWith('checklistItems');
      expect(getItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('saveChecklistItems()', () => {
    it('should call setItem of local storage on checklistItems key with supplied data', () => {
      const setItem = jest.spyOn(Storage.prototype, 'setItem');

      const testChecklistItems = [{}, {}] as any;

      service.saveChecklistItems(testChecklistItems);

      expect(setItem).toHaveBeenCalledWith(
        'checklistItems',
        JSON.stringify(testChecklistItems)
      );
    });
  });
});
