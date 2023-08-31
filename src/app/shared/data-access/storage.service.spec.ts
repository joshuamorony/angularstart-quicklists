import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService],
    });

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
});
