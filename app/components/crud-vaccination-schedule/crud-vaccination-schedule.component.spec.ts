import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudVaccinationScheduleComponent } from './crud-vaccination-schedule.component';

describe('CrudVaccinationScheduleComponent', () => {
  let component: CrudVaccinationScheduleComponent;
  let fixture: ComponentFixture<CrudVaccinationScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudVaccinationScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudVaccinationScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
