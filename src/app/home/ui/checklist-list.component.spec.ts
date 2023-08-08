import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChecklistListComponent } from './checklist-list.component';

describe('ChecklistListComponent', () => {
  let component: ChecklistListComponent;
  let fixture: ComponentFixture<ChecklistListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChecklistListComponent],
    })
      .overrideComponent(ChecklistListComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ChecklistListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
