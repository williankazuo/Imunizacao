import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPathologySchemeComponent } from './register-pathology-scheme.component';

import { ComponentsModule } from 'src/app/components/components.module';
import { RouterTestingModule } from '@angular/router/testing';
import { VaccinationScheduleService } from 'src/app/@core/services/vaccination-schedule/vaccination-schedule.service';
import { CoreModule } from 'src/app/@core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { VaccineService } from 'src/app/@core/services/vaccines/vaccine.service';
import { ModalAlertService } from 'src/app/@core/services/modal/modal-alert.service';
import { EmiterService } from 'src/app/@core/services/general/emiter.service';
import { ModificationService } from 'src/app/@core/services/general/modification.service';
import { VaccinationScheduleDeactivate } from 'src/app/@core/guards/vac-schedule-deactivate-guard';
import { AnchorService } from 'src/app/@core/services/anchor/anchor.service';

describe('Pagina de cadastro de esquema de vacinação', () => {
  let component: RegisterPathologySchemeComponent;
  let fixture: ComponentFixture<RegisterPathologySchemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ComponentsModule, RouterTestingModule, CoreModule, HttpClientModule],
      declarations: [RegisterPathologySchemeComponent],
      providers: [
        VaccinationScheduleService,
        VaccineService,
        ModalAlertService,
        EmiterService,
        ModificationService,
        VaccinationScheduleDeactivate,
        AnchorService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPathologySchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Teste para validar a criaçõa do componente
   */
  it('Criação do componente', () => {
    expect(component).toBeDefined();
  });

  /**
   * Teste para validar se o usuário pode/tem permissão para salvar uma patologia
   */
  it('Permitir cadastrar patologia', () => {
    component.passedPathology = true;
    component.passedScheme = true;

    expect(component.passedPathology).toBe(true);
    expect(component.passedScheme).toBe(true);
  });

  /**
   * Teste para validar que o usuário não possa salvar uma patologia
   */
  it('Não permitir o cadastro de patologia', () => {
    expect(component.passedPathology).toBeFalsy();
    expect(component.passedScheme).toBeFalsy();
  });
});
