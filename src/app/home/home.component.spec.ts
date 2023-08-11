import { ComponentFixture, TestBed } from '@angular/core/testing';
import HomeComponent from './home.component';
import { By } from '@angular/platform-browser';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
    })
      .overrideComponent(HomeComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('app-form-modal', () => {
    it('should have isOpen set to true when add button clicked', () => {
      const addButton = fixture.debugElement.query(
        By.css('[data-testid="create-checklist-button"]')
      );

      addButton.nativeElement.click();

      fixture.detectChanges();

      const modal = fixture.debugElement.query(By.css('app-form-modal'));

      expect(modal.componentInstance.isOpen).toBe(true);
    });
  });
});
