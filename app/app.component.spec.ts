import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { LoadingService } from './@core/services/loading/loading.service';
import { ModalAlertService } from './@core/services/modal/modal-alert.service';
import { TooltipService } from './@core/services/tooltip/tooltip.service';
import { ToastService } from './@core/services/toast/toast.service';

describe('App component - componente pai', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, ComponentsModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [LoadingService, ModalAlertService, TooltipService, ToastService]
    }).compileComponents();
  }));

  it('Criação do componente pai de todos', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeDefined();
  });

  it(`Titulo do componente`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('HiaeImmunization');
  });

  /* it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to HiaeImmunization!');
  }); */
});
