import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPathologySchemeComponent } from './edit-pathology-scheme.component';

describe('EditPathologySchemeComponent', () => {
  let component: EditPathologySchemeComponent;
  let fixture: ComponentFixture<EditPathologySchemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPathologySchemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPathologySchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
