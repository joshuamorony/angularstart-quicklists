import { ComponentFixture, TestBed } from '@angular/core/testing';
import HomeComponent from './home.component';
import { By } from '@angular/platform-browser';
import { ModalComponent } from '../shared/ui/modal.component';
import { MockModalComponent } from '../shared/ui/modal.component.spec';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { DebugElement } from '@angular/core';
import { FormModalComponent } from '../shared/ui/form-modal.component';
import { MockFormModalComponent } from '../shared/ui/form-modal.component.spec';
import { Checklist } from '../shared/interfaces/checklist';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let checklistService: ChecklistService;

  const mockChecklists: Checklist[] = [{ id: '1', title: 'test' }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        {
          provide: ChecklistService,
          useValue: {
            checklists: jest.fn().mockReturnValue(mockChecklists),
            add$: {
              next: jest.fn(),
            },
            remove$: {
              next: jest.fn(),
            },
          },
        },
      ],
    })
      .overrideComponent(HomeComponent, {
        remove: { imports: [ModalComponent, FormModalComponent] },
        add: { imports: [MockModalComponent, MockFormModalComponent] },
      })
      .compileComponents();

    checklistService = TestBed.inject(ChecklistService);

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('app-checklist-list', () => {
    let list: DebugElement;

    beforeEach(() => {
      list = fixture.debugElement.query(By.css('app-checklist-list'));
    });

    describe('input: checklists', () => {
      it('should use checklists selector as input', () => {
        expect(list.componentInstance.checklists).toEqual(mockChecklists);
      });
    });

    describe('output: delete', () => {
      it('should next remove$ source with emitted value', () => {
        const testId = 5;
        list.triggerEventHandler('delete', testId);

        expect(checklistService.remove$.next).toHaveBeenCalledWith(testId);
      });
    });
  });

  describe('app-modal', () => {
    let appModal: DebugElement;

    beforeEach(() => {
      appModal = fixture.debugElement.query(By.css('app-modal'));
    });

    describe('input: isOpen', () => {
      it('should be truthy when add button clicked', () => {
        const addButton = fixture.debugElement.query(
          By.css('[data-testid="create-checklist-button"]')
        );

        addButton.nativeElement.click();

        fixture.detectChanges();

        const modal = fixture.debugElement.query(By.css('app-modal'));

        expect(modal.componentInstance.isOpen).toBeTruthy();
      });
    });
  });

  describe('app-form-modal', () => {
    let appFormModal: DebugElement;

    beforeEach(() => {
      component.checklistBeingEdited.set({});
      fixture.detectChanges();

      appFormModal = fixture.debugElement.query(By.css('app-form-modal'));
    });

    describe('output: save', () => {
      it('should next add$ source with form values', () => {
        appFormModal.triggerEventHandler('save');
        expect(checklistService.add$.next).toHaveBeenCalledWith(
          component.checklistForm.getRawValue()
        );
      });
    });

    describe('output: close', () => {
      it('should close app-modal', () => {
        appFormModal.triggerEventHandler('close');
        fixture.detectChanges();

        const modal = fixture.debugElement.query(By.css('app-modal'));

        expect(modal.componentInstance.isOpen).toBeFalsy();
      });

      it('should clear title input', () => {
        component.checklistForm.get('title')?.setValue('test');
        fixture.detectChanges();

        appFormModal.triggerEventHandler('close');
        fixture.detectChanges();

        expect(component.checklistForm.get('title')?.getRawValue()).toEqual('');
      });
    });
  });
});
