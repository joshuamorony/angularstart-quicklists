import { ComponentFixture, TestBed } from '@angular/core/testing';
import HomeComponent from './home.component';
import { By } from '@angular/platform-browser';
import { ModalComponent } from '../shared/ui/modal.component';
import { MockModalComponent } from '../shared/ui/modal.component.spec';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { DebugElement } from '@angular/core';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let checklistService: ChecklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        {
          provide: ChecklistService,
          useValue: {
            add$: {
              next: jest.fn(),
            },
          },
        },
      ],
    })
      .overrideComponent(HomeComponent, {
        remove: { imports: [ModalComponent] },
        add: { imports: [MockModalComponent] },
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

  describe('app-modal', () => {
    let appModal: DebugElement;

    beforeEach(() => {
      appModal = fixture.debugElement.query(By.css('app-modal'));
    });

    describe('input: isOpen', () => {
      it('should be set to true when add button clicked', () => {
        const addButton = fixture.debugElement.query(
          By.css('[data-testid="create-checklist-button"]')
        );

        addButton.nativeElement.click();

        fixture.detectChanges();

        const modal = fixture.debugElement.query(By.css('app-modal'));

        expect(modal.componentInstance.isOpen).toBeTruthy();
      });
    });

    describe('output: save', () => {
      it('should next add$ source with form values', () => {
        appModal.triggerEventHandler('save');
        expect(checklistService.add$.next).toHaveBeenCalledWith(
          component.checklistForm.getRawValue()
        );
      });
    });
  });
});
