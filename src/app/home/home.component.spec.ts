import { ComponentFixture, TestBed } from '@angular/core/testing';
import HomeComponent from './home.component';
import { By } from '@angular/platform-browser';
import { ModalComponent } from '../shared/ui/modal.component';
import { MockModalComponent } from '../shared/ui/modal.component.spec';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
    })
      .overrideComponent(HomeComponent, {
        remove: { imports: [ModalComponent] },
        add: { imports: [MockModalComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('app-modal', () => {
    it('should have isOpen set to true when add button clicked', () => {
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
