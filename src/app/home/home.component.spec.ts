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
import { FormBuilder } from '@angular/forms';
import { ChecklistListComponent } from './ui/checklist-list.component';
import { MockChecklistListComponent } from './ui/checklist-list.component.spec';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let checklistService: ChecklistService;
  let formBuilder: FormBuilder;

  const mockChecklists: Checklist[] = [{ id: '1', title: 'test' }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
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
            edit$: {
              next: jest.fn(),
            },
          },
        },
      ],
    })
      .overrideComponent(HomeComponent, {
        remove: {
          imports: [ModalComponent, FormModalComponent, ChecklistListComponent],
        },
        add: {
          imports: [
            MockModalComponent,
            MockFormModalComponent,
            MockChecklistListComponent,
          ],
        },
      })
      .compileComponents();

    checklistService = TestBed.inject(ChecklistService);
    formBuilder = TestBed.inject(FormBuilder);

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

    describe('output: edit', () => {
      let testChecklist: any;
      beforeEach(() => {
        testChecklist = { id: '1', title: 'test' } as any;
        list.triggerEventHandler('edit', testChecklist);
        fixture.detectChanges();
      });

      it('should open modal', () => {
        const modal = fixture.debugElement.query(By.css('app-modal'));
        expect(modal.componentInstance.isOpen).toBeTruthy();
      });

      it('should patch form with checklist title', () => {
        expect(component.checklistForm.patchValue).toHaveBeenCalledWith({
          title: testChecklist.title,
        });
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
      describe('checklist not being edited', () => {
        it('should next add$ source with form values', () => {
          appFormModal.triggerEventHandler('save');
          expect(checklistService.add$.next).toHaveBeenCalledWith(
            component.checklistForm.getRawValue()
          );
        });
      });

      describe('checklist being edited', () => {
        let testChecklist: any;

        beforeEach(() => {
          testChecklist = { id: '5', title: 'hello' };
          component.checklistBeingEdited.set(testChecklist);
        });

        it('should next edit$ source with current id and form data', () => {
          appFormModal.triggerEventHandler('save');
          expect(checklistService.edit$.next).toHaveBeenCalledWith({
            id: testChecklist.id,
            data: component.checklistForm.getRawValue(),
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
        component.checklistForm.get('title')?.setValue('test');
        fixture.detectChanges();

        appFormModal.triggerEventHandler('close');
        fixture.detectChanges();

        expect(component.checklistForm.reset).toHaveBeenCalled();
      });
    });
  });
});
