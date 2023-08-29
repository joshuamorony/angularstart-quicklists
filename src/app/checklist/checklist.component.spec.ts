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
            add$: {
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
      });
    });
  });
});