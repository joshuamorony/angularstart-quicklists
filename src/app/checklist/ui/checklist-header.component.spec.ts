import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChecklistHeaderComponent } from './checklist-header.component';

describe('ChecklistHeaderComponent', () => {
  let component: ChecklistHeaderComponent;
  let fixture: ComponentFixture<ChecklistHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChecklistHeaderComponent],
    })
      .overrideComponent(ChecklistHeaderComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ChecklistHeaderComponent);
    component = fixture.componentInstance;

    component.checklist = {
      id: 'one',
      title: 'one',
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
