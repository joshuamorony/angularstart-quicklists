import { ComponentFixture, TestBed } from '@angular/core/testing';
import ChecklistComponent from './checklist.component';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ModalComponent } from '../shared/ui/modal.component';
import { MockModalComponent } from '../shared/ui/modal.component.spec';
import { FormModalComponent } from '../shared/ui/form-modal.component';
import { MockFormModalComponent } from '../shared/ui/form-modal.component.spec';
import { FormBuilder } from '@angular/forms';
import { ChecklistItemService } from './data-access/checklist-item.service';
import { ChecklistItem } from '../shared/interfaces/checklist-item';

describe('ChecklistComponent', () => {
  let component: ChecklistComponent;
  let fixture: ComponentFixture<ChecklistComponent>;
  let formBuilder: FormBuilder;
  let checklistItemService: ChecklistItemService;

  const mockParamId = 'two';

  const mockChecklists = [
    { id: 'one', title: 'one' },
    { id: 'two', title: 'two' },
    { id: 'three', title: 'three' },
  ];

  const mockChecklistItems = [
    { checklistId: 'one', title: 'abc' },
    { checklistId: 'two', title: 'def' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChecklistComponent],
      providers: [
        {
          provide: ChecklistService,
          useValue: {
            checklists: jest.fn().mockReturnValue(mockChecklists),
          },
        },
        {
          provide: ChecklistItemService,
          useValue: {
            checklistItems: jest.fn().mockReturnValue(mockChecklistItems),
            add$: {
              next: jest.fn(),
            },
            remove$: {
              next: jest.fn(),
            },
            edit$: {
              next: jest.fn(),
            },
            toggle$: {
              next: jest.fn(),
            },
            reset$: {
              next: jest.fn(),
            },
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(
              convertToParamMap({
                id: mockParamId,
              })
            ),
          },
        },
        {
          provide: FormBuilder,
          useValue: {
            nonNullable: {
              group: jest.fn().mockReturnValue({
                patchValue: jest.fn(),
                reset: jest.fn(),
                get: jest.fn(),
                getRawValue: jest.fn(),
              }),
            },
          },
        },
      ],
    })
      .overrideComponent(ChecklistComponent, {
        remove: { imports: [ModalComponent, FormModalComponent] },
        add: { imports: [MockModalComponent, MockFormModalComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ChecklistComponent);
    component = fixture.componentInstance;

    checklistItemService = TestBed.inject(ChecklistItemService);
    formBuilder = TestBed.inject(FormBuilder);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('app-checklist-header', () => {
    let checklistHeader: DebugElement;

    beforeEach(() => {
      checklistHeader = fixture.debugElement.query(
        By.css('app-checklist-header')
      );
    });

    describe('input: checklist', () => {
      it('should use the checklist matching the id from the route param', () => {
        const matchingChecklist = mockChecklists.find(
          (checklist) => checklist.id === mockParamId
        );

        expect(checklistHeader.componentInstance.checklist).toEqual(
          matchingChecklist
        );
      });
    });

    describe('output: resetChecklist', () => {
      it('should next reset$ source with emitted value', () => {
        const testId = 5;
        checklistHeader.triggerEventHandler('resetChecklist', testId);

        expect(checklistItemService.reset$.next).toHaveBeenCalledWith(testId);
      });
    });
  });

  describe('app-modal', () => {
    let appModal: DebugElement;

    beforeEach(() => {
      appModal = fixture.debugElement.query(By.css('app-modal'));
    });

    describe('input: isOpen', () => {
      it('should be truthy when checklist header emits addItem', () => {
        const checklistHeader = fixture.debugElement.query(
          By.css('app-checklist-header')
        );

        checklistHeader.triggerEventHandler('addItem', null);

        fixture.detectChanges();

        const modal = fixture.debugElement.query(By.css('app-modal'));

        expect(modal.componentInstance.isOpen).toBeTruthy();
      });
    });
  });

  describe('app-checklist-item-list', () => {
    let checklistItemList: DebugElement;

    beforeEach(() => {
      checklistItemList = fixture.debugElement.query(
        By.css('app-checklist-item-list')
      );
    });

    describe('input: checklistItems', () => {
      it('should use checklist items filtered with current checklist id', () => {
        const input: ChecklistItem[] =
          checklistItemList.componentInstance.checklistItems;

        expect(input.length).toEqual(
          mockChecklistItems.filter((item) => item.checklistId === mockParamId)
            .length
        );
        expect(input.every((item) => item.checklistId === mockParamId));
      });
    });

    describe('output: delete', () => {
      it('should next remove$ source with emitted value', () => {
        const testId = 5;
        checklistItemList.triggerEventHandler('delete', testId);

        expect(checklistItemService.remove$.next).toHaveBeenCalledWith(testId);
      });
    });

    describe('output: toggle', () => {
      it('should next toggle$ source with emitted value', () => {
        const testId = 5;
        checklistItemList.triggerEventHandler('toggle', testId);

        expect(checklistItemService.toggle$.next).toHaveBeenCalledWith(testId);
      });
    });

    describe('output: edit', () => {
      let testChecklistItem: any;

      beforeEach(() => {
        testChecklistItem = { id: '1', title: 'test' } as any;
        checklistItemList.triggerEventHandler('edit', testChecklistItem);
        fixture.detectChanges();
      });

      it('should open modal', () => {
        const modal = fixture.debugElement.query(By.css('app-modal'));
        expect(modal.componentInstance.isOpen).toBeTruthy();
      });

      it('should patch form with checklist title', () => {
        expect(component.checklistItemForm.patchValue).toHaveBeenCalledWith({
          title: testChecklistItem.title,
        });
      });
    });
  });

  describe('app-form-modal', () => {
    let appFormModal: DebugElement;

    beforeEach(() => {
      component.checklistItemBeingEdited.set({});
      fixture.detectChanges();

      appFormModal = fixture.debugElement.query(By.css('app-form-modal'));
    });

    describe('output: save', () => {
      describe('checklist item not being edited', () => {
        it('should next add$ source with form values and current checklist id', () => {
          appFormModal.triggerEventHandler('save');
          expect(checklistItemService.add$.next).toHaveBeenCalledWith({
            item: component.checklistItemForm.getRawValue(),
            checklistId: component.checklist()?.id,
          });
        });
      });

      describe('checklist item being edited', () => {
        let testChecklistItem: any;

        beforeEach(() => {
          testChecklistItem = { id: '5', title: 'hello' };
          component.checklistItemBeingEdited.set(testChecklistItem);
        });

        it('should next edit$ source with current id and form data', () => {
          appFormModal.triggerEventHandler('save');
          expect(checklistItemService.edit$.next).toHaveBeenCalledWith({
            id: testChecklistItem.id,
            data: component.checklistItemForm.getRawValue(),
          });
        });
      });
    });

    describe('output: close', () => {
      it('should close app-modal', () => {
        appFormModal.triggerEventHandler('close');
        fixture.detectChanges();

        const modal = fixture.debugElement.query(By.css('app-modal'));

        expect(modal.componentInstance.isOpen).toBeFalsy();
      });

      it('should reset form', () => {
        component.checklistItemForm.get('title')?.setValue('test');
        fixture.detectChanges();

        appFormModal.triggerEventHandler('close');
        fixture.detectChanges();

        expect(component.checklistItemForm.reset).toHaveBeenCalled();
      });
    });
  });
});
